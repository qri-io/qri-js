# qri-js

A monorepo of javascript packages useful in the qri dataset version control ecosystem.

## Packages

**qriswitch** - A CLI tool for quickly switching qri profiles.  (Tells qri to use a different `.qri` directory by setting environment variables)

**qri-node** - Nascent nodejs bindings for qri CLI.  Lets you do things like `qri.save()`, `qri.push()`, etc.

## Publishing

This monorepo uses `lerna`, run `lerna publish` after committing changes, and you'll see a prompt for incrementing versions for each package.
