---
layout: postLayout.njk
postTitle: "An Alternative to Force Pushing in Git"
date: "2019-02-16T18:11:42.446Z"
subtitle: "How to (not) lose commits & alienate colleagues"
imageSrc: 1_oweq1aE7O2aGFSO0Q6uaRQ.jpeg
imageAlt: "You and your Git friend."
author: Klas Eskilson
tags: post
postTags:
  - git
  - Software Development
  - Workflow
---

Git is an amazing version control system and the obvious choice for a lot of software teams around the world. Fishbrain is no exception. However, as your team grows, so does the count of simultaneous features in development. The need to stay up to date with the remote repository increases and helps you avoid nasty conflicts.

Git provides two options for doing this: `merge` and `rebase`. Wether to use one or the other is a [hot topic](https://www.atlassian.com/git/tutorials/merging-vs-rebasing) on its own, but we will not dig further into it. At Fishbrain we mostly use `rebase` and as this option rewrites Git history, we need to `push --force` when getting our code to our remote. Force pushing *safely* is what this post is all about.

---

> `--force` can cause the remote repository to lose commits; use it with care.

This is a snippet from the [Git documentation](https://git-scm.com/docs/git-push#git-push---force) on `push --force`. Seeing your work being blown into oblivion by an unsuspecting colleague is some of the least pleasant experiences you can have as a developer. It sucks. If you have been using `push --force` in your workflow you might see this risk as a necessary evil, but there is actually a way to make sure that it doesn’t happen to you or your colleagues: `push --force-with-lease`.

Git normally prevents you from rewriting history by making sure that the changes you push are aligned with what has already been pushed before. This means that your pushed commits must have a common past with the remote commits. `--force` is an option that allows you to bypass Git’s check for correct ancestry in the remote history. The end result of using `--force` or `--force-with-lease` is the same but the latter will ensure that your local reference of what is the latest remote commit is actually correct. It allows you to rewrite history, but prevents you from accidentally removing history by keeping the ancestry check.

As the Git documentation says *“If somebody else built on top of your original history while you are rebasing, the tip of the branch at the remote may advance with her commit”*. By blindly `—-force` pushing your work you would replace someone else’s. With `--force-with-lease`, you won’t.

However, there are some pitfalls when using `--force-with-lease`. If you fetch from the remote repository implicitly, by some mechanism like in an IDE or through a cronjob, you will update your reference of what is the latest work on the remote repository. Meaning that the remote tracking part of Git that checks that your work indeed is based on the latest work on the remote will fail. Workarounds exist though, such as separating the `push` and `fetch` references. See [Git’s documentation on the push command](https://git-scm.com/docs/git-push#git-push---force-with-leaseltrefnamegt) for more.

---

*Thanks to Emil Bogren.*
