![meni.js](http://i.imgur.com/nsvTANa.png)
## A convenient javascript library for making dynamic menus
If you don't want to use some heavy front-end javascript framework and just want
robust, convenient library to take care of the logic behind hiding/showing
html elements - take a look at this bad boy!

### Requirements
  - `meni.js` is a jQuery plugin so you'll need jQuery (duh!)
  - You'll also need lodash, grab your copy from [here](https://lodash.com/).

### Step 1 - Define your menu
```javascript
var myMenu = $.meni.tabbedMenu('.menu nav ul',{
  tabs:  [
    {
      name:'myDevices',
      element_id: 'menuDevices',
      show:['devicesView'],
      default: true
    },
    {
      name:'myUsers',
      element_id: 'menuUsers',
      show:['usersView']
    },
    {
      name:'mySettings',
      element_id: 'menuSettings',
      show:['settingsView']
    }
  ],
  views: [
    {
      name:'devicesView',
      element_id:'container_devices'
    },
    {
      name:'usersView',
      element_id:'container_users'
    },
    {
      name:'settingsView',
      element_id:'container_settings'
    }
  ]
});
```
This is how you define your tabbed menu. First argument is the selector string, you'll
need a `ul` element in your menu, use this argument to select your `ul` element.
Second argument is an object, in this object you'll need `tabs` and `views`
arrays. `tabs` is an array of objects that defines your tabs, `views` is an array
of objects that define what you'll show after user clicks a tab.

  - `tabs` array of objects
    - `name` | string, name of the tab, can be the same as the tab id (element_id)
    - `element_id` | string, id of the tab html element
    - `show` | a string or an array of strings, what view/s to show after a tab has been clicked.
    - `default` | boolean, If true the tab will be handled (clicked) on DOM ready

  - `views` array of objects
    - `name` | string, name of the view, can be the same as the view id (element_id)
    - `element_id` | string, the id of the html element that will be shown (after Its been hidden, `meni.js` automatically hides all views) by default.

Remember, for each tab you need a view defined. One more thing.

### Step 2 - Handle your clicks
```javascript
$( "#menuDevices" ).click(function(event) {
  myMenu.handle(event.target.id);
});
```

You can also pass a second argument for options `myMenu.handle(event.target.id, options);`


```javascript
// Default options
{
    /**
     * Handle (select) the default tab
     * @name $.meni.defaults.handleDefault
     */
    handleDefault: true, // Choose true If you want your default tab to click itself :D
    /**
     * sets the class of the tab for active state
     * @name $.meni.defaults.activeTabClass
     */
    activeTabClass: 'active',
    /**
     * sets the class of the view for active state (not set by default)
     * @name $.meni.defaults.activeViewClass
     */
    activeViewClass: null
}
```

### Step 3 - The hardest part

Click all the buttons you've made and enjoy!

### Benchmark

Didn't do a lot of tests, but chrome profiler averaged 8ms on each click, max 15ms. (lodash helps a lot!).

## Contribute

That's right! All your contributions, suggestions and issues also help, so get to it. :)

