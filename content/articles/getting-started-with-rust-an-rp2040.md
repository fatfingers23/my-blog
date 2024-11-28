---
title: 'Rust 🦀 on the RP2040'
description: 'Get stated with writing rust on the Raspberry Pico'
date: "2024-11-28T05:50:00Z"
draft: false
image:
    src: "https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:rnpkyqnmsw4ipey6eotbdnnf/bafkreidbs35u2h3mhmlrj2qx6big3mzqplaci74mhy57l5tmycevvrrda4@jpeg"
    alt: ""
head:
    meta:
      - name: "twitter:card"
        content: "summary"
      - name: "twitter:image"
        content: "https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:rnpkyqnmsw4ipey6eotbdnnf/bafkreidbs35u2h3mhmlrj2qx6big3mzqplaci74mhy57l5tmycevvrrda4@jpeg"
      - name: "keywords"    
        content: "rp2040, Raspberry Pi, Raspberry Pico, Rust, Embassy, Pico, embedded software, embedded development"
      - name: 'author'
        content: 'Bailey Townsend'
---

As previously seen on [Bluesky 🦋](https://bsky.app/profile/baileytownsend.dev/post/3lbq7o74fcc2d)

Welcome to my mega 🧵 on getting started with Rust on the RP2040! This thread aims to get you started with writing Rust on the Raspberry Pi Pico. The actual end result will just be a blinking on-board LED. It’s up to YOU to take this foundation and make awesome projects from it.


This is a “There are no dumb questions” thread. Got a question on something? Reply to the [post on Bluesky](https://bsky.app/profile/baileytownsend.dev/post/3lbq7o74fcc2d)! And I will do my best to answer it and help you get going. From now on, when I say “Pico,” I am referring to either the Pico 1 with or without wireless. This can be done with either.
It is recommended to have some familiarity of Rust and this guide is geared towards that, but this guide should be helpful enough to get you from zero to a pico running rust.


### Hard Requirements:
- A computer (any OS, but I can only help with Mac or Linux)
- Rust installed
- rustup target thumbv6m-none-eabi
- 1 Pico and the Debug probe

OR

- 2 Picos (Can be Pico 1's or 2's, or even W's)

### Nice to haves:
- Breadboard
- Jumper Wires

# Table of Contents
- [Software setup](#software-setup)
- [Project setup](#project-setup)
- [What to buy](#what-to-buy)
- [Debug Probe Setup](#debug-probe-setup)
  - [Setup with Raspberry Debug Probe](#raspberry-pi-debug-probe-setup)
  - [Setup with a second pico as the debug probe](#using-a-second-pico-as-a-debug-probe)
- [Flashing the Pico](#flashing-the-pico)
- [Congratulations 🎉!](#congratulations-)

# Software setup

- Install rust using https://www.rust-lang.org/tools/install
- Once installed, run `rustup target add thumbv6m-none-eabi` to add the target for the RP2040
- Install Probe-rs following https://probe.rs/. Make sure to follow the Installation section in [Getting Started](https://probe.rs/docs/getting-started/installation/). * Linux users will need to setup [udev rules](https://probe.rs/docs/getting-started/probe-setup/#linux%3A-udev-rules)

# Project setup.

We will be using the [Embassy](https://github.com/embassy-rs/embassy) on this 🧵, and for your convenience, I have a template you can use to get started! Clone this [repo](https://github.com/fatfingers23/raspberry-pico-w-embassy-template
).

- If you’re using the Pico(non W) use the [branch pico_non_w](https://github.com/fatfingers23/raspberry-pico-w-embassy-template/tree/pico_non_w)
- If you’re using the Pico W use the [branch main](https://github.com/fatfingers23/raspberry-pico-w-embassy-template)
  (They have different ways to toggle the LED)

# What to buy
This step is completely optional. But If you do not have a pico yet, then I HIGHLY recommend picking up a Raspberry Pi Pico Debug probe and a Pico W with the debug port from [@pimoroni](https://bsky.app/profile/did:plc:5hjd7glsnvwxf6wiouvtq5wt), both listed below. This will make everything so much easier

[Raspberry Pi Debug Probe](https://shop.pimoroni.com/products/raspberry-pi-debug-probe?variant=40511574999123)
![Picture of the debug probe](https://shop.pimoroni.com/cdn/shop/products/DEBUG_HERO_CASE_768x768_crop_center.jpg?v=1676880388)

[Raspberry Pi Pico W W/ headers and debug port](https://shop.pimoroni.com/products/raspberry-pi-pico-w?variant=40059369652307)
![Raspberry Pi Pico W W/ headers and debug port](https://shop.pimoroni.com/cdn/shop/products/pico-wh-2_768x768_crop_center.jpg?v=1694598294)

# Debug probe setup

In this 🧵 we are using a debug probe to flash the Pico. You can manually move a UF2 over every time, but I want to set you up with the best way to write Rust on the RP2040.

The benefit of us doing it this way is using a Debug probe you get.
- The ability to flash a new firmware without touching the pico
- Logging using defmt
- Breakpoints
- Did I mention you don't have to hit BOOTSEL and re plug the pico everytime?

I recommend buying the [Raspberry Pi Debug Probe](https://www.raspberrypi.com/products/debug-probe/) , but you can also use a spare Pico. This guide will cover both. 



# Raspberry Pi Debug Probe setup

If your target Pico has a three-pin JST-SH port, you can connect the JST-SH cable from the port on the right of the probe(Marked D) to the Pico's Debug port
![Close-up of a Raspberry Pi Pico connected to a breadboard, wired to a Raspberry Pi Debug Probe with a glowing red LED, indicating active status. The setup is placed on a wooden desk, showing a simple hardware debugging configuration.](https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:rnpkyqnmsw4ipey6eotbdnnf/bafkreiclzhngiigr7rjcmgquqez4di6gqsuor27m5xr4vfsnnfae3ahizu@jpeg){class="w-full object-cover rounded-lg"}


If your pico does not have the three-pin JST-SH port you will need to solder a 3 pin header to the debug port of your pico
![Raspberry Pi Pico W connected to a breadboard with jumper wires attached, wired to a Raspberry Pi Debug Probe emitting red and yellow LEDs. The setup is displayed on a wooden desk, showcasing an active debugging or prototyping configuration.](https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:rnpkyqnmsw4ipey6eotbdnnf/bafkreich3au7rf3gajf7rgjronn5ob343mnvvu3u64xc4ja5zham2ytwbi@jpeg){class="w-full object-cover rounded-lg "}


If that was as clear as mud, You can check out the [Raspberry Pi Debug Probe Documentation page](https://www.raspberrypi.com/documentation/microcontrollers/debug-probe.html) for more info on wiring. Refer to the previous image if you have to use the jumper wires. From left to right; Orange (TX/SC), Black (GND), Yellow(RX/SD)

# Using a second pico as a debug probe
You can use a spare Pico as the debug probe (You can also use a Pico 2 for this step). [Raspberry Pi has excellent instructions](https://www.raspberrypi.com/documentation/microcontrollers/pico-series.html#debugging-using-another-pico-series-device) on setting up the software on your Pico being as a debug probe. It boils down to downloading the uf2 listed and flashing it to your device.


Using a pico as the debug probe can look a bit more daunting to set up. But it’s much the same as using the Debug Probe.  Pico A is the Probe B is the target

I power the target from the probe. In the picture, I give power/GND from A to B on the power rails in the breadboard. VSYS → VSYS, GND → GND

![2 picos on a breadboard configured with the top being a probe and bottom being the target](https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:rnpkyqnmsw4ipey6eotbdnnf/bafkreidutlbdu3gp4kxvgf4o3f277z53utmmqdfot6ov7rjojw6bhgctru@jpeg){class="w-full object-cover rounded-lg "}
Here's a picture of the pins if you are not familiar with the pico 
![Pinout diagram of the Raspberry Pi Pico board. Each pin is labeled with its function, including power, ground, GPIO, UART, SPI, I2C, ADC, and debugging pins. A color-coded legend identifies pin functions, such as red for power, black for ground, green for GPIO/PWM, and other colors for communication interfaces. The board's layout includes a USB port, debug pins, and a BOOTSEL button.](https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:rnpkyqnmsw4ipey6eotbdnnf/bafkreigpgak4ygsthu6voq5oi3klabkjjwnkqcdtkenvdy772pcwexx74i@jpeg)

Then we connect

- Pico A GPIO2 → Pico B SWCLK(Orange cable) on the area marked debug
- Any Pico A GND(or breadboard GND rail) → Pico B Debug GND
- Pico A GPIO3 → Pico B SWDI0(Yellow Cable) on the area marked debug

![Close-up of a Raspberry Pi Pico H mounted on a breadboard, wired to a Raspberry Pi Debug Probe visible in its case, with connected jumper wires in red, orange, and yellow. The setup showcases active wiring for debugging or interfacing. Other wires and components are visible in the background on the wooden desk.](https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:rnpkyqnmsw4ipey6eotbdnnf/bafkreieryqsbfpdbh2v5aa3gx26t7k4dtvutxum3rgwnas665qthlbhkuu@jpeg)
![View of a Raspberry Pi Pico W mounted on a breadboard, with jumper wires in red, orange, yellow, and black being connected by hand. The close-up emphasizes the wiring process in an electronics prototyping setup, with additional wires scattered on the desk.](https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:rnpkyqnmsw4ipey6eotbdnnf/bafkreicia5uogblwvpm2i5vzs5bybqzwcmq5ibljw2xrlniztcx5zgy544@jpeg)
The debug port pins are same as before
From left to right;
- Orange (TX/SC) 
- Black (GND)
- Yellow(RX/SD)

If you have any issues, you can refer to [page 18 of this PDF](https://datasheets.raspberrypi.com/pico/getting-started-with-pico.pdf)

Note:
You may have noticed that we did not connect UART on either of those, as shown in the documentation. That is because it is not strictly needed for what we are doing. But it should be noted if you do anything you send on UART0 from the target can be read via the serial connection the probe


# Flashing the Pico.

This is as easy as navigating to the repo you cloned earlier in your terminal/code editor/IDE of choice, and running `cargo run`  probe-rs takes it from here and flashes the target. You should now be logging in to your terminal, and the LED is flashing!

![Terminal screenshot showing the output of a Rust program being flashed to an RP2040 chip using probe-rs. The process includes steps for erasing and programming, which complete successfully in 0.487 seconds. The output logs indicate toggling of an LED ('led on!' and 'led off!') at specific lines of src/main.rs. A warning appears at the bottom related to switching to DP Multidrop, signaling a communication issue.](https://cdn.bsky.app/img/feed_thumbnail/plain/did:plc:rnpkyqnmsw4ipey6eotbdnnf/bafkreihwr2qrrgxijq53hz6are2lgdjl5f2rxmbhoh5ofsreestvgqzeay@jpeg)

[Video of the pico flashing it's onboard LED](https://bsky.app/profile/baileytownsend.dev/post/3lbq7olcqj22d)

# Congratulations 🎉!

You have now have a great foundation for using the Rust framework Embassy to write amazing applications for the RP 2040. You should now be able to take any example from Embassy’s GitHub repo and run them locally using this template as a base.

https://github.com/embassy-rs/embassy/tree/main/examples/rp/src/bin


If you have made it this far, thank you so much for checking out this thread! Please feel free to ask me any questions and reply or quote this post with any projects you make using this! I hope it helps you out!
