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

//弹出注册登录页面
;(function showRegLoginPanel(){
	
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
