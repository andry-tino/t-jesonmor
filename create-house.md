# Creating the house module

We follow the same scheme we have adopted when creating the `Board` module.

1. Open `house.js`.
2. Write the initial module code in it.

So our file will look like this:

```javascript
var jm = jm || {};

jm.House = function(_i, _j) {
    // Here we will write the code for the House object
};
```

## Constructing the object
The first thing we need to take care of is the construction of an `House` object. The module function we have created accepts two parameters `_i` and `_j` which represent the row and the column of the house. It means that in order to construct one house, we need to provide the position of it on the board.

We want to validate the position passed to the constructor, so we create a `_validatePosition` function in the module:

```javascript
function _validatePosition(value) {
    if (!value) {
        throw value + " is invalid. Position must be a number!";
    }
    if (value <= 0) {
        throw value + " is invalid. Position must be a positive number!";
    }

    return value;
}
```

When we use an expression like `if (variable)` we are checking whether `variable` is an actual value, to evaluate the opposite we use `if (variable)`. We want to make sure a value was passed, so we have this condition. Later we also check that the number passed is not negative because it would not make any sense.

Now that the input is validated, we can use this function and store the position of the house:

1. Create two module variables for storing the position.
2. Assign the passed passed in the constructor to the module variables after checking them.

This means the following:

```javascript
jm.House = function(_i, _j) {
    // Construct object
    var i = _validatePosition(_i);
    var j = _validatePosition(_j);

    function _validatePosition(value) {
        // Code we wrote before...
    }
};
```

## Creating the element
The module must create the HTML element for the house. In order to do this, following the approach we used in the `Board` module, we define a function for that and we write it inside the module:

```javascript
function _createElement() {
    var element = document.createElement("div");
    element.className = HOUSE_CLASSNAME;

    return element;
}
```

For the styling, as before, we will define a variable called `HOUSE_CLASSNAME` in the module, let's write it down at the very first line of the module content:

```javascript
jm.House = function(_i, _j) {
    var HOUSE_CLASSNAME = "house";

    // Code we wrote before...
};
```

What we did is the same as before: we created a `div` element, assigned a style and returned it. Again, do not worry about this class name, we will get back to that in a few moments. Let's now use this function:

1. Create a module variable to host the element.
2. Assign it a value at construction time by calling function `_createElement`.

Which means the following:

```javascript
jm.House = function(_i, _j) {
    var HOUSE_CLASSNAME = "house";

    // Construct object
    var i = _validatePosition(_i);
    var j = _validatePosition(_j);
    var _element = _createElement();

    // Code we wrote before...
};
```

## Defining the API of the object
Now we have the basic code for the house. When constructed, the house will store the position and will also create the element. However like this, module `House` is completely unaccessible from the outside world. We want to use this module to create an object, but we want to interact with this object. For example, we will need to be able to reference `_element`, but that variable is held by the module and it is not accessible from outside it! How do we expose internal variables or functions?

> In order to expose objects from inside the module, we need to return them.

Remember that a module is a function, when the module is invoked an object is constructed via the module function. This function can return an object containing the references to everything we want to expose from inside the module to the external world.

As we mentioned before, we want to expose `_element`, so this is what we write just after the constructor:

```javascript
jm.House = function(_i, _j) {
    var HOUSE_CLASSNAME = "house";

    // Construct object
    var i = _validatePosition(_i);
    var j = _validatePosition(_j);
    var _element = _createElement();

    // Object interface
    return {
        element: _element
    };

    // Code we wrote before...
};
```

In Javascript, creating an object is like creating a dictionary. The empty dictionary `{}` is actually an empty object. To add things to an object we can either use the dot notation:

```javascript
var obj = {};
obj.property = "My first property";
```

Or define it inline:

```javascript
var obj = {
    property: "My first property"
};
```

Both syntaxes are valid. So, in our module, the `return` statement is actually returning the final `House` object which has been constructed so far. The object will, in this case, only expose the `_element` variable.

We are done with the basics of the `House` module. We will need to define more functionality for this module, but for now we do not need anything else. We can go back to the board and continue from where we left.
