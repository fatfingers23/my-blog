---
title: 'Missed Fundamentals'
description: 'I talk about some of the basics I think are missed from learning with a framework'
date: "2024-08-16T01:08:00Z"
draft: true
image:
    src: "/article-assets/2/cover.png"
    alt: "A photo of html code re sating the title and description"
head:
    meta:
      - name: "keywords"
        content: "js, php, code, learn, basics"
      - name: 'author'
        content: 'Bailey Townsend'
---

There are some basic fundamentals of web development that we more seasoned developers forget about. This article will not be groundbreaking, and it will not always be the best practice. However, it is intended to showcase some fundamental concepts about web development and how these are handled without a framework. These are a few things I have seen over my years working with juniors and other senior developers who may just now be moving to the web space.


Don't get me wrong. You will not find me doing web development strictly this way without all of the shortcuts that frameworks offer. However, I am glad I learned these basics of web development at the start of my coding journey. They really let me appreciate frameworks and have a basic idea of how to use their features.
You don't need to know these to be a successful developer, but if you do, it makes moving from one framework to another easier. No matter your framework, it's all web development; these ideas don't change.
## What will we be covering?
* [Explanation of how this article is written and setup](#explanation-of-how-this-article-is-written-and-setup)
* [Basic HTML forms](#basic-html-forms)
  * [Correlation between input names and variables on the backend](#correlation-between-input-names-and-variables-on-the-backend)
  * [Sending arrays with forms](#sending-arrays-with-forms)
  * [A somewhat modern twist](#a-somewhat-modern-twist)
* [~~Type~~ JavaScript](#type-javascript)
  * [The Basics](#the-basics)
  * [Basic HTML templates with JS](#basic-html-templates-with-js)
  * Vanilla Dates
  * Using NPM packages in `<sctipt>` tags

## Explanation of how this article is written and setup
This article will have the backend examples written in plain old PHP and express.js. PHP without a framework is one of the easiest ways to see this code and understand how it interacts. Express.js for those more familiar with JS and shows that these basic ideas can also work in something slightly newer.
You will find links and examples along the way, as well as all are found in this repo.

## Basic HTML forms
When learning with a framework, many fundamental ideas for taking user input must be included. It's not that they are doing it differently; it is just that the concept is usually abstracted away or, many times, with forms in these newer frameworks. It's a JSON API handling this input.

First, let's build an HTML form!

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

### Correlation between input names and variables on the backend
I see many people missing the connection between input fields on forms and how they get the data on the backend.
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


#### Sending arrays with forms
Something else I see people miss sometimes is sending arrays. Let's have a form, and we want to get multiple inputs. You can add `[]` to the end of the name. So it would look like `<input name="toppings[]">`. This will then let you take an array of input. I always find this useful on admin dashboards, but for example, we will use `toppings[]` so users can add any topping they want for a pizza from the input!
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


#### A somewhat modern twist
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
But doing a `document.getElementById` for each input can get old quickly. [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) can solve that for you! Just pass it to your form element, and then you can convert it to a JavaScript Object and easily access the data for validation or send it to an API.
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
But I think it has been overlooked because many of us have moved on to greener pastors and do not write as much vanilla javascript without all the reactivity of a framework.


### ~~Type~~ JavaScript
Many people have moved on from writing JavaScript on a web page or diving straight into TypeScript. I know there is a lot of debate, but honestly...
![Both is good](https://media1.tenor.com/m/EstKpPVveyYAAAAC/both-agree.gif)

Every tool has its place! Each has pros and cons, but to save the needer for a bundler and other complexities, these will be examples in JS that can run on any old HTML page.

I want to make sure we realize something. It's all on the web. It's all HTML. Razor pages, HTML. Blades, HTML. Vue, HTML. JSX, believe it or not, also HTML. It is all rendered out as HTML; you can interact with these examples no matter your framework. Should you? Highly debatable and probably not. But that's not the point. You can do it because these are just the basics of websites.

#### The Basics
We're going start with some basics that you can do on any framework.

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
The possibilities are endless for how you can interact with elements. There's a good chance you already knew this, but I'm sure I drove home the point: YOU CAN DO THIS ON ANY WEB PAGE. Try it on any website you've made in your preferred framework, open the dev console, and interact with elements.

#### Basic HTML templates with JS
Before discussing this next topic, there are possible security risks with XSS, as shown in some of what I will show you. Do not trust any user input at any time without some sanitization, especially for this.

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

![You have heard of me](/article-assets/2/heard_of_me.gif)

