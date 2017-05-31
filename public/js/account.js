// 注册验证
(function() {

	//构建验证提示信息组件
	var ConfirmMsg = function(parentNode){

		var confirmAlert = document.createElement('div');
		var confirmSuccess = document.createElement('div');

		confirmAlert.className = 'confirm-alert';
		confirmSuccess.className = 'confirm-success';

		parentNode.appendChild(confirmAlert);
		parentNode.appendChild(confirmSuccess);

		this.confirmAlert = confirmAlert;
		this.confirmSuccess = confirmSuccess;

	}
	ConfirmMsg.prototype={

		alert: function(string){
			this.confirmSuccess.innerHTML = '';
			this.confirmAlert.innerHTML = string;
		},

		success: function(){
			this.confirmAlert.innerHTML = '';
			this.confirmSuccess.innerHTML = '<i class="fa fa-check"></i>';
		},

		checking: function(){
			this.confirmSuccess.innerHTML = '<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>'
		}

	}

	// 用户名验证
	var userNameConfirmd;
	;(function confirmUserName(){
		var regName = document.querySelector('.regname');
		var confirmMsg = new ConfirmMsg(regName.parentNode);
		var reg = /[^\w\u4e00-\u9fa5]/g; //非数字、字母(不分大小写)、汉字、下划线
		var canChecking;

		regName.onkeyup = function(){
			if (reg.test(this.value)) {
				confirmMsg.alert('含有非法字符');
				canChecking = false;
			}else if (this.value.length < 5 || this.value.length > 20) {
				confirmMsg.alert('字符长度为5-20');
				canChecking = false;
			}else{
				confirmMsg.alert('');
				canChecking = true;		
			}
		}

		regName.onblur = function(){
			if (canChecking) {
				confirmMsg.checking();
				var xhr = new XMLHttpRequest();
				xhr.onreadystatechange = function(){
					if (xhr.readyState == 4 && xhr.status == 200) {
						switch(xhr.responseText){
							case '1':
								confirmMsg.success();
								userNameConfirmd = true;
								break;
							case '0':
								confirmMsg.alert('用户名已经存在');
								userNameConfirmd = false;
								break;
						}
					}
				}

				xhr.open('POST', '/checkusername', true);
				xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				xhr.send('username='+regName.value);
			}
			
		}
	})()

	// 邮箱验证
	var mailConfirmd;
	;(function confirmMail(){

		var regMail = document.querySelector('.regmail');
		var confirmMsg = new ConfirmMsg(regMail.parentNode);
		var reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/; //验证是否邮箱格式

		regMail.onblur = function(){
			if (reg.test(this.value)) {
				confirmMsg.success();
				mailConfirmd = true;
			}else{
				confirmMsg.alert('邮箱格式有误')			
			}
		}
	})()

	// 首次密码验证
	var passwordConfirmd;
	;(function confirmPassword(){
		var password = document.querySelector('.password');
		var confirmMsg = new ConfirmMsg(password.parentNode);
		var reg = /^(\w){6,20}$/;

		password.onkeyup = function(){
			if (this.value.length < 8) {
				confirmMsg.alert('密码长度至少为8个字符');
			}else{
				confirmMsg.alert('');
			}
		}

		password.onblur = function(){
			if (reg.test(this.value)) {
				confirmMsg.success();
				passwordConfirmd = true;
			}else{
				confirmMsg.alert('密码格式有误');
				passwordConfirmd = false;
			}
		}
	})()
	
	//验证二次密码
	var rePasswordConfirmd;
	;(function confirmRePassword(){
		var rePassword = document.querySelector('.re-password');
		var password = document.querySelector('.password');
		var confirmMsg = new ConfirmMsg(rePassword.parentNode);

		rePassword.onblur = function(){
			if (!rePassword.value == password.value) {
				confirmMsg.alert('两次输入密码不一致');
				rePasswordConfirmd = false;
			}else if (passwordConfirmd){
				confirmMsg.success();
				rePasswordConfirmd = true;
			}
		}
	})()

	;(function Login(){
		var loginForm = document.querySelector('.login-form');
		var loginName = document.querySelector('input[name = "loginname"]');
	    var loginPassword = document.querySelector('input[name = "loginpassword"]');
	    var loginButton = document.querySelector('.button-login');

	    
	    var confirmMsgName = new ConfirmMsg(loginForm.loginname.parentNode);
	    var confirmMsgPassword = new ConfirmMsg(loginForm.loginpassword.parentNode);
	    
	    loginName.onkeyup = function(){
	    	confirmMsgName.alert('');
	    }

	    loginPassword.onkeyup = function(){
	    	confirmMsgPassword.alert('');
	    }

		loginButton.addEventListener('click', function(evt){
			var formData = new FormData(loginForm);
			if (loginForm.loginname&&loginForm.loginpassword) {
				var xhr = new XMLHttpRequest();
				xhr.onreadystatechange = function(){
					if (xhr.readyState == 4 && xhr.status == 200) {
						switch(xhr.responseText){
							case '1':
								location.reload();
								break;
							case '0':
								confirmMsgPassword.alert('密码错误');
								break;
							case '-1':
								confirmMsgName.alert('该用户未注册');
								break;
						};
					}
				}
				xhr.open('POST', '/login', true);
				xhr.send(formData);
			}else{
				console.log('登录信息不完整');
			}
		})
	})()

	//提交注册信息
	var buttonReg = document.querySelector('.button-reg');
	var regForm = document.querySelector('.reg-form');

	buttonReg.addEventListener('click', function(evt){
		if (userNameConfirmd &&
			mailConfirmd &&
			passwordConfirmd&&
			rePasswordConfirmd) {
			var formData = new FormData(regForm);
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function(){
				if (xhr.readyState == 4 && xhr.status == 200) {
					switch(xhr.responseText){
						case '1':
							console.log('注册成功!');
							location.reload();
						break;
					}
				}
			}
			xhr.open('POST', '/regist', true);
			xhr.send(formData);
		}else{
			console.log('注册信息有误');
		}
	})
		
})()
