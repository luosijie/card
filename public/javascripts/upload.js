var submitButton = document.querySelector('.submit');
var popCancel = document.querySelector('.pop-cancel');
var mask = document.querySelector('.mask');

//弹出弹窗
submitButton.addEventListener('click', function() {
	mask.style.display = 'flex';
})
//取消弹窗
popCancel.addEventListener('click', function() {
	mask.style.display = 'none';
	console.log(3);
})


var popComfirmButton = document.querySelector('.pop-confirm');

popComfirmButton.addEventListener('click', function(){
	mask.style.display = 'none';
	uploadImages()
	.then(function(data){
		return uploadCover();
	})
	.then(function(coverData){
		uploadDom(coverData);
	})
})

function uploadImages(){

	var promise = new Promise(function(resolve, reject){
		var editImages = document.querySelectorAll('.edit-image');
		var base64Images = [];
		var formDataImg = new FormData();

		if (editImages.length) {

			// 将需要上传的base64图片放入formDataImg中
			editImages.forEach(function(elem){
				var originImgData = window.getComputedStyle(elem).backgroundImage;
				var imgData = originImgData.replace(/url\("/, '').replace(/"\)/, '');
				var base64Reg = /^data:image\/\w+;base64,/

				//筛选出base64格式的图片，排除服务器图片
				if (base64Reg.test(imgData)){
					formDataImg.append('editImg', imgData);
					base64Images.push(elem);	
				}

			})

			if (formDataImg.has('editImg')) {
				var xhr = new XMLHttpRequest();
				xhr.onload = function(){
					var responseData = JSON.parse(xhr.responseText);
					for(var i = 0; i < base64Images.length; i++){
						base64Images[i].style.backgroundImage = 'url("' + '/tempImg/' + responseData[i] + '")';
					}
					// 成功返回后执行回调
					resolve('uploadImages is ok');
				}
				xhr.open('POST', '/uploadImages', true);
				xhr.send(formDataImg);
			}else{
				resolve('uploadImages is ok');
			}
		}
	});
	return promise;
}

//生成并上传名片封面
function uploadCover(){
	var promise = new Promise(function(resolve, reject){
		var sideFront = document.querySelector('.side-front'),
			sideBack = document.querySelector('.side-back');
		var formDataCover = new FormData(form);
		var sideList = [];
		if(sideFront){
			sideList.push(sideFront);
		}
		if(sideBack){
			sideList.push(sideBack);
		}

		for(let i = 0; i < sideList.length; i++){

			// 判断dom是否可见，如果不可见htmlcanvas没法运行
			if(window.getComputedStyle(sideList[i]).display == 'none'){
				sideList[i].style.display = 'block';

				saveCover(sideList, i, false);
			}else{
	
				saveCover(sideList, i, true);
			}

		}


		/*
		 *@arry:待html2canvas转化的dom组
		 *@visible: 待转化的dom是否可见
		 */
		function saveCover(arry, index, visible){
			//html2canvas生成封面预览 并保存到 Formdata 准备上传后台

			html2canvas(arry[index]).then(function(canvas){

				//到这里顺序发生颠倒
				var imgData = canvas.toDataURL();

				formDataCover.append('coverImg', imgData);

				if (!visible) {
					arry[index].style.display = 'none'
				}

				if (index == arry.length - 2) {
					console.log(index);
					var xhr = new XMLHttpRequest();
					xhr.open('POST', '/uploadCovers', true);
					xhr.send(formDataCover);
					xhr.onload = function(){
						//返回封面地址数组，注意0为反面，1为正面
						resolve(JSON.parse(xhr.responseText));
					}
				}
			})
		}
	});
	return promise;	
}

//上传名片DOM数据
function uploadDom(coverData){
	var promise = new Promise(function(resolce, reject){
		var sideFront = document.querySelector('.side-front'),
			sideBack = document.querySelector('.side-back');
		var coverFront = coverData[1],
			coverBack = coverData[0];
		var form = document.querySelector('#form');
		var formDataDom = new FormData(form);

		formDataDom.append('sideFront', sideFront.innerHTML);
		formDataDom.append('sideBack', sideBack.innerHTML);
		formDataDom.append('coverFront', coverFront);
		formDataDom.append('coverBack', coverBack);

		var xhr = new XMLHttpRequest();
		xhr.onload = function(){
			console.log(xhr.responseText);
		}
		xhr.open('POST', '/uploadDom', true);
		xhr.send(formDataDom);
	})
	return promise;
}