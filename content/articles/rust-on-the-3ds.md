---
title: 'Rust 🦀 on the 3DS'
description: "Learn how to start building 3DS application's with Rust"
date: "2025-03-28T00:00:00Z"
draft: true
image:
    src: "/article-assets/8/cover.webp"
    alt: ""
head:
    meta:
      - name: "twitter:card"
        content: "summary"
      - name: "twitter:image"
        content: "https://baileytownsend.dev/article-assets/8/cover.webp"
      - name: "keywords"    
        content: "rust,3ds,citro,ctru-rs,devkitPro,libctru"
      - name: 'author'
        content: 'Bailey Townsend'
---

I Recently bought a 3DS, so of course I had to see if there was a way to write Rust for it, and thanks to [ctru-rs](https://github.com/rust3ds), you can. The 3DS has a large library of games to play. 
It has the whole 3DS library, while also being able to natively run DS, GBA, and Game Boy titles making it in my opinion making it the best daily handheld gaming device.

# Table of Contents
* [How does it work?](#how-does-it-work)
* Setup
  * Installing and setting up the devkitARM toolchain
  * Where do I even run this?
    * Emulators
    * Real hardware
* 2d Graphics
* Closing


## How does it work?
Thanks to the work done by the [@rust3ds](https://github.com/rust3ds) organization you can write rust for the [armv6k-nintendo-3ds](https://doc.rust-lang.org/beta/rustc/platform-support/armv6k-nintendo-3ds.html#armv6k-nintendo-3ds) target.
A lot of the apis for it are implemented by linking to a libc(devkitARM) library that is maintained by [devkitPro](https://devkitpro.org/wiki/Getting_Started). So a lot of what the ctru-rs/rust3ds project does is gives you, the end user, safe wrappers around the C libabries to make software for the 3DS in rust.

A lot of terms and organizations so I wanted to make a list to break it down. I am going to start with the C libraries. 
- [devkitPro](https://devkitpro.org/wiki/Getting_Started) - The organisation that provides the C libraries for the 3DS, along with other gaming consoles. 
- [libctru](https://github.com/devkitPro/libctru) -  C library for writing code for the 3DS
- [citro3d](https://github.com/devkitPro/citro3d) - C library providing easy apis for displaying 3D graphics
- [citro2d](https://github.com/devkitPro/citro2d) - C library build on top of citro3d to display 2d graphics. Text, sprites, and 2d shapes.

Then for the rust sie of things.
- [rust3ds](https://github.com/rust3ds) - The organisation that maintains support for the `armv6k-nintendo-3ds` target and safe rust bindings to the devkitPro C libraries.



# Notes
* Also write how I use bacon ls
* Talk about how you can use Cargo 3ds for a new project or make a template that is the 2d shapes that calls to the citr3d fork I have
* looks like 3ds cargo command works. recommend using `cargo install --locked --git https://github.com/rust3ds/cargo-3ds`
* Clean up repo with a readme and make a PR as a draft?
* Talk about how yeah it's not truly truly running rust 100%, but the goal is to have safe apis so YOU can write rust apps and games
* Show an example of my env variables. What was my issue and dont need a config.toml