# Rendering the horses on board

Now that we have the `Horse` module, we can start using it in the board. Our goal is displaying the horses on the board. Now that we finally have the board on screen, we need the final component: horses.

## Extending the initialization function
Let's go back to `board.js`. The last function we created was `_build` and it was responsible for actually creating the board. We decided to expose function `initialize` from the board by pointing to internal function `_initialize`.

We want to extend our initialization by adding another function for populating the board with horses in their initial positions. In JM, horses are initially placed in the first and last row. It means that houses `r1:c1` to `r1:c9` are going to have a white horse each; while houses `r9:c1` to `r9:c9` are going to have a black horse each:

1. Locate function `_initialize`.
2. Extend the code by adding a call to function `_populate`.

So that `_initialize` now looks like this:

```javascript
function _initialize() {
    _build();
    _populate();
}
```

Of course we still need to define `_populate`, so, before `_build`, add the following code:

```javascript
function _populate() {
    // Code to be written here
}
```

## Populating the board with horses
The first thing we want to do in this function, is checking that the `container` variable has a value. If not, it means that somebody is trying to call `_populate` without having called `_build` first. This function expects the board to be built to run properly, thus we need to check:

```javascript
if (!container) {
    throw "Invalid operation. Board must be first initialized!";
}

horses = [];
```

If everything is fine, we can proceed by initializing the array of horses:

```javascript
horses = [];
```

We created module variable `horses` when we started creating the `Board` module. This variable must be an array, a collection, of horses on the board. The line of code we just type creats an empty array.

The next step is creating as many white horses as the size of the board, same for black horses. Variable `size` stores the size of the board, so we can start creating a loop:

```javascript
for (var k = 0; k < size; k++) {
    // Code for creating horses will go here
}
```

We define a counter variable `k` which will range from `0` to `size - 1`. Arrays, usually, by convention, start from position 0. For each one of the iterations (as many as the value of `size`) we will create one white horse and one black horse. So inside the loop, add these first 2 lines:

```javascript
var horsew = jm.Horse(jm.HORSE_W);
var horseb = jm.Horse(jm.HORSE_B);
```

We are calling the constuctor of the `Horse` module, and we are providing constants `jm.HORSE_W` and `jm.HORSE_B` for specifying that we want a white and a black horse. Now let's calculate the positions were we should place the 2 horses:


```javascript
var wi = 1;
var wj = k + 1;
var bi = size;
var bj = k + 1;
```

White horses must be placed on the first row and for `k = 0..(size - 1)` we need to place them into columns ranging from `1` to `size`. For black horses, we need to use the last row, thus we use `size`. We have defined the positions, let's use them to define the positions:


```javascript
horsew.setPosition(wi, wj);
horseb.setPosition(bi, bj);
```

Please note that `setPosition` in the `Horse` module is not really setting the position of the horse, it is just setting some module internal variable. The reason why we use this function, is for checking that the position is valid. Remember that `setPosition` will throw an error in case the position is not correct.

Next step is adding the horses in the array:

```javascript
// Push horses in collection
horses.push(horsew);
horses.push(horseb);
```

Function `push` called on an array, will add the object to the array.

However our loop is not complete yet. We are missing the very last step: we need to physically place the horse element inside the board. Actually we want to add horses inside house elements. In order to do this, we will create function `_setHorse` which will take care of this operation. So let's complete our loop by adding these 2 lines:

```javascript
_setHorse(wi, wj, horsew);
_setHorse(bi, bj, horseb);
```

We will design `_setHorse` to accept 3 parameters:

1. The row of the house where to place the horse.
2. The column of the house where to place the horse.
3. The horse itself.

Our function should look like this now:

```javascript
function _populate() {
    if (!container) {
        throw "Invalid operation. Board must be first initialized!";
    }

    horses = [];

    for (var k = 0; k < size; k++) {
        var horsew = jm.Horse(jm.HORSE_W);
        var horseb = jm.Horse(jm.HORSE_B);

        var wi = 1;
        var wj = k + 1;
        var bi = size;
        var bj = k + 1;

        horsew.setPosition(wi, wj);
        horseb.setPosition(bi, bj);

        // Push horses in collection
        horses.push(horsew);
        horses.push(horseb);

        _setHorse(wi, wj, horsew);
        _setHorse(bi, bj, horseb);
    }
}
```

