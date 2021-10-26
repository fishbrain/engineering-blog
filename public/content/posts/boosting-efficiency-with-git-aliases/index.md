---
title: "Boosting Efficiency With Git Aliases"
date: "2021-10-26T11:15:55.150Z"
subtitle: "We are developers and developers love making their lives easier by automating boring stuff which they need to do every day. This article shows how to boost up your efficiency by introducing a couple of Git aliases which can help you to automate some of the most used Git tasks."
imageSrc: boost-efficiency.png
imageAlt: Boost Efficiency Git Commands
author: knut-holm
tags:
  - git
  - git-aliases
---

## Few Words About Git CLI

When I first came across Git many years ago, I installed a graphical tool for clicking on the commands rather than learning properly how to use the CLI as many other developers do. After some time, I got irritated by not being able to perform actions I wanted to do simply by not understanding what was going on under the hood. That was exactly the moment for downloading a copy of [Git Pro book](https://git-scm.com/book/en/v2) and starting to learn Git for real.  
If you haven't passed that moment yet, I strongly recommend to start with the book and come back to this article once you have finished at least the first two chapters. On the other hand, reading this article first can be a good motivation for learning the Git CLI as well - it may just be quite hard reading for you if have never touched Git CLI before. Whether one way or another, let's dive into on of the most powerful aspect of Git: the aliases.

__Note:__ All aliases in this article have been tested on macOS Big Sur in Bash.

## How to Configure Aliases

Before we start, I just want to briefly mention how you can add your own Git aliases. They sit in a `.gitconfig` file which is either global or project based file. For most of the aliases makes sense introducing them globally, which can be achieved by couple of different ways. I like the most editing the config file directly:

```bash
$ git config --global -e
```

This file contains much more configuration than just the aliases. We will focus on the aliases only, which can be added to the config file this way:

```bash
[alias]
	v = !git --version
```

After saving the file, we can now use our new alias:

```bash
$ git v
git version 2.30.1 (Apple Git-130)
``` 

This saves us typing 8 characters every time we want to check Git version! Not the most useful alias ever, but you got an idea about what are aliases for; we are developers and developers love making their lives easier by automating boring stuff which they need to do every day, couple of times. By getting rid of typing unnecessary characters with Git aliases, you can significantly boost your efficiency.

### Further Reading

* [Git Config](https://git-scm.com/docs/git-config)
* [Git Aliases](https://git-scm.com/book/en/v2/Git-Basics-Git-Aliases)

## Committing With Minimal Effort

I assume everybody knows this one of the most basic Git commands:

```bash
$ git commit -m "My commit message"
```

Quite boring, right? What about being able to write this instead, which will do exactly the same job?

```bash
$ git cm My commit message
```

That is possible if we introduce a new alias:

```bash
[alias]
	cm = "!f() { git commit -m \"$(echo $@)\"; }; f";
```

That can look a bit complicated at first sight so let's have a look into details:

* `"!f() { 〈my command〉 }; f"` is an anonymous Bash function; its content is a bash script rather than pure Git commands which opens the whole new world for our aliases!
* `git commit -m` is our familiar and boring Git command
* `"` characters wrap our commit message, so we don't have to type it every time. In addition, we need to escape it with `\` character to don't overlap with the end of the anonymous Bash function
* `$()` executes another Bash function inside our anonymous Bash function
* `echo $@` prints all passed arguments (`My commit message` in this case)

When now understanding this command, we can extend it a bit and add a new one:

```bash
[alias]
	acm = "!f() { \
		git add . && git commit -m \"$(echo $@)\"; \
	}; f"; 
```

Can you guess what this alias does? Try it on your own!

### Pro Tip

Most of the companies use some ticket tracking system like Jira and like adding ticket number to each commit message. I probably don't have to elaborate on how boring is typing `ABC-12345:` prefix every time when specifying the commit message. What about automating it?

Let's assume this is our branch name: `ABC-12345-description`. We already have the information about the ticket number, so we can parse it and add to the commit message automatically with help of this alias:

```bash
[alias]
	cmt = "!f() { \
		git commit -m \"$(git symbolic-ref --short HEAD \
		| awk -F'[ -]' '{print $1\"-\"$2}'): \
		$(echo $@)\"; \
	}; f";
```

Usage:

```bash
[ABC-12345-description]$ git cmt My commit message
```

When you now look into `git log`, you will see a commit message like this:

```bash
commit 7811dbdfb193e21da169e74eb447862ddeb674c9
Author: Knut Holm
Date:   Tue Oct 26 08:59:33 2021 +0200

    ABC-12345: My commit message
```

### Further Reading

* [Bash Scripting Tutorial for Beginners](https://linuxconfig.org/bash-scripting-tutorial-for-beginners)
* [One weird trick for powerful Git aliases](https://www.atlassian.com/blog/git/advanced-git-aliases)

## Let's Branch With Ease

You know this: a colleague ask you for code review, the change is quite big and you would like to check out their branch so you can have a look on your own machine. Or maybe somebody has handed over a ticket to you which is partially done, and you are about to continue in the same branch. In any of these scenarios you need to type a bit:

```bash
$ git fetch
$ git checkout --track origin/name-of-the-branch
```

Boring? Not anymore with the following alias:

```bash
[alias]
	cr = "!f() { \
		git fetch && git checkout --track \
		origin/$(echo $1); \
	}; f";
```

Usage:

```bash
$ git cr name-of-the-branch
```

The similar situation occurs when you are about to start working on a new ticket, and you want to create a new branch from the most actual master. Again, you either need to type a bit:

```bash
$ git checkout master
$ git pull
$ git checkout -b my-new-branch
```

Or you can introduce a new alias:

```bash
[alias]
	cb = "!f() { \
		git checkout master && \
		git pull && \
		git checkout -b $(echo $1); \
	}; f";
```

And use this command instead:

```bash
$ git cb my-new-branch
```

### Pro Tip

As I already mentioned, lot of the companies like using this kind of branches name `ABC-12345-description-of-the-feature-im-working-on` which is a combination of Jira ticket number and its description. If you are as lazy developer as I am, you probably don't like typing the whole thing manually every time when creating a new branch. Can we automate it? Of course, we can!

The ultimate goal is this:

```bash
$ git cbt ABC-12345

[ABC-12345-description-of-the-feature-im-working-on]$
```

We can for sure use an alias for doing so, but we are missing one important information here which is the feature description. We use Jira at Fishbrain, which is the place where we can look for this information. But how can we do so?  
Fortunately, Jira offers REST APIs which we can access to get this information. But first we need to [generate our personal token](https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account) to access the endpoints which require authentication. Once we have the token, we can combine it with our E-mail and encode the whole string with Base64:

```bash
$ echo -n "knut@example.com:123456abcdef" | base64

a251dEBleGFtcGxlLmNvbToxMjM0NTZhYmNkZWY=
```

For a simpler usage, we can add the token to environment variables (ideally by adding the export to your `.bashrc` file):

```bash
$ export ATLASSIAN_TOKEN=a251dEBleGFtcGxlLmNvbToxMjM0NTZhYmNkZWY=
```

Now we can use curl to get the ticket information:

```bash
$ curl \
	-s \
	-H "Authorization: Basic $ATLASSIAN_TOKEN" \
	https://your-domain.atlassian.net/rest/api/2/issue/ABC-12345
```

Because of this is fetching the whole ticket JSON, and we need only the summary, we would like to filter the response somehow. Quite handy tool for working with this is [jq](https://stedolan.github.io/jq):

```bash
$ curl \
	-s \
	-H "Authorization: Basic $ATLASSIAN_TOKEN" \
	https://your-domain.atlassian.net/rest/api/2/issue/ABC-12345 | \
	jq '.fields.summary
	
"Description of the feature I am working on"
```

The next step is to slugify the description (credits: [Quick bash slugify](https://gist.github.com/oneohthree/f528c7ae1e701ad990e6)):

```bash
$ echo "Description of the feature I am working on" | \
	iconv -t ascii//TRANSLIT | \
	sed -r s/[^a-zA-Z0-9]+/-/g | \
	sed -r s/^-+\|-+$//g | \
	tr A-Z a-z
	
description-of-the-feature-i-am-working-on
```

Almost done! Now we can finally combine everything into a Git alias:

```bash
[alias]
	cbt = "!f() { \
		git checkout master && \ 
		git pull &&  \
		git checkout -b \
		$(echo $@)-$(curl -s \
		-H \"Authorization: Basic $ATLASSIAN_TOKEN\" \
		https://your-domain.atlassian.net/rest/api/latest/issue/$1 | \
		jq '.fields.summary' | \
		iconv -t ascii//TRANSLIT | \
		sed -r s/[^a-zA-Z0-9]+/-/g | \
		sed -r s/^-+\\|-+$//g | \
		tr A-Z a-z); \
	}; f";
```

### Further Reading

* [Basic auth for REST APIs](https://developer.atlassian.com/cloud/jira/platform/basic-auth-for-rest-apis) (Atlassian)
* [Tutorial](https://stedolan.github.io/jq/tutorial) (jq)

## Summary

We went through some possibilities how your can boost up your efficiency with introducing Git aliases. Now when you know the aliases a bit, you can think about how can you extend them or what other aliases you can introduce to make your work even more efficient.  
My recommendation is to focus on mapping the tasks you are performing very often, because they can be boring and time-consuming. Once you have identified them, you can think about how you can automate them and make your life even easier. Please share your ideas with others!

### Bonus

List of some of my most useful Git aliases:

```bash
[alias]
  # push a new local branch to origin and sets upstream; git pu
  pu = push -u origin HEAD
  
  # force-push a local branch to origin; git fp
  fp = push --force-with-lease
  
  # commit with message; git cm My commit message
  cm = "!f() { git commit -m \"$(echo $@)\"; }; f";
  
  # add all and commit with a message
  acm = "!f() { git add . && git commit -m \"$(echo $@)\"; }; f";

  # commit with a message having a ticket prefix; git cmt My commit message
  cmt = "!f() { git commit -m \"$(git symbolic-ref --short HEAD | awk -F'[ -]' '{print $1\"-\"$2}'): $(echo $@)\"; }; f";
  
  # add all and commit with a message having a ticket prefix; git acmt My commit message
  acmt = "!f() { git add . && git commit -m \"$(git symbolic-ref --short HEAD | awk -F'[ -]' '{print $1\"-\"$2}'): $(echo $@)\"; }; f";
  
  # checkout remote branch, create local branch with the same name and track the remote branch; git cr ABC-12345-description
  cr = "!f() { git fetch && git checkout --track origin/$(echo $1); }; f";
  
  # checkout local branch from the most actual master; git cb new-branch-name
  cb = "!f() { git checkout master && git pull && git checkout -b $(echo $1); }; f";
  
  # checkout local branch from the most actual master and give it a name by Jira ticket description; git cbt ABC-12345
  cbt = "!f() { git checkout master && git pull && git checkout -b $(echo $@)-$(curl -s -H \"Authorization: Basic $ATLASSIAN_TOKEN\" https://your-domain.atlassian.net/rest/api/latest/issue/$1 | jq '.fields.summary' | iconv -t ascii//TRANSLIT | sed -r s/[^a-zA-Z0-9]+/-/g | sed -r s/^-+\\|-+$//g | tr A-Z a-z); }; f";
  
  # delete local branches which are fully merged to master; git clean clean-branches
  clean-branches = "!f() { git branch --merged master --no-color | grep -v \"master\\|stable\\|main\" | xargs git branch -d; }; f";
  
  # print a nice formatted compact git log; git lg1
  lg1 = log --graph --abbrev-commit --decorate --format=format:'%C(bold blue)%h%C(reset) - %C(bold green)(%ar)%C(reset) %C(white)%s%C(reset) %C(dim white)- %an%C(reset)%C(bold yellow)%d%C(reset)' --all
  
  # print a nice formatted git log with dates (less compact); git lg2
  lg2 = log --graph --abbrev-commit --decorate --format=format:'%C(bold blue)%h%C(reset) - %C(bold cyan)%aD%C(reset) %C(bold green)(%ar)%C(reset)%C(bold yellow)%d%C(reset)%n''          %C(white)%s%C(reset) %C(dim white)- %an%C(reset)' --all
  
  # use the lg1 alias as the standard log command; git lg
  lg = !"git lg1"
```