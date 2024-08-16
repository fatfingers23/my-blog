---
title: 'I (mostly) wrote a website to host blog while sitting at the bar'
description: 'I think I have a lot to say. So finally wrote a website to host my blog, on my phone at the bar...'
date: "2024-08-12T23:37:00Z"
draft: false
image:
    src: "/article-assets/1/cover.jpeg"
    alt: "A photo of a bar with a beer and a phone on the table"
head:
    meta:
      - name: "keywords"
        content: "blog, bar, replit, coding, article"
      - name: 'author'
        content: 'Bailey Townsend'
---


# First a bit about me 
Hey 👋, my name is Bailey, or you can call me by my handle, FatFingers. I've had the nickname for almost as long as my given name. I turn 30 this year and have been in tech for 10 years this March, 7 of them as a Full-Stack Web Developer. I am a self-taught developer and have never attended college or a coding boot camp. I started with [XAMPP](https://www.apachefriends.org/) and followed tutorials from Udemy. I would not say I am an expert on anything, but I have been in the business for what I consider a long time and have worked with many different tech stacks and developers. Currently, in my day job, I am a team lead on a dotnet core web application that falls more in the corporate realm of things. I work with the backend mostly now, and other members of my team handle most of the new features and front-end work. I like to pick up and learn whatever interests me in my free time. It has been Rust 🦀, retro gaming, modding consoles, and microcontrollers for the past couple of years. I have also written a few of what I would call "semi-successful" side projects. None generate revenue, but all we're a labor of love and made to solve problems. The biggest was probably at the start of 2020 when we were all stuck indoors.
I worked on an AAC web app called [FreeSpeech](https://github.com/fatfingers23/freespeech-Vue) to help the non-verbal. The project has since moved on to newer tech and better features, but I wanted to link the one I had worked on since that seems fair. As well as I also run a Discord bot that helps do some cool things with the video game Old School RuneScape. [TrackScape](https://trackscape.app/) takes in-game clan chat messages, extracts in-game data information like level ups and drops, and sends it to a Discord server. As of the last 30 days, it has had 2.13k Unique visitors, 2.93M requests, and 2 GB of data served. The cool thing, too, is it runs on an old Optiplex I have, and thanks to Actix and Rust, it uses roughly 120 MB of RAM just for the application. I have always wanted to write a blog, and I feel like right now is about the right time to share some of the opinions I've made as a developer and in-depth articles about what I am working on! So, if you made it this far, thanks for reading, and hopefully, you'll find some of what I write insightful or at least entertaining! 

# That's cool but what about the bar and the phone?
Like many great and not so great ideas, I had one while sitting at a bar. I decided I finally had enough to say to go past the 280 character limit. So, I decided to write a website to host a blog! It always looked like something fun to make and design. I did not want to waste the happy hour, so I decided to start right there. Thanks to [Replit](https://replit.com/), I was able to get this [template](https://github.com/sistematico/bun-vite-template) running and start coding right there and then! I knew what I wanted to use. Vue, Bun, tailwinds, and [DaisyUI](https://daisyui.com/). So, I started working and came up with the rough draft while sitting there.

::two-pictures-side-by-side
#one
![code_example](/article-assets/1/code.png){class="w-full object-cover rounded-lg"}
#two
![code_example](/article-assets/1/layout.png){class="w-full object-cover rounded-lg "}
::

So, I got pretty far! Well, as far as I could on a bar stool on my phone. I did not get into anything technical, but I got the layout and the design down, which was my main goal. Don't get me wrong, though, I love Replit! And I have made a few bigger products on it. It is also my go-to recommendation whenever someone starts out coding. It is the easiest way to write code and see the result without any other setup. And that is important when you are learning. The more likely you are to see visual results like a web page you wrote displaying in a browser, the more likely you will stick with it. The early stages are about finding a fun way to do it and seeing results you can understand at that time. Not everyone is familiar with console output or manipulating APIs and spreadsheets. A website is something more people can find more relatable. It may only be a bit of text and pictures when you first start out, but that is a start and a great visual indicator that you did it!

# Well, what did you do the next day?
Took a look at what I made and what my goals are. I wanted.
1. To use the tech I started with, it's what I like and enjoy
2. Have a way to display articles that are easily written the next time I'm sitting at a bar
3. Have a way to server side render for things like dynamic tiles and images when you share the article
4. To have fun and learn something new


# 1, 3, and 4
I had already started in Vue and knew I wanted to use it. I like it a lot and can usually host it somewhere free. Bullet point number 3 is a bit hard in vanilla Vue. Well. Why is that? Vue, by itself, is usually called a single-page application or SPA. In an oversimplification of what that is, it means you have one html file. Once the DOM loads, JS takes over and makes it look how you tell it to in your Vue files. So your index.html looks something like this if you did a curl to it. This is the HTML that your server sends to the browser.
```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>%VITE_APP_TITLE%</title>
    <meta property="og:title" content="%VITE_APP_TITLE%" />
    <meta property="og:description" content="%VITE_APP_DESC%" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="%VITE_APP_URL" />
    <meta property="og:image" content="%VITE_APP_TITLE%/vite.png" />
</head>
<body>
<div id="app"></div>
<script type="module" src="/src/main.ts"></script>
</body>
</html>
```
There is not a lot of text or content that you have written yet. That comes in from the `/src/main.ts.`Once the JavaScript loads, it transforms your application into the beautiful thing it was while you were developing it. See those ` <meta property="og:title"` that's what controls the text and images when you share a website on social media or in a text. SPAs have trouble with this, while yes, they can manipulate these. They cannot till JavaScript loads, and that code is executed. Your phone or other websites will not run and execute your JS code to determine the final page's appearance. So, that leaves you only able to set it once in index.html, and it's the same for the whole application. You cannot dynamically set it on different pages and have it render out on those services. So what is the solution for this and still use Vue? Well, there are a few, but I went for Nuxt! Not to be confused with Next.js. They do very similar things, giving their respected JS framework more features. One of those features is Server Side Rendering or SSR. Another way of simplification is. It can execute some of your JS code before it sends the HTML to the browser. This means those services can now read those meta tags without worrying about what your JS code is doing. So that HTML would look more so like this if you curl it

```html

<!DOCTYPE html><html  data-capo="">

<head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>I (mostly) wrote a website to host blog while sitting at the bar</title>
...
<meta name="keywords" content="blog, bar, replit, coding, article">
<meta name="author" content="Bailey Townsend">
<meta property="og:title" content="I (mostly) wrote a website to host blog while sitting at the bar">
<meta name="description" content="I think I have a lot to say. So finally wrote a website to host my blog, on my phone at the bar...">
<meta property="og:description" content="I think I have a lot to say. So finally wrote a website to host my blog, on my phone at the bar...">
<meta property="og:image" content="/article-assets/1/cover.jpeg">
<meta property="og:image:alt" content="A photo of a bar with a beer and a phone on the table">
<script type="module" src="/_nuxt/Users/baileytownsend/WebstormProjects/my-blog/node_modules/nuxt/dist/app/entry.js" crossorigin></script>

</head>
<body><div id="__nuxt"
...
```
Some of the content in the meta tags may look familiar! That is because this is an example of this page's HTML as the browser sees it with no JS executed. So now I can have this when I share my articles!

![meta_tag](/article-assets/1/meta_tags_example.png){class="w-full object-cover rounded-lg"}

So now thanks to nuxt I can still use Vue, have server side rendering, and I have yet to really use Nuxt for anything besides proof of concept!

# 2
So last is number 2. I knew I wanted to use markdown since it efficiently renders HTML on almost anything. I thought I would be writing something more by hand. Nope, Nuxt already had me covered with [Nuxt Content](https://content.nuxt.com/), and is it the Cadillac of rendering out markdown. So, everything you are reading right now is a markdown file! In fact, can view it [here](https://github.com/fatfingers23/my-blog/blob/main/content/articles/new-blog.md). I did not expect to get so many cool features from one thing. To list a few.

The original version written on my phone used a JSON file for things like Title, Description, cover image, etc. My idea was to use that and a markdown file to make the articles. Well, Nuxt Content uses this cool thing called Front-matter. It allows me to put meta data like things at the top and not even need a JSON file to accompany my mark down

```markdown
---
title: 'I (mostly) wrote a website to host blog while sitting at the bar'
description: 'I think I have a lot to say. So finally wrote a website to host my blog, on my phone at the bar...'
date: "2024-08-12T23:37:00Z"
image:
    src: "/article-assets/1/cover.jpeg"
    alt: "A photo of a bar with a beer and a phone on the table"
head:
    meta:
      - name: "keywords"
        content: "blog, bar, replit, coding, article"
      - name: 'author'
        content: 'Bailey Townsend'
---


# First a bit about me 
Hey 👋, my name is Bailey,
```

I can also do neat things like writing and rendering a vue component. See those two iPhone screenshots at the top of the article? I wanted those images to render side by side on desktop but on top of each other on mobile. So I wrote this vue component

```vue
<template>
  <div class="flex flex-col md:flex-row md:space-x-4">
    <div class="w-full md:w-1/2">
      <ContentSlot
        :use="$slots.one"
        unwrap="img"
      />

    </div>
    <div class="w-full md:w-1/2">
      <ContentSlot
        :use="$slots.two"
        unwrap="img"
      />
    </div>
  </div>

</template>
```

Then in my markdown file, I can use it like this

```markdown
::two-pictures-side-by-side
#one
![code_example](/article-assets/1/code.png){class="w-full object-cover rounded-lg"}
#two
![code_example](/article-assets/1/layout.png){class="w-full object-cover rounded-lg "}
::
```

It's all pretty handy! I could write much more on Nuxt Content, but it is the Cadillac of markdown CMS. It came with more bells and whistles than I could imagine, and I am very grateful to have found it. Check out the [repo](https://github.com/fatfingers23/my-blog) to see how this was built. Reading through the code, you will probably notice a lot of mistakes or things that probably should have been done differently (Please do not count how many eslint packages there are. It takes me 2 hours for every new project to set that up). But I have had a lot of fun with it and hopefully built a nice little system to write more.

Again, thank you for sticking around if you have made it this far. I am not sure how many of these I will write, but I have really enjoyed writing this one, and it has given me an outlet to write about some of my ideas and understanding of the tools I use daily. Feel free to reach out to me, and we can nerd out about some of this stuff, or you can even show me once and for all how the hell you set eslint. Cause it is all just a guess till it works.


