# Moving an horse

We need to write down the code for `_onClickHandler` as it was showed in the previous diagrams. However we will need a few things first. One of the functionalities we need to have in place is the code for moving an horse from one house to the other.

## Common grounding
Let's enstablish some naming and a terminology we are going to use. Everytime we have a move, we recognize the following things:

- **Source house:** It is the house the horse is moving from. Or, conversely, it is the horse's initial house.
- **Destination house:** It is the house where the horse wants to move.

With this in mind, we need to create a function that makes the movement of an horse from one house to another. Please be aware that this function will not take into consideration the color of the horse or whether the horse can move to the final house, all of this will be taken care of by `_onClickHandler`. The function we are going to write just makes the move and that's it!

So let's locate function `_populate` in the module and let's write another function right below it:

```javascript
function _move(srci, srcj, dsti, dstj) {
    // Code will end up here...
}
```

Our function will accept the coordinates of the source and destination houses.

## Implementing `_move`
The first thing we wanna do is checking that we have houses:

```javascript
if (!houses) {
    throw "Cannot move. Board has not been populated!";
}
```

So we are basically saying that the board must have been initialized before calling `_move`. This check is quite important. The next step is then checking that input parameters have been correctly provided:

```javascript
if (!dsti || !dstj || !srci || !srcj) {
    throw "Invalid positions!";
}
if (dsti <= 0 || dstj <= 0 || srci <= 0 || srcj <= 0) {
    throw "Position must be a couple of positive integers!";
}
```

The first conditional block just checks that we have values for the 4 parameters. The second block checks that correct values have been provided. We do not support negative coordinates!

The real code basically starts now. We need to check that the move from `srci:srcj` to `dsti:dstj` is legal:

```javascript
// Check that the move is valid, a horse moves like a chess knight
if (!_checkMove(dsti, dstj, srci, srcj)) {
    throw "Invalid move. A Horse moves like a Chess Knight!";
}
```

We are going to create function `_checkMove` for this purpose.

## Checking validity of a move
We still need to write the code for `_checkMove`. This function will return:

- `true` if the move is valid.
- `false` if the move is not valid.

So, what is it that we need to check? We need to make sure that the horse is moving like a Chess Knight. The typical move of a Chess Knight is L-shaped.