## Extending module `House`
We have used function `_setHorse`, but that does not yet exist. Before creating it, we need to move temporarily to module `House` because we need to add some more functionalities we will need inside `_setHorse`. So let's move to `house.js`.

The funcitonality we are missing is the ability to set an horse into an house. We are going to add this functionality. So just locate, in the module, the line where we have defined `HOUSE_CLASSNAME`, right after that, add the following lines:

```javascript
// Lazy initialized objects
var _horse = null;
```

We have just added a module variable to keep track of the horse which populates the house, if any. If this variable is `null`, then the house is free. Otherwise, the house is occupied by a horse which will be hosted inside this variable.

### Setting an horse
We are ready to write the function for setting an horse in the house. Locate the `return` statement in the construction code of the module, and this function after it:

```javascript
function _set(horse) {
    if (_horse) {
        throw "Cannot set as a horse is already present on this house!";
    }

    _horse = horse;
    _element.appendChild(horse.element);
}
```

The code we just wrote is used for setting an horse in the house. We do the following:

1. We first check whether an horse is already present in the house, in case we fail. In fact we cannot occupy an house when it is already occupied.
2. In case no horse is present, we save the horse object inside variable `_horse`.
3. We render the horse on screen by adding it to the house element.

Let's expose this function in the `return` statement of the module:

```javascript
return {
    element: _element,
    set: _set
};
```

### Removing the horse
We have added the capability to place an horse into the house, now we need to do the the opposite and allow the horse to be removed. So, let's add another function right after `_set`:

```javascript
function _unset() {
    if (!_horse) {
        return;
    }

    // More code to write here...
}
```

The first thing we do is checking whether we actually have an horse in the house, otherwise we have nothing to remove, so we just return without proceeding any further. The next code we need to write in the function, is the one for removing the horse:

```javascript
var horse = _horse; // Temporary location
_horse = null;
```

As you can see, before semoving the horse from the module, we are saving it inside a temporary variable `horse` inside this function. Why? Because we want to return the horse we are removing. It will become handy later. The next step is to remove the horse from the page, we do this by removing the horse element from the house element:

```javascript
var child = _element.firstChild;
if (child) {
    child.remove();
}
```

The previous lines do the following:

1. We take the house element and get the first element inside. The assumption is that an house either is empty, either contains only one element and that element has to be an horse.
2. If we found a child element, we remove it

What next? Just returning `horse`:

```javascript
function _unset() {
    if (!_horse) {
        return;
    }

    var horse = _horse; // Temporary location
    _horse = null;

    var child = _element.firstChild;
    if (child) {
        child.remove();
    }

    return horse;
}
```

Of course, we will expose this function as well in the module:

```javascript
return {
    element: _element,
    set: _set,
    unset: _unset
};
```

## Placing horses into houses
Now that we have changed the `House` module to support horses, we can go back to `board.js`. We just wrote the last line in function `_populate`, the last two lines use function `_setHorse` which we have not defined yet. Now it is time to do so. 

So let's create it before function `_build` in the `Board` module: 

```javascript
function _setHorse(i, j, horse) {
    // Code for placing the horse into an house will go here
}
```

The first thing we wanna do is getting the house at the specifid position in `i` and `j`. For this purpose, let's write a function called `_getHouse`. We will use it before writing it in `_setHorse`:

```javascript
function _setHorse(i, j, horse) {
    var house = _getHouse(i, j);
    if (!house) {
        throw "Cannot set horse in house. Cannot find house!";
    }

    // More code to be written later here...
}
```

This function `_getHouse` we are going to define, will return the house if found, or `null` otherwise. In fact we check that an house was returned before moving on, in case we fail finding the house, we throw an error. So let's suspend work on `_setHorse` and 
