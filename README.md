# Fishbrain Engineering Blog

This repo contains the code for the [Fishbrain Engineering Blog](https://engineering.fishbrain.com/).

## Setup

Run:

```sh
> yarn && yarn dev
```

You'll now have a local instance of the blog running at [localhost:3000](localhost:3000);

## Deploying

Everytime a commit is made to the `main` branch, the app is built and deployed to an AWS Lamda using
[serverless-nextjs](https://github.com/serverless-nextjs/serverless-next.js).

## Adding a new post

You can add a post by running:

```sh
> yarn add-post
```

Exisiting posts can be found at [./public/content/posts](./public/content/posts) and authors at [./public/content/authors](./public/content/authors).

## Writing a post

Posts are written in markdown. To add images to a post, copy the image to the post directory and just
refer to the image in your post like so (the same applied for post cover images and author avatars):

```markdown
![This is the alt text](my-image-file-name.png)
```

### Adding syntax highlighting

When adding code snippets to your post, it's possible to enable language specific highlighting
by appending the language name like so at the top of the code block:

> \```ruby
>
>     puts "Hello world"
>
>  \```

[A full list of supported languages can be found here](https://prismjs.com/#supported-languages).

### Adding tags

You can tag your post by adding a tags field to your post frontmatter:

```yaml
---
title: Structuring an Elixir+Phoenix App
date: "2020-07-17T22:12:03.284Z"
author: brian-underwood
tags:
  - Elixir
  - Phoenix
---
```

### Adding iframes/embeds

We use a custom syntax for embedding iframes (e.g. Youtube videos, etc.):

```markdown

<!-- with a caption -->
?[Here's my video](https://www.youtube.com/embed/5qap5aO4i9A)

<!-- without a caption -->
?[](https://www.youtube.com/embed/5qap5aO4i9A)

```

Domains must be whitelisted in [lib/markdownToHtml.ts](lib/markdownToHtml.ts).

#### Embedding tweets

Twitter doesn't use iframes by default, but you can utilise [https://twitframe.com/](https://twitframe.com/)
to embed tweets as iframes in the way described above.

## What's missing

This project's intent is to migrate our Engineering blog from Medium to our own self-run blog. Currently
we're missing the following capabilities:

- can't bold text in code snippets (see https://medium.com/fishbrain/graphql-fragments-are-amazing-1458d81fc5f)
- Inline images (see https://medium.com/fishbrain/graphql-fragments-are-amazing-1458d81fc5f)
- Comments. We can probably add disqus pretty easily.
- URL embeds like seen for "Noisli" in this article https://medium.com/fishbrain/transitioning-into-working-remote-3dbba1c26aac
- Cant have urls in image caption/alt E.g. ![An illustration of a sphere with its three axis. Sourced from Wikipedia.](1_bKy1EAZynH-oAGVDOndRoQ.png) - the wikipedia part should be linkable.
- Cant embed Gists (see https://medium.com/fishbrain/finding-the-center-point-in-a-cluster-of-coordinates-e607cdf75fd5)

## Known issues

- Sometimes images will appear missing in the dev environment. If this happens just restart the dev server.
