# Continuing on the board creation

We can resume our work and move back to `board.js`. The code should look like this at the moment:

```javascript
function _build() {
    var dimension = size * size;
    houses = {}; // Initializing dictionary

    container = _createContainer();
    for (var k = 0; k < dimension; k++) {
        // Calculate Indexes
        var i = Math.ceil((k + 1) / size);
        var j = (k + 1) % size;
        if (j === 0) j = size;

        // We left at this point...
    }
}
```

## Finishing up the board building function
The comment shows the point where we interrupted our development. We can resume from there. What were we about to do? Oh yes, we were going to create an `House` object. So we have now created the `House` module, now we need to use it in order to construct the corresponding object. This is how we do it:

```javascript
var house = jm.House(i, j);
```

Remember that our code will run inside `index.html`, there we load all the scripts. So when `board.js` runs, it will have the reference to `house.js`, so we can safely make a call to the `House` module like we just did.

Remember that we want to reference the element of the house, we can access the element via `house.element`, and the first thing we wanna do is assigning to this element an id which corresponds to the house position:

```javascript
// In order to facilitate detection while playing
house.element.id = i + ":" + j;
```

The reason why we want to do this will be unveilded later. The id we just assigned is in the form we saw before when defining the indexing in the dictionary of houses: `<i>:<j>`. 

The final operation needed in the loop is then adding the element to the container. So, in order to have something displayed in an HTML page, we need to add it. Elements can contain other elements but the parent of all of them must be contained inside a special element: `<body>`. There is only one `body` element in an HTML page, what we do now is adding all the houses to the `container` element, and then we will add the `container` element to the `body` element.

```javascript
container.appendChild(house.element);

// Index houses
houses[i + ":" + j] = house;
```

Other than adding the house to the container, we are also adding the house to the dictionary.

Out of the loop, we now need one more operation: adding the container to the `body` element of the page. We can do this easily:

```javascript
document.body.appendChild(container);
```

Remember that this script is going to be executed from inside `index.html`. A global object is exposed: `document` and `document.body` is exactly the `body` element we are looking for. Function `appendChild` is supported by every element and we use this again to add the container to the page basically. The function should look like this:

```javascript
function _build() {
    var dimension = size * size;
    houses = {}; // Initializing dictionary

    container = _createContainer();
    for (var k = 0; k < dimension; k++) {
        // Calculate Indexes
        var i = Math.ceil((k + 1) / size);
        var j = (k + 1) % size;
        if (j === 0) j = size;

        console.log("Indices", i, j);

        var house = jm.House(i, j);
        // In order to facilitate detection while playing
        house.element.id = i + ":" + j;
        container.appendChild(house.element);

        // Index houses
        houses[i + ":" + j] = house;
    }

    document.body.appendChild(container);
}
```

