---
title: 'Getting started with Rust 🦀 on the 10¢ microcontroller'
description: 'Learn how to get started with writing Rust on the ch32v003'
date: "2025-01-20T23:00:00Z"
draft: true
image:
    src: "/article-assets/6/cover.jpg"
    alt: "A bread bored with a small little oled that says Rust on the 10 cent micocontroller"
head:
    meta:
      - name: "twitter:card"
        content: "summary"
      - name: "twitter:image"
        content: "https://baileytownsend.dev/article-assets/6/cover.jpg"
      - name: "keywords"    
        content: "Rust,embedded development, ch32, 10 cents, ch32v003"
      - name: 'author'
        content: 'Bailey Townsend'
---

You may have heard of the "10¢" ch32v003 making waves in the past year. 
I bought a dev board recently when I found out all you need is the MCU, a couple of capacitors, and you have a cheap device you can write Rust for!
[This article](https://www.instructables.com/DIY-CH32V003-Development-Board-10-Cent-Devoard-for/) is what really kicked it off for me. 
When I saw you could easily make your own dev board and hand soldered the MCU pretty easily I was hooked. In this article I want to give you everything you need to know to get started
with writing Rust on these little devices.

# Table of Contents
* [About the chip](#about-the-chip)
* [Requirements for Rust 🦀](#requirements-for-rust-)
  * [Dev Board](#dev-board)
  * [Debugger Module(WCH-LinkE)](#debugger-modulewch-linke)
  * [Software setup](#software-setup)
* [Setting up the WCH-LinkE](#setting-up-the-wch-linke)
* [Getting started with the ch32-hal](#getting-started-with-ch32-hal)
* [Unbricking your chip](#unbricking-your-chip)
* [The good, The Okay, and The 2kb's of SRAM](#the-good-the-okay-and-the-2kbs-of-sram)
* [Closing notes](#closing-notes)
# About the chip
The ch32v003 is probably the smallest device I've ever written code for, both resource and physical size. Coming in with 16kb of flash, 2kb of ram, and a RISC-V clock of 48Mhz. But don't let
the lower specs fool you, this thing can do a lot for it's low price. With it, you have access to UART, I2C, SPI, ADC pins, and [more](https://www.wch-ic.com/products/CH32V003.html)
![Infographic of the ch32v003](./article-assets/6/ch32v003-specs.png)
Although I keep labeling it "The 10 cent microcontroller", I've yet to find any that cheap unless you buy thousands of units.
At this point I think it's just what it's known for. Realistically you are looking at 20-30 cents depending on the package. 
This chip comes in 4 different packages. TSSOP20, QFN20, SOP16, and SOP8. All of them but the QFN20 look to be easily enough to hand solder with some skill.
![img.png](./article-assets/6/ch32v003-packages.png)

# Requirements for Rust 🦀
Before you start writing Rust on this little device you do need to buy a few different things as well as setup. Before you click
checkout make sure to read both [Dev board](#dev-board) and [Debugger Module(WCH-LinkE)](#debugger-modulewch-linke) because there are a few gotchas to watch for.

## Dev board
Before I dived into making my own boards with this chip I wanted to order some dev boards to try out the [ch32-hal](https://github.com/ch32-rs/ch32-hal).
I bought this [dev board from AliExpress ($2.50)](https://www.aliexpress.us/item/3256804778040328.html?spm=a2g0o.order_list.order_list_main.92.5d9e1802ATri3e&gatewayAdapt=glo2usa). So far it's been good! Not used to the double headers for breadboards, but just been plugging jumper wires directly into the headers.
![img](https://ae-pic-a1.aliexpress-media.com/kf/S0f36267cac61448d8426f48086c7bc8d3.jpg_220x220q75.jpg_.avif)
I also have the [nanoCh32v003 Dev board($1.50)](https://www.tindie.com/products/johnnywu/nanoch32v003-development-board/) on the way. I'm thinking I am 
going to like this one a bit better cause of the single row of headers.
![img](https://cdn.tindiemedia.com/images/resize/NJWt8V3WQfEXdHN6Y67DRc1gzMQ=/p/fit-in/685x456/filters:fill(fff)/i/143933/products/2023-02-16T07%3A10%3A03.005Z-%E4%B8%BB%E5%9B%BE4.jpg?1676503543)

Both come with:
* the optional 24Mhz crystal oscillator
* USB-C Powered (or can be powered by the WCH-Link)
* Physical reset button
* On board LED
* All pins exposed on the breakout including the single wire debug pin

Also, nothing is stopping you from just [building your own](https://www.instructables.com/DIY-CH32V003-Development-Board-10-Cent-Devoard-for/).

## Debugger Module(WCH-LinkE)
This chip does require a probe to program it. The ch32v003 does not support USB even though both of the dev boards I listed have USB-C ports. There has been some
cool projects to add [USB support though](https://www.youtube.com/watch?v=j-QazXghkLY). For this we are going to use the WCH-LinkE. 

![Wch linl](https://img.wch.cn/20230403/0d0e0935-df8f-46e0-825d-03883fa2e6ff.png)

Make sure to note the E when buying these, if you buy a non E version you will need
to update the firmware via the [WCH-LinkUtility](https://www.wch.cn/downloads/wch-linkutility_zip.html). Which it still works, just needs a Windows pc to run the update utility to the latest release.
Which you can do by following the directions in [6.2 of the user manual](https://www.wch-ic.com/downloads/WCH-LinkUserManual_PDF.html).
![An image showing chapter 6.2 of the user manual](./article-assets/6/wchlink-update.png)

If you do pick up the[nanoch32v003 from tindie](https://www.tindie.com/products/johnnywu/nanoch32v003-development-board/) there is an option to get both
for $6.50.

# Software setup
As with most of my posts, we are not going to be writing anything groundbreaking. I just want to get you started and give you the tools to make awesome projects. 
- Install rust using https://www.rust-lang.org/tools/install
- [wlink](https://github.com/ch32-rs/wlink) a rust CLI for interacting with the WCH-LinkE.
- [cargo-generate](https://github.com/ch32-rs/ch32-hal-template) for using the [ch32-hal-template](https://github.com/ch32-rs/ch32-hal-template)

# Setting up the WCH-LinkE
The ch32v003 has 1-wire serial debug interface that you can either use [wlink](https://github.com/ch32-rs/wlink) or
[probe-rs](https://probe.rs/targets/master/CH32V003) to flash. Thanks to this it is super easy to wire. So far I have seen the debug pin labeled as 
`DIO` on development boards, but the actual pin on the chip is named `PD1` or just `D1`.
With just the single serial debug pin connected you can flash, debug log, and reset. There's even a `println!` macro for writing logs when using wlink.

Some kits come with the ribbon cable that plugs into 2 rows of 5 pin headers. To connect this you just make sure you line them up.
5v to 5v, 3v3 to 3v3, etc, etc. With this we are also powering the dev board from the WCH-LinkE.

::two-pictures-side-by-side
#one
![The dev board connected to the WCH-LinkE via the ribbon cable](./article-assets/6/ribbon_cable_connected.webp)
#two
![The dev board, WCH-LinkE, and ribbon cable laid out ](./article-assets/6/ribbon_cable_laidout.webp)
::

The pins that are needed
- 3v3 to 3v3 for power
- GND to GND for ground
- `SWDIO/TMS` on the WCH-LinkE is for the single wire serial debug. It connects to the pin labeled `DIO`, `PD1`, or `D1`.

You can also use some jumper wires to connect them. For what we are using it for you just need to make sure `3v3`, `gnd`, and `SWDIO/TMS` is connected.


![The dev board connected to the WCH-LinkE via jumper wires](./article-assets/6/jumper_wres_swd.webp)

| Color  | WCH-LinkE    | Dev board            |
|--------|--------------|----------------------|
| YELLOW | `SDWDIO/TMS` | `DIO`,`PD1`, or `D1` |
| RED    | `3v3`        | `3v`                 |
| BLACK  | `GND`        | `GND`                |


# Getting started with ch32-hal
I have been using the [ch32-hal](https://github.com/ch32-rs/ch32-hal) and been loving it so far. With it, you have embassy support, 
embedded-hal traits, and just about anything else you can need. They have done a great job with this crate. 

**Before starting make sure you have set up everything following [Software Setup](#software-setup).**

For starting a new project I just use their [template](https://github.com/ch32-rs/ch32-hal-template) with [cargo-generate](https://github.com/cargo-generate/cargo-generate).
The command is `cargo generate ch32-rs/ch32-hal-template`. During setup it asks for;
   * `Project Name`
   * `Enable embassy (async) support` - recommended to set true for embassy support
   * `Which MCU family to target` - ch32v003
   * `Which ch32v003 variant to use` - Depends, the dev board I have is ch32v003F4P6. Can mostly just count the pins to check, is important to get this right.
     * `ch32v003J4M6` - The SOP8 8pin variant
     * `ch32v003A4M6` - The SOP16 16pin variant 
     * `ch32v003F4P6` - The TSSOP20 20pin variant with 20pins that have "legs"
     * `ch32v003F4U6` - The QFN20 20pin variant, square with no "legs", just solder pads.

With those options you have a start project to blink a LED! Since every board is a little different the pin that has an LED varies. I used a [continuity test with my multimeter to find mine.](https://www.youtube.com/watch?v=5G622WDZaHg)
Just __DO NOT__ use pins labeled `PD1` or `D1`. [More on that here](#unbricking-your-chip)
* For the AliExpress board I have it was `PD4`
* For the `nanoCH32V003` it looks to be `PD6` according to the [schematic](https://github.com/wuxx/nanoCH32V003/blob/master/hardware/nanoCH32V003.pdf)

And that's it! With this you can start your ch32v003 adventure and make great projects. Can also find [examples here](https://github.com/ch32-rs/ch32-hal/tree/main/examples/ch32v003) for things like [SPI](https://github.com/ch32-rs/ch32-hal/blob/main/examples/ch32v003/src/bin/spi-lcd-st7735-cube.rs), [ADC](https://github.com/ch32-rs/ch32-hal/blob/main/examples/ch32v003/src/bin/adc.rs), [UART](https://github.com/ch32-rs/ch32-hal/blob/main/examples/ch32v003/src/bin/uart_tx.rs), and more.

**If you want to know more about the process of bringing Rust to the ch32v003, you should check out this great series of blog posts. [Rust on the CH32V003](https://noxim.xyz/blog/rust-ch32v003/).**


# "Unbricking" your chip

Talk about how I accidentally "bricked" it with setting PD1 as a gpio.
Share this video as thanks https://www.youtube.com/watch?v=9UHotTF5jvg 
and explain how to in the WCH Utility


# The good, The Okay, and The 2kb's of SRAM

talk about how i've enjoyed it and issues with SPI not working and how i dont think framebuffer embddedd graphic implementations will not work
TLDR great device, does a lot, but don't forget what it is

# Closing Notes


