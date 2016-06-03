(function () {
  "use strict";
  /*!
   * meni.js 1.0.3
   *
   * Copyright (c) 2016 Muhamed Krlić
   *
   * Licensed same as jquery - under the terms of the MIT License
   *   http://www.opensource.org/licenses/mit-license.php
   */

  // prevent another load? maybe there is a better way?
  if ($.meni) {
   return;
  }

  // Plugin definition.
  $.meni = {
    /**
     * specifies the meni.js version in use
     * @name $.meni.version
     */
    version: '1.0.3',
    /**
     * holds all the default options used when creating new instances
     * @name $.meni.defaults
     */
    defaults: {

    },
    /**
     * holds all ul menus defined with data-meni attribute
     * @name $.meni.version
     */
    menus: []
  };

  $.meni.init = function( setup ) {
    if(!setup) {
      console.error('Initializer requires a setup object.');
      return;
    }

    var menus = $("[data-meni]");
    for(var i = 0; i < menus.length; i++) {
      // Find all meni - menus
      var menu = menus[i];
      if(menu.tagName !== 'UL'){
        console.error('Menu \''+menu.dataset.meni+'\' must be defined in a UL tag.');
      }
      if(!setup[menu.dataset.meni] || setup[menu.dataset.meni] === {}){
        console.error('Menu \''+menu.dataset.meni+'\' doensn\'t contain setup info.');
      }

      menus[i].options = {
        activeClass: 'active',
        setup: setup
      };

      $.meni.menus.push(menu);
      // And Its tabs
      for(var j = 0; j < menu.children.length; j++) {
        // menu.children[j] is a tab
        var tab = $(menu.children[j]);

        if(menu.children[j].dataset.meniTab) {
          if(menu.children[j].tagName !== 'LI') {
            console.error('Menu tab \''+tab.dataset.meniTab+'\' must be defined in a LI tag.');
            continue;
          }
          if(menu.children[j].parentElement.dataset.meni !== menu.dataset.meni){
            console.error('Menu tab \''+tab.dataset.meniTab+'\' doesn\'t have \''+menu.dataset.meni+'\' parent.');
            continue;
          }
          var tabs = $('[data-meni="'+menu.dataset.meni+'"] [data-meni-tab="'+menu.children[j].dataset.meniTab+'"]');
          if(tabs.length > 1){
            console.error('Duplicate detected; Menu \''+menu.dataset.meni+'\', Tab \''+menu.children[j].dataset.meniTab+'\'.');
            continue;
          }
          // Handle tab click event.
          menus[i].children[j].handle = function() {
            handler($(this)[0].parentElement, $(this)[0].dataset.meniTab);
          };
          // Register click event ( this will not work in Meteor,
          // use tab.handle to bind your own events instead. )
          tab.on("click", function() {
            $(this)[0].handle();
          });
          // Execute handler If this is a default tab
          if(tab.is('[default]') ) {
            tab[0].handle();
          }
        }else{
          console.error('Can\'t handle non-tab element. Did you forget to put the data-meni-tab attribute?');
          return;
        }
      }
    }
  };

  $.meni.tab = {};
  $.meni.tab.create = function(menu_name, tab_name, setup) {
    if(!menu_name && typeof menu_name === 'string'){
      console.error('Menu name string is missing.');
      return;
    }
    if(!tab_name && typeof tab_name === 'string'){
      console.error('Tab name string is missing.');
      return;
    }
    if(typeof setup !== 'object'){
      console.error('Setup must be of type object.');
      return;
    }
    if(!setup.content){
      console.error('Setup content string is missing.');
      return;
    }
    var menus = $('[data-meni="'+menu_name+'"]');
    // Check menu existance
    if(menus.length > 1){
      console.error('Duplicates detected; Menu \''+menu_name+'\'.');
      return;
    }else if(menus.length < 1){
      console.error('No such menu found; Menu \''+menu_name+'\'.');
      return;
    }
    if(menus[0]){
      // Check tab existance
      for(var t = 0; t < menus[0].children.length; t++){
        if(menus[0].children[t].dataset.meniTab === tab_name){
          console.error('Can\'t add Tab \''+tab_name+'\', already exists in Menu \''+menus[0].dataset.meni+'\'');
          return;
        }
      }
      // Generate html
      var html = '<li data-meni-tab="'+tab_name+'">'+setup.content+'</li>';
      var tab = $(html).appendTo(menus[0]);

      // Update setup object
      var new_setup = {};
      new_setup[tab_name] = setup;
      $.extend(menus[0].options.setup[menus[0].dataset.meni], new_setup);

      // Handle tab click event.
      $(tab)[0].handle = function() {
        handler($(this)[0].parentElement, $(this)[0].dataset.meniTab);
      };
      // Register click event
      tab.on("click", function() {
        $(this)[0].handle();
      });
    }
  }

  var handler = function(menu, handled_tab) {
    change_active_tabs(menu, handled_tab);
    show_hide_views(menu, handled_tab);
  };

  var change_active_tabs = function(menu, handled_tab) {
    var tabs = menu.children;
    if(typeof handled_tab !== 'string'){
      console.error('Internal error: handled_tab must be type of string.');
      return;
    }
    for(var i = 0; i < tabs.length; i++) {
      var tab = tabs[i];
      if(tab.dataset.meniTab){
        if(tab.dataset.meniTab === handled_tab){
          $(tab).addClass(menu.options.activeClass);
        }else{
          $(tab).removeClass(menu.options.activeClass);
        }
      }
    }
  };

  var show_hide_views = function(menu, handled_tab) {
    if(typeof handled_tab !== 'string'){
      console.error('Internal error: handled_tab must be type of string.');
      return;
    }
    // Read setup object
    var setup_menus = Object.keys(menu.options.setup);
    for(var m = 0; m < setup_menus.length; m++){
      var setup_menu_key = setup_menus[m];
      var setup_menu = menu.options.setup[setup_menu_key];
      if(setup_menu_key === menu.dataset.meni){
        var setup_tabs = Object.keys(setup_menu);
        for(var t = 0; t < setup_tabs.length; t++){
          var setup_tab_key = setup_tabs[t];
          if(setup_tab_key === handled_tab){
            var setup_tab = setup_menu[setup_tab_key];
            if(Object.keys(setup_tab).length === 0 && setup_tab.constructor === Object){
              console.error('Tab \''+ setup_tab_key +'\' in setup object is empty.');
              continue;
            }
            if(setup_tab.show) {
              var setup_view_keys = Object.keys(setup_tab.show);
              for(var v = 0; v < setup_view_keys.length; v++){
                var view_container = setup_view_keys[v];
                  var view = setup_tab.show[view_container];
                  var selector = view_container +' '+ view;
                  // Hide all children in this container
                  var view_container_children = $(view_container)[0].children;
                  for(var i = 0; i < view_container_children.length; i++) {
                    $(view_container_children[i]).hide();
                  }
                  // Show child (view) defined in setup
                  $(selector).show();
              }
            }
            if(setup_tab.execute){
              setup_tab.execute({menu: menu, tab: menu.children[t] });
            }
          }
        }
      }
    }
  };

})();
