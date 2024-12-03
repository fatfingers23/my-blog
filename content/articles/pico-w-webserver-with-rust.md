---
title: 'Running a HTTP server on the Pico W with Rust 🦀'
description: 'Learn how to control your Pico W rust projects with HTTP requests and host simple web apps'
date: "2024-12-03T05:11:00Z"
draft: false
image:
    src: "/article-assets/5/cover.jpg"
    alt: ""
head:
    meta:
      - name: "twitter:card"
        content: "summary"
      - name: "twitter:image"
        content: "https://baileytownsend.dev/article-assets/5/cover.jpg"      
      - name: "keywords"    
        content: "Rust, Raspberry Pi, Pico, Http Server, embedded rust, embedded, RP2040"
      - name: 'author'
        content: 'Bailey Townsend'
---
As seen on [Bluesky 🦋](https://bsky.app/profile/baileytownsend.dev/post/3lcev3dcd5s2d)

A 🧵on running a HTTP server on the Raspberry Pi Pico W with Rust 🦀

I'm a web developer by trade, so when the Raspberry Pico W came out, it interested me because of the ability to connect to the internet, which sparked my love for embedded programming. In this 🧵 I am going to explain how I host web apps in my embedded Rust projects on the Pico.

**__Note and thanks to these repos__ \
There are more feature complete HTTP server implementations out there for [embassy](https://embassy.dev/). I had issues with getting them to run. 
So as any developer I made a simple implementation server to learn more. I took inspiration from these two and I thank them for all of their great work.
- [edge-net](https://github.com/ivmarkov/edge-net)
- [picoserve](https://github.com/sammhicks/picoserve)

# Table of Contents
- [What are we building](#what-are-we-building)
- [Setup](#setup)
- [Repo (click here to see the code)](#repo)
- [Running the project](#running-the-project)
- [Breakdown of the code](#breakdown-of-the-code)
  - [Running the HTTP Server](#running-the-http-server)
  - [(Bonus) Environment Variables](#bonus-environment-variables)
  - [Website Handler](#website-handler)
  - [Serving the web app](#serving-the-web-app)
  - [Post requests](#post-requests)
  - [Returning JSON](#returning-json)
  - [(Bonus) Embedded Rust String interpolation](#bonus-embedded-rust-string-interpolation)
  - [Controlling GPIO and more](#controlling-gpio-and-more)
- [Breakdown of the HTTP Sever Implementation](#breakdown-of-the-http-server-implementation)
- [Closing remarks](#closing-remarks)

# What are we building
As in my previous getting started 🧵 the end result is just the Pico's onboard LED turning on and off, but this time controlled via a [petite-vue](https://github.com/vuejs/petite-vue) web app styled by [daisyUI](https://daisyui.com/).
It's up to YOU to take this and make amazing projects.

# Setup
If this is your first time using embassy on the Pico then I recommend starting with this [article I wrote on getting started](https://baileytownsend.dev/articles/getting-started-with-rust-an-rp2040)

# Repo
This 🧵 will be following along with the [pico_w_webserver branch](https://github.com/fatfingers23/raspberry-pico-w-embassy-template/tree/pico_w_webserver) found on my Raspberry Pico W embassy template repo. If you just care about just getting the code and start coding you can clone this branch. Do a cargo run and you have a simple http server going on your pico and can stop here.

# Running the project
To run the project you do need to make a copy of .env.save, name it .env then fill out your WIFI settings. Then go to the root of project in your favorite code editor/IDE/terminal and do cargo run. The LED should turn on once ready and see a print out of Listening on: {the picos ip}.
![Picture of the IP printed out](/article-assets/5/ip.png)

Just connect to that ip on port 80 (mine is http://192.168.1.162) and you should see the web app!

![gif of the project running](/article-assets/5/demo.gif)


# Breakdown of the code
In [main.rs](https://github.com/fatfingers23/raspberry-pico-w-embassy-template/blob/pico_w_webserver/src/main.rs) we are setting up the net work [embassy_net::Stack](https://docs.embassy.dev/embassy-net/git/default/struct.Stack.html). This is what you will use for all Network communications when using embassy. This is pretty much the same as all the examples found in the embassy repo /examples/rp folder. With some abstractions I did with setup_cyw43.

```rust
let p = embassy_rp::init(Default::default());
let (net_device, mut control) = setup_cyw43(
    p.PIO0, p.PIN_23, p.PIN_24, p.PIN_25, p.PIN_29, p.DMA_CH0, spawner,
)
.await;

let config = Config::dhcpv4(Default::default());
let mut rng: RoscRng = RoscRng;

// Generate random seed
let seed = rng.next_u64();

// Init network stack
static RESOURCES: StaticCell<StackResources<3>> = StaticCell::new();
let (stack, runner) = embassy_net::new(
    net_device,
    config,
    RESOURCES.init(StackResources::new()),
    seed,
);

unwrap!(spawner.spawn(net_task(runner)));
let wifi_network = env_value("WIFI_SSID");
let wifi_password = env_value("WIFI_PASSWORD");

loop {
    match control
        .join(wifi_network, JoinOptions::new(wifi_password.as_bytes()))
        .await
    {
        Ok(_) => break,
        Err(err) => {
            info!("join failed with status={}", err.status);
        }
    }
}

// Wait for DHCP, not necessary when using static IP
info!("waiting for DHCP...");
while !stack.is_config_up() {
    Timer::after_millis(100).await;
}
info!("DHCP is now up!");

info!("waiting for link up...");
while !stack.is_link_up() {
    Timer::after_millis(500).await;
}
info!("Link is up!");

info!("waiting for stack to be up...");
stack.wait_config_up().await;
info!("Stack is up! You are good to use the network!");
```

## (Bonus) Environment Variables
One thing I did want to point out is the env_value methods. Working with Laravel I fell in love with .env files. I think they are one of the better ways to share env variables in repos. I could not find that in the embedded rust world so I made this simple implementation to have them here

```rust
//Examples on how to get wifi secrets from a .env using my env_value method
let wifi_network = env_value("WIFI_SSID");
let wifi_password = env_value("WIFI_PASSWORD");
```

```rust
//A simple .env implmentation that reads a .env file and parses it out. 
//Does not handle all situations but works for what I need
use heapless::Vec;

const _ENV_DATA: &str = include_str!("../.env");

pub fn env_value(key: &str) -> &'static str {
    for line in _ENV_DATA.lines() {
        let parts: Vec<&str, 2> = line.split('=').collect();
        if parts.len() == 2 {
            if parts[0].trim() == key {
                let mut value = parts[1].trim().chars();
                value.next();
                value.next_back();
                return value.as_str();
            }
        }
    }
    panic!("Key: {:?} not found in .env file. May also need to provide your own .env from a copy of .env.save", key);
}
```
## Running the HTTP Server

Then, we call my HttpServer Implementation by passing in the Stack and the port number to run on. Notice that I am passing the control over to the handler. You can pass your embedded interfaces to use them from web requests. In this example, control triggers the onboard LED.
```rust
//Creates a HttpServer by passing the desired port number
//and embassy_net::Stack
let mut server = HttpServer::new(80, stack);

server.serve(WebsiteHandler { control }).await;
```
You can also run this as a embassy task for added flexibility of reading sensors on the main loop or from another embassy task. 
```rust
....
//Called from main
spawner.must_spawn(http_server_task(stack, WebsiteHandler { control }));


#[embassy_executor::task]
async fn http_server_task(stack: Stack<'static>, website_handler: WebsiteHandler) {
    let mut server = HttpServer::new(80, stack);
    server.serve(website_handler).await;
}
```

## Website Handler
The WebsiteHandler is where you put your logic for handling web requests. This gets called for each web request and gives you access to the WebRequest (Rust struct representation of the request) and the response_buffer(what gets written as a response)
```rust
struct WebsiteHandler {
    control: Control<'static>,
}

impl WebRequestHandler for WebsiteHandler {
    async fn handle_request<'a>(
        &mut self,
        request: WebRequest<'_, '_>,
        response_buffer: &'a mut [u8],
    ) -> Result<Response<'a>, WebRequestHandlerError> {
        let path = request.path.unwrap();
....
```
## Serving the web app

This handler can be whatever you would like. I have a match statement on the request path to decide what to do for each request to a particular path. The root returns a index.html that hosts our web app. Then you return a response helper with the status code and body. You will also notice I am just doing a `include_str!` to add this so I can have the html in a file for development with my IDE.
```rust
let path = request.path.unwrap();
match path {
    "/" => {
        let web_app = include_str!("../web_app/index.html");
        return Ok(Response::new_html(StatusCode::Ok, web_app));
    }
...
```
## Post requests
The server can even handle post requests and read the body.
```rust
match path {
    "/post_test" => {
        if request.method.unwrap().as_str() == http_server::Method::Post.as_str() {
            info!("Received body: {:?}", request.body);
            return Ok(Response::new_html(StatusCode::Ok, "Received body"));
        }
        return Ok(Response::new_html(
            StatusCode::MethodNotAllowed,
            "Only POST method is allowed",
        ));
    }
...
```

## Returning JSON
You can also respond to web requests with JSON thanks to serde_json_core and write directly to the response buffer with my method for formatting strs. You can see I am using LIGHT_STATUS to keep the state of the light on the Pico. This can be used to share data between embassy tasks as well.
```rust
"/light_status" => {
    let light_status = LightStatus {
        light_status: LIGHT_STATUS.load(core::sync::atomic::Ordering::Relaxed),
    };

    match serde_json_core::to_string::<_, 128>(&light_status) {
        Ok(response) => {
            let json_body =
                easy_format_str(format_args!("{}", response), response_buffer);

            Ok(Response::json_response(StatusCode::Ok, json_body.unwrap()))
        }
        Err(_) => Ok(Response::new_html(
            StatusCode::InternalServerError,
            "Error serializing json",
        )),
    }
}
```
## (Bonus) Embedded Rust string interpolation

You may of noticed east_format_str.This is what I use in my embedded projects for string interpolation. I'm sure there are more elegant ones (And feel free to share them), but like most things, I write. It gets the job done for my use cases.
```rust
// Some logic I use in my embedded projects for string interpolation 
pub fn easy_format_str<'a>(
    args: Arguments<'_>,
    buffer: &'a mut [u8],
) -> Result<&'a str, core::fmt::Error> {
    let mut writer = BufWriter::new(buffer);
    let result = core::fmt::write(&mut writer, args);

    match result {
        Ok(_) => {
            let len = writer.len();
            let response_str = core::str::from_utf8(&buffer[..len]).unwrap();
            Ok(response_str)
        }
        Err(_) => {
            panic!("Error formatting the string")
        }
    }
}

// A simple wrapper struct to use core::fmt::Write on a [u8] buffer
pub struct BufWriter<'a> {
    buf: &'a mut [u8],
    pos: usize,
}

impl<'a> BufWriter<'a> {
    pub fn new(buf: &'a mut [u8]) -> Self {
        BufWriter { buf, pos: 0 }
    }

    pub fn len(&self) -> usize {
        self.pos
    }
}

impl<'a> core::fmt::Write for BufWriter<'a> {
    fn write_str(&mut self, s: &str) -> core::fmt::Result {
        let bytes = s.as_bytes();
        if self.pos + bytes.len() > self.buf.len() {
            return Err(core::fmt::Error); // Buffer overflow
        }

        self.buf[self.pos..self.pos + bytes.len()].copy_from_slice(bytes);
        self.pos += bytes.len();
        Ok(())
    }
}
```

## Controlling GPIO and more
The on and off endpoints I am changing the backend state of the light and interacting with control. Control is from the cyw43 crate and does a few things. One of those is controlling the onboard LED. But you can control any embedded thing here. Maybe read/write to a SPI or ic2 bus.
Can even see [in this repo](https://github.com/fatfingers23/Picosapien/blob/fa2b8e001885dd22f4acfd79c182c7c7148b85d2/src/main.rs#L153) I am passing over the flash to read and write to the Pico's onboard flash/

```rust
"/on" => {
    LIGHT_STATUS.store(true, core::sync::atomic::Ordering::Relaxed);
    self.control.gpio_set(0, true).await;
    Ok(Response::new_html(StatusCode::Ok, "Light is on"))
}
"/off" => {
    LIGHT_STATUS.store(false, core::sync::atomic::Ordering::Relaxed);
    self.control.gpio_set(0, false).await;
    Ok(Response::new_html(StatusCode::Ok, "Light is off"))
}
```

# Breakdown of the HTTP Server Implementation
The actual HTTP Server implementation is pretty simple. Before we start discussing the Rust implementation, let's discuss it from a high level. The way this HTTP server is implemented does not meet all of the normal standards, but rather, it meets just what is needed to meet my needs.


An oversimplification of an HTTP server is that it's just a TCP socket listening on a port for a web request from your browser. The the request and response follow a messaging protocol (HTTP) to know how to communicate withe each other.

::two-pictures-side-by-side
#one
HTTP Request
![A picture of a HTTP request](https://mdn.github.io/shared-assets/images/diagrams/http/overview/http-request.svg)
#two
HTTP Response
![A picture of a HTTP response](https://mdn.github.io/shared-assets/images/diagrams/http/overview/http-response.svg)
::



You will notice the response has a Protocol version. This tells the web browser which Protocol your server follows. My implementation responds with HTTP/1.1, but that does not mean it follows the version perfectly. Again, this was mostly for my needs and learning.
To learn more about HTTP you can check out this [great page from mozilla](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview) that goes into much more detail.

## The implementation in rust

We setup some buffers for sending/receiving, and for the request. As well as set some settings for the TCPSocket.
```rust
let mut rx_buffer = [0; 8_192];
let mut tx_buffer = [0; 8_192];
let mut request_buffer = [0; 8_192];
let ip = self.stack.config_v4().unwrap().address;
info!("Listening on ip: {}", ip);
let mut socket = TcpSocket::new(self.stack, &mut rx_buffer, &mut tx_buffer);
socket.set_timeout(Some(Duration::from_secs(10)));
socket.set_keep_alive(Some(Duration::from_secs(10)));
```

Then the socket waits to accept a connection on the port specified. Once it receives one it starts a new loop to read the request body.
```rust
loop {
    if let Err(e) = socket.accept(self.port).await {
        warn!("accept error: {:?}", e);
        continue;
    }

    info!("Received connection from {:?}", socket.remote_endpoint());

    loop {
        let n = match socket.read(&mut request_buffer).await {
            Ok(0) => {
                warn!("read EOF");
                break;
            }
            Ok(n) => n,
            Err(e) => {
                warn!("read error: {:?}", e);
                break;
            }
        };
```

Then, we begin to parse out the request. You can see we take that HTTP Request we talked about earlier and start to parse it out into the different parts with [request_parser](https://github.com/fatfingers23/raspberry-pico-w-embassy-template/blob/9c63a4bdaa13d286e9f63d58a9c51c6b41a92f41/src/http_server.rs#L120). We then pass that parsed request
to our `WebRequestHandler` we setup earlier. Then it takes that response from the handler and attempts some error handling before attempting to write the response to the TCP socket. Finally it closes the socket to let the web browser know the web request has finished. Then we just flush the socket and prepare for the next web request
```rust
//The read loop from above
...
let mut headers = [httparse::EMPTY_HEADER; 20];

let request = self.request_parser(&mut request_buffer[..n], &mut headers);
match request {
    Some(request) => {
        let mut request_response_buffer = [0u8; 8_192]; // Size the buffer appropriately
        let response = handler
            .handle_request(request, &mut request_response_buffer)
            .await;

        let mut response_buffer = [0u8; 8_192];
        let mut writer: BufWriter<'_> = BufWriter::new(&mut response_buffer);

        if response.is_err() {
            warn!("Something went wrong with the request");
            socket.close();
            break;
        }
        match response.unwrap().write_response(&mut writer) {
            Ok(()) => {}
            Err(_) => {
                warn!("Error writing response");
                let mut bad_response_buffer = [0u8; 300];
                let bad_response = Response::new_html(
                    StatusCode::InternalServerError,
                    "Error writing response",
                );
                let mut writer: BufWriter<'_> =
                    BufWriter::new(&mut bad_response_buffer);
                match bad_response.write_response(&mut writer) {
                    Ok(()) => {}
                    Err(_) => {
                        warn!("Error writing any response");
                        break;
                    }
                };
                //Already a hail mary, so just ignore the error
                let _ = socket.write_all(&bad_response_buffer).await;
            }
        };

        let response_len: usize = writer.len();

        match socket.write_all(&response_buffer[..response_len]).await {
            Ok(()) => {}
            Err(e) => {
                warn!("write error: {:?}", e);
                break;
            }
        };
    }
    None => {
        warn!("Was not a proper web request");
    }
}

//Have to close the socket so the web browser knows its done
socket.close();
if let Err(e) = socket.flush().await {
    warn!("Error flushing socket: {:?}", e);
    break;
}

```

# Closing remarks
And that's how I handle web requests in my embedded Rust projects! Thank you for taking the time to read this 🧵! As always these are a
"There are no dumb questions". So please feel free to comment on Bluesky any questions you have. Most of what I do with embedded projects is to learn something, and I write these threads to hopefully help you learn something new!
