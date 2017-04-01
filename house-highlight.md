# Making houses highlightable

We are almost ready to finish the game and write the last code in `board.js`. But before we do that, we need to extend module `House` again. This time we need to add the following functionalities:

- We need a function for highlighting one house
- We need a function for removing the highight from the house

When we say that we need to _highlight_ an house, we mean that we want to change its color to a different one which indicates that house has been selected.

## Highlighting and clearing the house
To have the house be highlighted and then cleared, we can write 2 functions in the last part of the module:

```javascript
function _highlight() {
    _element.classList.add(HOUSE_HIGHLIGHTED_CLASSNAME);
}

function _unhighlight() {
    _element.classList.remove(HOUSE_HIGHLIGHTED_CLASSNAME);
}
```

When called, `_highlight` will add class `HOUSE_HIGHLIGHTED_CLASSNAME` to the house element. While `_unhighlight` will remove it. This class name must be defined and we can do that at the top of the file, at the beginning of the module:

```javascript
jm.House = function(_i, _j) {
    var HOUSE_CLASSNAME = "house";
    var HOUSE_HIGHLIGHTED_CLASSNAME = "highlighted";

    // Rest of the module's code...
};
```

We must not forget to expose the functions:

```javascript
return {
    element: _element,
    highlight: _highlight,
    clear: _unhighlight,
    set: _set,
    unset: _unset,
    isSet: _isSet,
    getPosition: _getPosition,
    getHorseColor: _getHorseColor // HORSE_W | HORSE_B
};
```

As you can see we have exposed `_highlight` as `highlight` and `_unhighlight` as `clear`.

## Defining the style

CSS class `highlighted` must be used in the stylesheet so that it can be effective when used. So let's go to `style.css` and let's add these rules at the bottom of the file:

```css
.container > .house.highlighted {
    background-color: #ec592d;
}

.container > .house:nth-child(2n+1).highlighted {
    background-color: #c3380e;
}
```

Let's examine one rule at a time, but first let's notice that they are basically changing the `background-color` of the house as expected!

The first selector: `.container > .house.highlighted` is similar to the one we wrote before, except for this new additional `.highlighted`. What this selector is statig is the following:

> Select, inside elements whose class is set to `container`, all the elements whose class is set to `house` and `highlighted`.

Like this, we can set the highlight color to all houses. However, on the board, we have houses colored in different ways. We have light houses and dark houses because this is a chessboard! The highlight should preserve this difference, it means that we want the highlight on dark houses to be darker than the highlight on light houses. So basically the highlight color must be different for light and dark houses. This is done by means of the second rule: `.container > .house:nth-child(2n+1).highlighted` which is basing selecting this:

> Select, inside elements whose class is set to `container`, all the elements oddly positioned and whose class is set to `house` and `highlighted`.

We will see this in action later now, when we'll let the player click houses.

## Clicking houses
We also want to make houses clickable. When the player clicks on an house, that house should change color and become highlighted. When the player clicks on the same house again, the highlight should go away and the house should get its original color.

To achieve this, let's locate the constructor code in `house.js`, and add a call to function `_attachEventListeners`:

```javascript
jm.House = function(_i, _j) {
    var HOUSE_CLASSNAME = "house";
    var HOUSE_HIGHLIGHTED_CLASSNAME = "highlighted";

    // Lazy initialized objects
    var _horse = null;

    // Construct object
    var i = _validatePosition(_i);
    var j = _validatePosition(_j);
    var _element = _createElement();
    _attachEventListeners();

    /// More code of the module...
};
```

When an house is created, the position will be assigned, the element created and then `_attachEventListeners` will do something. Let's write its code just before `_highlight`:

```javascript
function _attachEventListeners() {
    _element.addEventListener("click", _onClickHandler);
}
```
