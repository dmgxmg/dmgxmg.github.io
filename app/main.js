define(['app', 'app/theme', 'jquery', 'lodash'], function(app, theme, $, _){
	Template7.registerHelper('isChecked', function(a, b){
		return a === b ? 'checked' : '';
	});
	app.onPageInit('/app/settings', function(page){
		var $page = $(page.container);
		$page.find('input[name="theme"]').on('change', function(){
			theme.applyTheme($(this).val());
		});
		$page.find('input[name="layout"]').on('change', function(){
			theme.applyLayout($(this).val());
		});
	});

	function preprocess(content, url, next) {
		if (url == 'app/settings.html') {
			Template7.data['url:app/settings.html'] = {
				themeList: theme.themeList,
				layoutList: theme.layoutList,
				theme: theme.storage.getTheme(),
				layout: theme.storage.getLayout(),
			};
		}
		return next(content);
	}

	return {
		preprocess: preprocess
	};
});