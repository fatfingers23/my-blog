---
title: 'Getting started with Poststation on the RP2350'
description: 'Use Rust 🦀 to build a small little display to show your computer resource usage'
date: "2025-02-14T01:08:00Z"
draft: true
image:
    src: "/article-assets/7/cover.webp"
    alt: "Picture of 3D printed case for a SSD1306 OLED with the screen in it showing the Poststation logo in blue. Beside it is a Pico 2 "
head:
    meta:
      - name: "twitter:card"
        content: "summary"
      - name: "twitter:image"
        content: "https://baileytownsend.dev/article-assets/7/cover.webp"
      - name: "keywords"    
        content: "Rust,Pico,RP2350,embassy-rs,Postcard,Poststation"
      - name: 'author'
        content: 'Bailey Townsend'
---

Ever wish getting or sending data to an embedded device was as easy as sending a web request? 
Well now you can with [Poststation](https://poststation.rs/)! Just like a post office handles communications, 
Poststation handles the communication between a host device running a full OS and an embedded device running Rust.
Poststation lets you focus on building the project you have in mind instead of building the tools to build teh project.


In this blog post we are going to explore Poststation by building a Rust program that runs on your computer that uses Poststation to send your computer usage
to a Pico 2 displaying the usage on SSD1306.

![Picture of the project running and showing the computer resource usage on the OLED display](./article-assets/7/project_running.webp)


# Table of Contents
 * [Postcard, Postcard-rpc, and Poststation](#postcard-postcard-rpc-and-poststation)



# Postcard, Postcard-rpc, and Poststation
Before we get started I wanted to break down some of the different components that make up the Postcard 

### [Postcard](https://docs.rs/Postcard/latest/Postcard/)
From the projects [README](https://github.com/jamesmunns/Postcard)
> Postcard is a #![no_std] focused serializer and deserializer for Serde.

Postcard is the underlying data structure. Think of it kind of like JSON or XML, but optimized to be easy to serialize and deserialize on embedded devices where resources can be limited.
If you're curious about more of how it works then I recommend checking out [The Postcard Wire Specification](https://postcard.jamesmunns.com/intro). 
But for this blog post to keep it simple just know that this is the specification of how the data that is sent between the microcontroller and our Host application.

## Postcard-rpc
From the projects [README](https://github.com/jamesmunns/postcard-rpc)
> A host (PC) and client (MCU) library for handling RPC-style request-response types.

To keep to a web analogy where Postcard is JSON or XML, Postcard-rpc is the web server, as well has the web framework.
Postcard-rpc gives you everything you need to set up communications between the Host and the microcontroller. Like handling the transporting of the data via USB, TCP, I2C, UART, etc.
As well as giving you the framework to build handlers on both the microcontroller and the host to receive and send requests that are serialized with Postcard.
The graphic on [Postcard-rpc's doc.rs page](https://docs.rs/postcard-rpc/latest/postcard_rpc/) does a great job of showing how it all works together.

## Poststation
Poststation takes care of the host side of Postcard-rpc and just lets you focus on just writing the logic you need for your project.
No need to worry about how to send data back and forth, how to handle multiple devices, connects/disconnect, It all Just Works™.

<<Insert pic you tae of the base screen of poststation>>

