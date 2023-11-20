---
layout: postLayout.njk
postTitle: Structuring an Elixir+Phoenix App
date: "2020-07-17T22:12:03.284Z"
author: Brian Underwood
tags: post
postTags:
  - Elixir
  - Phoenix
---

I’ve `mix phx.new`ed many applications and when doing so I often start with wondering how to organize my code. I love how Phoenix pushes you to think about the different domains in your app via generators while at the same time I have the freedom to organize modules on my own. Ecto schemas make for a nice abstraction, but where should I put code related just to that table? It could be in the context, but I don’t want the context to become a “grab bag” of unorganized function calls.

In the past, I’ve searched for someone writing on the subject but haven’t come up with much. I’ve even done some cursory glancing into repositories to get a feeling for what they do, but I’ve never looked thoroughly at different options. In this post, I share what I have found from four different open source Phoenix+Ecto applications. And as the old joke goes, I’ll be asking four developers for their opinions and getting four different answers. In the end, I’ll summarize how I plan to move forward.

Notes:
- Phoenix has evolved in how modules are organized, most notably splitting into [`my_app` and `my_app_web` folders](https://hexdocs.pm/phoenix/directory_structure.html#content) and with the concept of [contexts](https://hexdocs.pm/phoenix/contexts.html). Some of these applications were created with early versions of Phoenix which could explain some of the differences.
- When I say “typical Ecto schema logic” below, I’m referring to examples in the [Ecto documentation](https://hexdocs.pm/ecto/Ecto.Schema.html) and the community on the things to put into schema files (field definitions, schema attributes (such as `@primary_key`, `@schema_prefix`, etc…), and changeset logic)

## Avia
[GitHub](https://github.com/aviacommerce/avia/)

Repository description: “open source e-commerce framework”

A lot of the business logic can be found under `apps/snitch_core/lib/core`. There is a `domain` folder containing what appears to be the front-end API modules (what Phoenix might call “contexts”). Next to the `domain` folder is a `data` folder containing `schema` and `model` directories.

The `schema` directory contains typical Ecto schema files. The `model` directory contains correspondingly named modules with CRUD functions (like `create`, `update`, `delete`, `get`) but also occasionally some helper functions related to those domain objects (functions like `formatted_list` or `get_all_by_shipping_category`)

Each type of module also has a `use` statement at the top (i.e. `use Snitch.Data.Model` ) referring to a module containing shared logic. It’s worth looking at what that shared logic is:

```elixir
# apps/snitch_core/lib/core/domain/domain.ex
alias Ecto.Multi
alias Snitch.Data.{Model, Schema}
alias Snitch.Domain
alias Snitch.Core.Tools.MultiTenancy.Repo

# apps/snitch_core/lib/core/data/model/model.ex
import Ecto.Query
alias Snitch.Core.Tools.MultiTenancy.Repo
alias Snitch.Tools
alias Tools.Helper.Query, as: QH

# apps/snitch_core/lib/core/data/schema/schema.ex
use Ecto.Schema
import Ecto.Changeset
import Snitch.Tools.Validations
alias Snitch.Core.Tools.MultiTenancy.Repo
```

The domain modules alias the model modules and the model modules alias the schema modules, indicating the usage pattern of going deeper (Domain -> Model -> Schema):

```elixir
# apps/snitch_core/lib/core/domain/stock/stock_location.ex
alias Model.StockLocation, as: StockLocationModel

# apps/snitch_core/lib/core/data/model/stock/stock_location.ex
alias Snitch.Data.Schema.StockLocation, as: StockLocationSchema
```

## Changelog
[GitHub](https://github.com/thechangelog/changelog.com)

Repository description: This is the CMS behind [changelog.com](https://changelog.com/).

The business logic is under `lib/changelog`. This directory seems to contain various modules as well as directories containing grouped functionality. All of the Ecto logic looks to be under the `schema` directory which contains some base schema modules as well as directories containing grouped schema functionality.

Schemas have the typical Ecto schema logic but also sometimes many helpers like `admins`, `with_email`, `get_by_website` which are scoping/querying as well as defining changeset functions like `auth_changeset`, `admin_insert_changeset`, `admin_update_changeset`, `file_changeset`, etc…

The schemas use the `Changelog.Schema` module which, in addition to adding many helper functions like `any?`, `by_position`, `limit`, `newest_first`, `newest_last`, etc…, does this:

```elixir
use Ecto.Schema
use Arc.Ecto.Schema
import Ecto
import Ecto.Changeset
import Ecto.Query, only: [from: 1, from: 2]
import EctoEnum, only: [defenum: 2]
alias Changelog.{Hashid, Repo}
```

## Hexpm
[GitHub](https://github.com/hexpm/hexpm)

Repository description: API server and website for Hex [https://hex.pm](https://hex.pm)

The `lib/hexpm` directory contains some modules with basic logic, but the schemas and contexts exist inside of grouping folders. For example, the `lib/hexpm/accounts` folder has the `User` schema and the `Users` context as well as the `Organization` schema and the `Organizations` context. The singular modules (i.e. `User` and `Organization`) have the typical Ecto schema logic.

The two types of module use the `Hexpm.Schema` and `Hexpm.Context` modules:

```elixir
# lib/hexpm/schema.ex
import Ecto
import Ecto.Changeset
import Ecto.Query, only: [from: 1, from: 2]
import Hexpm.Changeset
alias Ecto.Multi
use Hexpm.Shared

# lib/hexpm/context.ex
import Ecto
import Ecto.Changeset
import Ecto.Query, only: [from: 1, from: 2]
import Hexpm.Accounts.AuditLog,
 only: [audit: 3, audit: 4, audit_many: 4, audit_with_user: 4]
alias Ecto.Multi
alias Hexpm.Repo
use Hexpm.Shared
```

You might have noticed that both `use` the `Hexpm.Shared` module. This just does a lot of aliases which means that modules like `Hexpm.Accounts.AuditLog` and `Hexpm.Repository.Download` become just `AuditLog` and `Download`…

While that pattern seems common, it’s not always the case. There is an `Auth` module which is just a plain module as well as `UserHandles` and `Email` schema modules without corresponding context modules. `Hexpm.Accounts.Email` actually seems to be used in the `emails` folder in `Hexpm.Emails` and `Hexpm.Emails.Bamboo`, which seems to be a case of one context reaching into another.

## elixirstatus-web
[GitHub](https://github.com/rrrene/elixirstatus-web)

Repository description: Community site for Elixir project/blog post/version updates

At the root of this project, there are `lib` and `web` directories. The schemas are located under `web/models`. This appears to be a pretty old app (the `LICENSE` file is five years old), which is probably why it’s not using the recent pattern of putting business logic outside of the “web” part of the app.

The `models` directory contains four schemas (`Impression`, `Posting`, `ShortLink`, and `User`) which all define typical Ecto schema logic. These all `use ElixirStatus.Web, :model` which does:

```elixir
use Ecto.Schema
import Ecto
import Ecto.Changeset
```

Another module under `web/models` is `Avatar` which doesn’t seem to be a schema but rather a grouping of helper functions.

As an example of an context-like module, the `Impressionist` module (stored at `lib/elixir_status/impressionist.ex`) defines various querying methods for the `Impression` schema along with some other helpers.

## My thoughts:

I already like Phoenix conventions like:
- Separating business logic from the web application logic
- Separating business logic into contexts with well-established APIs
- Ecto schema modules which are focused on mapping and validation of the data source

Things I like about these projects:
- It’s very nice to have modules headed with something like `use MyApp.Schema` or `use MyApp.Context` as the Hexpm project does. Even if the `use`d module doesn’t do much, it provides an at-a-glance label when browsing files.
- I like that Hexpm has established a bit of a convention around schemas (singular `User`) vs contexts (plural `Users`).
- I like how the Avia project separates “domain”, “model”, and “schema”. In particular as a fan of [Domain Driven Design](https://en.wikipedia.org/wiki/Domain-driven_design) using the word “domain” is nice and I think it’s used in the same way.

Things I don’t like from these projects:
- Aliasing the right-most module in a path (as the Avia project does) drops it’s context. If `Hexpm.Accounts.AuditLog` is aliased as `AuditLog`, that might not be so bad because `AuditLog` is potentially a unique concept. But aliasing `Hexpm.Repository.Download` as `Download` could confuse. If you alias `Hexpm.Accounts` or `Hexpm.Repository` you can refer to `Accounts.AuditLog` or `Repository.Download` which I find clearer.
- In the Avia project sometimes there are aliases like `Model.StockLocation` aliased as `StockLocationModel` . I would find it simpler to just refer to `Model.StockLocation` which is one character longer but makes the source clearer.
- In hexpm the schema vs context convention doesn’t help when browsing a directory to distinguish schemas from plain module files.

As a long-time Rails developer, one thing that makes Rails nice is being able to go between apps easily because there is always a place for everything. But as an app grows large, grouping files by type means that directories like `controllers` and `models` get very full. The Phoenix project, I think trying to learn from Rails, encourages using contexts with well-defined APIs. Since each context often needs to solve different problems (such as wrapping a database, creating an API client, or just doing calculations), these can be structured however you like. But when it makes sense I think that we could create directories according to conventions to organize our code. For a long time, many projects have established loose conventions with directories like `lib`, `docs`, `log`, and `test`. In the web part of a Phoenix application, we have `controller`, `channel`, `view`, etc…

We could do the same in the very common case where our contexts contain Ecto database logic. We are given the “schema” idea from Ecto itself as a way to separate transformation and validation logic. This helps us trim the fat from our “fat model” problem. But we’re left to put other query logic either into our schema or to have it mixed it with all of our context’s business logic.

So after my investigation, the way that I plan to move forward:

```elixir
# The context’s public API, headed with `use MyApp.Context`
my_app/<context>.ex

# Headed with `use MyApp.Schema`
my_app/<context>/schema/user.ex

# Headed with `use MyApp.Query`
my_app/<context>/query/user.ex
# For non-DB business logic

my_app/<context>/<some_module>.ex
my_app/<context>/<some_module>/<sub_module>.ex
```

These things might certainly change, but having looked through some other codebases and reflecting on what I like and don’t like, I think that this will be a good start.
