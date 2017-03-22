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

### Placing horses into houses
We have used function `_setHorse`, but that does not yet exist. So let's create it before function `_build` in the module: 

```javascript
function _setHorse(i, j, horse) {
    // Code for placing the horse into an house will go here
}
```

Todo

```javascript
function _setHorse(i, j, horse) {
    var house = _getHouse(i, j);
    if (!house) {
        throw "Cannot set horse in house. Cannot find house!";
    }

    house.set(horse);

    console.log("Horse set in", i, j);
}
```