## Exposing the API for rendering the board
Our objective now is having the board rendered on screen. [Rendering](https://en.wikipedia.org/wiki/Rendering_(computer_graphics)) is a technical term in IT which refers to the process of displaying something on a visual device. In our case, we want to construct the HTML of the board, and we have prepared all the components for that, and we want them to be viewed in the browser.

We need to start using the `Board` module, create a corresponding object and call `_build`. Well, we actually don't wanna expose function `_build` because the module should just expose a function for rendering the board and also initializing all the horses so that the game can start. For this reason, let's create one more function:

```javascript
function _initialize() {
    _build();
}
```

Add this function in the `Board` module together with the other functions we have created so far. As you can see, at this moment, the function will onlt create an empty board. Later, inside `_initialize`, we will invoke also more functions to render the horses in their initial positions and to initialize the game.

Let's expose the `_initialize` function. In the `Board` module, after the construction code, add the following statement:

```javascript
return {
    initialize: _initialize
};
```

The module should look like the following:

```javascript
jm.Board = function(_size) {
    var CUR_PLAYER_W = 0;
    var CUR_PLAYER_B = 1;

    // Lazy initialized variables
    var container = null;
    var houses = null; // A dictionary indexed by "i:j"
    var horses = null; // An array

    // Status variables
    var currentPlayer = CUR_PLAYER_W; // White starts
    var selectedHouse = null;

    // Object public interface
    return {
        // Code we just wrote...
    }

    // Functions we wrote before...
}
```

Like this, external code, can create an object `Board` and call `initialize()` in order to render the board on the page. So far we have called this process: _function exposition_, however in IT the correct terminology would be: _API definition_. With this `return` statement we are creating the API for an object of type `Board`. API means Application Program Interface and it is the set of funcitonalities that a developer decides to expose from an object. An API defined the way an object communicates and interacts with the external world, it also determines how that object should/can be used.

## Rendering the board
The next step is making the board appear on screen in `index.html`. Let's switch to `jesonmor.js`. This file will contain the code for launching the board and start the game. Here we are going to follow a different approach. Instead of creating a module inside the `jm` namespace, we are going to define a function inside the `jm` namespace. What's the first thing we need to do?

```javascript
var jm = jm || {};
```

Making sure that `jm` is properly initialized if it does not exist.

What's next? Not much we need to:

1. Create a `Board` object.
2. Call `initialize` from that object.

Which means:

```javascript
jm.initialize = function() {
    var board = jm.Board();
    board.initialize();
};
```

As you can see, `jm` will now expose a function called `initialize` which calls `initialize` on a `Board` object. Differently from before we don't need to use a `return` statement for exposing a function in `jm` because we have not defined `jm` as a function but as an object. So here there is no construction needed for `jm`. This is very common because `jm` will the object our page will call when starting. We say that `jm` is the _entry point_ of our application; and, usually, entry points have no constructors.

## Starting the game
Now that we have our entry point, we need to use it. Let's finally switch to `index.html` and add an empty `<script>` tag in the `<body>`.

```html
<body>
    <script type="text/javascript">
        // Here we will type some Javascript code
    </script>
</body>
```

In an HTML page there are 2 ways to execute some Javascript code:

- One way is importing a Javascript file like we did by using a `<script src="...">` tag in the `<head>` section of the page.
- Another way is to define some Javascript code right inside the page by using the same `<script>` tag, but without the `src` attribute. When we define Javascript code like this, directly in the poage, we say that we are writing _inline code_.

We are using both approaches. Inside the `<script>` tag we have just written, we are going to call `initialize` from the `jm` object we have defined in file `jesonmor.js` which we have imported in the page. There is one problem. What we need to write is basically this:

```html
<body>
    <script type="text/javascript">
        jm.initialize();
    </script>
</body>
```

However this code will not always work. Why? The question is the following:

> Are we sure that `jm` is going to be available the moment the browser execute our inline Javascript?

You probably think that the browser first processes all the `<script src="...">` tags in the `<head>` section of the page and then moves to the `<body>`. You are right, but there is one catch:

> The browser will process every directive from top to bottom. However when loading external resources, the browser will do that asyncronously.

What does it mean _asyncronously_? It means that when the browser processes each `<script src="...">`, it will not wait for that file to be loaded before moving to the next line. It will start loading that file but it will move on in the meantime. So how are we guaranteed that the moment we execute our inline code in the `<body>`, all of the files we need are going to be there?

The browser provides us with some functionality for waiting for all resources to be loaded. The code we need to write is this:

```html
<body>
    <script type="text/javascript">
        window.addEventListener("load", function() {
            jm.initialize();
        });
    </script>
</body>
```

In Javascript there is a global object called `window`. Among the different functions that this object exposes, we have a function called `addEventListener`. We will see this function again later and we will discuss more about it in detail. But now what you need to know is that this function accepts 2 parameters:

- One string which should contain the name of the event to wait for
- A function to call when that event is called

The code we wrote is basically telling the browser to execute the function we pass as second argument only when the `load` _event_ has been fired. That event is triggered by the browser only when all files and resources have been loaded.

### Trying to see it in the browser
Try to open the page in your browser and see what happens. We get a blank screen. We made a mistake? No not really. Let's try to understand what's going on.

The first thing we need to understand is that nothing went wrong. We just did things right. The fact that we do not see the board does not mean that it is not in the page. In the browser, press `F12` to bring up the _browser development tool_. Every browser has this thing and it can be activate from the same key, that is why sometimes this tool is called _F12 tool_. A new window opens, that window is used by developers to understand what happens in the page, it is an advanced tool.

![](/assets/f12-tools.png)

This tool lets us understand what there is in the page. In our code we have programmatically added elements to the page, our task now is making sure that this `<div>` elements are there. We are expecting one `<div>` element for the container and many other `<div>` elements inside it: as many as the number of houses which, in our case, is 81 because we did not specify a size for the board, so a 9x9 is created by default. 
    
In this tutorial I am using Chrome, so the F12 tools you are going to see in the picture are specific to Chrome. If you are using a different browser you might need just a little more time to figure out where things are, but be aware that all browser's developer tool implement more or less the same features.

On the top menu, let's make sure we are in the _Elements_ tab. We can see that the HTML tree is displayed. We initially get this view:

```javascript
<html>
    <head>...</head>
    <body>
        <script type="text/javascript"></script>
        <div class="container">...</div>
    </body>
</html>
```

Some lines can be expanded. Go ahead and expand `<div class="container">...</div>`. What we see is the following:

![](/assets/f12-tools-expanded.png)

So this proves that actually we have done things right. The elements are all there and if you count all the `<div class="house"></div>` tags in `<div class="container">...</div>`, they will be 81. So what is wrong? Why can't we see our board? We are missing the styling!
