define(['app', 'jquery', 'lodash', 'lolChampion'], function(app, $, _){
  Template7.registerHelper('lolHeroTag', function(key){
    var tags = {
      Fighter: '战士',
      Mage: '法师',
      Assassin: '刺客',
      Tank: '坦克',
      Marksman: '射手',
      Support: '辅助',
    };
    return tags[key] || key;
  });

  Template7.registerHelper('lolHeroLink', function(currentHeroId, type){
    var keys = _.keys(LOLherojs.champion.data);
    var currentIndex = _.indexOf(keys, currentHeroId);
    var index = type == 'prev' ? currentIndex-1 : currentIndex+1;
    if (!keys[index]) {
      return '<a class="link" href="#"></a>';
    }
    var hero = LOLherojs.champion.data[keys[index]];
    var content = type == 'prev' ? '<i class="icon icon-prev"></i><span>'+hero.name+'</span>' : '<span>'+hero.name+'</span><i class="icon icon-next"></i>';
    return '<a class="link" href="lol/hero-detail.html?heroId='+hero.id+'" data-reload="true">'+content+'</a>';
  });

  var storage = {
    heroIdKey: 'lol.heroId',
    activeTabKey: 'lol.activeTab',
    getHeroId: function() {
      return sessionStorage.getItem(this.heroIdKey);
    },
    setHeroId: function(heroId){
      sessionStorage.setItem(this.heroIdKey, heroId);
    },
    getActiveTab: function() {
      return sessionStorage.getItem(this.activeTabKey);
    },
    setActiveTab: function(activeTab) {
      sessionStorage.setItem(this.activeTabKey, activeTab);
    },
  };

  var utils = {
    getHeroJsUrl: function(heroId) {
      return 'http://lol.qq.com/biz/hero/'+heroId+'.js';
    },
    getHeroBigSkinUrl: function(skinId) {
      return 'http://ossweb-img.qq.com/images/lol/web201310/skin/big'+skinId+'.jpg'
    }
  };

  app.onPageInit('/lol/hero-list', function(page){
    
  });

  app.onPageInit('/lol/hero-search', function(page){
    var $page = $(page.container);
    var heroId = storage.getHeroId();

    if (heroId) {
      var scrollTop = $page.find('a[data-hero-id="'+heroId+'"]').offset().top-88;
      $page.find('.page-content').scrollTop(scrollTop);
    }

    app.searchbar($page.find('.searchbar'), {
      searchList: '.list-block-search',
      searchIn: '.item-title, .item-subtitle'
    });
  });

  app.onPageInit('/lol/hero-detail', function(page){
    var $page = $(page.container);
    var heroId = page.query.heroId;
    var activeTab = storage.getActiveTab();

    storage.setHeroId(heroId);
    if (activeTab) {
      app.showTab(activeTab);
    }
    
    $page.find('a[data-skin-index]').click(function(){
      var skins = page.context.skins;
      var photos = $.map(skins, function(skin, index){
        return {
          url: utils.getHeroBigSkinUrl(skin.id),
          caption: skin.name == 'default' ? '默认皮肤' : skin.name,
        };
      });
      app.photoBrowser({
        photos: photos,
        initialSlide: $(this).data('skin-index'),
        theme: 'light',
        type: 'page',
        ofText: '/',
        backLinkText: '返回',
      }).open();
    });

    _.forEach(['.lore-tab', '.skin-tab'], function(v, k){
      $page.find(v).on('tab:show', function(){
        storage.setActiveTab(v);
      });
    });
  });

  function preprocess(content, url, next) {
    var base = (url||'').split('?')[0];
    var championList = {list: _.values(LOLherojs.champion.data)};
    Template7.data['url:lol/hero-list.html'] = championList;
    Template7.data['url:lol/hero-search.html'] = championList;
    if (base == 'lol/hero-detail.html') {
      var query = Dom7.parseUrlQuery(url);
      var heroId = query.heroId;
      $.getScript('http://lol.qq.com/biz/hero/'+heroId+'.js')
      .done(function(){
        Template7.data['page:/lol/hero-detail'] = LOLherojs.champion[heroId].data;
      })
      .always(function(){
        return next(content);
      });
    } else {
      return next(content);
    }
  }

  return {
    preprocess: preprocess,
  };
});