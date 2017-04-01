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
