---
layout: postLayout.njk
postTitle: "Using mise to manage development environments"
date: "2025-12-15T19:42:00.000Z"
imageSrc: photo-1592929043000-fbea34bc8ad5.jpg
imageAlt: "Use the right tool for the job. Photo from @polarmermaid on Unsplash"
author: Luke Hansford
tags: post
postTags:
  - Programming
  - Coding
  - Tools
  - CLI
---

At [Fishbrain](https://fishbrain.com/) we work with many programming languages across multiple projects. Switching between projects can be a hassle if those projects have different languages, or different versions of the same language, and so recently I've been using a tool called [`mise`](https://mise.jdx.dev/about.html) to handle this.

When `mise` is set up correctly it will allow you to automatically use the correct version of a language for each project you're in:

```sh
> cd mykiss-web
> node --version
v20.12.0
> cd ../ornatus-administration
> node --version
v18.7.1
> cd ../rutilus-api
> ruby --version
ruby 3.3.1 (2024-04-23 revision c56cd86388) [arm64-darwin23]
```

## Installing mise

Installing is simple enough, just run the following in your terminal:

```sh
curl https://mise.run | sh
mise activate
```

This will download `mise` and add it to your shell config. You will need to restart your terminal for the changes to take effect.

## Adding version files

`mise` has [it's own configuration format, `mise.toml`](https://mise.jdx.dev/configuration.html), to define what language versions you want to work with. At Fishbrain we have a number of legacy formats from other environment managers which also work with `mise`.

For Node we use `.nvmrc`:

```txt
20
```

For Ruby we use `.ruby-version`:

```txt
3.3.1
```

For Terraform we use `.terraform-version`:

```txt
1.8.1
```

One benefit of using these formats is that other tooling can generally work with them. For example for all Github Actions where we use Node, we have the following step which ensures we use the same version of Node locally and in CI:

```yaml
- uses: actions/setup-node@v4
  with:
    node-version-file: '.nvmrc'
```

## Switching environments

Once you've added a version file to your project, `mise` will automatically try to use that language version. When entering your project in the terminal for the first time you might see a message like this:

```sh
mise missing: node@22.0.0
```

`mise` is telling us that we haven't installed that version of a language yet. To do so run:

```sh
> mise install
mise node@22.1.0 ✓ installed
> node --version
v22.1.0
```

## Other features of mise

Currently I only use `mise` for managing language versions, but there's some other cool features. A `mise.toml` file can also be used to handle environment variables and reduce the need for a tool like `crossenv`. It can also be used as a task runner similar to Node's `package.json`.

## Alternatives to mise

At Fishbrain we've been mostly using language specific tools like NVM or RVM. These tools work fine, but having one tool to handle all environments is something I've found handy. I've personally also found `mise` to be much more performant and less prone to breakage.

[`asdf`](https://asdf-vm.com/) is another popular alternative, though [the `mise` docs have a nice comparison on why they think `mise` is the better tool](https://mise.jdx.dev/dev-tools/comparison-to-asdf.html).

*Originally published at [https://lukehansford.me/posts/using-mise-to-manage-development-environments/](https://lukehansford.me/posts/using-mise-to-manage-development-environments/)*
