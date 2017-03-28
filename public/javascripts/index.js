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
		if (elem.classList.contains('collection')) {
			var a = elem.parentNode.querySelector('a');
			var aId = a.href;
			elem.classList.toggle('collection-active');
			if (elem.classList.contains('collection-active')){
				//数据库删除收藏
			}else{
				//数据库添加收藏
			}
		}
	})
})()