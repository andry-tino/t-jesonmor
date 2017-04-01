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

The code is not dificult for this function. First of all, if no horse is placed in the house, then we don't really need to do anuything:

```javascript
if (!_horse) {
    return;
}
```

## Checking the presence of an horse
The function for checking that an horse is present can be called: `isSet`. We can define it right below `_unset` which we have just finished writing:

```javascript
function _isSet() {
    return !!_horse;
}
```

## Getting the position of the house
To get the position of the house, we can write function `_getPosition` after `_unset`:

```javascript
function _getPosition() {
    return { "i": i, "j": j };
}
```

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
