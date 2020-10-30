# qriswitch

A node CLI for switching qri profile environment variables.  Tested on MacOS Catalina.

## Background

Qri makes use two hidden directories, `.qri` and `.ipfs`, located in the user's home directory. Together, these define the qri user's identity and collection of datasets.

Switching to a different user identity is possible if the user sets `QRI_PATH` and `IPFS_PATH` to different directories and either running Qri Desktop or running `qri setup` in qri CLI.

qriswitch allows for quickly changing these two environment variables to switch between multiple profiles.

## Getting Started

Have nodejs and qri installed, then

- Clone this repo
- Install dependencies `yarn`
- Install as a global command `npm install -g`
- The command `qriswitch` should be available in your terminal

## Source qriswitch's env variables file in your shell

qriswitch sets environment variables in a file `$HOME/.qriswitch/.env`.  This file should be sourced in your shell environment:

For me, it's `.bash_profile`, but add this wherever your shell gets its settings.
```
source ~/.qriswitch/.env
```

## Creating a New Profile

If you create a new profile using qriswitch and then open Qri Desktop, you'll have a local-only peername.
You will need to run `qri registry signup` to register this qri peer with qri.cloud before publishing.

## Switch!

Run `qriswitch`, you'll see a prompt to choose from existing profiles, use the default (home directory) profile, or create a new profile

```
current profile: chriswhong_dev
? Choose a Profile (Use arrow keys)
❯ chriswhong_dev
  ──────────────
  use default qri profile
  create a new profile
```

If you're using Qri CLI:
- make sure Qri Desktop is not running
- after switching, the current shell still thinks the previous environment variables are still in effect.  Either run `source ~/.qriswitch/.env` or open a new terminal window to use the new profile.

If you're using Qri Desktop:
- make sure it is not running when you switch

## Profiles

Profiles are just hidden directories in `$HOME/.qriswitch` containing `.ipfs` and `.qri` directories.

For example, if you create a profile named `myusername`, qriwitch will create:
- `$HOME/.qriswitch/myusername/.qri`
- `$HOME/.qriswitch/myusername/.ipfs`

Creating a profile only makes these directories and sets the environment variables to

## Environment Variables

`QRI_PATH` and `IPFS_PATH` are used to override the default paths for the qri and ipfs directories (`$HOME/.qri` and `$HOME/.ipfs`, respectively)

When you choose a profile, qriswitch does two things:
- exports both environment variables in `$HOME/.qriswitch/.env`, which makes them available in your shell (see above for how to 'source' this file)
- uses `launchctl setenv` to make both environment variables available to Qri Desktop

This has never been tested in Windows or Linux.  PRs welcome for expansion to other environments.
