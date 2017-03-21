# Styling the board

So, let's dive into another language called [CSS](https://en.wikipedia.org/wiki/Cascading_Style_Sheets). Cascading Style Sheets is a web technology used in HTML pages in order to define the style of elements. The reason because we still see nothing on the page is because we have defined all the pieces, but the are unstyled. We need to set dimensions, colors and positions of the elements we have defined.

## First simple rules
Let's go back to `index.html`. In the `<head>` section can you remember? We have added at the beginning this line:

```html
<link rel="stylesheet" type="text/css" href="style.css">
```

This HTML directive includes file `style.css` which we have created but left empty. Let's open this file as we will soon type some CSS code into that. Let's type these lines as first:

```css
body {
    padding: 0;
    margin: 0;
}
```

What we have just written is a CSS rule. Every CSS rule is made by 2 parts:

```
<rule-selector> {
    <rule-body>
}
```

- The first part is the _selector_ and precedes the curly brackets. The selector is used to point which element or elements in the page should be impacted by the style defined in the body of the rule.
- The second part is whatever comes into the brackets, that is the _body_ of the rule and consists of a list of CSS properties and values.

The rule we have written is telling the browser to locate the `<body>` element in the page and apply to that tag some style. The body of the rule we have written has 2 properties: `padding` and `margin`. A CSS rule has this pattern:

```
<property>: <value>;
```

We are basically asking for our page to have no margin and no spacing. We want this because by default every browser defines a default spacing which we don't want. If we refresh the page we will still see nothing. The style we have defined is not really specifying any color, so let's add some color. So let's now add a few more lines after those we just type in before:

```css
.container {
    position: absolute;
    left: 10px;
    top: 10px;
}
```

A selector of type `.<name>` picks up all the HTML elements which have their `class` attribute set to `container`. The properties we define are used to make the board positioned relatively to the page coordibate system whose center `(0,0)` is set to the top left corner of the browser content window. Then `left` and `right` are used to tell the browser to position the board 10 pixel from the page's left border and 10 pixels from the top border.

## Focusing on houses
We're almost there, we just need to define the style of the houses. So let's add this selector:

```css
.container > .house {
    background-color: #fecea2;
    position: absolute;
    width: 50px;
    height: 50px;
}
```

This selector is a bit more advanced. Let's start from right to left as it reads:

> Select all HTML elements having their `class` attribute set to `house` and among them, select only those contained inside an HTML element whose `class` attribute is set to `container`

In CSS the `<parent> > <direct-child>` selector is used to select all direct children elements of `<parent>`.

With this selector we are going to target only the houses inside the container. If, for some reason, we end up inserting houses outside of the container, they will not be styled. What properties have we defined? We have defined a color for the each house, the color is `#fecea2`, this is an hexadecimal code. Color are specified in this way, of course it is a little different to understand what clor it is, that is why there are so many tools in the web.

1. Go to `www.google.com`.
2. In the search field type: `color picker`.
3. The Google color picket tool appears.
4. In our code, copy the hexadecimal color.
5. Paste it into the color picker on the left.

You will see that `#fecea2` corresponds to a light brown color. It makes sense as this is a Chess board and must resemble a wooden board. The next property, as before, is just instructing every house to be positioned with respect to the top left cornet of their parent element (thus, the `container` element). In the end, we set the dimension of each house to be 50 pixels both for width and height. Let's refresh the page and see what happens.

### What's wrong?
Oh well, we see something at least, though what we see is not exactly what we expected. Let's open the F12 tools again and let's try to investigate the problem we are facing. Locate in the window the menu top bar:

![](/assets/f12-topbar.png)

The leftmost icon refers to the element visual selector.

1. Arrange the browser window and the F12 tools window one next to the other.
2. In the F12 tools window, click the icon we just located before.
3. Now, in the same window, click on one of the `<div class="house"></div>` elements in the tree

You will see in the browser window that the same spot is highlighted. What we are seeing is that all the houses are stacked one on top of each other. This happens because we have set `position: absolute;`, absolute positioning an element means that it will not flow with the other elements, if we remove this property we would see one house being positione next to the other on a long line, but that is not the final effect we want. We need to position these houses in the correct spot.

## Positioning houses
Remember that setting `position: absolute;` also means that we can use properties `left` and `top` as we did for the container and the position will be relative to the container element itself (top left corner).

So let's try doing some experiment and type the lines in `style.css`:

```css
.container > .house:nth-child(1) {
    top: 0;
    left: 50px;
}
```

This is another advanced selector but is not so different from the one we typed before. We still wanna make sure that we select only houses inside the container, but now we have added another condition. We don't want to select all the houses, only the first house inside `container`. This is what selector `:nth-child(1)` does:

> Selector `<element>:nth-child(<n>)` will select the `n`th element from `<element>`'s parent counting from 1 to `N`, where `N` is the number of siblings `<element>` has.

Go back to the page and refresh it. What can you see now? One house is 50 pixels moved to the right (50 pixels away from the left margin), since all houses still have the same color (something we will fix later) we actually see a rectangle.

Well, if you now try replacing the previous code with the following block: 

```css
.container > .house:nth-child(1) { top: 0; left: 50px; }
.container > .house:nth-child(2) { top: 0; left: 100px; }
.container > .house:nth-child(3) { top: 0; left: 150px; }
.container > .house:nth-child(4) { top: 0; left: 200px; }
.container > .house:nth-child(5) { top: 0; left: 250px; }
.container > .house:nth-child(6) { top: 0; left: 300px; }
.container > .house:nth-child(7) { top: 0; left: 350px; }
.container > .house:nth-child(8) { top: 0; left: 400px; }
.container > .house:nth-child(9) { top: 0; left: 550px; }
```

And refresh the page, you'll see we have aligned the first 9 houses on the first row, the rest are still positioned all where the top left house should be. 

### Setting alternating colors
This was a little experiment to play around the `:nth-child` selector. You probably guess what we are going to do. For every house we need to specify its coordinate. It means that we will need 81 different rules whose selectors range from `:nth-child(1)` to `:nth-child(81)`, but there is a much less verbose way to do this.

The style of an element is defined by properties such as `left`, `right`, `background-color` or `position`. However we now know that we need to select the correct elements to style by means of selectors. If you have 2 CSS rules defining different properties but whose selectors will end up picking some common elements, those elements will receive both styles.

Now add this code:

```css
.container > .house:nth-child(2n+1) {
    background-color: #d08c4c;
}
```

We are still using the `:nth-child` selector, but a more advanced version of it. So this selector can actually accept an expression inside the parentheses. You give `n` values from 0 to, whatever number, and the final result of the epression will give you the elements to apply the style to. With this advanced version of the selector, we can point many elements with just one rule. And that is what we are doing with the previous code:

> Selector `:nth-child(2n+1)` will select all children elements which are in odd positions

If we had wanted to select all children in even positions, we would have written `:nth-child(2n)`. Go ahead and refresh the page, you see? Now the first row has alternating coloured houses.

Remove not the last code, but the one we typed before it. We do not need that code anymore because we are going to align houses in a much smarter way.
