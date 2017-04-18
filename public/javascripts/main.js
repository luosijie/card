var selectedElem, //选中元素
	editSide,
	svg,
	editCanvas = document.querySelector('.edit-canvas'), //画布
	editToolbar = document.querySelectorAll('.edit-toolbar'), //编辑控件
	imageToolbar = document.querySelector('.edit-toolbar-image'), //图像控件
	textToolbar = document.querySelector('.edit-toolbar-text'), //文本控件
	svgToolbar = document.querySelector('.edit-toolbar-svg'),
	editTransformer = document.querySelector('.edit-transformer'); //变换控件


var sizeSelect = document.querySelector('.size-select'),
	familySelect = document.querySelector('.family-select'),
	transparentRange = document.querySelector('.transparent-range');

var selectedElemRect,
	editCanvasRect = editCanvas.getBoundingClientRect();

var clipboard; //剪贴版 用于复制粘贴功能

/**
 *引入CanvasEditor
 */
var canvasEditor = new CanvasEditor();

//默认将正面设为编辑状态
editSide = document.querySelector('.side-front');
svg = editSide.querySelector('svg');

document.addEventListener('selectstart', function(e) {
	e.returnValue = false;
});

var aligning = false;
var alignArry = [];
document.addEventListener('keydown', function(evt){
	if (evt.keyCode === 16){
		aligning = true;
	}
})
document.addEventListener('keyup', function(evt){
	if (evt.keyCode === 16){
		aligning = false;
	}
})
//handle：给画布添加点击事件
editCanvas.addEventListener('click', function(e) {
	

	//清除所有选中效果
	canvasEditor.clearStyle(editTransformer, textToolbar, imageToolbar, svgToolbar, sizeSelect, familySelect, transparentRange);

	//判断点击对象是否可编辑元素
	if (e.target.classList.contains('edit-elem')) {
		selectedElem = e.target;
		selectedElemRect = selectedElem.getBoundingClientRect();

		//判断是否是svg元素
		if (aligning) {
			editTransformer = document.querySelector('.align-active');
		}else if (selectedElem.tagName == 'path') {
			editTransformer = document.querySelector('.svg-transformer');
		}else{
			editTransformer = document.querySelector('.edit-transformer');
		}
		

		//显示变换控件
		canvasEditor.showEditTransformer();

		//显示编辑面板
		canvasEditor.showEditPanel();

	}

});

//拖拽移动
var dragging, tLeft, tTop;
var moveElem = document.querySelector('.move');
document.addEventListener('mousedown', function(e) {
	if (selectedElem) {
		selectedElemRect = selectedElem.getBoundingClientRect();
	}
	if (e.target == editTransformer || e.target.parentNode == moveElem) {

		canvasEditor.clearStyle(textToolbar, imageToolbar, svgToolbar);
		dragging = true;
		tLeft = e.clientX - selectedElemRect.left; //鼠标按下时和选中元素的距离:x坐标
		tTop = e.clientY - selectedElemRect.top; //鼠标按下时和选中元素的距离:y坐标
	}
});
document.addEventListener('mouseup', function(e) {
	dragging = false;
});
document.addEventListener('mousemove', function(e) {
	if (dragging) {
		var moveX = e.clientX - tLeft - editCanvasRect.left,
			moveY = e.clientY - tTop - editCanvasRect.top;

		editTransformer.style.left = selectedElem.style.left = moveX + 'px';
		editTransformer.style.top = selectedElem.style.top = moveY + 'px';

		//如果点击对象为svg的path
		if(selectedElem.tagName == 'path'){
			var scale = canvasEditor.getSvgTransform(selectedElem,'scale');

			selectedElem.setAttribute('transform', 'translate(' + moveX + ',' + moveY +')' + ' ' + scale);
			editTransformer.style.left = moveX + 'px';
			editTransformer.style.top = moveY + 'px';
			
		}
	}
});

/**
 *旋转元素
 */
var tMouseX, //转换鼠标X为旋转中心坐标
	tMouseY, //转换鼠标Y为旋转中心坐标
	angle, //旋转角度
	rotating, //旋转开关(true||flase)
	rotateElemRect, //旋转元素坐标
	centerX, centerY; //中心点坐标

