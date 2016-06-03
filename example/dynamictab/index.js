//#test1
var setup = {
  'mainmenu':{
    'home':{
      show:{
        '.container': '#home'
      }
    },
    'about':{
      show:{
        '.container': '#about'
      }
    }
  }
};
$.meni.init(setup);

$.meni.tab.create('mainmenu', 'dynamictab',{
  content: 'Dynamic Tab',
  execute: function(o){
    console.log(o.tab.dataset.meniTab, 'executed on click!');
  }
});

$.meni.tab.create('mainmenu', 'dynamictab',{
  content: 'Dynamic Tab',
  execute: function(o){
    console.log(o.tab.dataset.meniTab, 'executed on click!');
  }
});
