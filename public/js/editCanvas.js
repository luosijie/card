
	var CanvasEditor = function(){

	};

	CanvasEditor.prototype = {
		constructor: CanvasEditor,

		test: function(){
			alert(2);
		},

		/*
		 *新建文字
		 */
		addText: function(){
			var self = this;
			var addText = document.querySelector('.add-text');
	 		
	 		if (addText) {
	 			addText.addEventListener('click', function(e){
	 			e.stopPropagation();
	 			var newText = document.createElement('div');
	 			newText.innerText = '请输入内容';
	 			newText.classList.add('edit-elem');
	 			newText.classList.add('edit-text');
	 			newText.classList.add('default-text');

	 			newText.setAttribute('contenteditable','true');

	 			editSide.appendChild(newText);

	 			selectedElem = newText;
	 			self.showEditTransformer(editTransformer, selectedElem);
	 			self.showEditPanel(selectedElem, editCanvas, textToolbar, imageToolbar);
	 		});
	 		}
	 		
		},

		/*
		 *调整透明度
		 */
		transparentEdit: function (){

			var rangeCircle = document.querySelector('.range-circle'); //圆形滑块
			var rangeCircleMoving, preEX, preLeft;
			var minValue = 0, maxValue = 130;
			var transparentInput;

			document.addEventListener('mousedown', function(e){
				if (e.target == rangeCircle) {
					rangeCircleMoving = true;
					preEX = e.clientX; //储存鼠标按下时的x坐标
					preLeft = rangeCircle.offsetLeft; //储存鼠标按下时的滑块x坐标
				}
				if (selectedElem.classList.contains('edit-text')) {
					transparentInput = document.querySelectorAll('.transparent-input')[1];
				}else{
					transparentInput = document.querySelectorAll('.transparent-input')[0];
				}
			});
			document.addEventListener('mousemove', function(e){
				if(rangeCircleMoving){
					var moveLengh = e.clientX - preEX;
						rangeCircle.style.left = preLeft + moveLengh + 'px';
						if(rangeCircle.offsetLeft < minValue){
							rangeCircle.style.left = minValue + 'px';
						}
						if(rangeCircle.offsetLeft > maxValue ){
							rangeCircle.style.left = maxValue + 'px';
						}	
						transparentInput.value = (parseInt(rangeCircle.offsetLeft/maxValue*100)).toString() + '%';

						selectedElem.style.opacity = (rangeCircle.offsetLeft/maxValue).toString();

				}
			});
			document.addEventListener('mouseup', function(e){
				rangeCircleMoving = false;
			});
		 },

		/**
		 *显示数值编辑控件：透明度修改/字体选择/字号修改
		 */
		showEditControler: function(editControler, activeElem){
			var editControlerAll = document.querySelectorAll('.edit-controler');
			var activeElemRect = activeElem.getBoundingClientRect();
			var editCanvas = document.querySelector('.edit-canvas');
			var editCanvasRect = editCanvas.getBoundingClientRect();
			var TOPOFFSET = 40;

			editControlerAll.forEach(function(elem){
				elem.style.display = 'none';
			});
			
			editControler.style.left = activeElemRect.left - editCanvasRect.left + 'px';
			editControler.style.top = activeElemRect.top - editCanvasRect.top + TOPOFFSET + 'px';
			editControler.style.zIndex = '999';
			editControler.style.display = 'flex';
		},

		//替换图片
		replaceImg: function(inputElem){
			var reader = new FileReader(),
				file;
			
			inputElem.addEventListener('change', function(e){
				file = inputElem.files[0];
				if (file) {
					reader.readAsDataURL(file);
				}
			});

			reader.onload = function(e){

				var img = document.createElement('img');
				img.src = e.target.result;

				img.onload = function () {
				  selectedElem.style.background = 'url(' + e.target.result + ')';
					selectedElem.style.backgroundSize = '100% 100%';

					var selectedElemWidth = selectedElem.getBoundingClientRect().width; //当前选中的图片的宽度
					var imgPro = img.height/img.width; //图片的宽高比

					selectedElem.style.height = editTransformer.style.height = selectedElemWidth*imgPro + 'px';	
				}

			};

		},

		//添加新图片
		addImg: function(inputElem){
			var self = this;
			var reader = new FileReader();
			var file;
			if (inputElem) {
				inputElem.addEventListener('change', function(e){
					file = inputElem.files[0];
					reader.readAsDataURL(file);
				});
			}
			

			reader.onload = function(e){
				var newImg = document.createElement('div');
				var img = document.createElement('img');
				img.src = e.target.result;
        
        img.onload = function () {
          newImg.classList.add('edit-elem');
					newImg.classList.add('edit-image');
					newImg.classList.add('default-image');

					newImg.style.background = 'url(' + e.target.result + ')';
					newImg.style.backgroundSize = '100% 100%';
					newImg.style.width =img.width + 'px';
					newImg.style.height = img.height + 'px';

					selectedElem = newImg;

					editSide.appendChild(newImg);

					//显示变换控件
					self.showEditTransformer();
				
					//显示编辑面板
					self.showEditPanel();	
        }
			};

		},

		showEditPanel: function(){
			// selectedElem, editCanvas, textToolbar, imageToolbar
			var selectedElemRect = selectedElem.getBoundingClientRect(),
				editCanvasRect = editCanvas.getBoundingClientRect(); 
			
			if(selectedElem.classList.contains('edit-text')){
				textToolbar.style.top = selectedElemRect.top - editCanvasRect.top - 50 + 'px';
				textToolbar.style.left = selectedElem.offsetLeft + 'px';
				textToolbar.style.display = 'flex';

			}else if(selectedElem.classList.contains('edit-image')||selectedElem.classList.contains('default-image')){
				imageToolbar.style.left = selectedElem.offsetLeft + 'px';
				imageToolbar.style.top = selectedElemRect.top - editCanvasRect.top -50 + 'px';
				imageToolbar.style.display = 'flex';
			}else if(selectedElem.classList.contains('edit-svg')){
				svgToolbar.style.left = selectedElemRect.left - editCanvasRect.left + 'px';
				svgToolbar.style.top = selectedElemRect.top - editCanvasRect.top -50 + 'px';
				svgToolbar.style.display = 'flex';
			}
		},

		showEditTransformer: function(){
			//editTransformer, selectedElem
			var selectedElemRect = selectedElem.getBoundingClientRect();
			if (selectedElem.tagName == 'path') {
				editTransformer.style.width = selectedElemRect.width + 'px';
				editTransformer.style.height = selectedElemRect.height + 'px';
				editTransformer.style.left = selectedElemRect.left-editCanvasRect.left + 'px';
				editTransformer.style.top = selectedElemRect.top-editCanvasRect.top + 'px';
				editTransformer.style.display = 'block';	
			}else{
				editTransformer.style.width = selectedElem.offsetWidth + 'px';
				editTransformer.style.height = selectedElem.offsetHeight + 'px';
				editTransformer.style.left = selectedElem.offsetLeft + 'px';
				editTransformer.style.top = selectedElem.offsetTop + 'px';
				editTransformer.style.transform = selectedElem.style.transform;
				editTransformer.style.display = 'block';	
			}
			
		},

		clearStyle: function(){
			for(var index in arguments){
				arguments[index].style = '';
			}
		},

		/*
		 *旋转元素
		 */
		rotate: function(rotateElem1, rotateElem2, controlElem){
			var tMouseX,  //转换鼠标X为旋转中心坐标
				tMouseY,  //转换鼠标Y为旋转中心坐标
				angle,  //旋转角度
				rotating, //旋转开关(true||flase)
				rotateElemRect; //旋转元素坐标

			rotateElemRect = rotateElem1.getBoundingClientRect();


			controlElem.addEventListener('mousedown', function(e){
				rotating = true;
			});

			document.addEventListener('mouseup', function(e){
				rotating = false;
			});
			document.addEventListener('mousemove', function(e){
				if(rotating){
					tMouseX = e.clientX - rotateElemRect.left - rotateElemRect.width/2;
					tMouseY = e.clientY - rotateElemRect.top - rotateElemRect.height/2;
					angle = Math.abs(Math.atan(tMouseY/tMouseX)*180/Math.PI);
					if(tMouseX < 0 && tMouseY >= 0){
						angle = 90 - angle;
					}
					if(tMouseX <=0 && tMouseY <= 0){
						angle = angle + 90;
					}
					if (tMouseX >=0 && tMouseY <= 0){
						angle = 270 - angle;
					}
					if (tMouseX >= 0 && tMouseY >= 0){
						angle = 270 + angle;
					}
					rotateElem1.style.transform = rotateElem2.style.transform = 'rotate(' + angle + 'deg)';
				}
			});
		},

		/*
		 *调整透明度
		 */
		editTransparent: function(value){
			this.selectedElem.style.opacity = value + '%';
		},

		/*
		 *删除选中元素
		 */
		editDlete: function(){
			this.selectedElem.parent.removechild(this.selectedElem);
		},

		/*
		 *修改字体颜色
		 */
		editColor: function(value){
			this.selectedElem.style.color = value;
		},

		// 替换图片

		//16进制转rgb格式
		hexToRgb: function(hex){
			var color =[],
				rgb = [];
			hex = hex.replace(/#/,'');
			for(let i = 0; i<3; i++){
				color[i] = '0x' + hex.substr(i+2, 2);
				rgb.push(parseInt(Number(color[i])));
			}
			return 'rgb(' + rgb.join(',') + ')';
		},

		// 提取svg元素transform的值
		getSvgTransform: function(svgElem, type, value){
			var transform = svgElem.getAttribute('transform');
			var result;
			
			if (!transform) {
				svgElem.setAttribute('transform', 'translate(0,0) scale(1,1)');
				transform = svgElem.getAttribute('transform');
			}
			switch(type){
				case 'translate':
					var reg = /translate\((.*?)\)/;
					result = transform.match(reg);

					if (result) {
						if (value) {
							return result[1].split(','); //返回translate的值	
						}else{
							return result[0]; //返回transferlate字符串
						}	
					}else{
						if (value) {
							return [0,0];
						}else{
							return 'translate(0,0)';
						}
						
					}

				break;
					
				case 'scale':
					var reg = /scale\((.*?)\)/;
					result = transform.match(reg);
					if (result) {
						if(value){
							return result[1].split(',');
						}else{
							return result[0];	
						}	
					}else{
						if (value) {
							return [1,1];	
						}else{
							return 'scale(1,1)';
						}
						
					}

				break;
		    }	
			
		}
	};

	