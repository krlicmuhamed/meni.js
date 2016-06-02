![meni.js](http://i.imgur.com/nsvTANa.png)
## A convenient javascript library for making dynamic tabbed menus
If you don't want to use some heavy front-end javascript framework and just want
robust, convenient library to take care of the logic behind hiding/showing
html elements - take a look at this bad boy!

### Requirements
  - `meni.js` is a jQuery plugin so you'll need jQuery (duh!)

### Step 1 - Define your menu
Your HTML would look something like this:
```html
<ul data-meni="mainmenu">
  <li data-meni-tab="home" default>Home</li>
  <li data-meni-tab="about">About</li>
</ul>

<!-- Also define a container -->
<div class="container">
  <div id="home">HOME TAB CONTENT</div>
  <div id="about" style="display:none">ABOUT TAB CONTENT</div>
</div>
```
And your Javascript would look something like this:
```javascript
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
```
This is how you define your tabbed menu. You have to pass a `setup` object into
function `$.meni.init(setup);`. The `setup` object is an object that defines what
to show when a tab is clicked. This object should follow this schema:

  - SETUP OBJECT
    - `menu` object, must have same key name as `data-meni` value in html.
      - `tab` object, must have same key name as `data-meni-tab` value in html.
        - `show:{}` object containing one or multiple views that should be shown on
        tab click.
          - `view` object, *key* name should be a selector to a container (wrapper)
          that holds the element you want to show, *value* should be a string that
          completes the selector to the desired element you want to show on tab click.

The reason why you don't define a `view` just as a complete css selector (ex. '.container #home')
is because `meni.js` wants to know the parent element that contains all your other views
, so according to the example given above, when you click tab `home` It will hide all child elements
that are in the container and then show your desired child element (view).

Also, you have to define your default tab by setting `default` attribute in html.

### Step 2 - Handle your clicks
`meni.js` already registers by default all tab click events with jQuery. This may
not work If you use frameworks that have It's own event handling system (ex. Meteor).
In that case you may want to use `handle()` function that is defined in the tab object.
It may look analogous to this:
```javascript
$( '[data-meni="mainmenu"]' ).click(function(event) {
  event.target.handle();
});
```

### Step 3 - The hardest part

Click all the buttons you've made and enjoy!

### Benchmark

Didn't do a lot of tests, but chrome profiler averaged 8ms on each click, max 15ms. (lodash helps a lot!).

## Contribute

That's right! All your contributions, suggestions and issues also help, so get to it. :)
