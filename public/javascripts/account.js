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
				var xhr = new XMLHttpRequest();
				xhr.onreadystagechange = function(){
					if (xhr.readyState == 4 && xhr.status == 200) {
						console.log(xhr.responseText);
					}
				}
				xhr.open('POST', '/checkusername', true);
				xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				xhr.send('username='+regName.value);
			}
			confirmMsg.success();
			userNameConfirmd = true;
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

	//提交注册信息
	var buttonReg = document.querySelector('.button-reg');
	var regForm = document.querySelector('.reg-form');

	buttonReg.addEventListener('click', function(evt){
		if (userNameConfirmd &&
			mailConfirmd &&
			passwordConfirmd&&
			rePasswordConfirmd) {
			console.log('正在提交注册...')
		}else{
			console.log('注册信息有误');
		}
	})
		
})()
