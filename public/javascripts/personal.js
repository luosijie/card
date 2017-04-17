;(function cancelCollection() {
	var cancelCollection = document.querySelectorAll('.cancel-collection');
	cancelCollection.forEach(function(elem){
		elem.addEventListener('click', function(evt){
			var a = elem.parentNode.querySelector('a');
			cardId = a.href.match(/edituser\/(\S*)/)[1];
			var xhr = new　XMLHttpRequest();
			xhr.onreadystatechange = function(){
				if (xhr.readyState = 4 && xhr.status ==200) {
					if (xhr.responseText == '1') {
						elem.parentNode.parentNode.removeChild(elem.parentNode);
						var notyf = new Notyf({delay: 2000});
						notyf.confirm('取消收藏成功');
					}
				}
			}

			xhr.open('POST','/deletecollection', true);
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.send('cardId=' + cardId);

			
		})
	})
})()

;(function(){
	var acountInfo = document.querySelector('.acount-info');
	var userEmail = document.querySelector('.personal-useremail');
	var userCode = document.querySelector('.personal-usercode');
	var reuserCode = document.querySelector('.personal-reusercode');

	var userEmailInput = userEmail.querySelector('input');
	var userCodeInput = userCode.querySelector('input');
	var reuserCodeInput = reuserCode.querySelector('input');

	var originEmail = userEmailInput.value;

	acountInfo.addEventListener('click', function(evt){

		var notyf = new Notyf({delay: 2000});

		var trigger = evt.target; //修改、提交按钮

		if (trigger.innerText == '修改') {
			var parentNode = trigger.parentNode;

			switch(parentNode){
				case userEmail:

					userEmailInput.removeAttribute('disabled');
					trigger.innerText = '提交';

					break;

				case userCode:

					userCodeInput.removeAttribute('disabled');
					reuserCodeInput.removeAttribute('disabled');
					trigger.innerText = '提交';
					break;
			}
		}else if(trigger.innerText == '提交'){
			var parentNode = trigger.parentNode;

			switch(parentNode){
				case userEmail:

					var reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/; //验证是否邮箱格式

					if(userEmailInput.value == originEmail){
						notyf.alert('您输入的邮箱与原邮箱一致');
					}else if (reg.test(userEmailInput.value)) {

						var xhr = new　XMLHttpRequest();
						xhr.onreadystatechange = function(){
							if (xhr.readyState == 4 && xhr.status ==200) {
								if (xhr.responseText == '1') {
									notyf.confirm('邮箱修改成功');
								}else{
									notyf.confirm('邮箱修改失败,请重试');
								}
							}
						}
						xhr.open('POST','/checkemail', true);
						xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
						xhr.send('email=' + userEmailInput.value);
						
					}else{
						userEmailInput.value = originEmail;
						notyf.alert('邮箱格式有误');			
					}

					userEmailInput.setAttribute('disabled', '');
					trigger.innerText = '修改';


					break;

				case userCode:

					if (!userCodeInput.value||!reuserCodeInput) {
						notyf.alert('密码不能为空');
					}else if (userEmailInput.value&&reuserCodeInput.value.length<8) {
						notyf.alert('新密码长度不能小于8个字符');
					}else{
						var xhr = new　XMLHttpRequest();
						xhr.onreadystatechange = function(){
							if (xhr.readyState == 4 && xhr.status ==200) {
								if (xhr.responseText == '1') {
									notyf.confirm('密码修改成功');
								}else if(xhr.responseText == '0'){
									notyf.alert('原密码错误，请重新输入');
								}else{
									notyf.alert('密码修改失败，请重试');
								}
							}
						}
						xhr.open('POST','/checkpassword', true);
						xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
						xhr.send('originpassword=' + userCodeInput.value +'&'+'newpassword=' + reuserCodeInput.value);
					}

					userCodeInput.setAttribute('disabled', '');
					reuserCodeInput.setAttribute('disabled', '');
					trigger.innerText = '修改';

					break;

			}
		}
		
	})

})()