---
layout: postLayout.njk
postTitle: "DRY Unit Tests in Javascript"
date: "2020-11-01T13:54:38.043Z"
subtitle: ""
imageSrc: hosein-zanbori-Gnmc1967xWw-unsplash.jpg
imageAlt: "Defintely not DRY. Photo by hosein zanbori on Unsplash"
author: Luke Hansford
tags: post
postTags:
  - Javascript
  - Testing
  - Software Development
---

A couple of years ago I started working with a Ruby on Rails codebase and was stunned
by how more well thought out the test were in comparison to Javascript codebases I'd worked with. In
particular I loved that the axiom of DRY (Don't Repeat Yourself) applied to testing - something that
seems obvious to do in hindsight.

Over time I've been picking up the parts of Ruby testing that I found particular useful and applying
them to JS testing. A common pattern I run into is having to test a basic functionality that might
apply across a whole category of component or function types. This post is going to show a small of
example of how we can do this in Javascript.

Let's start with a non-DRY test. The following test suite is for a BlogPost component, and we want
to test that it has HTML metadata (i.e. a title and a description). For this example we're using [Jest](https://jestjs.io/) and
[React Testing Libary](https://testing-library.com/docs/react-testing-library/intro), but the concept
should be applicable to whichever testing framework you use.

```javascript
  import { render } from '@testing-library/react';

  describe('BlogPost' , () => {
    render(<BlogPost />);

    it('Renders metadata', () => {
      expect(document.title).toEqual(title);
      expect(document.querySelector("meta[name='description']")).toHaveAttribute(
        'content',
        description,
      );
    });
  });
```

If our app has other pages, then HTML metadata is probably a useful thing to test for on those as
well. Making our test reusable is as simple as moving it to it's own function that accepts as arguments
the values we want to test for.

```javascript
  import { render } from '@testing-library/react';

  function itHasMetadata({ title, description }) {
    it('Renders metatags', () => {
      expect(document.title).toEqual(title);
      expect(document.querySelector("meta[name='description']")).toHaveAttribute(
        'content',
        description,
      );
    });
  }

  describe('BlogPost' , () => {
    render(<BlogPost />);

    itHasMetadata({ title: 'Blog', description: 'Some description' });
  });

  describe('Homepage' , () => {
    render(<Homepage />);

    itHasMetadata({ title: 'Home', description: 'Some description' });
  });
```

Our metadata test is now DRY! Refactoring our test like this also allows us to compose them.
Let's say our `BlogPost` and `Homepage` components share multiple similar tests - we can roll them
into one function that applies thoses tests together.

```javascript
  export function itBehavesLikeAPage(title, description, url) {
    itHasMetadata(metadata);
    itHasAHeading();
    itHasACanonicalUrl();
  }

  describe('BlogPost' , () => {
    render(<BlogPost />);

    itBehavesLikeAPage({ title: 'Blog', description: '...' });
  });

  describe('HomePage' , () => {
    render(<Homepage />);

    itBehavesLikeAPage({ title: 'Home', description: '...' });
  });
```

One added benefit of writing our tests in this way is that it makes jumping into Test Driven
Development (TDD) a lot easier. I personally gain a lot from doing TDD, but I often find myself
skipping past the tests because I just want to get my hands dirty coding a solution instead of
spending the time writing a new test. But when writing that test is as simple as importing my
reusable test I don't have any excuse not to do proper TDD!

*Originally published at [http://lukehansford.me/articles/dry-unit-tests-in-javascript/](http://lukehansford.me/articles/dry-unit-tests-in-javascript/)*