var rotateControl = document.querySelector('.rotate'),
	angleRotateControl;

document.addEventListener('mousedown', function(e) {
	if (selectedElem) {
		selectedElemRect = selectedElem.getBoundingClientRect();
		centerX = selectedElemRect.left + selectedElemRect.width / 2;
		centerY = selectedElemRect.top + selectedElemRect.height / 2;

		angleRotateControl = Math.atan((selectedElemRect.height / 2) / (selectedElemRect.width / 2)) * 180 / Math.PI;
	}
	if (e.target.parentNode == rotateControl) {
		canvasEditor.clearStyle(textToolbar, imageToolbar);
		rotating = true;
	}
});

document.addEventListener('mouseup', function(e) {
	rotating = false;
	if (editTransformer.style.display == 'block') {
		canvasEditor.showEditPanel();
	}

});

document.addEventListener('mousemove', function(e) {
	if (rotating) {
		tMouseX = e.clientX - centerX;
		tMouseY = e.clientY - centerY;
		angle = Math.abs(Math.atan(tMouseY / tMouseX) * 180 / Math.PI);

		/**
		 *象限判断 从右上角开始 顺时针
		 */
		if (tMouseX >= 0 && tMouseY <= 0) {
			if (angle > angleRotateControl) {
				angle = 360 - (angle - angleRotateControl);
			} else if (angle <= angleRotateControl) {
				angle = angleRotateControl - angle;
			}
		}
		if (tMouseX >= 0 && tMouseY > 0) {
			angle = angle + angleRotateControl;
		}
		if (tMouseX <= 0 && tMouseY >= 0) {
			angle = 180 + angleRotateControl - angle;
		}
		if (tMouseX <= 0 && tMouseY < 0) {
			angle = 180 + angleRotateControl + angle;
		}

			selectedElem.style.transform = editTransformer.style.transform = 'rotate(' + angle + 'deg)';	

	}
});

/**
 *缩放元素
 */
var scaling, selectedElemProp;

var selectedElemOffsetWidth,
	selectedElemOffsetHeight;

var scaleOrigin, //缩放起始点
	scaleOriginRect,
	scaleOriginX,
	scaleOriginY;

var oppsiteCorner, //缩放元素左上角坐标
	oppsiteCornerRect,
	oppsiteCornerX,
	oppsiteCornerY;

var ANGLE; //旋转的角度

var preX, preY; //鼠标按下的坐标

editTransformer.addEventListener('mousedown', function(e) {
	if (selectedElem) {
		selectedElemRect = selectedElem.getBoundingClientRect();
	}
	if (e.target.parentNode.className == 'scale' && selectedElem.classList.contains('edit-image')) {
		scaling = true;
		selectedElemOffsetWidth = selectedElem.offsetWidth;
		selectedElemOffsetHeight = selectedElem.offsetHeight;

		selectedElemProp = selectedElemRect.width / selectedElemRect.height; //选中元素的宽高比

		preX = e.clientX;
		preY = e.clientY;
	}

	if (angle) {
		ANGLE = angle * Math.PI / 180;
	} else {
		ANGLE = 0;
	}

	scaleOrigin = document.querySelector('.scale');
	scaleOriginRect = scaleOrigin.getBoundingClientRect();

	scaleOriginX = scaleOriginRect.left + scaleOriginRect.width / 2; //缩放起始点的X坐标
	scaleOriginY = scaleOriginRect.top + scaleOriginRect.height / 2; //缩放起始点的y坐标

	oppsiteCorner = document.querySelector('.move');
	oppsiteCornerRect = oppsiteCorner.getBoundingClientRect();
	oppsiteCornerX = oppsiteCornerRect.left + oppsiteCornerRect.width / 2; //缩放元素左上角x坐标
	oppsiteCornerY = oppsiteCornerRect.top + oppsiteCornerRect.height / 2; //缩放元素左上角y坐标
});

