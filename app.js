define(['app/theme', 'jquery', 'lodash', 'framework7'], function(theme, $, _){
	Template7.registerHelper('_', function(){
	    return _;
	});

	theme.init();

	var app = new Framework7({
	  pushState: true,
	  precompileTemplates: true,
	  template7Pages: true,
	  template7Data: {},
	  preprocess: function(content, url, next){
	  	var base = (url||'').split('?')[0];
	  	var paths = base.split('/');
	  	switch(paths[0]) {
	  		case 'app':
	  			require(['app/main'], function(module){
	  				module.preprocess(content, url, next);
	  			});
	  			break;
	  		case 'lol':
	  			require(['lol/main'], function(module){
	  				module.preprocess(content, url, next);
	  			});
	  			break;
	  		default:
	  			return next(content);
	  	}
	  },
	  onPageInit: function(app, page) {
	  	var $page = $(page.container);
	  	var $pageContent = $page.find('.page-content');
	  	$page.find('.scroll-top-link').on('click', function(){
	  		$pageContent.scrollTop(0);
	  	});
	  	$page.find('.scroll-bottom-link').on('click', function(){
	  		var $last = $pageContent.children().last();
	  		$pageContent.scrollTop($last.offset().top + $last.height());
	  	});
	  },
	  onAjaxStart: function (xhr) {
	    app.showIndicator();
	  },
	  onAjaxComplete: function (xhr) {
	    app.hideIndicator();
	  },
	});
	var mainView = app.addView('.view-main', {
	  dynamicNavbar: true,
	});
	mainView.router.loadPage('app/home.html');

	return app;

});