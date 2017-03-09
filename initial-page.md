# Defining the initial page

The first thing we wanna do is defining the content of `index.html`. This file is pretty important. To run the game, the user will just need to open this page and that's it. The page will contain the code to execute the Javascript files we will include inside it and display the board with all the pieces.

Technically speaking, we say that this file is the _entry point_ of our application.

## The structure of a generic HTML page
This file, as the extension suggests, is an [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML) file. HTML (Hyper Text Markup Language) is a language which is not used to write a program, that is a _programming language_. HTML is a _markup language_, namely a language used to tell a program how to display something.

The program we need to tell how and what to display is a [web browser](https://en.wikipedia.org/wiki/Web_browser) such as Chrome, Firefox, Edge or Safari. All of them are able to understand HTML.

HTML is not difficult, this is the most basic content of a valid HTML that can be displayed by a browser, type it inside `index.html` and then open the page in your favorite browser:

```
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Play Jeson Mor</title>
</head>

<body>
</body>
</html>
```

Every HTML page starts with an opening statement `!DOCTYPE`. That first line is sinmply telling the browser which version of HTLM your are going to use in the page. HTML has changed over time, so you need to tell the browser which one you are picking. With this declaration, you are telling the browser you are using the latest version of HTML: [HTML5](https://developer.mozilla.org/en/docs/Web/Guide/HTML/HTML5).

### The basic tags
Then the document must start with an `<html>` element. An HTML element is an opening tag `<some-name>` and a closing tag `</some-name>` enclosing a certain content which can be text or other elements. Everything about an HTML page must appear inside the `<html>` element, everything outside of it is invalid markup.

In the `<html>` element we must define two elements in order: `<head>` and `<body>`. The first one encloses information about the page such as the title to display in the top bar, scripts to load for the page and other information. The `<body>` contains everything that will appear on the screen and rendered as graphics. Now it is empty and, in fact, if you run this page, you will get a blank page.

Inside the `<head>` element we have defined two elements: a `<meta>` and the `<title>`. That `<meta charset="UTF-8">` is a single tag (it has no closing tag) which tells the browser what type of characters we are going to use. [UTF-8](https://en.wikipedia.org/wiki/UTF-8) is a widely used standard and it allows us to use many different characters inside an HTML page, like special symbols in other languages (like `ø`, `æ` and `å` in Danish for example). The `<title>` element contains the text that the browser will display in the top bar of the window or on the page tab.

## Loading external content
The most important thing we need to do loading all those Javascript and `.css` files we have created before. Those files are still empty but we will take care of them right after finishing here with this page.

What we need to do is telling the browser that it needs to load those files into the page because we need them. How? There are special HTML tags to use for including external content and they must all be written in the `<head>` element.

```
<head>
    <meta charset="UTF-8">
    <title>Play Jeson Mor</title>

    <!-- Stylesheets -->
    <link rel="stylesheet" type="text/css" href="style.css">

    <!-- Javascript files -->
    <script src="horse.js" type="text/javascript"></script>
    <script src="house.js" type="text/javascript"></script>
    <script src="board.js" type="text/javascript"></script>
    <script src="jesonmor.js" type="text/javascript"></script>
</head>
```

We have added a few more line after the `<title>` tag. One thing to nitice is those tags which open with a `<!--` and close with a `-->`; they are comments such as `<!-- Comment -->` and they will not be considered by the browser. They are used by developers to better organize the markup.

The first inclusion tag we find is `<link>`. This is another single tag (it has no closing) and it is used to tell the browser to include a [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) file. We will talk about CSS later.

Then we have 4 `script` tags. This tag is used to define Javascript code. We can actually write the Javascript code directly inside the tag like in the following example:

```
<script type="text/javascript">
  alert("This will display a message box");
</script>
```

But we need to include the code from an external file, thus we do not type anything inside the tag, but use the `src` attribute in the tag to specify the path of the Javascript file we want the browser to import in the page. Paths must be relative to the HTML file.

Again, if we try to load the reload page, we will still see a blank screen. That is because there is nothing in those files we have included. We have just prepared our page, now we are ready to create something real.
