window.onload = function(){
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
}
