# Extending the `House` module

Before we dig into further development of the board, we need to extend module `House` because we are going to need some more functionalities there that we are soon going to use. So let's jump to `house.js` and see what it is that we need there:

- We need a function for removing the horse from the house, in case one is placed in it.
- We need a function to tell us whether there is an horse in the house.
- We need a function to get the position of the house.
- And we also need a function that gives us the color of the horse in the house, if any.

You will see in the next chapter, that all these functions we have just enumerated are going to be necessary. So let's do the work upfront.

## Removing the horse
The function we want to write is called: `_unset`. We can write it just below `_set`:

```javascript
function _unset() {
    // Code goes here...
}
```

The code is not dificult for this function. First of all, if no horse is placed in the house, then we don't really need to do anything:

```javascript
if (!_horse) {
    return null;
}
```

Since this function will return the horse it removes, we need to return `null` in this case as there was nothing to return. Removing the horse basically means resetting variable `_horse`:

```javascript
var horse = _horse; // Temporary location
_horse = null;
```

As you can see, before resetting the variable, we store the horse in a temporary location. However we are not done yet. The element still contains the horse element, we need to remove it from the element so that it is not displayed anymore in the house on the board:

```javascript
var child = _element.firstChild;
if (child) {
    child.remove();
}
```

Calling `remove` on an element, will cause that element to be removed from its parent, thus from the page. After this, we can just write down `return horse;` to return the removed horse. The code should look like this:

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

## Checking the presence of an horse
The function for checking that an horse is present can be called: `isSet`. We can define it right below `_unset` which we have just finished writing:

```javascript
function _isSet() {
    return !!_horse;
}
```

Expression `!!_horse` will convert variable `_horse` into `true` if the variable has a value, otherwise it will be converted into `false`.

## Getting the position of the house
To get the position of the house, we can write function `_getPosition` after `_unset`:

```javascript
function _getPosition() {
    return { "i": i, "j": j };
}
```

Here as well not much of a rocket science: we return an object which has 2 properties: `i` for the row and `j` for the column.

## Retrieving the color of the horse
We also have function `getHorseColor` to write. This can be defined just after `_isSet`:

```javascript
function _getHorseColor() {
    if (!_horse) {
        return null;
    }

    return _horse.mode;
}
```

This function first checks that we have an horse, in case we have no horse, we return `null`. However if an horse is saved in `_horse`, then we return its color by using exposed property `mode`.

## Exposing them all
Everything we have added we must now expose. So let's reach the `return` statement in the module constructor (in the top area of `house.js`), and let's add 4 more exposing lines. The `return` statement should look like this now:

```javascript
return {
    element: _element,
    set: _set,
    unset: _unset,
    isSet: _isSet,
    getPosition: _getPosition,
    getHorseColor: _getHorseColor // HORSE_W | HORSE_B
};
```
