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

#### CSS property override
Let's move on and remove not the last code, but the one we typed before it. We do not need that code anymore because we are going to align houses in a much smarter way. Your `style.css` should now look like this:

```css
body {
    padding: 0;
    margin: 0;
}

.container {
    position: absolute;
    left: 10px;
    top: 10px;
}

.container > .house {
    background-color: #fecea2;
    position: absolute;
    width: 50px;
    height: 50px;
}

.container > .house:nth-child(2n+1) {
    background-color: #d08c4c;
}
```

Before moving on I want you to reflect a little more about the last 2 rules we have written. They both act on some elements that are the same right? The one before last is selecting all houses, the last one is selecting all in odd positions. And both rules are setting different values of `background-color`. So which one wins over an odd house? Since we have run the page, we could see that the last rule wins. Why? Because it is defined after the rule selecting all houses? No! Try swapping the positions of those rules and you will see the same final effect on the browser.

The key is something a bit complicated called [Specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity), but here is one simple way of seeing it:

> The rule with more selectors wins

The rule selecting all houses `.container > .house` has a selector consisting in 2 selectors: one for selecting the container and one for selecting houses in the container. The other one `.container > .house:nth-child(2n+1)` has 3 selectors: the additional one for selecting odd positioned houses and therefore it wins the contest for the `background-color` property.

### Aligning houses in a smart way
Now that we know more about selectors, we can resume our task: we need to align houses in a better way than just defining 81 different `:nth-child` selectors. We are going to use this selector in order to reduce the number of different rules to define.

So, what approach are we going to follow? Let's have a look at the board again. Houses are going to be arranged in specific positions. If we consider one row, all the houses in that row will have the same y-coordinate (CSS property `top`). The same goes if we consider one column, all the houses will have the same x-coordinate (CSS property `left`). So here is the trick: we are going to define 9 rules (one for each row) and 9 rules (one for each column) instead of 81 different ones.

ow will we do this? There is one more thing you need to know about selectors in CSS rules: it is possible to specify more selectors for one single rule like this:

```
<rule-selector>,
<rule-selector>,
...
<rule-selector> {
    <rule-body>
}
```

By using comma, it is possible to separate more selectors for one same rule. Of course, the opposite is not possible (one selector for multiple rules). So, here we go. You might probably get what we are going to do. We need to create one rule which targets all the houses in one row and we need to do this for every row. Same goes for columns. 

**Simplicity:** Now, we have created the board to be whatever size, so we should create an infinite amount of rules to target all possible sizes. Well, truth is we are making things simple here, so for the styling we are using a very simle approach which cannot target parametric sizes: we are going to create a style only for 9x9 boards. So our application will have a limitation. Later we will see how to remove it by using a better CSS styling.

So, for the first row, we notice that all houses will have the same y-coordinate set to `top: 0;`:

```css
.container > .house:nth-child(1),
.container > .house:nth-child(2),
.container > .house:nth-child(3),
.container > .house:nth-child(4),
.container > .house:nth-child(5),
.container > .house:nth-child(6),
.container > .house:nth-child(7),
.container > .house:nth-child(8),
.container > .house:nth-child(9) {
    top: 0;
}
```

Of course, in the first row we will have element from position 1 to position 9. The same goes for the second row. We have made houses such that their size is set to `50px`, so the second row will have all houses `50px` from the top border of the page:

```css
.container > .house:nth-child(10),
.container > .house:nth-child(11),
.container > .house:nth-child(12),
.container > .house:nth-child(13),
.container > .house:nth-child(14),
.container > .house:nth-child(15),
.container > .house:nth-child(16),
.container > .house:nth-child(17),
.container > .house:nth-child(18) {
    top: 50px;
}
```

In this case the elements range from position 10 to 18. So we need to do this for all 9 rows. The 3rd row will have houses shifted down by `100px`, then `150px` and so on. The final CSS for aligning rows is displayed below:

