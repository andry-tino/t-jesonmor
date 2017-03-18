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
The next step is making the board appear on screen in `index.html`.
