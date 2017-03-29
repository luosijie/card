//首页滑块
;(function slideMenu(){

 		var slideBlock = document.querySelector('.slide-blok'),
 		    ul = document.querySelector('.temp-type'),
 		    li = ul.querySelectorAll('li');

 		var slideContent = document.querySelectorAll('.slide-content')

 		for(let i=0; i<li.length; i++){
 			 li[i].onclick = function(evt){
 			 	slideBlock.style.left = evt.target.offsetLeft + 'px';
 			 	slideContent.forEach(function(elem){
 			 		elem.style.display = 'none';
 			 	})
 			 	slideContent[i].style.display = 'block';
 			 	console.log(slideContent[i].style.display)
 			 }
 		}
})()

;(function showRegLoginPanel(){
	//弹出注册登录页面
	var noLogin = document.querySelector('.no-login');
	var loginRegPop = document.querySelector('.login-reg-pop');

	if (noLogin) {
		noLogin.addEventListener('click', function(evt){
			loginRegPop.style.display = 'flex';
		})	
	}

	var popClose = document.querySelector('.pop-close');
	if (popClose) {
		popClose.addEventListener('click', function(evt){
			loginRegPop.style.display = 'none';
		})	
	}
	
})()	

;(function addCollection(){
	document.addEventListener('click', function(evt){
		var elem = evt.target;
		var a = elem.parentNode.querySelector('a');
		var cardId = a.href.match(/edituser\/(\S*)/)[1];
		
		if (elem.classList.contains('collection')) {

			if (elem.classList.contains('collection-active')){
				//数据库删除收藏
				var xhr = new　XMLHttpRequest();
				xhr.onreadystatechange = function(){
					if (xhr.readyState = 4 && xhr.status ==200) {
						if (xhr.responseText == '1') {
							elem.classList.remove('collection-active');
						}
					}
				}
				xhr.open('POST','/deletecollection', true);
				xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				xhr.send('cardId=' + cardId);
				console.log(cardId)
			}else{
				//数据库添加收藏
				var xhr = new　XMLHttpRequest();
				xhr.onreadystatechange = function(){
					if (xhr.readyState = 4 && xhr.status ==200) {
						if (xhr.responseText == '1') {
							console.log(xhr.responseText);
							elem.classList.add('collection-active');
						}
					}
				}
				xhr.open('POST','/addcollection', true);
				xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				xhr.send('cardId=' + cardId);
			}

		}
	})
})()