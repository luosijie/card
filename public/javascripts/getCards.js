//ajax根据不同类型获取后台模板数据
function getCards(type, dom){
	
	var promise = new Promise(function(resolve, reject){
		//loaderDom结构
		var loadingFrag = document.createDocumentFragment();
		var loadDiv = document.createElement('div');
		var loadIcon = document.createElement('i');
		var loadP = document.createElement('p');
		
		loadDiv.className = 'loader';
		loadIcon.className = 'fa fa-spinner fa-pulse fa-3x fa-fw margin-bottom';
		loadP.innerText = '加载中...';
		
		loadDiv.appendChild(loadIcon);
		loadDiv.appendChild(loadP);
		loadingFrag.appendChild(loadDiv);

		var xhr = new XMLHttpRequest();
		url = '/getcards?type=' + type;


		xhr.onreadystatechange = function(){
			//加载中样式
			
			if (xhr.readyState === 3 ) {
				dom.innerHTML = '';
				dom.appendChild(loadingFrag);

			}
			//成功返回数据;
			if (xhr.readyState === xhr.DONE && xhr.status === 200 ) {

				resolve(JSON.parse(xhr.responseText));

			}

		}
		xhr.open('GET', url, true);
		xhr.send();
	})
	return promise;
}

//模板中心获取分类模板
var cateMenu = document.querySelector('.category-menu');
if (cateMenu) {
	var cateMenuLi = cateMenu.querySelectorAll('li');
	cateMenuLi.forEach(function(elem){
		elem.addEventListener('click', function(evt){
			cateMenuLi.forEach(function(e){
				e.className = '';
			})
			elem.className = 'active';

			var type = evt.target.type;
			console.log(type)
			var dom = document.querySelector('.temp-list');
			getCards(type, dom)
			.then(function(cards){
				var  cardTemplate = document.querySelector('#card_template')
				var template = Handlebars.compile(cardTemplate.innerHTML);
				dom.innerHTML = template(cards);
				console.log(cards);
			});
		})
	})	
}


//编辑模式获取分类模板
var cateMenu = document.querySelector('.thame-list');
if (cateMenu) {
	var cateMenuLi = cateMenu.querySelectorAll('li');
	cateMenuLi.forEach(function(elem){
		elem.addEventListener('click', function(evt){
			var type = evt.target.type;
			var dom = document.querySelector('.template');
			getCards(type, dom)
			.then(function(cards){
				var  jsTemplate = document.querySelector('#edit_card_template')
				var template = Handlebars.compile(jsTemplate.innerHTML);
				dom.innerHTML = template(cards);
			});
		})
	})	
}

//编辑模式选择魔板编辑
var templateUl = document.querySelector('.template');
templateUl.addEventListener('click', function(evt){
	var elem = evt.target.parentNode;
	if (elem.tagName == 'LI') {
		var cardId = elem.dataset.id;
		var xhr = new XMLHttpRequest();
		var url = '/getEditCard?id=' + cardId;
		xhr.onreadystatechange = function(){
			if (xhr.readyState == 4 && xhr.status ==200) {
				var data = JSON.parse(xhr.responseText);

				var sideFront = document.querySelector('.side-front'),
					sideBack = document.querySelector('.side-back');

				sideFront.innerHTML = data.sideFront;
				sideBack.innerHTML = data.sideBack;
				
				
			}
		}
		xhr.open('GET',url, true);
		xhr.send();
	}
})