# Developing the state machine

In chapter [Making the board interactive](./logic-events.md#defining-the-state-machine) we saw that the board basically behaves accordingly to a certain state machine. That state machine and the algorithm that described in that same chapter is what we are going to implement now. Let's go back to `board.js` and start writing `_onClickHandler`. When we left the development on that function, we were experimenting with events. Let's remove the `console.log` that we wrote and let's start from here:

```javascript
function _onClickHandler(e) {
    // The code will end up here...
}
```

## Defining the cancel procedure
The first thing we wanna do is defining an internal function (a function that only `_onClickHandler` can access to) which deals with cancelling the operation. As we saw in the algorithm diagram in chapter [Making the board interactive](./logic-events.md), we have many checkpoints, and if something goes wrong, instead of failing, we cancel the operation.

The way to define a function which is visible to only one other function is to have former defined insinde the latter, so let's do this:

```javascript
function _onClickHandler(e) {
    function cancel(phase) {
        // Code for the internal function here...
    }

    // Code for the click handler here...
}
```

Like this, `cancel` can only be called from inside `_onClickHandler`. We want to make sure that `cancel` can only be called by the click handler because this functionality is extremely specific to this context. Before digging into the details of the 2 functions, we need to explain the approach we are planning for canceling one operation.

### Understanding how to cancel an operation
Events are not easy to understand and can be complicated. However here we will try to describe them in a very easy way. The key concept is understanding that events travel across elements in the page.

If you recall, we have defined 2 event handlers for the `click` event:

- One in the `Board` module on the `container` element.
- One in the `House` module on every `house` element.

What happens when a user clicks on an house on the page? To understand this answer, we need to focus on the page subtree that starts from that element and walks all the parent elements up to the `<body>` element. In our case, we have the following subtree:

```html
<body>
    <div class="container">
        <div class="house"></div>
    </div>
</body>
```

When the user clicks on that house `<div class="house"></div>`, this is what happens:

1. A `click` event is generated by the browser and is sent to the `<body>` element.
2. Right after, the event is sent to the `<div class="container">` element.
3. In the end, the event reaches the `<div class="house">` element.

Everytime the event reaches one element, if there are listeners registered on that element for the `click` event, those will be executed. Since both `<div class="container">` and `<div class="house">` define one event handler for the `click` event, first the event handler for the container is executed and then the one for the house. This dynamics is called _event propagation_.

#### Changing the event flow
However, if anyone of the event handlers calls `stopPropagation`, then the event will stop and not proceed any further down.

The same event traverses the subtree until it reaches `<div class="house"></div>`. This last element is called _target element_ because is the element which was actually clicked by the user and that is the element where the event chain will stop.

Every intermediate element that the event traverses before reaching the target is called a _non-target element_.

An event handler on an element for a certain event is registered in this way:

```javascript
element.addEventListener("click", clickEventHandler);

function clickEventHandler(e) {
    // The handler code
}
```

The event handler is `clickEventHandler` (we have coded something similar so far) and you see it always accepts an argument called `e`. That argument is called `event arguments` because it will contain information about the event as it traverses the subtree. We are interested in 2 particular properties of this object:

- Property `e.target` contains a reference to the target element of the event.
- Property `e.currentTarget` contains a reference to the intermediate element that the event is currently traversing. When the event reaches the target, `e.currentTarget` and `e.target` will have the same value.

Object `e` is very important because it gives us a chance to understand where the event is currently at in the subtree. However remember that if some event handler calls `e.stopPropagation()`, then the event will not proceed any further. So, to understand this dynamics, let's make a simulation with this example by considering 2 cases.

##### Non stopping the propagation
When no handler stops the propagation of the event, we have the following scenario:

| # | Element                   | Handler? | `e.target`            | `e.currentTarget`         |
|:-:|:--------------------------|:--------:|:---------------------:|:-------------------------:|
| 1 | `<body>`                  | No       | `<div class="house">` | `<body>`                  |
| 2 | `<div class="container">` | Yes      | `<div class="house">` | `<div class="container">` |
| 3 | `<div class="house">`     | Yes      | `<div class="house">` | `<div class="house">`     |

Note that `body` cannot stop the propagation because there is no handler defined there.

##### Stopping the propagation
When `<div class="container">` stops the propagation of the event, we have the following scenario:

| # | Element                   | Handler? | `e.target`            | `e.currentTarget`         |
|:-:|:--------------------------|:--------:|:---------------------:|:-------------------------:|
| 1 | `<body>`                  | No       | `<div class="house">` | `<body>`                  |
| 2 | `<div class="container">` | Yes      | `<div class="house">` | `<div class="container">` |

Since `<div class="container">` stops the propagation, the event will not reach `<div class="house">`!

#### Event propagation and cancel strategy
Remember that we have set 2 different handlers for `click`: one on container and one on each house. When one player clicks on one house, the event will:

1. Start from `<body>`.
2. Propagate to `<div class="container">`, which will cause the event handler registered there to be executed.
3. Propagate to `<div class="house">`, which will trigger the other handler defined there.

Since `_onClickHandler` in the board does not call `e.stopPropagation()`, the event will reach the target (the house). The handler on the house will flip its `background-color` so that the house looks highlighted. Our cancel approach is very simple and consists in the following:

> When the player clicks on an house, the handler in the container will try to run the game interaction to move pieces. Typically this will result in that house to be highlighted. However, if something goes wrong, the operation will be canceled and the event stopped via `e.stopPropagation()` so that the house does not receive highlight.

It basically means the following:

```javascript
function _onClickHandler(e) {
    function cancel(phase) {
        e.stopPropagation();
        if (selectedHouse) {
            _clearSelectedHouse();
        }

        console.log("Interaction canceled at", phase);
    }

    // More code will go here...
}
```

You can see that, in `cancel`, we stop the propagation so that the house does not receive highlight, and we also clear the currently selected house. For example, if the player selectes one horse because he wants to move it, then that house will be highlighted; but if later the player selected another house which makes the horse move in an invalid way, then we need to remove the highlight from the initial house and the player will have to repeat the move. In our design, everytime the user enters the _Wait move complete_ state because he wants to move an horse, we save the initial house in `selectedHouse`. The purpose of `_clearSelectedHouse` is removing the highlight from the selected house and then resetting the value of `selectedHouse` (which means that we go back to state `Wait move`).

We can write down the code for `_clearSelectedHouse` right before `_onClickHandler`:

```javascript
function _clearSelectedHouse() {
    selectedHouse.clear();
    selectedHouse = null;
}
```

Back to `cancel`, please note that we use parameter `phase` to pass a string. We will use it for logging, so that if an error occurs, we know at which stage we have canceled the operation.

## Retrieving the clicked house
When the user clicks on one house we can be in 2 possible states:

- We can be in state `Wait move`, so it means that the player wants to start moving a piece by selecting the source house.
- We can be in state `Wait move complete`, so it means that the player is selecting the destination house.

In the first part of `_onClickHandler` we need to figure out which one of the 2 states we are in. The way to do that is checking `selectedHouse`. When the player selected the source house, we will always store it into that variable. So we can check if the variable has an house or not to understand which state we are into. However before doing that we will carry on some operations that are common to handling both states. These operations concern getting the house that the player has selected. So, back to `_onClickHandler`, let's add the following lines at the end of the function's body:

```javascript
var target = e.target;
if (!target) { cancel("House Acquire"); return; }
```

The evenr arguments `e` has property `e.target` which contains the target element. We will get a reference to the house from there. Of course we need to check that a target is present, otherwise we cancel the operation. The next code we need is the following:

```javascript
var id = target.id;
if (!id) {
    // Player might have selected a horse
    var parent = target.parentElement;
    if (!parent) { cancel("House Acquire"); return; }

    id = parent.id;
}
```

Remember that every house has an `id` set with the coordinates of that house. We made sure that we have this behavior when we developed function `_build` in chapter [Continuing on the board creation](./board-cont.md#finishing-up-the-board-building-function). However what if the mouse cursor hits the horse inside one house? In that case `e.target` will point to the horse element, not the house! In that case we would have no `id` defined, so we can check the parent (horses are contained by houses). After making this additional check, we should have the id, we can move on:

```javascript
// Could not find the house
if (!id) { cancel("House Acquire"); return; }
```

The code we just wrote is pretty straightforward: we still need to check that we have a valid id, otherwise we cancel. Now we are ready to retrieve the house basing on the id:

```javascript
var house = houses[id];
if (!house) {
    throw "Click handler failed. Cannot find house at " + id;
}
```

If an house cannot be found, we cannot cancel because we must find an house. If we don't find it then we need to fail! The next code branches in order to consider the 2 cases we mentioned before.

```javascript
if (!selectedHouse) {
    // Here is the code for when we are in state "Wait move"...
}

// From here, the code for when we are in state "Wait move complete"...
```

The code inside the `if` block will be executed when we are in state _Wait move_. Otherwise the code after the conditional block will be executed (state `Wait move complete`).

## Implementing the _Selection_ flow
Let's focus on the code inside the last `if` we wrote. If we fall inside that path, then the player is selecting the source house for selecting which horse he wants to move. Recalling the algorithm diagram we drew in chapter [Making the board interactive](./logic-events.md#an-overview-of-the-moving-logic), we need to do implement the flow wihch follows the _Selection_ branch:

![](/assets/diagrams-activity-1.png)

We just need to transform into code what is described in the diagram. The first thing we need to do is checking that the player has selected an house with an horse inside:

```javascript
// Empty house, invalid selection
if (!house.isSet()) { cancel("Initial selection"); return; }
```

In fact, if the house is empty, we cannot allow the move. The player must move an horse! The call to `cancel` guarantees that the player will need to retry the nmove again.

The next step in the diagram is checking the color of the horse in the house selected by the user:

```javascript
if (_evaluateAntagony(house)) { cancel("Initial selection"); return; }
```

Function `_evaluateAntagony` will tell us whether we picked one of the opponent's horses. In fact we cannot move any horse belonging to the opponent and we need to check that. We have written function `_evaluateAntagony` already, so we are just good to go, howeevr remember how it works: it will get the color of the horse and evaluate one of the following possibilities:

- The player is White and he is trying to move a Black horse
- The player is Black and he is trying to move a White horse

If either of those 2 possibilties occurrs, then we return `true`. Back to the code in the handler, we can see that, in case the player attempts a move on an horse which is not his, we cancel the operation and force the player to try moving again.

After that we can just set variable `selectedHouse`:

```javascript
selectedHouse = house;
return;
```

And return as we have finished transitioning from state `Wait move` to `Wait move complete`. The code for the handler should look like this:

```javascript
function _onClickHandler(e) {
    function cancel(phase) {
        e.stopPropagation();
        if (selectedHouse) {
            _clearSelectedHouse();
        }

        console.log("Interaction canceled at", phase);
    }

    var target = e.target;
    if (!target) { cancel("House Acquire"); return; }

    var id = target.id;
    if (!id) {
        // Player might have selected a horse
        var parent = target.parentElement;
        if (!parent) { cancel("House Acquire"); return; }

        id = parent.id;
    }

    // Could not find the house
    if (!id) { cancel("House Acquire"); return; }

    // When constructing the board we assign positions as ids
    var house = houses[id];
    if (!house) {
        throw "Click handler failed. Cannot find house at " + id;
    }

    if (!selectedHouse) {
        // Empty house, invalid selection
        if (!house.isSet()) { cancel("Initial selection"); return; }

        var houseColor = house.getHorseColor();
        if (_evaluateAntagony(house)) { cancel("Initial selection"); return; }

        // Player has selected one of his horses
        selectedHouse = house;
        return;
    }

    // From here, the code for when we are in state "Wait move complete"...
}
```

We can now focus on the other case.

## Implementing the _Make move_ flow
The code after the conditional is hit only when the player is selecting the destination house as he is attempting to complete a move for an horse he selected before. The code we need to write must follow this part of the diagram we defined in chapter [Making the board interactive](./logic-events.md#an-overview-of-the-moving-logic):

![](/assets/diagrams-activity-2.png)

The first thing we need to do is checking that the player has selected a destination house that contains one of his horses:

```javascript
if (house.isSet() && !_evaluateAntagony(house)) { cancel("Move"); return; }
```

In this case we need to cancel because the player can only move an horse into:

- An empty house.
- An house where an opponent's horse resides. In this case the move results in eating.

The next step is getting the positions of the source and destination houses:

```javascript
var selectedHousePosition = selectedHouse.getPosition();
var attemptedHousePosition = house.getPosition();
```

So we can check whether the move is valid or not:

```javascript
if (!
    _checkMove(
        selectedHousePosition.i, selectedHousePosition.j, 
        attemptedHousePosition.i, attemptedHousePosition.j
        )
    ) { cancel("Move"); return; }
```

Remember that `_checkMove` will return `true` if the move is legal and `false` when it is not. If the player is trying to move an horse with an irregular move, then we cancel the operation and we force the player to start over.

### Evaluating endgame
At this point we want to know whether the move results into the game to be over or not. We consider the game to be over when one of the player has successfully reached the central house and left it. In order to be able to assess such a condition, let's move back at the beginning of the function, and right below `cancel`, let's create another internal function:

```javascript
function evaluateEndGame(srci, srcj) {
    var c = Math.ceil(size / 2);
    return srci === c && srcj === c;
}
```

Function `evaluateEndGame` will return `true` if the move with source house `srci:srcj` is a winning move. In order to detect vistory, we just need to make sure that the player is moving one of his horses from the central house to somewhere else and that move must be legal. This function only checks the condition for which we start the movement from the central house, the other conditions will be evaluated elsewhere.

Let's go back at the end of function `_onClickHandler` and let's type the following line:

```javascript
var endgame = evaluateEndGame(selectedHousePosition.i, selectedHousePosition.j);
```

Variable `selectedHousePosition` stores the source house whose coordinates are passed to `evaluateEndGame`. Variable `endgame` will be used later. Now at least we know whether this is the final move or not!

### Making the move
The next step in the diagram is implementing _Move or eat_. In fact we are ready now. If the move is legal and the player has selected an empty house or an house with one of the opponent's horses in it, then we can move the horse there:

```javascript
_move(
    selectedHousePosition.i, selectedHousePosition.j, 
    attemptedHousePosition.i, attemptedHousePosition.j
    );
```

As you can see, we call `move` to perform the moving of the horse. Remember that this might result into an eating if the destination house was occupied by one of the opponent's horses.

### Finalizing the operation
What's left is now cleaning up. At this stage we still have `selectedHouse` highlighted. We need to remove the highlight from there:

```javascript
_clearSelectedHouse();
```

Then remember that after this event handler, the event will propagate to the destination house, causing it to receive highlight. We don't want the destination house to be highlighted at the end of the operation, so we need to stop the propagation:

```javascript
e.stopPropagation();
```

We are basically almost over. Let's make sure that we move control to the opponent:

```javascript
_nextPlayer();
```

This function will make sure to pass the turn. We still need to define it and we can do that right below `_evaluateAntagony`:

```javascript
function _nextPlayer() {
    if (currentPlayer === CUR_PLAYER_W) {
        currentPlayer = CUR_PLAYER_B;
    } else {
        currentPlayer = CUR_PLAYER_W;
    }
}
```

As you can see, it is no rocket science. We just make sure to flip the value of `currentPlayer` so that if White was playing, now control passes to Black, otherwise we do the opposite.

Back to the last line of `_onClickHandler`, we can just check whether we have endgame, and, in case, we do something special instead of just letting the opponent play:

```javascript
if (endgame) _endgame();
```

Function `_endgame` can be defined right after `_onClickHandler`:

```javascript
function _endgame() {
    _reset();
}
```

And it will be responsible for resetting the game by calling `_reset`. 

#### Resetting the game
Function `_reset` is supposed to take the game back to its initial state, let's first define it before `_checkMove`:

```javascript
function _reset() {
    // Code goes here...
}
```

How to clear all the pieces, put all horses back to their initial positions and give control back to White? Well we will implement this logic in the proper way later, for now we go for a very very easy approach: we refresh the page! In Javascript it is pretty easy, only one line:

```javascript
window.location.reload();
```

The gobally available `window` object exposes one object called `location` whose module exposes function `reload`. When called, it is going to do the same thing we do when we refresh the page: it reloads the page, so it will destroy everything on the page and execute `jm.initialize` again!

**Important note on reloading:** Just to be clear: this is not the good approach to resetting the game. Why? Because we don't like to force the user to reload the page! So later we will remove that line and implement a better logic.

### Done!

The complete code for `_onClickHandler` should look like this:

```javascript
function _onClickHandler(e) {
    function cancel(phase) {
        e.stopPropagation();
        if (selectedHouse) {
            _clearSelectedHouse();
        }

        console.log("Interaction canceled at", phase);
    }

    function evaluateEndGame(srci, srcj) {
        var c = Math.ceil(size / 2);
        return srci === c && srcj === c;
    }

    var target = e.target;
    if (!target) { cancel("House Acquire"); return; }

    var id = target.id;
    if (!id) {
        // Player might have selected a horse
        var parent = target.parentElement;
        if (!parent) { cancel("House Acquire"); return; }

        id = parent.id;
    }

    // Could not find the house
    if (!id) { cancel("House Acquire"); return; }

    // When constructing the board we assign positions as ids
    var house = houses[id];
    if (!house) {
        throw "Click handler failed. Cannot find house at " + id;
    }

    // Nothing was started, one player is selecting an house, 
    // let's check it is a house with a player's horse on
    if (!selectedHouse) {
        // Empty house, invalid selection
        if (!house.isSet()) { cancel("Initial selection"); return; }

        // Player has selected an adversary's horse => invalid
        if (_evaluateAntagony(house)) { cancel("Initial selection"); return; }

        // Player has selected one of his horses
        selectedHouse = house;
        return;
    }

    // An house is already selected, a move is being attempted
    // Cannot move to an house which is occupied
    if (house.isSet() && !_evaluateAntagony(house)) { cancel("Move"); return; }

    var selectedHousePosition = selectedHouse.getPosition();
    var attemptedHousePosition = house.getPosition();
    if (!_checkMove(
        selectedHousePosition.i, selectedHousePosition.j,
        attemptedHousePosition.i, attemptedHousePosition.j
        )) { cancel("Move"); return; }
    
    // Evaluate endgame
    var endgame = evaluateEndGame(selectedHousePosition.i, selectedHousePosition.j);

    // Can move
    _move(
        selectedHousePosition.i, selectedHousePosition.j, 
        attemptedHousePosition.i, attemptedHousePosition.j);

    _clearSelectedHouse(); // Remove highlight from source house
    e.stopPropagation(); // Make sure destination house does not receive highlight later

    _nextPlayer();

    if (endgame) _endgame();
}
```

## Third step completed
This was the most complex function in the game. Congratulations, you have completed the 3rd step. Now the game is fully working. The code is available [here](https://github.com/andry-tino/t-jesonmor/tree/development/tutorial-src/step-3).
