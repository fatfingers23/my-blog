---
title: 'Getting started with Rust 🦀 on the 10¢ microcontroller'
description: 'Learn how to get started with writing Rust on the ch32v003'
date: "2025-01-22T03:30:00Z"
draft: false
image:
    src: "/article-assets/6/cover.jpg"
    alt: "A bread bored with a small little OLED that says Rust on the 10 cent micocontroller"
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
When I saw you could easily make your own dev board and hand soldered the MCU pretty easily. I was hooked. In this article I want to give you everything you need to know to get started
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
  * [The Good](#the-good)
  * [The Okay](#the-okay)
  * [The 2kb's of SRAM](#the-2kbs-of-sram)
    * [The E-Ink display](#the-e-ink-display)
    * [The ssd1306 OLED display](#the-ssd1306-oled-display)
    * [println!("{}", "Too much data)](#println-too-much-data)
* [Closing notes](#closing-notes)


# About the chip
The ch32v003 is probably the smallest device I've ever written code for, both resource and physical size. Coming in with 16kb of flash, 2kb of ram, and a RISC-V core clock of 48Mhz. But don't let
the lower specs fool you, this thing can do a lot for it's low price. With it, you have access to UART, I2C, SPI, ADC pins, and [more](https://www.wch-ic.com/products/CH32V003.html)
![Infographic of the ch32v003](./article-assets/6/ch32v003-specs.png)
Although I keep labeling it "The 10 cent microcontroller", I've yet to find any that cheap unless you buy thousands of units.
At this point I think it's just what it's known for. Realistically you are looking at 20-30 cents depending on the package. 
This chip comes in 4 different packages. TSSOP20, QFN20, SOP16, and SOP8. All of them but the QFN20 look to be easily enough to hand solder with some skill.
![img.png](./article-assets/6/ch32v003-packages.png)

# Requirements for Rust 🦀
You do need to buy a few different things and set up your dev environment before you can start writing Rust on this microcontroller. But before you click the 
checkout button make sure to read both [Dev board](#dev-board) and [Debugger Module(WCH-LinkE)](#debugger-modulewch-linke), there are a few gotchas to watch for.

## Dev board
Before I dive into making my own boards with this chip I wanted to order some dev boards to try out the [ch32-hal](https://github.com/ch32-rs/ch32-hal).
I bought this [dev board from AliExpress ($2.50)](https://www.aliexpress.us/item/3256804778040328.html?spm=a2g0o.order_list.order_list_main.92.5d9e1802ATri3e&gatewayAdapt=glo2usa). So far it's been good! Not used to the double headers for breadboards, but I have been plugging jumper wires directly into the headers.
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
cool projects to add [USB support though](https://www.youtube.com/watch?v=j-QazXghkLY) for compatible boards. But we need a probe,we are going to use the WCH-LinkE. 

![Wch linl](https://img.wch.cn/20230403/0d0e0935-df8f-46e0-825d-03883fa2e6ff.png)

Make sure to note the E when buying these, if you buy a non E version you will need
to update the firmware via the [WCH-LinkUtility](https://www.wch.cn/downloads/wch-linkutility_zip.html). Which it still works, just needs a Windows pc to run the update utility to the latest release.
Which you can do by following the directions in [6.2 of the user manual](https://www.wch-ic.com/downloads/WCH-LinkUserManual_PDF.html).
![An image showing chapter 6.2 of the user manual](./article-assets/6/wchlink-update.png)

If you do pick up the [nanoch32v003 from tindie](https://www.tindie.com/products/johnnywu/nanoch32v003-development-board/) there is an option to get both the dev board and a WCHLinkE
for $6.50.

# Software setup
As with most of my posts, we are not going to be writing anything groundbreaking. I just want to get you started and give you the tools to make your own awesome projects. 
- Install rust using https://www.rust-lang.org/tools/install
- [wlink](https://github.com/ch32-rs/wlink), a rust CLI for interacting with the WCH-LinkE.
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
embedded-hal traits, and just about anything else you could need. They have done a great job with this crate. 

**Before starting make sure you have set up everything following [Software Setup](#software-setup).**

For starting a new project I just use their [template](https://github.com/ch32-rs/ch32-hal-template) with [cargo-generate](https://github.com/cargo-generate/cargo-generate).
The command is `cargo generate ch32-rs/ch32-hal-template`. During setup it asks for
   * `Project Name`
   * `Enable embassy (async) support` - recommended to set true for embassy support
   * `Which MCU family to target` - ch32v003
   * `Which ch32v003 variant to use` - Depends, the dev board I have is ch32v003F4P6. Can mostly just count the pins to check, is important to get this right.
     * `ch32v003J4M6` - The SOP8 8pin variant
     * `ch32v003A4M6` - The SOP16 16pin variant 
     * `ch32v003F4P6` - The TSSOP20 20pin variant with 20pins that have "legs"
     * `ch32v003F4U6` - The QFN20 20pin variant, square with no "legs", just solder pads.

With those options you have a start project to blink a LED! Since every board is a little different the pin the LED is on varies. I used a [continuity test with my multimeter to find mine.](https://www.youtube.com/watch?v=5G622WDZaHg)
* For the AliExpress board I have it was `PD4`
* For the `nanoCH32V003` it looks to be `PD6` according to the [schematic](https://github.com/wuxx/nanoCH32V003/blob/master/hardware/nanoCH32V003.pdf)

Then when you run make sure to use `cargo run --release` or your build will fail.

And that's it! With this you can start your ch32v003 adventure and make great projects. Can also find [examples here](https://github.com/ch32-rs/ch32-hal/tree/main/examples/ch32v003) for things like [SPI](https://github.com/ch32-rs/ch32-hal/blob/main/examples/ch32v003/src/bin/spi-lcd-st7735-cube.rs), [ADC](https://github.com/ch32-rs/ch32-hal/blob/main/examples/ch32v003/src/bin/adc.rs), [UART](https://github.com/ch32-rs/ch32-hal/blob/main/examples/ch32v003/src/bin/uart_tx.rs), and more.
If you are not familiar with embassy and like a bit more help or details then I recommend checking out [this great video by The Rusty Bits on getting started with Embassy](https://www.youtube.com/watch?v=pDd5mXBF4tY)

**If you want to know more about the process of bringing Rust to the ch32v003, you should check out this great series of blog posts. [Rust on the CH32V003](https://noxim.xyz/blog/rust-ch32v003/).**

# "Unbricking" your chip

I'm not sure on how or why it happened. Originally I was assuming that I had overridden the function of the debug pin, now I think it may be an early panic.
When I was trying to find the Pin for my LED before using a multimeter.
I had tried `PA1`, well with that I found that it would panic and give me an era anytime I tried to flash or erase the device. Pretty much just "bricking" it from my normal development workflow.

Well thanks to this [video](https://www.youtube.com/watch?v=9UHotTF5jvg) I was able to "unbrick" the chip and get back to coding! 
You can also use the WCH Link Utility for this. The option you are looking for is of similar text `Clear all code flash - Power off`.

As I was writing this article and testing I also found that you can erase and get back with wlink using
`wlink erase --method power-off --chip CH32V003`, after that you are good to `cargo run --release` and get back to coding! 


# The good, The Okay, and The 2kb's of SRAM

So far I have had a lot of fun and been very impressed by this little chip. I've mostly just been doing some proof of concepts like this DVD loading screen
on a 128x64 ssd1306 OLED screen. But in the future I have plans for a devboard, E-ink badge, and possibly a cheap 3d printed robot. 
![An oled screen showing the text DVD bouncing from corner to corner](./article-assets/6/dvd_logo.gif)

Before you read the pros and cons, remember. We are talking about a 48Mhz MCU with 2kb of ram and a 16kb flash that is running Rust.

## The Good
* Cheap. Even the dev boards are cheap. You do need to buy the WCH-LinkE, but even then I picked mine up for [$5.73 from the official WCH AliExress store](https://www.aliexpress.us/item/3256804695267285.html?spm=a2g0o.order_list.order_list_main.104.21ef1802b7LuIM&gatewayAdapt=glo2usa) and you only need one of those.
* With the embedded-hal traits and embassy this thing has been very familiar to work with. Worked great with the [ssd1306](https://crates.io/crates/ssd1306) crate I used to put the display into terminal mode.
* Has the `println!` for easy logging during debugging.
* Do not have to press any physical buttons, or plug in, unplug the device while flashing code.
* Has all the major interfaces you would expect in a microcontroller. SPI, I2C, UART, ADC, ability to do PWM, and so on.
* A small cheap chip that is easy to work with when designing your own PCB. You just need a couple of capacitors to get going.

## The Okay
I really have not found anything "bad" with the chip itself or the hal. It's all been great, you just have to remember this chip is coined as the "10 cent microcontroller".
* I have not found a way to write panic messages out yet. I did implement my own [panic_handler](https://doc.rust-lang.org/nomicon/panic-handler.html#panic_handler), but cannot log out the message. Just the error `will not fit in region 'FLASH'`. Which I have ran into a few times in other cases trying to print. I think it is just down to a resource limitation.

That's pretty much it. I've loved the hal and the chip so far. I think everyone who has worked on it has done a great job.

## The 2kb's of sram
This chip is a powerhouse...for what it is. The only limitations or issue's I've hit so far are that I just have to think a bit smaller. I wrote some quick notes on using it so far and the challenges I faced.

### The E-Ink display
While testing to write this article I had tried to use an E-Ink display with SPI. I ran into a few issues. First I could not make a shared BUS in [the usual way I am familiar with](https://github.com/embassy-rs/embassy/blob/main/examples/rp/src/bin/shared_bus.rs). When attempting to pull in some of the dependencies like the [embedded-hal-bus](https://crates.io/crates/embedded-hal-bus) I ran into `compare_exchange requires atomic CAS but not available on this target by default`. 
Which is a type of error that isn't totally unexpected when using something that is cutting edge in the embedded rust ecosystem.
In the end I ended up forking the ch32-hal and implementing the `SpiDevice` trait which was supported on the crate I was using. That got the project ot build, but still no luck with the display. I decided to move on to a smaller in scope test.

### The ssd1306 OLED display
I decided to start simpler and use the ssd1306 since it is I2C. Just 2 wires besides GND and POWER. 
With that I was still having issues when trying to use the embedded-graphics feature. I did find it had a terminal-mode which allowed just writing text and that worked!
During this time I started to speculate that using a framebuffer embedded-graphics implementation may be a bit too much for this chip. If you are not familiar with framebuffers in Rust with embedded-graphics,
the idea is you have a variable in memory that holds an RGB value for every pixel of the screen. Where in Text Mode it is just sending small bits of data a time to the displays to be stored on it's SRAM.
With the limited resources of the chip I just don't think it has the ability to hold something as large as a display framebuffer in memory. I did try to write my own implementation to just directly write to the display instead of to a framebuffer then flush to no success. In the end I decided this display did not really fit into the projects I have in mind for this microcontroller,
and I felt like I had enough to write this article.


### println!("{}", "Too much data")
I talked a bit in [The Okay](#the-okay) about running into errors with trying to println panic messages. I have found you have to be careful with
what you are printing, because I think you can pretty quickly build a binary that will be too large for the flash of the device.

Like I said before. I feel like any of the issues I've had with this chip is due to the fact that it's just smaller than anything I've written for before.
So as you use it. Just keep in mind what this device truly is, a 10 cent microcontroller.

# Closing Notes

All in all the ch32v003 is a fun little microcontroller. I don't think this will replace a lot of my use cases where I use the RP2040. 
But with the price and ease to add it to a PCB, I think this is a great little chip for your projects. But mostly
![Marge Simpson holding a potato saying "I just think they're neat"](https://media1.tenor.com/m/eHIRFWRKeQoAAAAd/marge-i-just-think-theyre-neat.gif)

There's just something really cool about writing code for something smaller than a penny and making your own dev board by hand. 

I hope you have enjoyed this article and maybe leaned something new. Thanks for reading! 
