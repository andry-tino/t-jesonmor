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

| Position | Name          | Description                                                                                       |
|----------|---------------|---------------------------------------------------------------------------------------------------|
| 1        | Event name    | What event we want to listen to when it will be triggered by the element.                         |
| 2        | Event handler | The function to call when the event is triggered.                                                 |
| 3        | Capture       | We need to explain this later as it is a bit complicated, for now let's just forget about this :) |

s