document.addEventListener('mousemove', function(e) {
	if (scaling) {

		var addWidth, addHeight, //缩放后增加的宽高
			offsetX, offsetY, //鼠标偏移的宽高
			scaledX, scaledY, //缩放后端点的坐标
			midX, midY,
			finalX, finalY, finalWidth, finalHeight, //缩放后的元素坐标和宽高
			angleCross, //缩放图形的对角线和宽的夹角
			crossline; //缩放后的对角线

		editCanvasRect = editCanvas.getBoundingClientRect(); //重新获取editCanvas是坐标，防止浏览器窗口变化产生错位

		angleCross = Math.atan(selectedElemOffsetHeight / selectedElemOffsetWidth);

		offsetX = e.clientX - preX;
		offsetY = offsetX * Math.tan(ANGLE + angleCross);

		if (ANGLE >= 0 && ANGLE <= Math.PI / 2 || ANGLE >= Math.PI && ANGLE <= Math.PI * 3 / 2) {
			offsetY = e.clientY - preY;
			offsetX = offsetY * Math.tan(Math.PI / 2 - angleCross - ANGLE);
		}

		scaledX = scaleOriginX + offsetX;
		scaledY = scaleOriginY + offsetY;

		midX = (scaledX + oppsiteCornerX) / 2;
		midY = (scaledY + oppsiteCornerY) / 2;

		crossline = Math.sqrt(Math.pow((scaledX + 2 - oppsiteCornerX), 2) + Math.pow((scaledY + 2 - oppsiteCornerY), 2));

		finalWidth = crossline * Math.cos(angleCross);
		finalHeight = crossline * Math.sin(angleCross);

		finalX = midX - finalWidth / 2 - editCanvasRect.left;
		finalY = midY - finalHeight / 2 - editCanvasRect.top;

		selectedElem.style.left = editTransformer.style.left = finalX + 'px';
		selectedElem.style.top = editTransformer.style.top = finalY + 'px';
		selectedElem.style.width = editTransformer.style.width = finalWidth + 'px';
		selectedElem.style.height = editTransformer.style.height = finalHeight + 'px';

		//构建辅助三角形求出变换后的宽高 m:n = p : sinx - p;


	}

});

document.addEventListener('mouseup', function(e) {
	scaling = false;
});


/**
 *handle:给编辑控件添加点击事件
 */
