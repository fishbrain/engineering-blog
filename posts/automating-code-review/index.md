---
layout: postLayout.njk
postTitle: "Automating Code Review"
date: "2019-06-14T17:49:07.651Z"
subtitle: "Removing friction from pull requests"
imageSrc: 1_eFw5raKT8TwcEpog-l-Wzw.jpeg
imageAlt: "Photo by Thomas Ashlock on Unsplash"
author: Klas Eskilson
tags: post
postTags:
  - Software Development
  - git
  - Github
  - Workflow
  - Code Review
---

At Fishbrain, code reviewing through pull requests is one of our backend team’s core pillars. It allows us to share knowledge, learn from others, and correct mistakes at an early stage. We never ship a feature without it going through code review first.

As you might know and understand, this is rather time-consuming. While we are convinced it is the right thing to do, being stuck as a reviewer or review target is just *the worst* on those certain days. This is why we have carefully developed our code reviewing process, making sure it runs as smooth as possible with most of the friction removed. What we’ve discovered and how we do things is what this post is about.

## Bots — Computers working for us

Automating tasks through bots is the best! Computers are amazing at making tedious chores go away. One of the bots we rely on on a daily basis is [Dependabot](https://dependabot.com/) ([recently acquired by GitHub](https://dependabot.com/blog/hello-github/) 🎉). It is a dependency management bot, constantly checking your app’s dependencies towards the dependency registry. With support for most languages and package managers out there, it has saved us weeks of work.

Manually making sure your dependencies stay up to date is hard, and as most of us know — the longer you wait, the harder bumping dependency versions get. Dependabot checks your dependencies at a configurable frequency and creates pull requests for each separate dependency. If you trust your continuous integration (CI) setup, Dependabot can merge the pull requests automatically once all your checks have passed.

Since Github’s introduction of [actions](https://github.com/features/actions), we’ve added some to our setup. To avoid having dangling branches around after a pull request has been merged, we defined an action in our repository’s [workflow](https://help.github.com/en/articles/creating-a-workflow-with-github-actions) setup that triggers a [fork](https://github.com/fishbrain/branch-cleanup-action) of [Jess Frazelle’s `branch-cleanup-action`](https://github.com/jessfraz/branch-cleanup-action). This safely removes any branches still around after merging. What we’ve modified is to prevent it from trying to delete special branches as well as handling manually removed branches gracefully.

## CI—Linting and tests

Speaking of CI and being able to trust the tools in place, this is probably one of the most fundamental parts of automating a pull request review. With Fishbrain being a Ruby shop, we rely on Rubocop to do style checking and use Rspec to write the app’s tests. This allows us to let automated tasks prove that the suggested changes work as intended and follow the code style put in place. To speed things up and shorten the feedback loop even further, we run these two checks in parallel using two different setups.

While this might increase the complexity of our CI tooling, we have found that the benefits outweigh the cost. The checks run on AWS Codebuild, which allows us to run multiple tasks in parallel, and they are being managed through Terraform and some configuration files in the Git repository of each project. Our test suite is rather massive and takes some time to run, so being able to get the Rubocop feedback on a pull request even faster is of tremendous help.

As a team, we have been avoiding using tools like [Hound](https://www.houndci.com/) in our pull requests. While they are great and allows the pull request to be enhanced with the results from Rubocop, as an example, we prefer to have that separate from the discussion forum that the pull requests are.

## Requesting feedback

To let our colleagues know that we need their feedback on our work, we used to rely on manual pinging through Slack or Github’s review requests. While this worked from time to time, it was not an ideal solution. There were two tools, and neither of them provided the structure we wished for. Slack was too easy to forget and the review requests were too easy to miss.

This is when we found [Pull Panda](https://pullreminders.com/) (previously known as Pull Reminders). This is a tool that works as a bridge between Slack and Github. It integrates with both of the platforms’ APIs to send reminders through Slack to the reviewers when their feedback is requested on Github. Each developer can then set up reminders as they choose, decide how they want to get notified and as a team there are lots of different options on how to configure it in a way that works for you.

While it is unclear if the introduction of Pull Reminders has affected the review turnaround time, we now have a tool to measure it with. Having a shared review turnaround target, we can now gain a greater insight into how we perform. Stale pull requests get highlighted and different statistics become easy to track over time.

Another Pull Reminders feature that deserves mentioning here is the automatic assigning. By assigning a Github team to review your PR, Pull Reminders then selects any number of reviewers based on a set of configurable options. As an example from us, when picking the backend team to review your PR, Pull Reminders then selects one reviewer based on each developer’s current review load.

*Note: Since publishing this, Pull Panda was [acquired by Github](https://pullpanda.com/github), too.*

---

This is just a fraction of all our efforts to automate code reviews. We’d love to hear more great ideas from you! Please feel free to reach out to us if you got something else we should check out.

---

*Thanks to Emil Bogren.*
