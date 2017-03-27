# Making the board interactive

The first thing we need to do is making the board react to user input. So we just laid down the plan in the previous chapter, let's follow it. We need to instrument the `Board` module so that it can be responsive when the user does something.

## Reacting to mouse click
In the specific case, we want the board to react when the user clicks one the houses. This is a step further in the programming techniques in HTML and Javascript because we need to make use of something called _eventing_.

Every element inside an `HTML` page has the ability to trigger an event. An event is a notification triggered by the browser when something happens on an element. There are literally dozens of different events that can be triggered by elements for example:

| Event name  | Description                                               |
|-------------|-----------------------------------------------------------|
| `click`     | Triggered when the element is clicked with the mouse      |
| `focus`     | Triggered when the element receive focus                  |
| `mouseover` | Triggered when the user hovers the element with the mouse |

These are just examples. The interesting part is not just that an element can trigger an event, but rather that, via Javascript, it is possible to do something when an event is triggered. Say that you want a message to be displayed when the user clicks on the `<div class="container">` element; when this happens that element will trigger a `click` event, that we can _listen to_.

Yes! Elements trigger events and programmers like us can listen to this events and create functions to be executed everytime an event is triggered. How do we do this? Let's do it together.

Locate, in `board.js`, function `_initialize`, and modify that to include a call to a function we are going to write later:

```javascript
function _initialize() {
    _build();
    _populate();
    _attachNativeEvents();
}
```

We have just added a call to `_attachNativeEvents`, a module function we will write just after `_initialize`:

```javascript
function _attachNativeEvents() {
    if (!container) {
        throw "Cannot attach events. Board must first be initialized!";
    }

    container.addEventListener("click", _onClickHandler, true);
}
```

We know what the first lines do: we check that we have a container. Basically we check that we have called `_build`, because we are going to need the container element for the last line in the function. Every HTML element exposes a function called `addEventListener` which accepts 3 parameters:

| # | Name          | Description                                                                                       |
|---|---------------|---------------------------------------------------------------------------------------------------|
| 1 | Event name    | What event we want to listen to when it will be triggered by the element.                         |
| 2 | Event handler | The function to call when the event is triggered.                                                 |
| 3 | Capture       | We need to explain this later as it is a bit complicated, for now let's just forget about this :) |

So, when we make this call:

```javascript
container.addEventListener("click", _onClickHandler, true);
```

We are doing the following:

> We are asking the browser to register a new _event handler_ called `_onClickHandler` and that this function must be called everytime the `click` event reaches element `container`.

Of course, we still need to define `_onClickHandler`, so let's write it down after `_attachNativeEvents`:

```javascript
function _onClickHandler(e) {
    // Code for the event handler will go here...
}
```

Please note that event handler always accept a parameter. You can call this parameter the way you want, and it represents the _event arguments_. When the browser calls the handler because the event it is listening to has been triggered, then the event arguments variable will be filled with more information about the event. We will use `e` later.

The logic for `_onClickHandler` will be crucial, as it will drive the whole game. But for now let's just make a tryout of events and check that this handler is actually called when we click on the board. So, in the function, let's add this line:

```javascript
function _onClickHandler(e) {
    console.log("Somebody clicked the container element!");
}
```

Let's run the page and let's bring up the F12 tools. As soon as you click on the board, you will see a message being printed in the _Console_ tab of the F12 tools window. So this proves that events are real and they work! Let's remove that line of code we just wrote, it was just for testing!

## Defining the state machine
The logic we are going to write for `_onClickHandler` is very important because it will affect the whole game interaction and flow. So it is better to first design the behavior of the board before writing code. What does it mean? It means to make a plan and lay out some diagrams! The first important diagram we want to consider is a _state diagram_ which helps us understand the state of the board when the game is on:

![](/assets/diagrams-state.png)

The diagram basically shows that our board has 3 states:

1. When we start the game we enter state _Wait move_. Here we basically wait for one player to start a move.
2. When the player selects an house, we check that house has an horse and that horse is one of the player's horse (White cannot move one of Black's pieces for example); if we pass the the test then we enter a new state: _Wait move complete_.
3. At this stage we are basically waiting the player to complete one move. He needs to select another house where to move the horse he has selected. So when he clicks again another house and that house either is empty or contains one of the opponent's horses (White cannot eat one of its horses), we enter state _Move complete_ where we complete the move and we change the current player.

The game will go on like this forever, until, after state _Move complete_, we detect that the move resulted in the game to be over. Also, note that the first 2 states are persistent; we remain in those states until the player does something. The last state is transient, it will be immediately abandoned after `currentPlayer` is changed and `selectedHouse` is cleared.

## An overview of the moving logic
The state machine gives us a good perspective of what the game flow will be. Now we want to have a look at how the algorithm for function `_onClickHandler` will work. Instead of writing down the code immediately, we can lay out a diagram of the operations we need to do, so that coding will be easier and faster.

![](/assets/diagrams-activity.png)

The diagram basically tells us what we need to write, let's analyze it.

1. We start, as you can see, when the user clicks something on the board, this goes without saying because we have registered `_onClickHandler` as a click event handler, so it will be called everytime the player clicks something on the board.
2. We need to check that the user has actually clicked an house and not something else. If not we cancel the operation. _Cancel_ does not mean failing, it means that we simply do nothing. We must have the user repeat the operation.
3. If an house has been clicked, we need to fetch it from the dictionary of houses.
4. Moving on, we need to choose. Which state are we in? If we are in _Wait move_, then we follow the path for _Selection_, if we are in state _Wait move complete_ then we go for the _Make move_ path.

As you can see the state plays an important role because the second part of the diagram shows a branch with 2 possible choices. Let's consider the first branch: _Selection_:

5. The user is basically selecting the house where he has an horse he wants to move. We need to check that the house actually has an horse, if the house contians no horse, we cancel the operation.
6. If an horse is present, we need to check that horse is one of the player's horses. White cannot move one of Black's horses and vice versa.
7. If everything is fine, we change the color of the house to make it clear that the board is ready to change the position of the horse from that house to somewhere else.

This is the first stage when moving an horse. When the user clicks again on one house, he will end up in point 4 of our sequence, but this time he will follow the other path: _Make move_:

8. The user now clicks on the house where he wants his horse to be moved to from the house he selected before. We need to check that this house either is empty or has an horse in it.
9. If the house is empty, just fine. If the house has an horse, it must be one of the opponent's. White cannot eat one of its horses, and so does Black. If we detect that everything is ok, we can move on.
10. We need to check that the move from the original house to the new house is a regular move. Remember that an horse moves like a Chess Knight. If the user selects an house which is causing the horse to make an invalid move, we must cancel the operation.
11. If the move is ok, we make the move. So we remove the horse from the initial house and we put it in the new house.
12. Then we restore the color of the original house. Remember that in point 7 we have changed the color of that house.
13. Once the move is done, we need to check if this move resulted in game over. If it does, we restart the game, otherwise we just complete the move and we change the current player.

So we have some work to do here!
