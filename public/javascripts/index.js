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
 			 }
 		}
})()