```css
.container > .house:nth-child(1),
.container > .house:nth-child(2),
.container > .house:nth-child(3),
.container > .house:nth-child(4),
.container > .house:nth-child(5),
.container > .house:nth-child(6),
.container > .house:nth-child(7),
.container > .house:nth-child(8),
.container > .house:nth-child(9) {
    top: 0;
}
.container > .house:nth-child(10),
.container > .house:nth-child(11),
.container > .house:nth-child(12),
.container > .house:nth-child(13),
.container > .house:nth-child(14),
.container > .house:nth-child(15),
.container > .house:nth-child(16),
.container > .house:nth-child(17),
.container > .house:nth-child(18) {
    top: 50px;
}
.container > .house:nth-child(19),
.container > .house:nth-child(20),
.container > .house:nth-child(21),
.container > .house:nth-child(22),
.container > .house:nth-child(23),
.container > .house:nth-child(24),
.container > .house:nth-child(25),
.container > .house:nth-child(26),
.container > .house:nth-child(27) {
    top: 100px;
}
.container > .house:nth-child(28),
.container > .house:nth-child(29),
.container > .house:nth-child(30),
.container > .house:nth-child(31),
.container > .house:nth-child(32),
.container > .house:nth-child(33),
.container > .house:nth-child(34),
.container > .house:nth-child(35),
.container > .house:nth-child(36) {
    top: 150px;
}
.container > .house:nth-child(37),
.container > .house:nth-child(38),
.container > .house:nth-child(39),
.container > .house:nth-child(40),
.container > .house:nth-child(41),
.container > .house:nth-child(42),
.container > .house:nth-child(43),
.container > .house:nth-child(44),
.container > .house:nth-child(45) {
    top: 200px;
}
.container > .house:nth-child(46),
.container > .house:nth-child(47),
.container > .house:nth-child(48),
.container > .house:nth-child(49),
.container > .house:nth-child(50),
.container > .house:nth-child(51),
.container > .house:nth-child(52),
.container > .house:nth-child(53),
.container > .house:nth-child(54) {
    top: 250px;
}
.container > .house:nth-child(55),
.container > .house:nth-child(56),
.container > .house:nth-child(57),
.container > .house:nth-child(58),
.container > .house:nth-child(59),
.container > .house:nth-child(60),
.container > .house:nth-child(61),
.container > .house:nth-child(62),
.container > .house:nth-child(63) {
    top: 300px;
}
.container > .house:nth-child(64),
.container > .house:nth-child(65),
.container > .house:nth-child(66),
.container > .house:nth-child(67),
.container > .house:nth-child(68),
.container > .house:nth-child(69),
.container > .house:nth-child(70),
.container > .house:nth-child(71),
.container > .house:nth-child(72) {
    top: 350px;
}
.container > .house:nth-child(73),
.container > .house:nth-child(74),
.container > .house:nth-child(75),
.container > .house:nth-child(76),
.container > .house:nth-child(77),
.container > .house:nth-child(78),
.container > .house:nth-child(79),
.container > .house:nth-child(80),
.container > .house:nth-child(81) {
    top: 400px;
}
.container > .house:nth-child(82),
.container > .house:nth-child(83),
.container > .house:nth-child(84),
.container > .house:nth-child(85),
.container > .house:nth-child(86),
.container > .house:nth-child(87),
.container > .house:nth-child(88),
.container > .house:nth-child(89),
.container > .house:nth-child(90) {
    top: 450px;
}
```

Those are 9 rules in total!

Columns have a similar pattern. Instead of using `top`, we need to use property `left`. Also, we need to select elements in a different scheme. To select the first row, we need to take elements in positions `1,10,19,28,37,46,55,64,73`. From this basic sequence, we add 1 for every new column. So the second column is selected by positions: `2,11,21,29,38,47,56,65,74`. The final code for columns, to be added the one for rows, is the following:

