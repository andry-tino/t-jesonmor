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

We define a counter variable `k` which will range from `0` to `size - 1`. Arrays usually, by convention, start from position 0.

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
        var bi = 9;
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
