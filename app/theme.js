define(['jquery'], function($){
	var themeList = [
		{
			key: 'blue',
			label: '蓝色',
		},
		{
			key: 'gray',
			label: '灰色',
		},
		/*{
			key: 'white',
			label: '白色',
		},*/
		{
			key: 'black',
			label: '黑色',
		},
		{
			key: 'lightblue',
			label: '淡蓝色',
		},
		{
			key: 'yellow',
			label: '黄色',
		},
		{
			key: 'orange',
			label: '橙色',
		},
		{
			key: 'pink',
			label: '粉红色',
		},
		{
			key: 'green',
			label: '绿色',
		},
		{
			key: 'red',
			label: '红色',
		}
	];
	var layoutList = [
		{
			key: 'default',
			label: '默认',
			displayColor: 'gray',
		},
		{
			key: 'white',
			label: '白色',
			displayColor: 'white',
		},
		{
			key: 'dark',
			label: '黑色',
			displayColor: 'black',
		},
	];

	var storage = {
		layoutKey: 'app.layout',
		themeKey: 'app.theme',
		getTheme: function() {
			return localStorage.getItem(this.themeKey) || 'black';
		},
		setTheme: function(color) {
			localStorage.setItem(this.themeKey, color);
		},
		getLayout: function() {
			return localStorage.getItem(this.layoutKey) || 'white';
		},
		setLayout: function(color) {
			localStorage.setItem(this.layoutKey, color);
		}
	};

	function applyTheme(color) {
		if (!color) {
			color = storage.getTheme();
		}
		storage.setTheme(color);

		$('body').removeClass(function(index, css) {
		  return (css.match (/(^|\s)theme-\S+/g) || []).join(' ');
		}).addClass('theme-' + color);
	}

	function applyLayout(color) {
		if (!color) {
			color = storage.getLayout();
		}
		storage.setLayout(color);

		$('body').removeClass(function(index, css) {
		  return (css.match (/(^|\s)layout-\S+/g) || []).join(' ');
		}).addClass('layout-' + color);
	}

	function init() {
		applyTheme();
		applyLayout();
	}

	return {
		themeList: themeList,
		layoutList: layoutList,
		applyTheme: applyTheme,
		applyLayout: applyLayout,
		storage: storage,
		init: init,
	};
});