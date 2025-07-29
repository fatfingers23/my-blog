---
title: 'Host a PDS via Cloudflare Tunnel'
description: 'Learn how to use a Cloudflare Tunnel to host your PDS on a local network.'
date: "2025-08-01T21:00:00Z"
draft: true
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
Today we are going to set up a PDS and use a [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) to proxy requests from the web to your locally hosted PDS. This does require you to have your domain registered via Cloudflare. 


# Table of Contents

- [Installing your PDS](#installing-your-pds)
  - [Installing the actual PDS](#installing-the-actual-pds)
  - [*Bonus* Install on newer distros](#bonus-install-on-newer-distros)


    

# Installing Your PDS
We're going to *mostly* follow the guide from Bluesky found [here for PDS self-hosting](https://atproto.com/guides/self-hosting).

We are going to skip on down to [Installer on Ubuntu20.04/22.04 and Debian 11/12](https://atproto.com/guides/self-hosting#installer-on-ubuntu-20-04-22-04-and-debian-11-12). We'll handle all the DNS stuff with Cloudflare later. 

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

You can ignore the DNS setup, we will be doing that later. Go ahead and enter your domain name you want to use for the PDS, 
and that is on Cloudflare. Like `attoolbox.app`. I also recommend using a top level domain, not something like `pds.attoolbox.app` if you are planing on using handles on it like `bailey.attoolbox.app`.

For `Enter an admin email address (e.g.) you@example.com` I put an email I set up using [resend](https://resend.com/) from their [Setting up SMTP](https://github.com/bluesky-social/pds?tab=readme-ov-file#setting-up-smtp) section.

After that you wait for the installer to do its thing. Once that is done it asks you if you `Create a PDS user account? (y/N): ` I recommend setting one up so you can use it as a test later that `*.yourdomain.com` handles are resolving fine.


# *Bonus* Install on newer distros

The [installer.sh](https://raw.githubusercontent.com/bluesky-social/pds/main/installer.sh) does a check to make sure you are using only a distro Bluesky has confirmed works. I have my personal account [@baileytownsend.dev](https://bsky.app/profile/baileytownsend.dev) hosted on a VPS running Ubuntu 24.04 LTS.
So I feel comfortable to say you can install and run a PDS from a newer LTS Ubuntu distro.

Once you download the [installer.sh](https://raw.githubusercontent.com/bluesky-social/pds/main/installer.sh). You can open it in your text editor of your choice and comment out lines `89-114`. So your script would look like this
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