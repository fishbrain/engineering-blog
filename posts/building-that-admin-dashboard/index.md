---
layout: postLayout.njk
postTitle: "Building that admin dashboard"
date: "2019-05-22T17:55:04.871Z"
subtitle: ""
imageSrc: 1_MrY2VuIEwvhl85ftn6VS4Q.jpeg
imageAlt: "Fishbrain ground control. Photo: NASA via Wikimedia"
author: Klas Eskilson
tags: post
postTags:
  - Ruby on Rails
  - CMS
  - Web Development
  - Software Engineering
  - Tech
---

At Fishbrain, we have known for a while that our old admin panel was outdated. It was built using *Angular.js* and done so in a solid way. However, over time it became a hassle to maintain. Dependencies were getting out of date and incompatible with each other and the technologies we decided to use back then were getting out of fashion. Therefore we set out to create a new admin dashboard for our community team. This time our goal was to find, build or invent a tool that enabled fast development.

One of the things we learned throughout the now abandoned project is that fast development is a not so realistic dream. In this blog post, we’re going to share our experiences and insights from when we built our tool(s).

## Starting out

With some experience within the team using *[DjangoAdmin](https://docs.djangoproject.com/en/2.1/ref/contrib/admin/)*, our goal was to find something similar. A tool that works smoothly with the rest of the framework and essentially only requiring us to configure parameters in order to have a full CRUD setup.

Using *Ruby on Rails* for our core API, we quickly found two popular frameworks: *RailsAdmin* and *ActiveAdmin*. At the time both of these had seen a decline in development, and support for other Ruby Gems as well as the then-new Rails 5 were not yet in place. Hoping to build a tool that would last at least two years, we moved on. The search resulted in *Administrate* and even later we also found *Godmin*.

We decided to go with [Administrate](https://github.com/thoughtbot/administrate), maintained by Thoughtbot. Several things made us choose this Ruby gem, most of all the fact that it is nothing other than a Rails engine with controllers and views that can be easily overwritten by our own customizations. This means that pretty much any Rails developer in our backend team can join the project without reading up on a DSL or getting too familiar with the project’s structure.

We also saw that Administrate, even though it is still pre-1.0, had good and solid community support. The overall quality was high and the project is easy to extend through plugins. Since we use so many fantastic open source tools at Fishbrain, we also saw a great opportunity to contribute to the project, both with contributions to Administrate directly and through plugins.

![Photo: Przemysław Sakrajda, Unsplash](1_FRBcwn6bv5blIpCyPfYM5g.jpeg)

## Moving on

Having the tool of our choice, the project moved into the next phase: development.

Here, again, we had a number of factors to consider. How should the dashboard be integrated with the core API of Fishbrain? It was important to avoid a situation where the development of one project blocked the other (high cohesion). Neither did we want to move too far away from one of the goals of the project — making it developer friendly (which we consider being one of the biggest advantages of the Ruby language and the Rails framework.)

### The everything in one place approach

In the initial experiments, we tried to use Administrate inside our API. However, that turned out to be troublesome. Our API is running the Rails 5 API-only configuration, which had poor support for views and their helpers, asset compilation, session management and so on. Neither Rails flashes nor logging in worked smoothly, and we constantly had to fight the defaults that Rails tried to throw at us.

### The Git approach

Further trying out alternatives, we investigated the possibility of using Git Submodules or Git Subtrees to import certain parts of the core API’s logic. The idea was to separate development as well as only using the parts that mattered to the dashboard.

![Photo: Nick Karvounis, Unsplash](1_C9ipdjTSjmILZDIpLf_KiQ.jpeg)

There are a lot of opinions on Submodules out there. From our team’s experience they tend to be hard to maintain and easy to mess up. With that in mind we quickly decided not to progress with Submodules. Having little to no experience working with Subtrees it looked like a good alternative for our team. Similar promises to Submodules, but with some of their issues resolved.

We liked the idea of having a local reference of the source code at hand as well as not needing to copy the whole repository. However, trying to manage something like this in an automatic way could easily blow up in our faces. There would still be logic that we didn’t really need and the risk of someone forgetting to update the references or similar seemed daunting.

A picture began appearing in the heads of our developers of a nightmare situation with a completely broken production environment and downtime. We decided no not move on with this approach.

### The copy and paste approach

The idea of somehow copying the logic between the projects hung around. It was a not so appealing idea. The thought of manually copying and pasting the parts of the logic needed quickly became unsustainable. Say that an admin wants to update an image. That image is then going to be uploaded and scheduled for cropping and resizing in an async job in one of our Sidekiq instances. We would have to copy all the jobs too. And we would have to duplicate the Sidekiq environment between the apps. And, of course, we’d have the creeping issue of database differences as time went by, or any other change in any place.

### The Administrate-as-an-engine approach

Thinking we were soon out of ideas, one final solution popped up into our heads. Administrate is a Rails engine. A Rails engine can be mounted into our main app. We could make a Rails engine ourselves. One that would use Administrate’s controllers, views and cleverness *and* use the logic of our main app without hindering the development of the rest of the service. No annoying copy-and-pasting. No Git-foo. No ugly Rails hacking or never-ending workarounds. Simply a special instance of our main app with our admin engine mounted, managed by the *Bundler*.

Nice!

![Photo: Alan Bishop, Unsplash](1_8J3WwVzyGmzq9syIBsWpTA.jpeg)

## Getting somewhere

Finally finding a solution that felt solid *enough*, we started out converting the application to an engine. After a couple of days with a failing test suite, we got closer to converting the controllers and dashboards we had created into an engine format.

### The initializers

As it turns out, it is possible to change your mind throughout the Rails boot process an infinite amount of times. Want to disable, enable, disable, enable a middleware for the lulz? Go right ahead, no one is stopping you! While that might be unnecessary, what it means is that the Rails API settings and middleware stack can be overwritten when our admin engine is mounted. So, in order to support sessions and flashes, we simply add those middlewares back in an initializer:

```ruby
# lib/admin_engine/engine.rb
module AdminEngine
  class Engine < ::Rails::Engine
    isolate_namespace AdminEngine
    initializer 'admin_engine.reset_app_config_to_non_api' do |app|
      app.config.api_only = false
      app.config.debug_exception_response_format = :default
    end

    initializer 'admin_engine.middleware' do |app|
      app.config.middleware.use ActionDispatch::Cookies
      app.config.middleware.use ActionDispatch::Session::CookieStore
      app.config.middleware.use ActionDispatch::Flash
    end
    # ...
```

What happens here is that the initializer method sends this initializer back to the main app *after* all of the main app’s initializer has run. So first, the main app starts in a `api_only` mode. When the engine later is loaded this gets overwritten, and Rails goes back into a non-`api_only` mode. Sweet!

### Separate instances of the app

As said before, using an engine allowed us to keep this almighty code away from any potentially ill-intended people out there. We can decide if we want to mount the engine using `Rails.application.config`, which we set in an initializer using environment variables:

```ruby
# config/routes.rb
Rails.application.routes.draw do
  mount AdminEngine::Engine => '/admin' if Rails.application.config.mount_admin_engine
  # ...
```

Furthermore, we can decide the source from where we import our code using the Bundler. Again, using environment variables we can use this in our continuous integration loop, allowing us to have a staging environment for the engine:

```ruby
# Gemfile
group :admin do
  ENV['ADMIN_SOURCE'] ||= 'none'
  ENV['ADMIN_GIT_BRANCH'] ||= 'develop'

  case ENV['ADMIN_SOURCE']
  when 'local'
    gem 'admin_engine', path: '../admin_engine'
  when 'github'
    gem 'admin_engine', git: 'git@github.com:fishbrain/admin_engine', branch: ENV['ADMIN_GIT_BRANCH']
  end
end
```

As can be seen above, the bundler can also be run with `ADMIN_SOURCE=local` in order to support development locally. By using the Git protocol to fetch the remote dependency, we also avoid the risk of accidentally having any Git or other credentials in `Gemfile.lock`.

![Photo: Austin Neill, Unsplash](1_Y5ggRmWaFkVvlwl3mweAnQ.jpeg)

## Reaching and not reaching our goal

Throughout our search for a tool that allowed us to develop fast, we did run into some issues. As it turned out, every solution has drawbacks.

### Who’s data is it, really?

Naturally, no solution is perfect. What we actually ended up doing here is essentially duplicating the whole production environment of our main app. Sidekiq instances and all. It goes without saying that this might not be optimal. Also, the owner of the data is somewhat unclear. What we want is for the API to be the obvious owner of all of the data, and that all the subservices handles their data through the API. Now, that has become somewhat unclear. The risk of running into bugs where invalid data gets inserted increases, as we’ve also seen during development. Using more strict database constraints could be a solution to this, but even with these in place the application layer can still corrupt the data.

We also quickly ran in to the issue of updates in our main app not being reflected in our admin engine. Missing database columns, new data types, removed models and other changes made the admin engine crash, cause data corruption and slow development down. Inefficient database queries and unused search indices made our infrastructure team think we were under attack simply due to a sudden peak in load on our staging database.

It became obvious to us that our great solution, after all, wasn’t as great as we hoped.

## Where we landed

Turns out, there weren’t any shortcuts for us out there. While we still have the Rails engine-based admin app in production, the process of sunsetting it has begun and is soon completed. Access has been restricted to only our office and the project has been replaced. By what, you might ask?

In the end, we decided to go back a step. How do you want to guarantee that there is a single source of truth for how your data is created, accessed and stored? Make sure that there is only one way to do so. What we’re building and using today is again an web based tool that talks to our API using *REST* and GraphQL requests. While this might be a more time consuming setup, it is safer from a data integrity perspective.

Using tools like [Dependabot](https://dependabot.com/), [Storybook](https://storybook.js.org/), and [Jest](https://jestjs.io/) we can make sure that we can develop an internal tool that stays up to date in a safe way. Reusable components can be created to speed things up and the entire world’s resources on *TypeScript*, *React*, and web development are available to us. One day we might share more details on this project, but that deserves a post on its own.

---

*Thanks to Emil Bogren.*
