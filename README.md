# Fishbrain Engineering Blog

This repo contains the code for the [Fishbrain Engineering Blog](https://engineering.fishbrain.com/).

## Setup

Run:

```sh
> yarn
> yarn dev
```

You'll now have a local instance of the blog running at [localhost:8000](localhost:8000);

## Deploying

Everytime a commit is made to the `main` branch, the app is built using Github Actions and deployed to an
S3 bucket.

## Adding a new post

To add a new post just clone a folder in the `/posts` folder. Rename it and update the frontmatter (the metadata at the
top of the file).

If it's your first post also update `/_data/authors.json` with your info.

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
postTitle: Structuring an Elixir+Phoenix App
date: "2020-07-17T22:12:03.284Z"
author: Brian Underwood
postTags:
  - Elixir
  - Phoenix
---
```

> NOTE: Don't use `tag` - this value should always be `post`,

### Adding iframes/embeds

You can use HTML for embedding iframes (e.g. Youtube videos, etc.):

```markdown

<!-- with a caption -->
<figure>
  <iframe src="https://www.youtube.com/embed/dtxPp9UOcIc" height="480" width="670" allowfullscreen="true" frameborder="0"></iframe>
  <figcaption>Here's my video</figcaption>
</figure>

<!-- without a caption -->
<iframe src="https://www.youtube.com/embed/dtxPp9UOcIc" height="480" width="670" allowfullscreen="true" frameborder="0"></iframe>

```

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
