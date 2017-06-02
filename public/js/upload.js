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
					resolve();
				}
				xhr.open('POST', '/uploadImages', true);
				xhr.send(formDataImg);
			}else{
				resolve();
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

		// var promiseAll = Promise.all([saveCover(sideFront), saveCover(sideBack)]);
		
		// promiseAll
		// .then(function(){
			
		// })

		saveCover(sideFront)
		.then(function(resolve){
			return saveCover(sideBack)
		})
		.then(function(){
			var xhr = new XMLHttpRequest();
			xhr.open('POST', '/uploadCovers', true);
			xhr.send(formDataCover);
			xhr.onload = function(){
				resolve(JSON.parse(xhr.responseText));
			}
		})

		function saveCover(dom){

			var promise = new Promise(function(_resolve, reject){

				if (window.getComputedStyle(dom).display == 'none') {
					dom.style.display = 'block';
					html2canvas(dom).then(function(canvas){
						var imgData = canvas.toDataURL();
						formDataCover.append('coverImg', imgData);
						
						_resolve();
						dom.style.display = 'none';

					})
				}else{
					html2canvas(dom).then(function(canvas){
						var imgData = canvas.toDataURL();
						formDataCover.append('coverImg', imgData);
						_resolve();
					})
				}

			})

			return promise;
		}

	});

	return promise;	
}

//上传名片DOM数据
function uploadDom(coverData){
	var promise = new Promise(function(resolce, reject){
		var sideFront = document.querySelector('.side-front'),
			sideBack = document.querySelector('.side-back');
		var coverFront = coverData[0],
			coverBack = coverData[1];
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