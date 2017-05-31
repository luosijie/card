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
			if (xhr.readyState === 4 && xhr.status === 200 ) {

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

			var dom = document.querySelector('.temp-list');
			getCards(type, dom)
			.then(function(cards){
				// var  cardTemplate = document.querySelector('#card_template')
				// var template = Handlebars.compile(cardTemplate.innerHTML);
				// dom.innerHTML = template(cards);
				// console.log(cards);
				
				document.querySelector('.temp-list').innerHTML = '<card-list></card-list>';

				Vue.component('card-list', {
					template: ' <ul>\
									<li v-for="item in items">\
							   			<a :href="item._id | formatURL">\
											<img :src="item.coverFront | formatSRC">\
											<p>{{item.title}}</p>\
										</a>\
										<i v-if="item.flag" class="fa fa-heart collection collection-active"></i>\
										<i v-else class="fa fa-heart collection"></i>\
							   		</li>\
							   	</ul> ',

					data: function(){
						return { items: cards}
					},

					filters:{
						formatURL: function(value){
							return '/edituser/' + value
						},
						formatSRC: function(value){
							return '/coverImg/' + value
						}
					}
				})

				new Vue({
					el: ' .temp-list',
				})
				

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
			var dom = document.querySelector('.template-edit');
			getCards(type, dom)
			.then(function(cards){

				document.querySelector('.template-container').innerHTML = '<card-list-edit></card-list-edit>';

				Vue.component('card-list-edit', {
					template: ' <ul class="template-edit">\
									<li v-for="item in items" :data-id=" item._id ">\
										<img :src="item.coverFront | formatSRC" alt="">\
							    	</li> \
							    </ul>',

					data: function(){
						return { items: cards }
					},

					filters: {
						formatSRC: function(value){
							return '/coverImg/' + value
						}
					}
				})

				new Vue({
					el: '.template-container'
				})

			});
		})
	})	
}

//编辑模式选择魔板编辑
var templateUl = document.querySelector('.template-edit');
if (templateUl) {
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
}


//收藏功能
;(function addCollection(){
	var tempList = document.querySelector('.temp-list');
	if (tempList) {
		tempList.addEventListener('click', function(evt){
			var elem = evt.target;
			var a = elem.parentNode.querySelector('a');
			var cardId ;

			if (a) {
				cardId = a.href.match(/edituser\/(\S*)/)[1];
			}
			
			if (elem.classList.contains('collection')) {
				if (elem.classList.contains('collection-active')){
					//数据库删除收藏
					var xhr = new　XMLHttpRequest();
					xhr.onreadystatechange = function(){
						if (xhr.readyState = 4 && xhr.status ==200) {
							if (xhr.responseText == '1') {
								elem.classList.remove('collection-active');
								var notyf = new Notyf({delay:2000});
								notyf.confirm('取消收藏');
							}
						}
					}
					xhr.open('POST','/deletecollection', true);
					xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
					xhr.send('cardId=' + cardId);
				}else{
					//数据库添加收藏
					var xhr = new　XMLHttpRequest();
					xhr.onreadystatechange = function(){
						if (xhr.readyState = 4 && xhr.status ==200) {
							if (xhr.responseText == '1') {
								elem.classList.add('collection-active');

								var notyf = new Notyf({delay:2000});
								notyf.confirm('收藏成功');

							}else if (xhr.responseText == '-1') {
								console.log(xhr.responseText);
								var notyf = new Notyf({delay: 2000});
								notyf.alert('请先登录');
							}
						}
					}
					xhr.open('POST','/addcollection', true);
					xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
					xhr.send('cardId=' + cardId);
				}

			}
		})
	}
})()