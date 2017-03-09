# Creating the board

Our first focus will be creating the Chess board on the page. So let's open `board.js` and start writing code.

## Good programming
We will try to write some good Javascript code. What do I mean? Javascript, like any other programming language, can be abused. One of the many ways to abuse a programming language is by writing bad code. 

Bad code can happen at many different levels: bad styling, bad indentation, not enough comments and so on. We will try to write good code, code that can be easily modified in future, that can be understood by others and that is simple. One of the core principles of good coding is _modularity_.

Modularity is the ability of encapsulating the code for one component into a single module. Now Javascript does not really define the concept of _module_, but we can create one.

### Modules and namespaces
The first line of code we write is the following:

```
var jm = jm || {};
```

That line of code has the following meaning:

> Create a variable called `jm`. If `jm` exists already, then just leave it as it is, otherwise (if it does not exist already), create it as an empty object `{}`.

In Javascript `{}` corresponds to an empty object. 

#### Namespaces
We want to group all the objects we create inside the same one entity called `jm`. A namespace is a way to group components in a programming language. We are going to create an object for the board, one for houses and one for horses and they will all be inside `jm`.

There is a catch: Javascript does not explicitely support namespace like other programming languages. However it is still possible to use namespaces by using objects. `jm` will be an object and we will add the other components to this object in all of the files we have created.

In `index.html` we have added lines for including the different javascript files. Each one of them will have `var jm = jm || {};` as first line. Why? Because even though we have specified a certain order of files to be imported, nothing guarantees us that the browser will finish loading the second file after the first. The order is not guaranteed, so we must make sure that we initialize `jm` in each one of them, however if the object has already been initialized, we must not re-initialize it!

## Creating the Board object

So far we have just guaranteed the creation of the `jm` namespace. Now let's fill it with the first object. It is going to be the board.

So let's continue from where we left and add the following lines:

```
var jm = jm || {};

jm.Board = function(_size) {
    // Here we will write the code for the Board object
}
```

Objects are created as functions. `jm.Board` instructs Javascript to create a variable called `Board` inside the `jm` namespace. The variable is initialized to a function which accepts one parameter. 

It is important to understand this logical step. To create an object we must:

1. Create a function called _object constructor_ responsible for building that object.
2. Invoke that function in order to get an object of that type.

### Constructing the object
As you could see we need a parameter. We construct a board by providing a number which is the size of a board. Our intention is to make the board generic. JM is a game which is played on a 9x9 board, however there are variants of the game where players can play on a 15x15 board. So we just want not to miss the fun of playing very complex games, so we make the thing generic and let the user choose the size of the board. If the size is not specified though, then we fall back to the default size 9x9.

What should the constructor do? It is responsible for creating our board object. So lets start adding some logic to this function.

```
jm.Board = function(_size) {
    // Lazy initialized variables
    var container = null;
    var panelw = null;
    var panelb = null;
    var houses = null; // A dictionary indexed by "i:j"
    var horses = null; // An array
}
```

We are creating some variables that we will use later when building the board on the screen. 

- Variable `container` will host a reference to the HTML element containing the board.
- Variables `panelw` and `panelb` will host a reference to the elements where lost horses for white and black will be moved to when eaten on the board.
- Variable `houses` will host all the houses. This variable will actually be a _dictionary_,  we will later explain what it is.
- Variable `horses` will contain an _array_ hosting all horses. An array is basically a list of objects.

All of them are initially set to `null`, which is the Javascript way to say that a variable contains nothing.

We actually need more a few more variables:

```
jm.Board = function(_size) {
    var CUR_PLAYER_W = 0;
    var CUR_PLAYER_B = 1;

    // Lazy initialized variables
    var container = null;
    var panelw = null;
    var panelb = null;
    var houses = null; // A dictionary indexed by "i:j"
    var horses = null; // An array

    // Status variables
    var currentPlayer = CUR_PLAYER_W; // White starts
    var selectedHouse = null;
}
```

We want to keep track about which one of the player gets to move. For this we are going to need a variable `currentPlayer` whose value will be `0` or `1` depending whether White or Black has to move. However we programmers do not like using plain values as they might change, so we use contants. That is why we created two other variables called `CUR_PLAYER_W` and `CUR_PLAYER_B`.

As you can see, we set `currentPlayer` to `CUR_PLAYER_W` because White starts first in the game.
