#!/usr/bin/env node
const fs = require("fs");
const { join } = require("path");
const { exit } = require("process");

const inquirer = require("inquirer");
const slugify = require("slugify");

const NEW_AUTHOR_OPTION = "Create a new author";
const AUTHORS_DIR = join(process.cwd(), "public", "content", "authors");
const POSTS_DIR = join(process.cwd(), "public", "content", "posts");

function handleError(error) {
  console.error(error);
  exit(1);
}

function getAuthorOptions() {
  return fs
    .readdirSync(AUTHORS_DIR, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

function getPostOptions() {
  return fs
    .readdirSync(POSTS_DIR, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

function createFile(content, routeDir, unslugifiedTitle) {
  const slug = slugify(unslugifiedTitle, { lower: true });
  const newDir = join(routeDir, slug);
  fs.mkdirSync(newDir);
  fs.writeFileSync(join(newDir, "index.md"), content);
  return slug;
}

function createAuthor() {
  return inquirer
    .prompt([
      {
        name: "name",
        message: "Full Name:",
        validate: (input) => {
          if (!input.length) {
            return "A name is required";
          }
          if (getAuthorOptions().includes(slugify(input, { lower: true }))) {
            return "This author already exists";
          }
          return true;
        },
      },
    ])
    .then(({ name }) => {
      const content = `---
avatar:
name: ${name}
shortDescription:
---`;
      const slug = createFile(content, AUTHORS_DIR, name);
      return slug;
    })
    .catch(handleError);
}

function selectAuthor() {
  return inquirer
    .prompt([
      {
        type: "list",
        name: "author",
        message: "Select an author",
        choices: [...getAuthorOptions(), NEW_AUTHOR_OPTION],
      },
    ])
    .then(({ author }) => {
      if (author === NEW_AUTHOR_OPTION) {
        return createAuthor();
      }
      return author;
    })
    .catch(handleError);
}

function createPost() {
  selectAuthor().then((author) => {
    inquirer
      .prompt([
        {
          name: "title",
          message: "Post title:",
          validate: (input) => {
            if (!input.length) {
              return "Post title is required";
            }
            if (getPostOptions().includes(slugify(input, { lower: true }))) {
              return "This post title is already in use";
            }
            return true;
          },
        },
        {
          name: "subtitle",
          message:
            "Post subtitle/excerpt (optional - if not entered the first 160 chars of the post will be the excerpt):",
        },
      ])
      .then(({ title, subtitle }) => {
        const content = `---
title: "${title}"
date: "${new Date().toISOString()}"
subtitle: "${subtitle}"
imageSrc:
imageAlt:
author: ${author}
tags:
---

Write your post here!`;
        const slug = createFile(content, POSTS_DIR, title);
        console.log(
          `Your new post is available at ${join(POSTS_DIR, slug, "index.md")}`
        );
      })
      .catch(handleError);
  });
}

createPost();
