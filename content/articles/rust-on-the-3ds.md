---
title: 'Rust 🦀 on the 3DS'
description: "Learn how to start building 3DS application's with Rust"
date: "2025-03-31T00:00:00Z"
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
* [Setup](#setup)
  * [Installing and setting up the devkitARM toolchain](#installing-and-setting-up-the-devkitarm-toolchain)
  * [cargo-3ds](#cargo-3ds)
  * [Creating a project](#creating-a-project)
  * [Where do I even run this?](#where-do-i-even-run-this)
    * [Emulators](#emulators)
    * [Real hardware](#real-hardware)
  * [My development workflow](#my-development-workflow)
* [2d Graphics](#2d-graphics)
* Closing


## How does it work?
Thanks to the work done by the [@rust3ds](https://github.com/rust3ds) organization you can write rust for the [armv6k-nintendo-3ds](https://doc.rust-lang.org/beta/rustc/platform-support/armv6k-nintendo-3ds.html#armv6k-nintendo-3ds) target.
A lot of the apis for it are implemented by linking to a libc(devkitARM) library that is maintained by [devkitPro](https://devkitpro.org/wiki/Getting_Started). So a lot of what the ctru-rs/rust3ds project does is gives you, the end user, safe wrappers around the C libraries to make software for the 3DS safely in rust.

A lot of terms and organizations so I wanted to make a list to break it down. I am going to start with the C libraries. 
- [devkitPro](https://devkitpro.org/wiki/Getting_Started) - The organization that provides the C libraries for the 3DS, along with other gaming consoles. 
- [libctru](https://github.com/devkitPro/libctru) -  C library for writing code for the 3DS
- [citro3d](https://github.com/devkitPro/citro3d) - C library providing easy apis for displaying 3D graphics
- [citro2d](https://github.com/devkitPro/citro2d) - C library build on top of citro3d to display 2d graphics. Text, sprites, and 2d shapes.

Then for the rust sie of things.
- [rust3ds](https://github.com/rust3ds) - The organization that maintains support for the `armv6k-nintendo-3ds` target and safe rust bindings to the devkitPro C libraries as well as crates to safely call them in a rusty way.
- [ctru-sys](https://github.com/rust3ds/ctru-rs/tree/master/ctru-sys) - Direct rust bindings to the libctru C library, unsafe.
- [ctru-rs](https://github.com/rust3ds/ctru-rs/tree/master/ctru-rs) - A Safe and idiomatic Rust wrapper around the libctru library. This is the library you call when writing Rust software on the 3DS. It handles all the [unsafe](https://doc.rust-lang.org/book/ch20-01-unsafe-rust.html) implementations for you.
- [cargo 3ds](https://github.com/rust3ds/cargo-3ds) - cargo commands to work with 3DS projects. Example, you use `cargo 3ds build` and `cargo 3ds run` to build and run the project.
- [citro3d-sys](https://github.com/rust3ds/citro3d-rs/tree/main/citro3d-sys) - Direct rust bindings to the citro3d C library.
- [citro3d-rs](https://github.com/rust3ds/citro3d-rs/tree/main/citro3d) - A work in progress crate for safe rust bindings to the citro3d C Library, this is the crate you call to use 3D graphics in your 3DS software.
- citro2d-sys and citro2d - More on this under [2d graphics](#2d-graphics) 

## Setup
The rust3ds team has an excellent [Getting Started](https://github.com/rust3ds/ctru-rs/wiki/Getting-Started) guide for setting up a dev environment to get started on writing rust on the 3DS. I am going to brush over a lot of the same information, but mostly focus on the pain points I had when I was getting started.
This guide assumes you have [rust](https://www.rust-lang.org/tools/install) installed and familiar with setting up and running projects with it.

### Installing and setting up the devkitARM toolchain
Before you can build any of these projects you will need to install and set up the devkitARM toolchain by following their [Getting started guide](https://devkitpro.org/wiki/Getting_Started).
1. Install and have the `dkp-pacman` command working in your terminal by following [this guide](https://devkitpro.org/wiki/Getting_Started).
2. Once you have that setup run `sudo dkp-pacman -S 3ds-dev` to install the packages needed for 3DS dev.
3. After this you need to make sure you have the following environment variables set. The path values are what I have from installing on Pop!_OS. `DEVKITPRO`, `DEVKITARM`, and `DEVKITPPC`. My `.bashrc` looks like this
```bash
export DEVKITPRO=/opt/devkitpro
export DEVKITARM=${DEVKITPRO}/devkitARM
export DEVKITPPC=${DEVKITPRO}/devkitPPC
```
4.  You also need to make sure you have `/opt/devkitpro/tools/bin` and `/opt/devkitpro/devkitARM/bin` are in your path. My `.bashrc` for that looks like this
```bash
export PATH=${DEVKITPRO}/tools/bin:$PATH
export PATH=${DEVKITARM}/bin:$PATH
```

If you get a `error: linker arm-none-eabi-gcc not found` it is most likely because of bullet point 4. So need to check those and make sure it is accessible. [Some more context](https://github.com/rust3ds/cargo-3ds/issues/73). 

### cargo-3ds
[cargo 3ds](https://github.com/rust3ds/cargo-3ds) is a command tool you use to interact with your 3DS projects. You have to use this to build and run projects. Normal `cargo run` and `cargo build` does not work.
You can install it by `cargo install --locked cargo-3ds`.

### Creating a project
To create a new project you can use `cargo 3ds new`, this will create a new project that you can build and run.  When I first started using it I had the same problem as listed in [issue #68](https://github.com/rust3ds/cargo-3ds/issues/68) when using `cargo 3ds new`, but since then it has been resolved.
If you have a similar problem may use `cargo install --locked --git https://github.com/rust3ds/cargo-3ds` instead to make sure you have the latest version with the patch.

Or for some extra bell and whistles you can use [my template](https://github.com/fatfingers23/citro2d-project-template) I have created for trying out my work on citro2d. I'll go a bit more into what those extras are in [My development workflow](#my-development-workflow). 

## Where do I even run this?
Once you build your project with `cargo 3ds build` you should see output that looks a bit like this 
```bash
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.14s
Building smdh: /home/baileytownsend/Documents/code/rust/games/citro2d-project-template/target/armv6k-nintendo-3ds/debug/citro2d-project-template.smdh
Building 3dsx: /home/baileytownsend/Documents/code/rust/games/citro2d-project-template/target/armv6k-nintendo-3ds/debug/citro2d-project-template.3dsx
Adding RomFS from /home/baileytownsend/Documents/code/rust/games/citro2d-project-template/romfs

```
The file ending in `.3dsx` is what you want. This is what you install on the 3DS or the file you open inside the emulator. This is important mostly for when using a emulator. 

### Emulators

During development, I recommend using an emulator I found it is a bit of a faster feedback loop. But which one? You may have heard, there has been [a bit of a controversy](https://www.pcgamer.com/software/nintendo-3ds-emulator-citra-taken-offline-as-collateral-damage-in-yuzu-settlement/) with 3DS emulators. Because of this the projects have been a bit splintered across forks, but I am going to list some I've had success with.

* [Citra (rip)](https://citra-emulator.com/)
* [Lime3DS (archived)](https://github.com/Lime3DS/lime3ds-archive)
* [Azahar Emulator (Successor to lime-3ds)](https://github.com/azahar-emu/azahar)
* [Panda3DS (2D complex shapes do not show as well for some reason)](https://panda3ds.com/)

All of these also allow you to open the `.3dsx` as the first argument after executable's name. For example in my projects I usually have a just file that builds, and then launches it in an emulator.
```justfile
shapes-example:
    cargo 3ds build
    lime3ds target/armv6k-nintendo-3ds/debug/citro2d-project-template.3dsx 
```

### Real hardware
One of the coolest parts of writing software for these older game systems is being able to run it on the actual hardware. I will never forget how awesome it was to the see the GBA load screen on real hardware before booting into a game I had made.

Thanks to homebrewing it is easy to get what you write onto your 3DS.

What you will need.
* Any 3Ds or 2Ds model
* Follow the [3DS Hacks Guide](https://3ds.hacks.guide/) to install a custom firmware on your 3DS. It does not matter which model, or version it has, the guide has a way for all of them.

Once you have your 3DS loaded with the custom firmware and [the homebrew launcher](https://smealum.github.io/3ds/) setup. Open `the homebew launcher` and on the main screen of the homebrew launcher press `Y` on your console. You should see the following screen below.
![Picture of a 3DS showing the homebrew launcher screen with the 3dslink netLoader](/article-assets/8/3dslink.webp)

After that it is as easy as using `cargo 3ds run` to send the program over to the 3DS! If you have issues with it not being able to find the device make sure your 3DS is on the same network and can use this command to specify the ip address found on the 3dslink NetLoader screen `cargo 3ds run --address xxx.xxx.xxx.xxx`

## My development workflow
I did not have luck with using [rust analyzer as setup here](https://github.com/rust3ds/ctru-rs/wiki/Guides#setting-up-rust-analyzer) with my 3DS projects. But I found using bacon and bacon-ls helped a ton to keep a familiar workflow.
I am going to use my [citro2d-project-template](https://github.com/fatfingers23/citro2d-project-template) template as the example for this.

Although not strictly needed. I found having a [config.toml](https://github.com/fatfingers23/citro2d-project-template/blob/main/.cargo/config.toml) setup helpful, especially for bacon-ls. Just make sure to update with the locations of your env variables for `DEVKITARM`

1. Make sure you have [bacon](https://github.com/Canop/bacon) installed `cargo install --locked bacon`
2. Make sure have [bacon-ls](https://github.com/crisidev/bacon-ls) installed `cargo install --locked bacon-ls`
3. Install the [VS Code extension](https://marketplace.visualstudio.com/items?itemName=MatteoBigoi.bacon-ls-vscode)
4. Usually need to set up a [bacon.toml](https://github.com/fatfingers23/citro2d-project-template/blob/main/bacon.toml) as explained [here](https://github.com/crisidev/bacon-ls?tab=readme-ov-file#configuration), this is the one found in the template.
```toml
[jobs.bacon-ls]
command = [
    "cargo",
    "3ds",
    "check",
    "--message-format",
    "json-diagnostic-rendered-ansi",
]
analyzer = "cargo_json"
need_stdout = true

[exports.cargo-json-spans]
auto = true
exporter = "analyzer"
line_format = "{diagnostic.level}|:|{span.file_name}|:|{span.line_start}|:|{span.line_end}|:|{span.column_start}|:|{span.column_end}|:|{diagnostic.message}|:|{diagnostic.rendered}|:|{span.suggested_replacement}"
path = ".bacon-locations"
```
5. You need to make sure bacon is running for it to work with VS Code, can do that with `bacon -j bacon-ls`

Then that is it! You should now be seeing the output of `cargo 3ds check` in your editor to help you write your 3ds programs.


## 2d Graphics

Talk about how ctru-rs had a lot of bindings for making 3DS software, but i did not find any easy ones for makign simple games, and 2d grpahics is easier to start with so i looked into getting citro2d working and talk about the complexes too of citro2d being built on top of citro 3d


# Notes
* Also write how I use bacon ls
* Talk about how you can use Cargo 3ds for a new project or make a template that is the 2d shapes that calls to the citr3d fork I have
* looks like 3ds cargo command works. recommend using `cargo install --locked --git https://github.com/rust3ds/cargo-3ds`
* Clean up repo with a readme and make a PR as a draft?
* Talk about how yeah it's not truly truly running rust 100%, but the goal is to have safe apis so YOU can write rust apps and games
* Show an example of my env variables. What was my issue and dont need a config.toml