editToolbar.forEach(function(elem) {
	elem.childNodes.forEach(function(elem) {
		elem.addEventListener('click', function(e) {

			canvasEditor.clearStyle(sizeSelect, familySelect, transparentRange);

			switch (elem.className) {
				case 'edit-text':
					document.execCommand('selectAll', false, null);
					selectedElem.focus();

					break;
				case 'change-image':
					var inputRepaceImg = document.querySelector('.replace-img');
					canvasEditor.replaceImg(inputRepaceImg, selectedElem, editTransformer);

					break;
				case 'edit-transparent':

					canvasEditor.showEditControler(transparentRange, elem);

					canvasEditor.transparentEdit(); //透明度滑块样式	


					break;
				case 'edit-copy':
					const offsetValue = 10;

					clipboard = selectedElem.cloneNode(true);

					
					if (selectedElem.tagName == 'path') {
						
						var translate = canvasEditor.getSvgTransform(selectedElem, 'translate', true);
						var scale = canvasEditor.getSvgTransform(selectedElem, 'scale');

						clipboard.setAttribute('transform', 'translate(' + parseInt(selectedElemRect.left - editCanvasRect.left + selectedElemRect.width + offsetValue) + ',' + translate[1] +')' + '' + scale);

						svg.appendChild(clipboard);

						console.log(selectedElemRect.left - editCanvasRect.left + selectedElemRect.width + offsetValue);
					}else{
						clipboard.style.left = parseInt(selectedElem.offsetLeft) + selectedElemRect.width + offsetValue + 'px';
						editSide.appendChild(clipboard);
					}
					
					selectedElem = clipboard;
					selectedElemRect = selectedElem.getBoundingClientRect();

					//显示变换控件
					canvasEditor.showEditTransformer();

					//显示编辑面板
					canvasEditor.showEditPanel();


					break;
				case 'edit-putup':
					if (selectedElem.tagName == 'path') {
						svg.appendChild(selectedElem);

					}else{
						editSide.appendChild(selectedElem);	
					}
					
					break;
				case 'edit-putdown':
					if(selectedElem.tagName == 'path'){
						svg.insertBefore(selectedElem, svg.firstChild)
					}else{
						editSide.insertBefore(selectedElem, editSide.firstChild);	
					}
					break;
				case 'edit-delete':
					selectedElem.parentNode.removeChild(selectedElem);
					editToolbar.forEach(function(elem) {
						elem.style.display = 'none';
					});
					editTransformer.style.display = 'none';
					break;
				case 'edit-color':
					var editColor = document.querySelector('.edit-color'),
						inputColor = elem.querySelector('input[type = color]');
					inputColor.onchange = function() {

						if (selectedElem.tagName == 'path') {
							selectedElem.setAttribute('fill', inputColor.value);
						}else{
							selectedElem.style.color = inputColor.value;
							editColor.style.backgroundColor = inputColor.value;	
						}
						
					};
					break;
				case 'edit-fontfamily':
					if (familySelect.style.display == 'flex') {
						familySelect.style.display = 'none';
					} else {
						canvasEditor.showEditControler(familySelect, elem);
					}
					break;
				case 'edit-fontsize':
					var editFontsize = document.querySelector('.edit-fontsize'),
						editFontsizeSpan = editFontsize.querySelector('span'),
						fontSize;

					console.log(sizeSelect.style.display);
					if (sizeSelect.style.display == 'flex') {
						sizeSelect.style.display = 'none';

					} else {
						canvasEditor.showEditControler(sizeSelect, elem);
					}

					sizeSelect.addEventListener('mousemove', function(e) {
						fontSize = parseInt(e.target.innerText);
						selectedElem.style.fontSize = fontSize + 'px';


						canvasEditor.showEditTransformer(editTransformer, selectedElem);
						// canvasEditor.clearStyle(sizeSelect);
					});

					sizeSelect.addEventListener('click', function(e) {
						editFontsizeSpan.innerText = fontSize;
						canvasEditor.clearStyle(sizeSelect);
					});

					break;
				case 'edit-fontitaly':
					// selectedElem.style.fontStyle = 'italic';

					if (selectedElem.style.fontStyle == 'italic') {
						elem.style.backgroundColor = '';
						selectedElem.style.fontStyle = '';
					} else {
						elem.style.backgroundColor = '#e0e0e0';
						selectedElem.style.fontStyle = 'italic';
					}

					break;
				case 'edit-fontunderline':

					if (selectedElem.style.textDecoration == 'underline') {
						elem.style.backgroundColor = '';
						selectedElem.style.textDecoration = '';
					} else {
						elem.style.backgroundColor = '#e0e0e0';
						selectedElem.style.textDecoration = 'underline';
					}
					break;

				case 'edit-fontbold':

					if (selectedElem.style.fontWeight == 'bold') {
						elem.style.backgroundColor = '';
						selectedElem.style.fontWeight = '';
					} else {
						elem.style.backgroundColor = '#e0e0e0';
						selectedElem.style.fontWeight = 'bold';
					}

					break;
			}
		});
	});
});

