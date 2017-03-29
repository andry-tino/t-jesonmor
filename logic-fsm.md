# Developing the state machine

In chapter [Making the board interactive](./logic-events.md#defining-the-state-machine) we saw that the board basically behaves accordingly to a certain state machine. That state machine and the algorithm that described in that same chapter is what we are going to implement now. Let's go back to `board.js` and start writing `_onClickHandler`. When we left the development on that function, we were experimenting with events. Let's remove the `console.log` that we wrote and let's start from here:

```javascript
function _onClickHandler(e) {
    // The code will end up here...
}
```

## 