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
	;(function confirmUserName(){
		var regName = document.querySelector('.regname');
		var confirmMsg = new ConfirmMsg(regName.parentNode);
		var reg = /[^\w\u4e00-\u9fa5]/g; //非数字、字母(不分大小写)、汉字、下划线

		regName.onkeyup = function(){
	
			if (reg.test(this.value)) {
				confirmMsg.alert('含有非法字符');
			}else if (this.value.length < 5 || this.value.length > 20) {
				confirmMsg.alert('字符长度为5-20');
			}else{
				confirmMsg.alert('');		
			}
		}
		regName.onblur = function(){
			confirmMsg.success();
		}
	})()

	// 邮箱验证
	;(function confirmMail(){

		var regMail = document.querySelector('.regmail');
		var confirmMsg = new ConfirmMsg(regMail.parentNode);
		var reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/; //验证是否邮箱格式

		regMail.onkeyup = function(){

			if (reg.test(this.value)) {
				confirmMsg.success();
			}else{
				confirmMsg.alert('邮箱格式有误')
			}

		}

	})()
	
})()
