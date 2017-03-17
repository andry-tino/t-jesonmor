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

## Rendering the board
We are ready