// 绑定键盘事件
document.addEventListener('keydown', function(evt){

	if (selectedElem && selectedElem.tagName != 'path') {
		switch(evt.keyCode){
			case 46 :
				selectedElem.parentNode.removeChild(selectedElem);
				editToolbar.forEach(function(elem) {
					elem.style.display = 'none';
				});
				editTransformer.style.display = 'none';
				break;

			case 38 :
				editTransformer.style.top = selectedElem.style.top = selectedElem.offsetTop - 1 + 'px';
				break;
			case 39 :
				editTransformer.style.left = selectedElem.style.left = selectedElem.offsetLeft + 1 + 'px';
				break;
			case 40 :
				editTransformer.style.top = selectedElem.style.top = selectedElem.offsetTop + 1 + 'px';
				break;
			case 37 :
				editTransformer.style.left = selectedElem.style.left = selectedElem.offsetLeft - 1 + 'px';
				break;
		}
	}


	//变换对象是svg
	if (selectedElem && selectedElem.tagName == 'path') {
				
				var scale = canvasEditor.getSvgTransform(selectedElem,'scale');
				var translate = canvasEditor.getSvgTransform(selectedElem, 'translate');
				var translateX = translate.match(/translate\((\S*)\,/)[1],
					translateY = translate.match(/\,(\S*)\)/)[1];
		
		switch(evt.keyCode){
			case 38 :

				translateY = parseInt(translateY) - 1;

				editTransformer.style.top = editTransformer.offsetTop - 1 + 'px';

				break;
			case 39 :
				translateX = parseInt(translateX) + 1;
				
				editTransformer.style.left = editTransformer.offsetLeft + 1 + 'px';
				break;
			case 40 :
				translateY = parseInt(translateY) + 1;
			
				editTransformer.style.top = editTransformer.offsetTop + 1 + 'px';
				break;
			case 37 :
				translateX = parseInt(translateX) - 1;
				editTransformer.style.left = editTransformer.offsetLeft - 1 + 'px';
				break;
		}
		selectedElem.setAttribute('transform', 'translate(' + translateX + ',' + translateY +')' + ' ' + scale );

		
	}
	

})

// editTransformer.style.left = selectedElem.style.left = moveX + 'px';
// 		editTransformer.style.top = selectedElem.style.top = moveY + 'px';

// 		//如果点击对象为svg的path
// 		if(selectedElem.tagName == 'path'){
// 			var scale = canvasEditor.getSvgTransform(selectedElem,'scale');
// 			console.log(scale)
// 			selectedElem.setAttribute('transform', 'translate(' + moveX + ',' + moveY +')' + ' ' + scale);
// 			editTransformer.style.left = moveX + 'px';
// 			editTransformer.style.top = moveY + 'px';
// 		}



/*
 *新建文字
 */

canvasEditor.addText();

/*
 *缩放画布（禁用）
 */
// var zoomIn = document.querySelector('.action-zoomin'),
// 	zoomOut = document.querySelector('.action-zoomout');
// var value = 1;
// zoomIn.addEventListener('click', function(e){
// 	var canvasWrapper = document.querySelector('.canvas-wrapper');
// 	value = value+0.1;
// 	if (value > 1) {
// 		value = 1;
// 	}
// 	canvasWrapper.style.transform = 'scale(' + value + ')';
// 	document.querySelector('.view-percent').innerText = parseInt(value*100) + '%';
// });
// zoomOut.addEventListener('click', function(e){
// 	var canvasWrapper = document.querySelector('.canvas-wrapper');

// 	value = value - 0.1;
// 	if (value < 0.5) {
// 		value = 0.5;
// 	}

// 	canvasWrapper.style.transform = 'scale(' + value + ')';

// 	document.querySelector('.view-percent').innerText = parseInt(value*100) + '%';
// 	console.log(value);
// });

/*
 *取消编辑
 */
var cancel = document.querySelector('.cancel');
cancel.addEventListener('click', function(e) {
	canvasEditor.clearStyle(textToolbar, imageToolbar, editTransformer, svgToolbar);
});


//添加图片
var addImg = document.querySelector('.add-img-input');
canvasEditor.addImg(addImg);

//正反面切换
var panelTabs = document.querySelector('.panel-tabs');
var tabButtons = panelTabs.querySelectorAll('button');

tabButtons.forEach(function(elem) {
	elem.addEventListener('click', function(evt) {
		var sideFront = document.querySelector('.side-front'),
			sideBack = document.querySelector('.side-back');

		canvasEditor.clearStyle(textToolbar, svgToolbar, imageToolbar, editTransformer);

		if (!elem.classList.contains('panel-tabs-active')) {
			tabButtons.forEach(function(elem) {
				elem.classList.remove('panel-tabs-active');
			});
			elem.classList.add('panel-tabs-active');
		}

		if (elem.classList.contains('panel-tabs-active') && elem.classList.contains('the-front')) {
			sideFront.style.display = 'block';
			editSide = sideFront;

			sideBack.style.display = 'none';
			svg = editSide.querySelector('svg');
		} else {
			sideFront.style.display = 'none';
			sideBack.style.display = 'block';
			editSide = sideBack;
			svg = editSide.querySelector('svg');
		}

	});
});

