# Developing the board

We can now start writing code. The first thing we need to do is defining the main structure of our project. 

## Structuring the project
Everything will reside inside one folder. It does not really matter what you call this folder like or where you save it. In this tutorial I will call it `jeson-mor` and place t in my `Documents` folder. If I were developing it on my Mac I would place this directory in my `home` folder.

### More files
We are going to need the following files:

- One HTML file which represents our web page which we will open with our browser. The game will actually be run inside this page and all the code we write will be executed there.
- Weneed one file for styling the graphical elements on the page.
- We need one script file for starting the game.
- We need one file for each component in the architecture.
- We need one folder for images.

So we will end up with this structure here:

```
jeson-mor
├───images
│   └───...
├───index.html
├───style.css
├───jesonmor.js
├───board.js
├───house.js
├───horse.js
```

Some files have names that reflect the component they represent, some other files have standard names, let's discover them together.

- `index.html` is our initial page. By convention, every web application (web games are included) must have the start page be called `index`.
- `style.css` is our stylesheet. The name follows a non-standard convention (something almost all programmers agree on, but not mandatory).
- `jesonmor.js`, `board.js`, `house.js` and `horse.js` are the Javascript files which will contain the code for the components we will need to create. Their names give a good suggestion about what they will contain.