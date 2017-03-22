# Adding the horses

The next step is filling the houses with horses. Each player gets 9 horses, so we need to place on the board a total of 18 horses, 9 white and 9 black. Let's move on and create the module for a horse.

## Defining the horse module
Well, even though we are going to have 2 types of horses: black and white, we are still talking about the same thing: an horse. So we are going to create one module for an horse and give it the possibility to specify whether we want a black horse or a white horse.

We have already created `horse.js` at the very beginning of our journey, so let's jump to that empty file and start writing down the first lines:

```javascript
var jm = jm || {};

jm.Horse = function(__mode) {
    // The code for the horse module goes here
};
```

Not surprisingly, the code is the same as for the the other modules we have created so far. Please note that we have added a parameter to our constructing function: `__mode`. When we are going to use the module to create one horse, we will pass a value indicating whether we want a black one or a white one. The reason for the double underscore, is because we are going to use other variables called `mode` later, so we avoid a clash of names.

### Constants for the mode
So let's enstablish that `0` means a white horse, while `1` means a black horse. Now, if we just use numbers, we make things a bit difficult. What if we change our mind in future and decide to use different values? And how to remember that `0` means white and `1` black in one month from now? Well, we need to use constants as we did before. However there is a problem here. We cannot define these constants in the module as they need to be visible outside of the module. The solution would be exposing them, but then we would need a constructued object, and we need to use the constants before building one. 

We need to place these constants outside of the module in a place where they will always be available. Remember that we have created `jm` to be a globally available object, so we can just add these constants to that object. This is how we do it:

1. Go to the project folder. It is the folder that contains `index.html` and the other files we created at the beginning of the tutorial.
2. Create a new file there and call it: `consts.js`.
3. Open that file.

Since we need to reference the global object `jm`, we want to make sure one exists first, so same as before we write this first line:

```javascript
var jm = jm || {};
```

Now we can define the constants by adding these 2 lines:

```javascript
jm.HORSE_W = 0;
jm.HORSE_B = 1;
```

Those are the 2 constants we will use to define the type of horse. Let's now include this file in `index.html`:

1. Open `index.html`.
2. In the `<head>` section, locate the first `<script src="..." type="text/javascript"></script>` line.
3. Add one line before that and type: `<script src="consts.js" type="text/javascript"></script>`.

So your `index.html` now looks like:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Play Jeson Mor</title>

    <!-- Stylesheets -->
    <link rel="stylesheet" type="text/css" href="style.css">

    <!-- Javascript files -->
    <script src="consts.js" type="text/javascript"></script>
    <script src="horse.js" type="text/javascript"></script>
    <script src="house.js" type="text/javascript"></script>
    <script src="board.js" type="text/javascript"></script>
    <script src="jesonmor.js" type="text/javascript"></script>
</head>

<body>
    <script type="text/javascript">
    window.addEventListener("load", function() {
        jm.initialize();
    });
    </script>