//主题类型选择下拉框
(function dropMenu() {

	var type = document.querySelector('.type');

	if (type) {
		var typeDiv = type.querySelectorAll('div');

		var typeUl = type.querySelectorAll('ul');

		var iAll = type.querySelectorAll('i')


		typeDiv.forEach(function(elem) {
			elem.onclick = function(evt) {
				var span = elem.querySelector('span');

				var ul = elem.querySelector('ul');
				var i = elem.querySelector('i');

				iAll.forEach(function(elem) {
					elem.style.transform = 'rotate(0deg)';
				})

				if (window.getComputedStyle(ul).display == 'none') {

					typeUl.forEach(function(elem) {
						elem.style.display = 'none';
					})

					ul.style.display = 'block';
					i.style.transform = 'rotate(180deg)';
					// span.innerText = evt.target.innerText;

				} else {

					ul.style.display = 'none';
					i.style.transform = 'rotate(0deg)';
					// span.innerText = evt.target.innerText;
				}

				if (evt.target.tagName == 'LI') {
					span.innerText = evt.target.innerText;
				}
			}
		})
	}

})();



//隐藏控件
var sidebarUser = document.querySelector('.sidebar-user');
if (sidebarUser) {
	sidebarUser.addEventListener('click', function(evt){
		canvasEditor.clearStyle(editTransformer, textToolbar, imageToolbar, svgToolbar);
	})
}


//svg变换
var svgTransformer = document.querySelector('.svg-transformer');
var scaling = false;
var direction;
var originX, originY;
var originRect = {};
svgTransformer.addEventListener('mousedown', function(evt){
	selectedElemRect = selectedElem.getBoundingClientRect()
	scaling = true;
	direction = evt.target.className;
	originX = evt.clientX;
	originY = evt.clientY;
	var scale = canvasEditor.getSvgTransform(selectedElem, 'scale', true);

	//每一次按下计算出原始svg大小
	originRect.width = selectedElemRect.width/scale[0];
	originRect.height = selectedElemRect.height/scale[1]; 
	originRect.prop = selectedElemRect.width/selectedElemRect.height;

	originRect.translate = canvasEditor.getSvgTransform(selectedElem, 'translate', true)||'';

})

