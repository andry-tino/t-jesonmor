# Moving an horse

We can resume our work in `board.js` as we need to write down the code for `_onClickHandler` as it was showed in the previous diagrams. However we will need a few things first. One of the functionalities we need to have in place is the code for moving an horse from one house to the other.

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
The function is still empty, so let's start writing the logic. The first thing we wanna do is checking that we have houses:

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

### Checking conditions for moving
The real code basically starts now. We need to check that the move from `srci:srcj` to `dsti:dstj` is legal:

```javascript
// Check that the move is valid, a horse moves like a chess knight
if (!_checkMove(srci, srcj, dsti, dstj)) {
    throw "Invalid move. A Horse moves like a Chess Knight!";
}
```

We are going to create function `_checkMove` for this purpose which takes the coordinates of the old position and the new position and returns `true` if the move is legal, `false` otherwise. We will develop this function later, for now let's just assume that it works as expected and let's move on with the code for `_move`.

The next step is doing the following:

1. We need to get a reference to the source house object in `houses`.
2. We need to get a reference to the destination house object in `houses`.
3. We must check that we can actually find these 2 houses.
4. We need to make sure that the source house has an horse inside it.

In code, it means this:

```javascript
// Check that the source house is occupied by a horse and destination is free
var srcHouse = _getHouse(srci, srcj);
var dstHouse = _getHouse(dsti, dstj);
if (!srcHouse || !dstHouse) {
    throw "Cannot move. Could not find houses!";
}
if (!srcHouse.isSet()) {
    throw "Cannot move. Source house is not occupied by a horse!";
}
```

Remember that at this stage we don't wanna check the color of the source house. This is something that another function must do because `_move` only takes care of moving one horse, no matter its color.

Moving on, we still need to know if this move results into a simple move or an eat. Think about it, what if the destination house contains another horse? Then we need to check whether that horse has the opposite color of the current player's. White can only eat Black horses, Black can only eat White horses, but White cannot eat White and so does Black. Write down these lines below from the code we wrote a few seconds ago:

```javascript
// If destination is occupied by other player's horse, eat it!
var eat = false;
if (dstHouse.isSet()) {
    if (_evaluateAntagony(dstHouse)) {
        eat = true;
    } else {
        throw "Cannot move. Destination house is occupied by a horse!";
    }
}
```

We define variable `eat` to tell us whether this move results into an eat or not. Later on we immediately check whether we are actually eating or not. How do we check? We use a function which we will write later: `_evaluateAntagony`. This function will have the following behavior:

| Current Player  | Destination house's horse | Outcome |
|:---------------:|:-------------------------:|:-------:|
| White           | Black                     | `true`  |
| Black           | White                     | `true`  |
| White           | White                     | `false` |
| Black           | Black                     | `false` |

Function `_evaluateAntagony` is the key to understand whether the eating is legal or not. If we attempt to eat our own horse, we throw an error.

### Doing the move
At this point we have checked everything! We are good to go and we can perform the move. What does it mean? It means doing the following:

1. Remove the horse from the source house and save it.
2. If there is an horse in the destination house, remove it (eat scenario).
3. Place the saved horse from point 1 into the destination house.

The first part is the following:

```javascript
// Unplace horse from source house
var movingHorse = srcHouse.unset();
if (!movingHorse) {
    throw "Cannot move. Attempt to get source horse failed!";
}
movingHorse.setPosition(dsti, dstj);
```

We store a reference to the horse in the source house when calling `unset` which removes the horse from the house and returns it. Then we just set the new position for this horse. Then we can write the following code:

```javascript
// Handling destination house
if (eat) {
    dstHouse.unset();
}
dstHouse.set(movingHorse);
```

Which takes care of removing the horse in the destination house if we are actually eating an horse while moving. After that we can set the horse which was in the source house in the destination house. The last line of code is just for emitting some logging information (always useful when debugging in case we need it):

```javascript
console.log("Moved horse from:", srci, srcj, "to:", dsti, dstj, eat ? "and ate!" : "");
```

And we are done! However we still have 2 functions to write: `_evaluateAntagony` and `_checkMove`. So let's pay this debt.

## Evaluating the antagony
Let's focus on `_evaluateAntagony` first. Let's write this function right before `_populate`:

```javascript
function _evaluateAntagony(house) {
    // Code will go here...
}
```

The behavior of this function is simple: we need to return `true` when the color of the player and the color of the horse in the house in argument `house` are different. Otherwise we return `false`. 

- How do we get the color of the current player? We get it from module variable `currentPlayer`.
- How do we get the color of the horse in the house passed in argument `house`? We can use `getHorseColor` exposed by the `House` module.

So we can write down the following in the body of the function:

```javascript
var houseColor = house.getHorseColor();
var wbcond = houseColor === jm.HORSE_W && currentPlayer === CUR_PLAYER_B;
var bwcond = houseColor === jm.HORSE_B && currentPlayer === CUR_PLAYER_W;
```

As you can see we first get the color of the house passed as argument to `_evaluateAntagony`. Then we check the 2 possible cases:

- Case 1: White player is trying to eat a Black horse.
- Case 2: Black player is trying to eat a White horse.

If either one of them is `true`, then we can return `true`, which means:

```javascript
return wbcond || bwcond;
```

## Checking validity of a move
We must not forget to write the code for `_checkMove` either. This function will return:

- `true` if the move is valid.
- `false` if the move is not valid.

So, what is it that we need to check? We need to make sure that the horse is moving like a Chess Knight. The typical move of a Chess Knight is L-shaped. First of all, let's write down this function right before `_setHorse`:

```javascript
function _checkMove(oi, oj, ni, nj) {
    // Code will end up here...
}
```

This function will accept 4 parameters: `oi` and `oj` represent the old position of the horse, while `ni` and `nj` represent the new position.

So let's consider one horse in a generic position `i:j` on a generic board. What are the all possible moves that one horse can do from that house relatively to its current house? The picture below shows all these possibilities are 8 and are visible in the image below:

![](/assets/board_moves.png)

So we need to check that `oi:oj` and `ni:nj` are inside one of those possibilities. So, referring to the image, we basically have that:

```
oi:oj = i:j
ni:nj = <coordinates in one of the 8 positions showed in the image>
```

After this basic assessment, it is easy to understand the following code that we can write in the function:

```javascript
function _checkMove(oi, oj, ni, nj) {
    if (ni === oi - 2 && nj === oj + 1) return true;
    if (ni === oi - 1 && nj === oj + 2) return true;
    if (ni === oi + 1 && nj === oj + 2) return true;
    if (ni === oi + 2 && nj === oj + 1) return true;
    if (ni === oi + 2 && nj === oj - 1) return true;
    if (ni === oi + 1 && nj === oj - 2) return true;
    if (ni === oi - 1 && nj === oj - 2) return true;
    if (ni === oi - 2 && nj === oj - 1) return true;

    return false;
}
```

The first condition: `ni === oi - 2 && nj === oj + 1)` is checking 