```css
.container > .house:nth-child(1),
.container > .house:nth-child(10),
.container > .house:nth-child(19),
.container > .house:nth-child(28),
.container > .house:nth-child(37),
.container > .house:nth-child(46),
.container > .house:nth-child(55),
.container > .house:nth-child(64),
.container > .house:nth-child(73) {
    left: 0;
}
.container > .house:nth-child(2),
.container > .house:nth-child(11),
.container > .house:nth-child(20),
.container > .house:nth-child(29),
.container > .house:nth-child(38),
.container > .house:nth-child(47),
.container > .house:nth-child(56),
.container > .house:nth-child(65),
.container > .house:nth-child(74) {
    left: 50px;
}
.container > .house:nth-child(3),
.container > .house:nth-child(12),
.container > .house:nth-child(21),
.container > .house:nth-child(30),
.container > .house:nth-child(39),
.container > .house:nth-child(48),
.container > .house:nth-child(57),
.container > .house:nth-child(66),
.container > .house:nth-child(75) {
    left: 100px;
}
.container > .house:nth-child(4),
.container > .house:nth-child(13),
.container > .house:nth-child(22),
.container > .house:nth-child(31),
.container > .house:nth-child(40),
.container > .house:nth-child(49),
.container > .house:nth-child(58),
.container > .house:nth-child(67),
.container > .house:nth-child(76) {
    left: 150px;
}
.container > .house:nth-child(5),
.container > .house:nth-child(14),
.container > .house:nth-child(23),
.container > .house:nth-child(32),
.container > .house:nth-child(41),
.container > .house:nth-child(50),
.container > .house:nth-child(59),
.container > .house:nth-child(68),
.container > .house:nth-child(77) {
    left: 200px;
}
.container > .house:nth-child(6),
.container > .house:nth-child(15),
.container > .house:nth-child(24),
.container > .house:nth-child(33),
.container > .house:nth-child(42),
.container > .house:nth-child(51),
.container > .house:nth-child(60),
.container > .house:nth-child(69),
.container > .house:nth-child(78) {
    left: 250px;
}
.container > .house:nth-child(7),
.container > .house:nth-child(16),
.container > .house:nth-child(25),
.container > .house:nth-child(34),
.container > .house:nth-child(43),
.container > .house:nth-child(52),
.container > .house:nth-child(61),
.container > .house:nth-child(70),
.container > .house:nth-child(79) {
    left: 300px;
}
.container > .house:nth-child(8),
.container > .house:nth-child(17),
.container > .house:nth-child(26),
.container > .house:nth-child(35),
.container > .house:nth-child(44),
.container > .house:nth-child(53),
.container > .house:nth-child(62),
.container > .house:nth-child(71),
.container > .house:nth-child(80) {
    left: 350px;
}
.container > .house:nth-child(9),
.container > .house:nth-child(18),
.container > .house:nth-child(27),
.container > .house:nth-child(36),
.container > .house:nth-child(45),
.container > .house:nth-child(54),
.container > .house:nth-child(63),
.container > .house:nth-child(72),
.container > .house:nth-child(81) {
    left: 400px;
}
```

That's it. Run it in the browser and finally see our board there on the screen!

### One final touch
Are we missing anything? Oh well actually we do! Remember that in Jeson Mor we have one special house: `r5,c5`, the centrer house which plays the most important role in the game. We need to style it differently! We actually need to give it a different color. How do we do that? Well pretty easy, as a final rule, we define the color of that house to be different:

```css
.container > .house:nth-child(41) {
    background-color: #9c6027;
}
```

So, remember that we have other rules defining the same property, why should this rule win? Remember the discussion we had about specificity. Well, in this case you will see we have two rules with the same number of selectors and both defining `background-color`, how do we define the winner? Well here is another fun fact about specificity:

> If two rules have the same specificity, the one defined last wins

So, since we have defined the rule for the central house as last, it will win over the one we defined before for setting the darker color on odd houses.

**First step completed:** We have completed the first step, congratulations! The code is available [here](https://github.com/andry-tino/t-jesonmor/tree/development/tutorial-src/step-1).
