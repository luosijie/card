// 下载图片功能实现
(function downloadImg() {

	// 获取名片正反面
	var sideFront = document.querySelector('.side-front'),
		sideBack = document.querySelector('.side-back');

	var sideAll = [];

	var zip = new JSZip();

	if (sideFront) {
		sideAll.push(sideFront);
	}
	if (sideBack) {
		sideAll.push(sideBack);
	}

	// 获取保存按钮
	var saveButton = document.querySelector('.save');

	if (saveButton) {
		// 绑定按钮事件
		saveButton.onclick = function() {
				var a =[];

				saveToZip(sideFront)
				.then(function(resolve){

					return saveToZip(sideBack);

				}).then(function(resolve){

					console.log(resolve);

					zip.generateAsync({
						type: "blob"
					}).then(function(content) {

						saveAs(content, "拿去打印吧.zip");
						
					});

				})

				// sideAll.forEach(function(elem) {
				// 	if (window.getComputedStyle(elem).display == 'none') {

				// 		elem.style.display = 'block';
				// 		saveToZip(elem)
				// 		elem.style.display = 'none';
						
				// 	}else{
				// 		saveToZip(elem);
				// 	}

				// });

				// setTimeout(function(){
				// 	zip.generateAsync({
				// 		type: "blob"
				// 	}).then(function(content) {
				// 		saveAs(content, "拿去打印吧.zip");
				// 	});
				// },500);
				
			
		}

	}

	//图片添加到zip文件中
	function saveToZip(dom) {

		var promise = new Promise(function(resolve, reject){
			var imgName;
			var imgData;

			if (window.getComputedStyle(dom).display == 'none') {
				
				dom.style.display = 'block';
				
				html2canvas(dom).then(function(canvas) {

					imgData = canvas.toDataURL();

					if (dom.className == 'side-front') {
						imgName = '正面.png'
					} else if (dom.className == 'side-back') {
						imgName = '反面.png'
					}

					zip.file(imgName, imgData.replace(/^data:image\/\w+;base64,/, ''), {
						base64: true
					});

					resolve(dom);

					dom.style.display = 'none';
					
				})	
			}else{
				html2canvas(dom).then(function(canvas) {

					imgData = canvas.toDataURL();

					if (dom.className == 'side-front') {
						imgName = '正面.png'
					} else if (dom.className == 'side-back') {
						imgName = '反面.png'
					}

					zip.file(imgName, imgData.replace(/^data:image\/\w+;base64,/, ''), {
						base64: true
					});

					resolve(dom);
				})	

			}
			

		})
		return promise;	
	}

})();