;(function scaleElem(){
	document.addEventListener('mousemove', function(evt){
			if (scaling) {
				switch(direction){
					case 'e':
						scaleE(evt);
						break;

					case 's':
						scaleS(evt);
						break;
					case 'se':
						scaleE(evt);
						var selectedElemRectInner = selectedElem.getBoundingClientRect();
						var finalHeight = selectedElemRectInner.width/originRect.prop;
						var scaleValue = finalHeight/originRect.height;
						var translate = canvasEditor.getSvgTransform(selectedElem, 'translate')||'';
						var scale = canvasEditor.getSvgTransform(selectedElem, 'scale', true);

						selectedElem.setAttribute('transform', translate + '' + 'scale(' + scale[0] + ',' + scaleValue + ')');
						canvasEditor.showEditTransformer();	
						break;
					case 'n':
						scaleN(evt)
						
						break;

					case 'w':
						scaleW(evt)
						break;

					case 'nw':
						scaleN(evt);
						scaleW(evt);
					break;
					case 'ne':
						scaleN(evt);
						scaleE(evt);
					break;
					case 'sw':
						scaleS(evt);
						scaleW(evt);
					break;

				}
			}
	})

	document.addEventListener('mouseup', function(evt){
		scaling = false
	})

	function scaleE(evt){
		var addWidth = evt.clientX - originX;
		var finalWidth = selectedElemRect.width + addWidth;
		var translate = canvasEditor.getSvgTransform(selectedElem, 'translate')||'';
		var scale = canvasEditor.getSvgTransform(selectedElem, 'scale', true);
		var scaleValue = finalWidth/originRect.width;

		if (scaleValue>0) {
			selectedElem.setAttribute('transform', translate + ' ' + 'scale(' + scaleValue + ',' + scale[1] + ')');
			canvasEditor.showEditTransformer();	
		}
	}

	function scaleS(evt){
		var addHeight = evt.clientY - originY;
		var finalHeight = selectedElemRect.height + addHeight;
		var translate = canvasEditor.getSvgTransform(selectedElem, 'translate')||'';
		var scale = canvasEditor.getSvgTransform(selectedElem, 'scale', true);
		var scaleValue = finalHeight/originRect.height;

		if (scaleValue>0) {
			selectedElem.setAttribute('transform', translate + '' + 'scale(' + scale[0] + ',' + scaleValue + ')');
			canvasEditor.showEditTransformer();	
		}
			
	}

	function scaleN(evt){
		var addHeight = evt.clientY - originY;
		var finalHeight = selectedElemRect.height - addHeight;
		var scaleValue = finalHeight/originRect.height;
		var translate = canvasEditor.getSvgTransform(selectedElem, 'translate', true)||'';
		var scale = canvasEditor.getSvgTransform(selectedElem, 'scale', true);	

		if (scaleValue>0) {
			selectedElem.setAttribute('transform', 'translate(' + translate[0] + ',' + (parseInt(originRect.translate[1])+addHeight) + ')' + '' + 'scale(' + scale[0] + ',' + scaleValue + ')');
			canvasEditor.showEditTransformer();		
		}
		
	}
	function scaleW(evt){
		var addWidth = evt.clientX - originX;
		var finalWidth = selectedElemRect.width - addWidth;
		var scaleValue = finalWidth/originRect.width;
		var translate = canvasEditor.getSvgTransform(selectedElem, 'translate', true)||'';
		var scale = canvasEditor.getSvgTransform(selectedElem, 'scale', true);		

		if (scaleValue>0) {
			selectedElem.setAttribute('transform', 'translate(' + (parseInt(originRect.translate[0])+addWidth) + ',' + translate[1] + ')' + '' + 'scale(' + scaleValue + ',' + scale[1] + ')');
			canvasEditor.showEditTransformer();	
		}
			
	}
})()




//添加svg元素
var buttonAddSvg = document.querySelector('.button-add-svg');
var svgInput = document.querySelector('.svg-input');
var addSvg = document.querySelector('.add-svg');

var buttonCancelSvg = document.querySelector('.button-cancle-svg');

if (addSvg) {
	addSvg.addEventListener('click', function(evt){
		svgInput.style.display = 'block';
	})	
}

if (buttonCancelSvg) {
	buttonCancelSvg.addEventListener('click', function(evt){
		svgInput.style.display = 'none';
	})	
}

if (buttonAddSvg) {
	buttonAddSvg.addEventListener('click', function(evt){
		var svgContent = document.querySelector('.svg-content');//svg内容

		var defs = editSide.querySelector('defs');

		var date = Date.now();

		var regDefs = /<defs>[\s\S]*<\/defs>/gm;
		var defsHtml;
		if(regDefs.test(svgContent.value)){
			defsHtml = svgContent.value.match(regDefs)[0].replace(/<\/defs>/, '').replace(/<defs>/, '').replace('PSgrad_0', date);
			defs.innerHTML += defsHtml;
		}else{
			
		}
		var regPath = /<path[\s\S]*>/gm;
		var pathHtml;
		if(regPath.test(svgContent.value)){
			pathHtml = svgContent.value.match(regPath)[0].replace(/<\/path>/, '').replace(/<path>/, '').replace('PSgrad_0', date);
			svg.innerHTML += pathHtml;
			console.log(svg);
			console.log(pathHtml);
		}
		var path = document.querySelectorAll('path');
		path.forEach(function(elem){
			elem.classList.add('edit-elem');
			elem.classList.add('edit-svg');
		})

	})	
}

document.addEventListener('click', function(evt){
	if (evt.target.className == 'content-main-user') {
		canvasEditor.clearStyle(editTransformer, textToolbar, imageToolbar, svgToolbar, sizeSelect, familySelect, transparentRange);
	}
});

(function alignItem(){

})();