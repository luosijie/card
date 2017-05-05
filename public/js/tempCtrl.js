;(function(){

	var tempDelete = document.querySelectorAll('.temp-delete');
	tempDelete.forEach(function(elem){
		elem.addEventListener('click', function(evt){
			var temp = 	elem.parentNode.parentNode.parentNode.parentNode;
			var tempId = temp.dataset.id;
			alert(tempId);

			var xhr = new XMLHttpRequest();
			xhr.onload = function(){
				
				temp.parentNode.removeChild(temp);
			}
			xhr.open('POST', 'http://api.localhost:3000/delete?type=template&id=' + tempId, true);
			xhr.send();
		})
	})

})()

