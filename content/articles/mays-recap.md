---
title: "May's Recap"
description: "A recap of what i've been up to in May"
date: "2025-05-30T21:00:00Z"
draft: true
image:
    src: "/article-assets/2/cover.png"
    alt: ""
head:
    meta:
      - name: "twitter:card"
        content: "summary"
      - name: "twitter:image"
        content: "https://baileytownsend.dev/article-assets/2/cover.png"
      - name: "keywords"    
        content: ""
      - name: 'author'
        content: 'Bailey Townsend'
---

It has been a pretty busy month! Well closer to 2 months truly. I usually focus on one topic in a blog post, but I've been a bit all over the place this month, so I thought a recap of what open source work I've been doing would be fun. 

- Talk about work on at://2048
  - Talk about the release seems like that happened in may wtf 
  - History view
  - Future appview plans
- Talk about atproto findings. A lot written on https://ruthub.com/kb/baileytownsend.dev
  - did:web routing
  - the keys on pds are just there for the sshing
  - backfilling with the list collections
  - Talk about the nashville meetup
- Learning some GO and started helping with teal. maybe shoutout daniel roe
- Talk about the rust trmnl firmware
  - Challenges with SPI and having to spilt the data send in half

# at://2048
![img](https://2048.blue/assets/imgs/banner.png)

About 2 months ago my new phone came in. It is a [Minimal Phone](https://minimalcompany.com/). It's an e-ink phone with a physical keyboard. The attraction to it is it runs android, so I have full access to the apps I need for work and to be social with irl friends and online friends. But since it is e-ink it cuts down my usage and makes everything feel much more purposeful. Well with it being e-ink I found playing the (now classic) [2048](https://en.wikipedia.org/wiki/2048_(video_game)) puzzle game perfect for the device when I had time to kill.
But in the versions I tried, I found myself wanting WASD keybinds since my phone had a keyboard and reduce animations. Well as everyone has probably thought at one point or another, why don't I just make one. So I did.
:bluesky-embedded{:postAtUri="at://did:plc:rnpkyqnmsw4ipey6eotbdnnf/app.bsky.feed.post/3lmahydrde22i"}



The alpha of at://2048 has been out for about a month now. I've been pretty proud of how it has turned out! I think I got most of the major bugs out of the way and the initial goals reached. As of writing this post 180 accounts have played and published an at://2048 game to their atproto repo, and a total of 3,457 games have been published. 
I am going to come back and finish out the leaderboards and social feeds, but I needed a bit of a break and to look at some other codebases for a bit. I expect to start on the appview in June.



# ATProto Shenanigans
![](https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:rnpkyqnmsw4ipey6eotbdnnf/bafkreiax6zhyco4ivid2eeejm3lqaztsndmf2t55pd6vgf7ivimj7kklqe@jpeg)

# Working On Teal
![](https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:rnpkyqnmsw4ipey6eotbdnnf/bafkreicw5yrfzesh2kgs42athqkiunzpiiyeremywsmgzcmhlyb3r2hcxq@jpeg)
I've sort of been looking for an atproto project that I could start making weekly contributions to help out in. Mostly, I've just have learned a lot more about the protocol, and I wanted to give back to the community as a whole in some way. There's a lot going in the world right now, and although nothing I am doing is changing the world in a real way, it feels good to give back in someway and help where I can.

A couple of weeks ago I made a post about wanting to try out [last.fm](https://www.last.fm/) to have some stats of the music I've been listening to. Well [@daniel roe](https://bsky.app/profile/danielroe.dev) replied to wait on [teal.fm](https://teal.fm)  

::bluesky-embedded{:postAtUri="at://did:plc:jbeaa5kdaladzwq3r7f5xgwe/app.bsky.feed.post/3lpabuonbi22q"}
::

Well, it kind of hit me then. Why wait? teal.fm is [open source](https://github.com/teal-fm), I could start today. I like the team working on teal.fm, and it's a project I would really like to have. So it just clicked here was a project I could help out with. Which is the cool thing about open source. So since then I've decided to dedicate a few hours a week helping out where I can.



Talk abotu what i've been working on. Piper, docker, etc