</body>
</html>
```

### Defining the constructor
Let's go back to `horse.js` and resume our development there. Let us write the constructor code and we stard by defining two important variables:

```javascript
var i = 1;
var j = 1;
```

Variable `i` represents the row where the horse is located, while `j` the column. It makes sense because one horse is placed into an house, and in order to locate which house, we store the coordinates of it. Note that we are setting an horse in the first house of the board hen it is created. That is all right, when we construct one horse we place it by default on the first house, later we will expose functions for moving it.

We now need to store the mode, so we add this line:

```javascript
var _mode = _validateMode(__mode); // HORSE_W | HORSE_B
```

The comment remonds us that `__mode` should be either `jm.HORSE_W` or `jm.HORSE_B`. As always, we want to validate the input of the constructor, so we let's add function `_validateMode` to the module:

```javascript
function _validateMode(value) {
    if (value !== jm.HORSE_W && value !== jm.HORSE_B) {
        return jm.HORSE_W; // Default to white
    }

    return value;
}
```

Of course we want to make sure that whatever component is using an horse, it is passing a proper value to define the mode. What if somebody specifies a value different from `jm.HORSE_W` or `jm.HORSE_B` to `__mode`? We have 2 options:

1. We can make the module fail and create an error.
2. We can discard the input and define a default value.

Generating errors is fine, however in this case, if the mode is not correct, we just set the horse to be white by default. So if somebody misusus this module and tries to create a red horse, he will get a white one :)

Let's go back to the constructor code. After variables `_mode`, we need to create a variable for hosting the element we need to create for the horse. In fact we will render an horse on the page. As we did before, we will create a function for generating this element:

```javascript
var _element = _createElement(_mode);
```

We can create the function right before `_validateMode`:

```javascript
function _createElement(mode) {
    // Code for creating the horse element here
}
```

The first 2 lines is something we have already seen:

```javascript
var element = document.createElement("div");
element.className = HORSE_CLASSNAME;
```

We create a `<div>` element and we assign it a class so that, later, we can style it in CSS. Now, let's define the constant at the beginning of the module:

```javascript
jm.Horse = function(__mode) {
    var HORSE_CLASSNAME = "horse";

    // Code we wrote before...
};
```

Back to function `_createElement`, we now need to find a way to style the horse in a different way depending whether it is white or black. The way to do this is still by using CSS classes. Let's add the following lines:

```javascript
if (mode === jm.HORSE_B) {
    element.classList.add(BLACK_CLASSNAME);
} else {
    element.classList.add(WHITE_CLASSNAME);
}
```

We will define the 2 constants right after `HORSE_CLASSNAME` at the beginning of the module:

```javascript
jm.Horse = function(__mode) {
    var HORSE_CLASSNAME = "horse";
    var WHITE_CLASSNAME = "white";
    var BLACK_CLASSNAME = "black";

    // Code we wrote before...
};
```

Property `classList` on an HTML element is used for modifying the list of CSS classes associated to an HTML element. By calling `element.classList.add`, we add a new class. Later, when we'll define the CSS for an horse, we will see how these classes play a role in rendering a white and a black horse.

The last line to write is for returning `element`, so `_createElement` should look like this:

```javascript
function _createElement(mode) {
    var element = document.createElement("div");
    element.className = HORSE_CLASSNAME;
    
    if (mode === jm.HORSE_B) {
        element.classList.add(BLACK_CLASSNAME);
    } else {
        element.classList.add(WHITE_CLASSNAME);
    }

    return element;
}
```

## Defining the API
We need to expose a few things for an object of type `Horse`:

- The element so that we can add it to the page.
- A function for getting the current position of the horse.
- A function for setting the position of the horse when we want to place it in a different house.

Let's start form the first point. Right after the constructor code in the module, we can add the `return` statement for exposing members from the module:

```javascript
jm.Horse = function(__mode) {
    // Constants and constructor...

    // Object public interface
    return {
        element: _element
    };

    // Functions we wrote before...
};
```

We are exposing the element like this, now we need to focus on the 2 functions for handling the position of the horse. So, in the module, after function `_createElement`, let's create a new one:

```javascript
function _position() {
    return { "i": i, "j": j }
}
```

This function will return an object which specifies the coordinates of the house where the horse is placed at the moment. We are using the object notation for defining an object with 2 properties `i` and `j` which will get their values from the internal module variables.

Before this function, let's create a new one:

```javascript
function _setPosition(_i, _j) {
    if (!_i || !_j) {
        throw "Invalid position!";
    }
    if (_i <= 0 || _j <= 0) {
        throw "Invalid position!";
    }

    i = _i;
    j = _j;
}
```

This last function will be exposed, together with `_position`, for setting the position of the horse. The first two conditionals are used to check that correct values for input parameters `_i`
 and `_j` are provided. When this does not happen we create an error by using the `throw` statement. The string that follows this keyword is used by Javascript to display a message for the error. If everything is ok, then the new position is stored.

Let's noe expose these 2 functions by adding 2 members in the return object:

```javascript
// Object public interface
return {
    element: _element,
    position: _position,
    setPosition: _setPosition,
    mode: _mode
};
```

As you can see, we are also returning the mode so that an external component can check what type of horse it is handling: white or black.
