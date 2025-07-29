---
title: 'Host a PDS via a Cloudflare Tunnel'
description: 'Learn how to use a Cloudflare Tunnel to host your PDS on a local network.'
date: "2025-07-29T04:37:00Z"
draft: false
image:
    src: "/article-assets/12/cover.png"
    alt: "ascii text that shows a cloud above the text atproto "
head:
    meta:
      - name: "twitter:card"
        content: "summary"
      - name: "twitter:image"
        content: "https://baileytownsend.dev/article-assets/12/cover.png"
      - name: "keywords"    
        content: "PDS,personal data server, PDS with cloudflare tunnel, atproto, atprotocol"
      - name: 'author'
        content: 'Bailey Townsend'
---

So, you want to host a PDS on your network, but you may not want to open a port on your router(or able to). Or port 80/443 is already taken up by an application, and you don't want to deal with Caddy/nginx. Well, if that's the case then this is the blog post for you!
Today we are going to set up a PDS and use a [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) to proxy requests from the web to your locally hosted PDS. 


# Table of Contents
- [Requirements](#requirements)
- [Cloudflare Tunnel Setup](#cloudflare-tunnel-setup)
- [Installing your PDS](#installing-your-pds)
  - [Installing the actual PDS](#installing-the-actual-pds)
  - [After Install Surgery](#after-install-surgery)
  - [*Bonus* Install on newer distros](#bonus-install-on-newer-distros)
- [Invalid Handle](#invalid-handle)
- [Wrap up](#wrap-up)


# Requirements
- A domain that is hosted on Cloudflare. I also recommend using a top level domain, Like `attoolbox.app`. Not something like `pds.attoolbox.app` if you are planing on using handles on it like `bailey.attoolbox.app`. If you don't have one, can do `pds.yourdomain.name`. Just may expect to have to manually set a `_atprot.` DNS TXT record so they resolve.
- A Linux Distro. Raspberry Pi OS works great and what I used when writing this guide. Or I use Ubuntu 24.04 LTS for my main.
- About 30 minutes of free time


# Cloudflare Tunnel Setup
I'm not going
to get too much into how to create a tunnel
[since their documentation does it well](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/get-started/create-remote-tunnel/).
Once you are done with step 1 and have `cloudflared` installed and connected you can come back to this guide.

With `cloudflared` installed and your tunnel connecting you should now be on a page to add a public hostname.
We want to create 2 of these. 

The first one that handles all your XRPC requests
- Leave subdomain blank
- Domain is the domain you are using 
- Service Type is HTTP
- URL is `localhost:3000`

![Picture on cloudflare of the above settings](/article-assets/12/public_host_one.jpg)

Then can click complete setup. We do need to setup a second one so can click on the tunnel name -> edit -> public hostnames
-> add a public hostname

The second one for handles like `bailey.attoolbox.app`
- Set `*` for the subdomain
- Domain is the domain you are using
- Service Type is HTTP
- URL is `localhost:3000`


![Picture on cloudflare of the above settings](/article-assets/12/public_host_two.jpg)

Next we are going
to set up a `CNAME` record with the name `*` for the domain [following this](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/routing-to-tunnel/dns/).
(Can copy the Target from the other record the tunnel created for the first public hostname).


And that's it! Cloudflare will handle your SSL and routing via the Tunnel.


# Installing Your PDS
We're going to *mostly* follow the guide from Bluesky found [here for PDS self-hosting](https://atproto.com/guides/self-hosting).

We are going to skip on down to [Installer on Ubuntu20.04/22.04 and Debian 11/12](https://atproto.com/guides/self-hosting#installer-on-ubuntu-20-04-22-04-and-debian-11-12). Since we set up all the DNS stuff with the Cloudflare Tunnel setup. 

## Installing the actual PDS
Get the [installer.sh](https://raw.githubusercontent.com/bluesky-social/pds/main/installer.sh) script.

Can use `wget`
```bash
wget https://raw.githubusercontent.com/bluesky-social/pds/main/installer.sh
```

or `curl`
```bash
curl https://raw.githubusercontent.com/bluesky-social/pds/main/installer.sh >installer.sh
```
> ***If you are wanting to install the PDS to a newer distro, like maybe Ubuntu 24.04 LTS, you can go to [*Bonus* Install on newer distros](#bonus-install-on-newer-distros) and then come back here once you are done.***

## Setup screens
Can run the script with this
```bash
# Gives the script execute permission
chmod +x ./installer.sh
# Runs the script. Needs root
sudo ./installer.sh
```

After you get the script and run it, you should see this screen.
```bash
---------------------------------------
     Add DNS Record for Public IP
---------------------------------------

  From your DNS provider's control panel, create the required
  DNS record with the value of your server's public IP address.

  + Any DNS name that can be resolved on the public internet will work.
  + Replace example.com below with any valid domain name you control.
  + A TTL of 600 seconds (10 minutes) is recommended.

  Example DNS record:

    NAME                TYPE   VALUE
    ----                ----   -----
    example.com         A      104.236.54.66
    *.example.com       A      104.236.54.66

  **IMPORTANT**
  It's recommended to wait 3-5 minutes after creating a new DNS record
  before attempting to use it. This will allow time for the DNS record
  to be fully updated.

Enter your public DNS address (e.g. example.com):
```

You can ignore the DNS setup, since it's already done with the tunnel setup. Go ahead and enter your domain name you want to use for the PDS, 


For `Enter an admin email address (e.g.) you@example.com` I put an email I set up using [resend](https://resend.com/) from their [Setting up SMTP](https://github.com/bluesky-social/pds?tab=readme-ov-file#setting-up-smtp) section.

> If you're not getting emails may check that you have the value set in `/pds/pds.env` and sometimes a `docker compose down` and `docker compose up -d` helps to refresh the containers env variables.

After that you wait for the installer to do its thing. Once that is done it asks you if you `Create a PDS user account? (y/N): ` I recommend setting one up so you can use it as a test that `*.yourdomain.com` handles are resolving fine.

# After Install Surgery
This is optional, but I recommend it. Since we're not using Caddy you want to remove it from the docker compose 

1. Login as root
2. `cd /pds`
3. Open open `compose.yaml`
4. Remove the service `caddy` lines `4-16`. Should look like this after
```yaml
version: '3.9'
services:
  pds:
    container_name: pds
    image: ghcr.io/bluesky-social/pds:0.4
    network_mode: host
    restart: unless-stopped
    volumes:
      - type: bind
        source: /pds
        target: /pds
    env_file:
      - /pds/pds.env
  watchtower:
    container_name: watchtower
    image: containrrr/watchtower:latest
    network_mode: host
    volumes:
      - type: bind
        source: /var/run/docker.sock
        target: /var/run/docker.sock
    restart: unless-stopped
    environment:
      WATCHTOWER_CLEANUP: true
      WATCHTOWER_SCHEDULE: "@midnight"
```
5. run `docker compose down` to remove the caddy container
6. run `docker compose up -d` to bring everything back online

# *Bonus* Install on newer distros

The [installer.sh](https://raw.githubusercontent.com/bluesky-social/pds/main/installer.sh) does a check to make sure you are using only a distro Bluesky has confirmed works. I have my personal account [@baileytownsend.dev](https://bsky.app/profile/baileytownsend.dev) hosted on a VPS running Ubuntu 24.04 LTS.
So I feel comfortable to say you can install and run a PDS from a newer LTS Ubuntu distro.

Once you download the [installer.sh](https://raw.githubusercontent.com/bluesky-social/pds/main/installer.sh). You can open it in your text editor of your choice and comment out lines `89-114`. These are the lines to remove.
```bash

  # Check for a supported architecture.
  # If the platform is unknown (not uncommon) then we assume x86_64
  if [[ "${PLATFORM}" == "unknown" ]]; then
    PLATFORM="x86_64"
  fi
  if [[ "${PLATFORM}" != "x86_64" ]] && [[ "${PLATFORM}" != "aarch64" ]] && [[ "${PLATFORM}" != "arm64" ]]; then
    usage "Sorry, only x86_64 and aarch64/arm64 are supported. Exiting..."
  fi

  # Check for a supported distribution.
  SUPPORTED_OS="false"
  if [[ "${DISTRIB_ID}" == "ubuntu" ]]; then
    if [[ "${DISTRIB_CODENAME}" == "focal" ]]; then
      SUPPORTED_OS="true"
      echo "* Detected supported distribution Ubuntu 20.04 LTS"
    elif [[ "${DISTRIB_CODENAME}" == "jammy" ]]; then
      SUPPORTED_OS="true"
      echo "* Detected supported distribution Ubuntu 22.04 LTS"
    elif [[ "${DISTRIB_CODENAME}" == "mantic" ]]; then
      SUPPORTED_OS="true"
      echo "* Detected supported distribution Ubuntu 23.10 LTS"
    fi
  elif [[ "${DISTRIB_ID}" == "debian" ]]; then
    if [[ "${DISTRIB_CODENAME}" == "bullseye" ]]; then
      SUPPORTED_OS="true"
      echo "* Detected supported distribution Debian 11"
    elif [[ "${DISTRIB_CODENAME}" == "bookworm" ]]; then
      SUPPORTED_OS="true"
      echo "* Detected supported distribution Debian 12"
    fi
  fi

  if [[ "${SUPPORTED_OS}" != "true" ]]; then
    echo "Sorry, only Ubuntu 20.04, 22.04, Debian 11 and Debian 12 are supported by this installer. Exiting..."
    exit 1
  fi

```

# Invalid Handle
IF you see the dreaded Invalid Handle like below, don't sweat it.
I'm going to give you a few tips and can always @ me on Bluesky, and we can figure it out.
I got it twice today setting up PDSes, it's easy to mess up.

![Picture of a profile saying invalid handle](/article-assets/12/oh_no.jpg)

First use [https://bsky-debug.app/handle](https://bsky-debug.app/handle)

IF your handle is like `bailey.yourpdsdomain.com`, and when you check on the debug page and see that HTTP Verification method is failing.
Then double check [Cloudflare Tunnel Setup](#cloudflare-tunnel-setup).
Will most likely have to do with one of the `*` settings.
Either the DNS record was missed or the tunnel public hostname.
If you do resolve it and still see Invalid Handle on bsky, but the debug page says you're good.
You may have to wait about 2-4 hours.
The app view caches it for a while, that's how long it took for mine to resolve itself.

IF you went with something like `bailey.pds.yourpdsdomain.com`, you are probably going to be better off setting a `_atproto` TXT record for it. 
The record would be `_atproto.bailey.pds`, more info on that [here](https://atproto.com/specs/handle#dns-txt-method). 

Worse comes to worst can always just do `_atproto.bailey` so you end up with `bailey.yourpdsdomain.com` via the setup in settings found [here](https://bsky.app/settings/account). Just remember it will be cached for a bit and may not show up right away on Bluesky even tho the debug tool says it's fine.


# Wrap up
I ended up writing this guide while setting up a PDS on a Raspberry Pi Zero 2 W. So that may be a cheap fun way to try out self hosting. I'm not sure if I would host your main account on it though...

::bluesky-embedded{:postAtUri="at://did:plc:rnpkyqnmsw4ipey6eotbdnnf/app.bsky.feed.post/3lv367w6a5k2v"}
::

And that's about it!
Thanks for reading, and I hope this helps, feel free to @ me if you hit any problems or have questions.