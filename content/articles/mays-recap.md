---
title: "May's Recap"
description: "A recap of what i've been up to in May"
date: "2025-05-30T21:00:00Z"
draft: true
image:
    src: "/article-assets/11/cover.png"
    alt: "A picture of a tucker hat that says May's recap"
head:
    meta:
      - name: "twitter:card"
        content: "summary"
      - name: "twitter:image"
        content: "https://baileytownsend.dev/article-assets/11/cover.png"
      - name: "keywords"    
        content: "atprotocol,teal.fm, atproto"
      - name: 'author'
        content: 'Bailey Townsend'
---

It has been a pretty busy month! Well, closer to 2 months truly. I usually focus on one topic in a blog post, but I've been a bit all over the place this month, so I thought a recap of what open source work I've been doing would be fun.

 
# Table of Contents
* [at://2048](#at2048)
* [ATProtocol Shenanigans](#atprotocol-shenanigans)
  * [Ripping private keys from a PDS](#ripping-private-keys-from-a-pds)
  * [Backfilling missed records](#backfilling-missed-records)
  * [atrium template](#atrium-template)
  * [did:web proxying](#didweb-proxying)
* [Working On Teal](#working-on-teal)
* [A rusty TRMNL](#a-rusty-trmnl-firmware)
* [Closing](#closing)

# at://2048
![img](https://2048.blue/assets/imgs/banner.png)

About 2 months ago my new phone came in. It is a [Minimal Phone](https://minimalcompany.com/). It's an e-ink phone with a physical keyboard. The attraction to it is it runs android, so I have full access to the apps I need for work and to be social with irl friends and online friends. But since it is e-ink it cuts down my usage and makes everything feel much more purposeful. Well with it being e-ink I found playing the (now classic) [2048](https://en.wikipedia.org/wiki/2048_(video_game)) puzzle game perfect for the device when I had time to kill.
But in the versions I tried, I found myself wanting WASD keybinds since my phone had a keyboard and reduce animations for the screen. Well, as everyone has probably thought at one point or another, I thought why don't I make one. So I did.
::bluesky-embedded{:postAtUri="at://did:plc:rnpkyqnmsw4ipey6eotbdnnf/app.bsky.feed.post/3lmahydrde22i"}
::

Since I had just done a [Rust version of Statusphere](https://github.com/fatfingers23/rusty_statusphere_example_app)
and created [esquema](https://github.com/fatfingers23/rusty_statusphere_example_app)(A fork of [atrium's lex code gen](https://github.com/atrium-rs/atrium/tree/main/lexicon/atrium-codegen)
so it can be used as a cli).
I thought it would be a lot of fun to make it on the atmosphere.
Maybe even bring back some of that fun exploration
of when FaceBook was getting big and doing all the social media games. 


The main features I wanted out with what I'm calling v0.1 were:
- Actual game play
- Stats
- OAuth login for atproto so it will all be client side
- Store your games and stats to your atproto repo
- History View to see previous games and to help resync any high scoring games that may of failed to sync

v1.0 is going to be the actual "social" features.
- Global Leaderboards
- Friends(mutual) Leaderboards
- A feed to see when people get achievements or their recent games
- Chess like titles, but for 2048 that is applied via labels


The alpha of at://2048 has been out for about a month now.
I've been pretty proud of how it has turned out! And the feedback has been great. It has been awesome to see so many people play it and have fun. Adding the share button was the best idea because it has been rewarding to see people share their games with friends and having fun.
I think I got most of the major bugs out of the way and the initial goals reached.
As of writing this post, 180 accounts have played and published an at://2048 game to their atproto repo,
and a total of 3,499 games have been published.



I am going to come back and finish out the leaderboards and social feeds, but I needed a bit of a break and to look at some other codebases for a bit. I expect to start on the appview in June.



# ATProtocol Shenanigans
![](https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:rnpkyqnmsw4ipey6eotbdnnf/bafkreiax6zhyco4ivid2eeejm3lqaztsndmf2t55pd6vgf7ivimj7kklqe@jpeg)

For the past couple of months I've reallly gotten into [ATProtocol](https://atproto.com/).
To me it's a well thought out way to build public applications and has a great community of developers.
So to learn more about it I have been doing a bit of a deep dive into the docs and other atproto projects.
I thought I would highlight some of the more interesting things I've learned.

## Ripping private keys from a PDS
After the first meeting with [#IndieSkyWG](https://atproto.wiki/en/working-groups/indiesky) talking about PDS migrations and backup, I got curious about that in a nontraditional way and how that data is kept on the PDS side.
What was learned that the `verificationMethod:publicKeyMultibase` is the public key to a keypair just for your account that is used to sign JWTs for accessing your PDS and is also what is used to sign your PDS repo (all those CIDS). 
These are saved on your PDS at `/pds/actors/{number not sure meaning}/{your did}/key`. This is the keypair bytes you can load up to an atproto crypto library to sign various operations. And since this is just a file, you can SSH in and copy it out if you have access to your PDS.
Then you have the private key and can use it for whatever you want. Here's an example in rust using [atrium-crypto](https://crates.io/crates/atrium-crypto) to read and parse the key.

```rust
use atrium_crypto::keypair::{Did, Secp256k1Keypair};

const KEY_BYTES: &[u8] = include_bytes!("../key");

fn main() {
    let key_from_my_pds = Secp256k1Keypair::import(&KEY_BYTES).unwrap();
    let public_key = key_from_my_pds.did();
    println!("Public did:key {}", public_key);
}
```

Then I also learned
Rotation keys are public did:keys used to prove you are you when submitting a change to your DID Doc,
which your DID doc is your “true identity.”
These can be keypairs created from your PDS or you created on your own.
It is recommended
to upload at least one in the event your PDS goes down so you can prove it’s you when submitting changes to DID docs.
On the PDS you can find the private key hex for the rotation key for the PDS
at `/pds/pds.env` not clear on where they go if you submit one though.
I have not tested that yet.

## Backfilling missed records
I was wanting to release at://2048 all at once.
An appview with leaderboards and the actual game play.
But I quickly realized I was hitting feature creep,
and honestly, I was at the point I was ready to have something out there so I could get some feedback.
One of my biggest fears was I thought
I needed to have a Firehose/JetStream listner running so my appview could collect the [blue.2048.game](https://atproto-browser.vercel.app/at/did:plc:zylhqsjug3f76uqxguhviqka/com.atproto.lexicon.schema/blue.2048.verification.game) records.
Turns out that was not a concern at all.

I was originally thinking I would have to wait till a new record was created
and then retroactively go and check their PDS to pick up any previous games.
Turns out I don't have to do that either.
AtProtocol already thought of that and have a solution. 

I found the `com.atproto.sync.listReposByCollection`,
which you can call on a relay (like `relay1.us-west.bsky.network`) to get a list of user repos that have that lexicon.
Then you know which repos to call to check for the records to backfill your appview.
Here's the url for 2048.blue.game's records.
https://relay1.us-west.bsky.network/xrpc/com.atproto.sync.listReposByCollection?collection=blue.2048.game


# atrium template

I also took some time this month to create an atrium template to help people jump start their rust atprotocol projects.
It is divided up between 4 crates.
This came from about the 3rd time I had copy and pasted a similar project to run atprotocol experiments
and decided others may like to have it as well.

- atproto_api - This holds the generated lexicon types and XRPC clients created with [esquema-cli](https://github.com/fatfingers23/esquema).
- logic - This holds the logic for the atproto app. Things like getting and reading records and allows you to share the logic betwene multiple crates.
- cli - is an example binary showing a simple cli app to demonstrate getting and writing records.
- wasm - is an example web app in Rust to show how you can share the same logic with the cli thanks to the logic crate.

It also has a quick JetStream listener implementation that works on WASM web targets that is pretty neat to see all happening in the browser. 

::bluesky-embedded{:postAtUri="at://did:plc:rnpkyqnmsw4ipey6eotbdnnf/app.bsky.feed.post/3lpsmpz7n3k23"}
::


# did:web proxying

I recently learned something pretty cool that I had missed.
When making requests to a PDS
if you set the `atproto-proxy` header to a did:web with an endpoint identifier it will reroute the request to that service as long
as it's prefixed `/xrpc/`.
I am going to use [teal.fm](https://teal.fm) as an example singe this is how the appview works for it.

So for teal.fm you would set a header like this: `atproto-proxy: did:web:notreal.teal.fm#teal_fm_appview`

That will then check the web address `https://notreal.teal.fm/.well-known/did.json` and expect a `did.json` about like this
```json
{
  "@context": [
    "https://www.w3.org/ns/did/v1"
  ],
  "id": "did:web:notreal.teal.fm",
  "verificationMethod": [
    {
      "id": "did:web:notreal.teal.fm#atproto",
      "type": "Multikey",
      "controller": "did:web:notreal.teal.fm",
      "publicKeyMultibase": "zQ3sheEnMKhEK87PSu4P2mjAevViqHcjKmgxBWsDQPjLRM9wP"
    }
  ],
  "service": [
    {
      "id": "#teal_fm_appview",
      "type": "TealFmAppView",
      "serviceEndpoint": "https://notreal.teal.fm"
    }
  ]
}
```

It will then grab the service with the id `#teal_fm_appview` and reroute the request to that endpoint.
So the cool thing about this is your client can just have a `did:web` set in preference
and using atprotocol will always know how to route the request to the appview. Plus it's a pretty cool way to allow clients to pick which appview they want to use if there's a fork.


# Working On Teal
![](https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:rnpkyqnmsw4ipey6eotbdnnf/bafkreicw5yrfzesh2kgs42athqkiunzpiiyeremywsmgzcmhlyb3r2hcxq@jpeg)
I've sort of been looking for an atproto project that I could start making weekly contributions to help out in. Mostly, I've just have learned a lot more about the protocol, and I wanted to give back to the community as a whole in some way. There's a lot going in the world right now, and although nothing I am doing is changing the world in a real way, it feels good to give back in someway and help where I can.

A couple of weeks ago I made a post about wanting to try out [last.fm](https://www.last.fm/) to have some stats of the music I've been listening to. Well [@daniel roe](https://bsky.app/profile/danielroe.dev) replied to wait on [teal.fm](https://teal.fm)  

::bluesky-embedded{:postAtUri="at://did:plc:jbeaa5kdaladzwq3r7f5xgwe/app.bsky.feed.post/3lpabuonbi22q"}
::

Well, it kind of hit me then. Why wait? teal.fm is [open source](https://github.com/teal-fm), I could start today. I like the team working on teal.fm, and it's a project I would really like to have. So it just clicked here was a project I could help out with. Which is the cool thing about open source. So since then I've decided to dedicate a few hours a week helping out where I can.

I've mostly been helping with [piper](https://github.com/teal-fm/piper) the music scaper for teal.fm.
It has been a lot of fun!
It also has given me a chance to learn a bit of Go since that is the language it is written in.
But since working on teal i've also been running piper most of the time I'm at my computer
and now have 1,351 `fm.teal.alpha.feed.play` records on my PDS. 

![](./article-assets/11/teal_stamps.png)

I also have a [PR](https://github.com/teal-fm/teal/pull/62)
submitted to get the whole teal.fm stack
running locally with a docker compose.
I am hoping is it makes it a bit easier
for developers working on one section of the stack to get up and running.

Working on teal.fm has been a lot of fun. I am hoping to put a good chunk of my free time this summer into helping with the project.

# A rusty TRMNL firmware

My [TRMNL](https://usetrmnl.com/?ref=bt15) came in this month!
I have been pretty excited about getting this device.
If you have not heard of the TRMNL it is a esp32 e-ink display that you can use premade plugins
or even [write your own](https://docs.usetrmnl.com/go/private-plugins/templates).
It is a really cool device,
and they have made the [firmware open source](https://github.com/usetrmnl/firmware) as well as [alternatives to hosting platforms](https://docs.usetrmnl.com/go/diy/byos) for the plugins.

I decided
since this was a device
that used a [WaveShare epd screen,](https://www.waveshare.com/wiki/7.5inch_e-Paper_HAT_Manual#Overview)
and I am pretty familiar with them,
it would be a good chance to try out [stream.place](https://stream.place)

![](./article-assets/11/stream.jpg)

It was a lot of fun! I did not get the full firmware completed, but we did finally get a static BMP image showing on the screen and web requests to their servers.
![](https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:rnpkyqnmsw4ipey6eotbdnnf/bafkreicyurs34zghkth2wn5p4rmi72ws5dx45nunxmriayfvyhx2zrqfvu@jpeg)

Sadly a few days later my desktop crashed so I have not yet open sourced the firmware,
or uploaded the stream recording yet.
But I am hoping to do that sometime in June. I may also do a longer blog post just about it and writing the firmware for it.
But if you are thinking about getting a TRMNL,
you can use my discount code of [bt15](https://usetrmnl.com/?ref=bt15) to get $15 off your first order!

# Closing
It felt like a really long month!
Or at least a busy one.
I feel like I learned a lot this month and got to work on a variety of projects.
Next month I will be on vacation for a bit so may not get as much done,
but I am hoping to work on the TRMNL, Firmware, at://2048's appview, and make some contributions to teal.fm. 

Thanks for reading!