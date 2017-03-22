# Adding the horses

The next step is filling the houses with horses. Each player gets 9 horses, so we need to place on the board a total of 18 horses, 9 white and 9 black. Let's move on and create the module for a horse.

## Defining the horse module
Well, even though we are going to have 2 types of horses: black and white, we are still talking about the same thing: an horse. So we are going to create one module for an horse and give it the possibility to specify whether we want a black horse or a white horse.

We have already created `horse.js` at the very beginning of our journey, so let's jump to that empty file and start writing down the first lines:

```javascript
var jm = jm || {};

jm.Horse = function(__mode) {
    // The code for the horse module goes here
};
```

Not surprisingly, the code is the same as for the the other modules we have created so far. Please note that we have added a parameter to our constructing function: `__mode`. When we are going to use the module to create one horse, we will pass a value indicating whether we want a black one or a white one. The reason for the double underscore, is because we are going to use other variables called `mode` later, so we avoid a clash of names.

### Constants for the mode
So let's enstablish that `0` means a white horse, while `1` means a black horse. Now, if we just use numbers, we make things a bit difficult. What if we change our mind in future and decide to use different values? And how to remember that `0` means white and `1` black in one month from now? Well, we need to use constants as we did before. However there is a problem here. We cannot define these constants in the module as they need to be visible outside of the module. The solution would be exposing them, but then we would need a constructued object, and we need to use the constants before building one. 

We need to place these constants outside of the module in a place where they will always be available. Remember that we have created `jm` to be a globally available object, so we can just add these constants to that object. This is how we do it:

1. Go to the project folder. It is the folder that contains `index.html` and the other files we created at the beginning of the tutorial.
2. Create a new file there and call it: `consts.js`.
3. Open that file.

Since we need to reference the global object `jm`, we want to make sure one exists first, so same as before we write this first line:

```javascript
var jm = jm || {};
```

Now we can define the constants by adding these 2 lines:

```javascript
jm.HORSE_W = 0;
jm.HORSE_B = 1;
```

Those are the 2 constants we will use to define the type of horse. Let's now include this file in `index.html`:

1. Open `index.html`.
2. In the `<head>` section, locate the first `<script src="..." type="text/javascript"></script>` line.
3. Add one line before that and type: `<script src="consts.js" type="text/javascript"></script>`.

So your `index.html` now looks like:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Play Jeson Mor</title>

    <!-- Stylesheets -->
    <link rel="stylesheet" type="text/css" href="style.css">

    <!-- Javascript files -->
    <script src="consts.js" type="text/javascript"></script>
    <script src="horse.js" type="text/javascript"></script>
    <script src="house.js" type="text/javascript"></script>
    <script src="board.js" type="text/javascript"></script>
    <script src="jesonmor.js" type="text/javascript"></script>
</head>

<body>
    <script type="text/javascript">
    window.addEventListener("load", function() {
        jm.initialize();
    });
    </script>
</body>
</html>
```

### Defining the constructor
Let'
