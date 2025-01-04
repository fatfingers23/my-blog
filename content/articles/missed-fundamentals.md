---
title: 'Missed Fundamentals In Web Development'
description: 'I talk about some of the basics I think are missed from learning web development with a full framework'
date: "2025-01-03T23:00:00Z"
draft: false
image:
    src: "/article-assets/2/cover.png"
    alt: "A photo of html code re sating the title and description"
head:
    meta:
      - name: "twitter:card"
        content: "summary"
      - name: "keywords"
        content: "js, php, code, learn, basics, html, web development"
      - name: 'author'
        content: 'Bailey Townsend'
      - name: "twitter:card"
        content: "summary"
      - name: "twitter:image"
        content: "https://baileytownsend.dev/article-assets/2/cover.png"                  
---

There are some fundamentals of web development that I think are forgotten about with modern abstractions. 
This article will not be groundbreaking, and it will not always be the best practice. However, it is intended to showcase some fundamental concepts about web development and how these are handled without a framework. In my job I spend a lot of time moving desktop applications to the web or just modernizing some older code bases. 
That's really where some of this shines. When you realize it's all just web you can bridge the gap and introduce some modern concepts to those older web applications.

I learned web development from using plain PHP. With that you have to do a LOT of things that modern frameworks just take care of for you. I've been in the Rust ecosystem for a few years now
, frameworks like [actix-web](https://github.com/actix/examples) or [axum](https://github.com/tokio-rs/axum) have that *feel* of just being barebones like old PHP was. All that to say is, I did not have as many abstractions when I learned web development. I feel like that has helped me be able to learn newer frameworks easier.
Things like Vue, next.js, Laravel, dotnet, and so on are great tools that I use almost daily, but they abstract a lot of these basics away where I feel like they are missed or forgotten about. You do not need to know any of these
to be a successful developer. But if you realize it's all the same tech, it's all HTML, it's all just the web it will help you. Especially if you move from framework to framework. The basics stay the same.


## What will we be covering?
* [Explanation of how this article is written and setup](#explanation-of-how-this-article-is-written-and-setup)
* [Basic HTML forms](#basic-html-forms)
  * [Correlation between input names and variables on the backend](#correlation-between-input-names-and-variables-on-the-backend)
  * [Sending arrays with forms](#sending-arrays-with-forms)
  * [A somewhat modern twist](#a-somewhat-modern-twist)
* [~~Type~~ JavaScript](#type-javascript)
  * [The Basics](#the-basics)
  * [Basic HTML templates with JS](#basic-html-templates-with-js)
  * [Vanilla Dates](#vanilla-dates)
  * [Using NPM packages in `<sctipt>` tags](#using-npm-packages-in-script-tags)
* [Closing](#closing)

# Explanation of how this article is written and setup
This article will have the backend examples written in plain old PHP and express.js. PHP without a framework is one of the easiest ways to see this code and understand how it interacts. Express.js for those more familiar with JS and shows that these basic ideas can also work in something slightly newer.
You will find links and examples along the way, as well as all are found in this [GitHub repo](https://github.com/fatfingers23/missed-fundamentals-examples).




# Basic HTML forms
[These examples can be found in either the express.js or php folder](https://github.com/fatfingers23/missed-fundamentals-examples)

When learning with a framework, many fundamental ideas for taking user input is included in an easier abstracted way. A lot of times it's usually a JSON object, then a web call to the backend with it. But you can just send data to the backend
without JS or any other framework's abstractions of the HTML like Razor or Blade. Just plain ol' HTML that is valid in any framework.

Let's start by building the basic HTML form before we discuss what some abstractions hide.

::multi-lang-code-example{:codingLanguages='["php", "html"]'}
#one
```php
// /php/form.php
<?php

?>
<!DOCTYPE html>
<html>
<body>
<form action="index.php" method="POST">
  <input type="text" name="first_name">  
  <br>
  <input type="submit">
</form>
</body>
</html>
```
#two
```html
<!--/express.js/public/form.html-->
<!DOCTYPE html>
<html>
<body>
<form action="/form" method="POST">
    <input type="text" name="first_name">
    <input type="submit">
</form>
</body>
</html>
```
::

## Correlation between input names and variables on the backend

I see people missing the connection between input fields on forms and how they get the data on the backend a lot.
For example, in dotnet, when you do an input, you do like `@Html.DisplayNameFor(model => model.name)`, then on the backend, you access it via the name property of the class. 

But how does that connection happen?
Well when you use `@Html.DisplayNameFor(model => model.name)` it renders out HTML that looks about like this `<input id="name" name="first_name">`.
Well, your plain Jane forms use this as the key to find that form value. If this is a POST, the form key of the body
is set to `first_name`, and if it is a GET request, it's in the URL as `/?first_name=John Keats`. It's simple, but it gets brushed over a lot in abstractions. You can see below how to access these values on the backend for a POST.


::multi-lang-code-example{:codingLanguages='["php", "js"]'}

#one

```php
// /php/form.php
if(isset($_POST['first_name'])) {
    $first_name = $_POST['first_name'];
    echo 'Welcome ' . $first_name;
}

```

#two

```js
// /express.js/index.js
app.use(express.urlencoded({ extended: true }));
app.post('/form', (req, res) => {
    const fullName = req.first_name;
    if(fullName) {
        res.send(`Hello ${fullName}`);
        return;
    }
    res.redirect('/form');
});

```
::


## Sending arrays with forms
Sending arrays with plain HTML is something you really don't see a lot anymore with frontend frameworks. Let's say we have a form, and we want to get multiple inputs. You can add `[]` to the end of the `name` attribute. So it would look like `<input name="toppings[]">`. This will then let you take an array of inputs. I find this useful on admin dashboards, but for this example, we will use `toppings[]` so users can add any topping they want for a pizza from the input!
::multi-lang-code-example{:codingLanguages='["php", "js"]'}

#one

```php
// /php/array_submit.php
<?php
  $toppings = [];
  if(isset($_POST['toppings'])) {
    $toppings = $_POST['toppings'];
  }
?>
<!DOCTYPE html>
<html>
  <body>
  <h1>Pick your toppings!</h1>
  <?php
    if (count($toppings) > 0) {
      foreach($toppings as $topping) {
        echo $topping . '<br>';
      }
    }
  ?>
    <form action="/array_submit.php" method="POST">
      <label><input type="checkbox" name="toppings[]" value="pepperoni"> Pepperoni</label>
      <br>
      <label><input type="checkbox" name="toppings[]" value="pine-apple"> Pine Apple</label>
      <br>
      <input type="submit">
    </form>
  </body>
</html>
```

#two

```js
// /express.js/index.js
app.get('/toppings', (req, res) => {
    res.sendFile(__dirname + '/public/toppings.html');
});
app.post('/toppings', (req, res) => {
    const toppings = req.body.toppings;
    if(toppings.length > 0) {
        res.send(`You have selected ${toppings.join(', ')}`);
        return;
    }
    res.redirect('/toppings');
});

```

```html
<!--/express.js/public/toppings.html-->
<!DOCTYPE html>
<html>
<body>
<h1>Pick your toppings!</h1>
<form action="/toppings" method="POST">
    <label><input type="checkbox" name="toppings[]" value="pepperoni"> Pepperoni</label>
    <br>
    <label><input type="checkbox" name="toppings[]" value="pine-apple"> Pine Apple</label>
    <br>
    <input type="submit">
</form>
</body>
</html>
```
::


## A somewhat modern twist
This is not cutting-edge, but it is a tip I like to use to easily convert form data into JS for API calls. You usually think of doing something like this to get input field data.

```html
<script>
    function consoleLogInput(){
        let input = document.getElementById('name');
        console.log(input.value);
    } 
</script>
<input type="text" id="name" oninput="consoleLogInput()">

```
But doing a `document.getElementById` for each input can get old quickly. [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) can solve that for you! Just pass it your form element, and then you can convert it to a JavaScript Object and easily access the data for validation or send it to an API.
```html
<!DOCTYPE html>
<html>
  <body>
    <script>
        function handleFormSubmission(event){
            event.preventDefault();
            const formElement = document.getElementById('formName');
            const form = new FormData(formElement);
            const formValues = Object.fromEntries(form.entries());
            console.log(formValues);
        }
    </script>
  <h1>Submit our form!</h1>
    <form id="formName" onsubmit="handleFormSubmission(event)">
        <label for="first_name">First Name:</label>
        <input type="text" name="first_name">
        <br>
        <label for="last_name">Last Name:</label>
        <input type="text" name="last_name">
        <br>
        <label for="email">Email:</label>
        <input type="email" name="email">
        <br>
      <input type="submit">
    </form>
  </body>
</html>
```
This has been available across all major browsers since 2015, so it's not new. 
But I think it has been overlooked because many of us have moved on to greener pastors and do not write as much vanilla javascript with all the reactivity of a framework.


# ~~Type~~ JavaScript
[These examples can be found in the html folder](https://github.com/fatfingers23/missed-fundamentals-examples/tree/main/html)

Many people have moved on from writing vanilla JavaScript on web pages or diving straight into TypeScript. I know there is a lot of debate, but honestly...
![Both is good](https://media1.tenor.com/m/EstKpPVveyYAAAAC/both-agree.gif)

Every tool has its place! Each has pros and cons, but to save the need for a bundler and other complexities, these will be examples in JS that can run on any old HTML page.

I want to make sure we realize something. It's all on the web. It's all HTML. Razor pages, HTML. Blades, HTML. Vue, HTML. JSX, believe it or not, also HTML. It is all rendered out as HTML. You can slap this into any project, no matter the framework. Should you? Highly debatable and probably not. But that's not the point. You can do it because these are just the basics of websites.

## The Basics
We're going start with some basics that work on any framework. Pretty much every framework has either a server side helper for this,
or a better frontend abstraction to make it easier and cleaner. But just knowing or remembering you can just pick a HTML element with JS and modify it is helpful.

You can select an element just about any which way you can imagine.
```html
<body>
  <div id="app" class="container">
    <div id="app" class="container">
      <h1>The Basics</h1>
    </div>
  </div>
</body>
```

You can...
```js
let byId = document.getElementById('app');
let byClass = document.getElementsByClassName('container');
let byTag = document.getElementsByTagName('div');
let byCssSelectors = document.querySelector('.container')
```
Let's say you want to add a class.
```js
let byId = document.getElementById('app');
byId.classList.add('red');
```
Let's now remove the class
```js
let byId = document.getElementById('app');
byId.classList.remove('red');
```

Let's add a new element
```js
let byId = document.getElementById('app');
let newElement = document.createElement('span');
newElement.innerText = 'I am a new span';
byId.appendChild(newElement);
```
The possibilities are endless for how you can interact with elements. There's a good chance you already knew this, but I want to make sure I drove home the point: YOU CAN DO THIS ON ANY WEB PAGE. Try it on any website made in your preferred framework, open the dev console, and interact with elements. Nothing is stopping you, it's just HTML.

## Basic HTML templates with JS
*Note: Before discussing this next topic, there are possible security risks with XSS, as shown in some of what I will show you. Do not trust any user input at any time without some sanitization, especially for this.*

Usually, when you think of templates, you think of something like `{{value}}` or even JSX. What I am going to show you does not have any reactivity to it. But it is good if you can't import anything else or want a simple code solution to throw up some more complex HTML from a JS action.

I use this occasionally when I do not have a JS framework on the project and do not need to bring one in. 
The benefit is that I can see the HTML elements I am writing in a way that is easier for me to understand, and JetBrains IDE's can pick up the HTML in the strings and show my syntax highlights and completion.

![Example photo showing html syntax in a JetBrains IDE](/article-assets/2/template_syntax.png)

I create a function that can take the values I need in the template

```js
function responseTemplate(message,img) {
}
```

then using backticks (`), then you can do some string interpolation to insert the values you want.
```js
function responseTemplate(message,img){
    return `
        <div>
            <h1>${message}</h1>
            <img src="${img}" alt="image">
        </div>
    `
}
```
And that's it! You can do other things like [`element.appendChild()`](https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild) and use a builder like syntax. But seeing the HTML laid out like this has always just clicked for me and made it easier.
![You have heard of me](/article-assets/2/heard_of_me.gif)

## Vanilla Dates
This one is straightforward, and I'm sure many know it already. There are a thousand ways to solve it, but sometimes just keeping it simple is easiest.
You will even notice at the top of this article I am using the same exact thing to display the datetime in a format local to you.

Let's say you have a datetime like `2024-08-26 03:00:00.000` and you want to show it in an easier way to read.
You may see something like this as taken from this [Stackoverflow question](https://stackoverflow.com/a/25275808) that showed up when I googled `format a datetime js`.
```js
function formatDate(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return (date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
}

var d = new Date();
var e = formatDate(d);

alert(e);
```
This does give you better control over the format, but you can also just chunk it into a `new Date()` and call `.toLocaleString()`, is it the prettiest or best?
Probably not, but it is a quick and easy way to show usable dates for each region to your users from vanilla JS.

```js
const dateTimeFromDb = "2024-08-26 03:45:32.9916342";
const date = new Date(dateTimeFromDb);
console.log(date.toLocaleString())
// 8/26/2024, 3:00:00 AM

```

## Using NPM packages in script tags
*Note: This one mileage may vary. Depends on if the package has a version that runs in the browser and more. I do not know enough or feel comfortable talking about the specifics of it. Just want to show some tricks I've used before with success and use it to illustrate "it's all web tech"*

I think most people are familiar with JS applications and using bundlers like [webpack](https://webpack.js.org/) or [Vite](https://vite.dev/). You'll see something like this
```js
// https://www.npmjs.com/package/date-fns
import { compareAsc, format } from "date-fns";

format(new Date(2014, 1, 11), "yyyy-MM-dd");
//=> '2014-02-11'

```
Importing a package that you installed with `npm i {package-name}`. Well in our projects we may not be using npm or have a way to install these.
Maybe there's a small npm package that solves your issue and you just want to import it, or maybe you just want to use Vue's reactivity in your legacy app. You can just add those modules to your project and start using them. Nothing is stopping you cause it's all just the same web tech.

In this example we are going to use Vue's render and reactivity. We start out by importing our library. I like to use [UNPKG](https://www.unpkg.com/), it's a CDN for anything on npm.
```html
<script src="https://unpkg.com/@vue/runtime-dom@3.5.13"></script>
```
Then this part is a bit different for every library, but just remember, it's all the Web, it's all code. If you go to [https://unpkg.com/@vue/runtime-dom@3.5.13](https://unpkg.com/@vue/runtime-dom@3.5.13) you will notice at the top
there is a variable set named `VueRuntimeDOM`. This is how you are going to access the library. Then we write out a simple counter example showcasing you can just import modules to your html.
I am not going to go into the specifics of the Vue render, but it is really cool stuff you can read about [here](https://vuejs.org/guide/extras/render-function)
```html
<script src="https://unpkg.com/@vue/runtime-dom@3.5.13"></script>
<script type="module">
    //VueRuntimeDOM is the object I found to access the libraries methods

    //Set up some reactive state
    const globalState = VueRuntimeDOM.reactive({
        counter: 0
    })
    //Set a watcher for when the counter changes
    VueRuntimeDOM.watch(
        () => globalState.counter,
        (newCount, prevCount) => {
            console.log(`new:${newCount}, old:${prevCount}`);
            let counterElement = document.getElementById('counter');
            //Counter is not rendered by first watchEffect
            if (counterElement) {
                document.getElementById('counter').innerHTML = globalState.counter
            }
        }
    )

    //Lay out the count action and build the elements
    const count = () => globalState.counter++;
    const button = VueRuntimeDOM.h('button', {id: 'count', onClick: count}, 'Count');
    const counterSpan = VueRuntimeDOM.h('h1', {id: 'counter'}, '0');

    const RootComponent = {
        render() {
            return VueRuntimeDOM.h('div', {id: 'inner-app'}, [
                counterSpan,
                VueRuntimeDOM.h('br'),
                button,
            ]);
        },
    }

    VueRuntimeDOM.createApp(RootComponent).mount('#app')
</script>
<div id="app" class="centered-element">

</div>
```
and the resulting web page
![Video of a counter going up to 8 with each button press](/article-assets/2/simple_example_vue_render.gif)

Of course with [vite](https://vite.dev/guide/#trying-vite-online) it's pretty easy to get the ball rolling with node packages, and even typescript in any framework you want. But this is mostly just to show you can and it's all the same tech. Again what I want you to know is
it's all the web. You can just do this, it's what the libraries you use are doing.

# Closing
I hope you have enjoyed reading this post and maybe learned something new, or at least got the wheels turning. If there is anything to take from this it's
that it's all just web and HTML. Every single thing I've shown here can be used in whatever web framework you are using. Be it React, Nuxt JS, Next, Previous.JS, Laravel, Ruby, Dotnet, Actix, or anything else that runs in a web browser. It's all the same tech.
That's what I really want you to know as you work on your next project that you can just treat it like a website and use the basics if you need them. It's what those frameworks are doing, just giving you a nicer cleaner abstraction. Cause who really want's to do `$_POST['name']` or `document.getElementById('name')` anymore.

Thanks for reading!
