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

  var TabbedMenu = function () {
    var Tabs   = [];
    var Views  = [];
    var TabViews  = [];
    var defaultTab = '';
    var Options = {};
    var NestedObjects = [];

    this.get = function(){
      return {Tabs: Tabs, Views: Views, TabViews: TabViews, Options: Options};
    };
    this.setDefaultTab = function(d){
      defaultTab = d;
    };
    this.getDefaultTab = function(){
      return defaultTab;
    };
    this._defineView = function(id, name){
      // Type check
      if(typeof id !== 'string'){//
        console.error('defineTab type check failure.');
        return;
      }

      var View = {name: name, elem_id: id, active: false};
      Views.push(View);
      $('#'+View.elem_id).hide();
      return View;
    };
    this._defineTabView = function(tab_id, view_name){
      // Parameter validation
      if(typeof tab_id !== 'string'){
        console.error('TabView parameter "tab_id" is not string.');
        return;
      }
      if(typeof view_name !== 'string'){
        console.error('TabView parameter "view_id" is not string.');
        return;
      }
      // Find the view with name to get the elem_id
      var foundView = _.find(Views, {name: view_name});
      // Check If View is found
      if(!foundView){
        console.error('TabView couldn\'t be defined, define view first.');
        return;
      }

      var TabView = {tab_id: tab_id, view_id: foundView.elem_id};
      TabViews.push(TabView);
      return TabView;
    };
    this._defineTab = function(id, name, def){
      // Type check
      if(typeof id !== 'string'){//
        console.error('defineTab type check failure.');
        return;
      }
      if($("#" + id).length == 0) {
        console.error('Canno\'t define a Tab, given element id doesn\'t exist.');
        return;
      }

      if(def === true){
        this.setDefaultTab(id);
      }

      var Tab = {name: name, elem_id: id, active: false};
      Tabs.push(Tab);
      return Tab;
    };
    this._defineNestedObject = function(o){
      NestedObjects.push(o);
    }
    this._handle = function(tab_id, options){
      if(!options){
        options = $.meni.defaults
      }
      var _TabViews = _.filter(TabViews, {tab_id: tab_id});

      // Reset all active Tabs (should be just one Tab)
      _.forEach(_.filter(Tabs, {active: true}), function(Tab){
        Tab.active = false;
        $('#'+Tab.elem_id).removeClass(options.activeTabClass);
      });
      // Reset all active Views except those which are shown by this tab
      _.forEach(_.filter(Views, {active: true}), function(View){
        View.active = false;
        $('#'+View.elem_id).hide();
        if(options.activeViewClass)
          $('#'+View.elem_id).removeClass(options.activeViewClass);
      });
      // Reset all active nested Views
      if(NestedObjects.length > 0){
        _.forEach(NestedObjects, function(NestedObject){
          var o = NestedObject.get();
          var NestedViews = o.Views;
          var NestedOptions = o.Options;
          _.forEach(_.filter(NestedViews, {active: true}), function(NestedView){
            NestedView.active = false;
            $('#'+NestedView.elem_id).hide();
            if(NestedOptions.activeViewClass)
              $('#'+NestedView.elem_id).removeClass(NestedOptions.activeViewClass);
          });
        });
      }


      _.forEach(_TabViews, function(TabView){

        var tab  = _.find(Tabs, {elem_id: TabView.tab_id});
        if(!tab){
            console.error('Tab not found.');
            return;
        }
        var view = _.find(Views, {elem_id: TabView.view_id});

        // Check If Views is empty, this shouldn't happen, ever.
        if(!view){
          console.error('TabView with tab name "'+tab.name+'" has a corrupt View.');
          return;
        }

        tab.active = true;
        // You can use activeTabClass setting to choose the active css class
        $('#'+tab.elem_id).addClass(options.activeTabClass);

        view.active = true;
        $('#'+view.elem_id).show();
        if(options.activeViewClass)
          $('#'+view.elem_id).addClass(options.activeViewClass);

      });
    };
  };

  TabbedMenu.prototype.get = function() {
    return this.get();
  };
  TabbedMenu.prototype.defineView = function(id, name) {
    return this._defineView(id, name);
  };
  TabbedMenu.prototype.defineTabView = function(tab_id, view_id) {
    return this._defineTabView(tab_id, view_id);
  };
  TabbedMenu.prototype.defineTab = function(id, name, def) {
    if(typeof def === 'undefined'){
      var def = false;
    }
    return this._defineTab(id, name, def);
  };
  TabbedMenu.prototype.defineNestedObject = function(o) {
    if(o)
      return this._defineNestedObject(o);
  };
  TabbedMenu.prototype.handle = function(tab_id, options) {
    if(typeof tab_id === "undefined"){
      var tab_id = this.getDefaultTab();
    }else{
      this.setDefaultTab(tab_id);
    }
    return this._handle(tab_id, options);
  };

  // Plugin definition.
  $.meni = {
    /**
     * specifies the jstree version in use
     * @name $.meni.version
     */
    version: '1.0.3',
    /**
     * holds all the default options used when creating new instances
     * @name $.meni.defaults
     */
    defaults: {
      /**
       * Handle (select) the default tab
       * @name $.meni.defaults.handleDefault
       */
      handleDefault: true,
      /**
       * sets the class of the tab for active state
       * @name $.meni.defaults.activeTabClass
       */
      activeTabClass: 'active',
      /**
       * sets the class of the view for active state (not set by default)
       * @name $.meni.defaults.activeViewClass
       */
      activeViewClass: null,
      /**
       * Nested $.meni objects, can be array of nested $.meni objects
       * @name $.meni.defaults.nestedIn
       */
      nests: null
    }
  };

  $.meni.tabbedMenu = function( el, o ) {
      // TODO: Element must contain at least one ul or be one.
      var element = $( el );

      // Extend our default options with those provided.
      var options = $.extend( {}, $.meni.defaults, o );

      // Options must contain Tabs array and Views array.
      if(!options.tabs){
        console.error('Options object doesn\'t contain tabs array.');
        return;
      }else{
        // Further inspect Tabs array objects.
      }
      if(!options.views){
        console.error('Options object doesn\'t contain views array.');
        return;
      }else{
        // Further inspect Tabs array objects.
      }

      // Define menu objects
      var self = new TabbedMenu();

      // Set options for use in nested objects
      self.Options = options;

      // Define all nested objects
      if(typeof options.nests === 'object'){
        self.defineNestedObject(options.nests);
      }else if (options.nests.constructor === Array) {
        _.forEach(options.nests, function(NestedObject){
          self.defineNestedObject(NestedObject);
        });
      }

      _.forEach(options.views, function(value){
        if(typeof value.name === 'string' && typeof value.element_id === 'string'){
          self.defineView(value.element_id, value.name);
        }else{
          console.error('Options.views object doesn\'t contain "name" or "element_id" strings.');
        }
      });
      _.forEach(options.tabs, function(value){
        if(typeof value.name === 'string' && typeof value.element_id === 'string'){
          self.defineTab(value.element_id, value.name, value.default);
          if(typeof value.show === 'string'){
            self.defineTabView(value.element_id, value.show);
          }else if (value.show.constructor === Array) {
            _.each(value.show, function(view_name){
              self.defineTabView(value.element_id, view_name);
            });
          }
        }else{
          console.error('Options.tabs object doesn\'t contain "name" or "element_id" strings.');
        }
      });

      // Last step is to handle the clicks.
      // Meteor has Its own DOM handler, but If you're not using it you can
      //  use jQuery .click()

      // Handle the initial (default) click
      if(options.handleDefault){
        self.handle();
      }
      // $.meni.tabbedMenu returns the TabbedMenu that has the handle function
      return self;
  };
})();
