---
layout: postLayout.njk
postTitle: "Introducing and Surviving On-Call"
date: "2019-08-19T14:07:24.807Z"
subtitle: "Staying online and staying sane."
imageSrc: 1_GOLc6N-0ub-9F5wrgZFt4g.jpeg
imageAlt: "Photo by Matthew T Rader on Unsplash"
author: Klas Eskilson
tags: post
postTags:
  - Software Development
  - Continuous Integration
  - Continuous Delivery
---

At Fishbrain, we have for little over a year relied on an on-call rotation in order to ensure that Fishbrain is constantly online. Having gone from previously running a tight ship and relying on server operations contractors, to managing our infrastructure ourselves with an in-house rotation, we’ve learnt a lot. This post is about those learnings, what we think is worth sharing and how to gradually start rolling out your on call rotation. It was in large part inspired by [Molly Struve’s post](https://dev.to/molly_struve/making-on-call-not-suck-490) about making on-call not suck.

Fishbrain’s Engineering team has grown quite significantly over the past year. From being a company of about 25, we’re now closer to 75. While engineering isn’t the only department that has grown, this part of our organization has gone from three teams of about 3–5 engineers to around six teams of six engineers. This includes backend engineers, client engineers and what we call infrastructure engineers.

<figure>
  <iframe src="https://twitframe.com/show?url=https://twitter.com/sehnaoui/status/858711356933111815?s=20" height="480" width="670" allowfullscreen="true" frameborder="0"></iframe>
  <figcaption>Fishbrain DDOS.</figcaption>
</figure>

## Growing the team

Naturally, growing our company affects the team. Apart from the overall productivity that increases as our new team members gets a chance to settle in, we’re also increasing the amount of potential members of the on-call rotation. This is one of the challenges of an on-call rotation. As Struve mentioned in her post, it is important to avoid being on-call too infrequently. A balance is important to be able know what to do when you get an alert, at the same time as you avoid having burnt-out team members. You want people to gain on-call experience without it becoming too much of a burden.

At Fishbrain, we’ve settled for eight people today. Naturally, this means your on-call every eighth week, or roughly once every second month. What we found was that we needed to try a few different variations out. As we started off, we had three people in the rotation. Experience was gained quickly, but so did the mental load on these engineers. As we introduced more people to the rotation, we locked the team size just as it started feeling like it was a while ago since you were on call. This seemed like a natural balance to us.

Finding a balance that works for your team in combination with your application stack is key, which is why it might be hard to recommend a general recommendation.

## Expectations and Escalations

When you’re lost, alarms are blaring, and the service you are supposed to keep online just isn’t working, it is important to be able to get the help you need. This is the next major challenge of on-call. At Fishbrain, this is solved through different levels of escalation policies. The week before your shift begins, you are the second line on-call. That means that the person on the first line rotation can escalate things to you if they would need help.

With no official expectation of what you should do this week, the mental burden is low. If you can help the person who is first line, that’s great — but that is also where the expectations end.

Another type of escalation is having different types of alerts. This can be compared to different log levels. We have landed in two different levels for our alerts — warning and error. Warnings are simply logged to a Slack channel. They wont ping you during out of office-hours and they wont force you out of bed during night. They are simply there to indicate that an unexpected behavior has occurred in any of our systems. To take a real-world example, a surge of evictions in a Redis cache cluster might not be a problem during low-load hours. But if that cold cache is still misconfigured when the load increases, that might put too much pressure on another system, perhaps more resource consuming or configured for a lower load. All of a sudden you have an incident on your hands, which very likely could have been avoided.

Here we have yet another place where the importance of balance can be found. If you get constantly flooded by warnings, you will eventually stop listening to the system. Having smart warnings that adapt to changes and stay relevant is important. The same goes for errors, you wouldn’t want to end up in a situation where you stop listening to the alerts that get to you just because things actually are running.

<figure>
  <iframe src="https://www.youtube.com/embed/dtxPp9UOcIc" height="480" width="670" allowfullscreen="true" frameborder="0"></iframe>
  <figcaption>Fish related incidents happen.</figcaption>
</figure>

## Growing the Product

We previously mentioned the overall productivity increase of our team as it grows. This ties in to how your on-call week is. With more things happening throughout the company, it gets harder for the individual to keep up with the different changes. Understanding how a change in one of the backend services affect the other, or how an increased load on one system invisibly puts out another.

As product and platform complexity increases, so does the need for experienced on-call engineers. While we initially had all our senior engineers (iOS, Android and backend alike) in our rotation, we’re now seeing a change. Client engineers are stepping down from the rotation to give way to newer backend team members as they gain the necessary feeling of familiarity to our systems. This allows the people that work with and interact with our backend services on a daily basis to be the one that are on the rotation.

While it of course is possible to keep mobile engineers on the rotation too, letting them step down from the rotation gives them time to focus on other tasks that might be just as necessary. While they are all experts in interacting with some of our backend services, it is hard to ask them to keep up with all the internal mechanisms of our applications might fail.

## Getting Rested

The mental load being on-call puts on an engineer is something that should not be underestimated. While you might have a week with not a single alert or incident (which is the case most weeks for us, for the record), being tethered to your phone for a week and constantly close to you laptop is tiring. You need rest. At Fishbrain, we have a seven-day on-call rotation. Your shift starts on Monday at 1 p.m.m and ends the same time next week.

As Fishbrain is a company based in Sweden, the solution to giving our on-call engineer the chance to rest is governed by the law. The work-time law decides that you’re not allowed to work for more than eleven consecutive days. Being on call for seven days and then working the next week would be twelve consecutive days, and with no rest at that. The way we have solved this is that during the week after your on-call shift ends, you are therefore expected, allowed and encouraged to take a day off from work. Three-day weekend? One-day staycation? Sleeping for 36 hours? Video games, exercise, trip? You decide.

## The On-call Mindset

While there are still things to figure out for us, the past year with an on-call rotation has worked out fine. With a clear focus on people and service health, we’re seeing stability awareness increase in our backend team. Friday deploys are even scarier knowing that it is your colleague that will have to clean up your mess at 4 a.m.

Our backend team has decided that no deploys shall happen after 3 p.m., unless they contain a critical change or fix that is needed. If accidents occur, we’ve also decided to in as many cases as possible follow our standard deploy procedure. Get your changes reviewed by another developer, verify that it works as expected in our staging environment and then deploy to the production environment. Needles to say, you might not be at your best if you were to be woken up during your night sleep. That is why following procedure, documenting your steps and notifying your team mates on what you are doing ensures that mistakes are kept at a minimum. At any cost, you want to avoid putting more fuel to the fire. An accident made larger because of unreviewed decisions is not a situation you want to end up in.

---

With two periods of peak season passed with an on-call rotation, it is going to be exciting to see what challenges lie ahead. How we as a company and team will handle product needs, team changes and technical solutions is for the future to tell.
