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
Everytime the user clicks on 

```
|             ^[event]
|             |
v[event]      |
<body>        
    |              ^[event]
    |              |
    v[event]       |
    <div class="container">
        |               ^[event]
        |               |
        v[event]        | 
        <div class="house">
```
