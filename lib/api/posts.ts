import { join } from "path";
import readingTime from "reading-time";
import slugify from "slugify";

import { IPost, IPostExcerpt } from "../../types/post";
import { getAuthorExcerptBySlug } from "./authors";
import { getAllSlugs, readContentData } from "./shared";

const postsDirectory = join(process.cwd(), "public", "content", "posts");

export function getAllPostSlugs() {
  return getAllSlugs(postsDirectory);
}

function getPostContentExcerpt(content: string) {
  const strings = content.slice(0, 160).split(" ");
  strings.pop();
  return `${strings.join(" ")}…`;
}

function readPostData(slug: string) {
  return readContentData(join(postsDirectory, slug));
}

export function getPostBySlug(slug: string): IPost {
  const { data, content } = readPostData(slug);

  return {
    slug,
    content,
    ...data,
    imageSrc: data.imageSrc
      ? join("/content", "posts", slug, data.imageSrc)
      : null,
    author: getAuthorExcerptBySlug(data.author),
    readingTime: readingTime(content).text,
    subtitle: data.subtitle || null,
    excerpt: getPostContentExcerpt(content),
  } as IPost;
}

export function getAllPostExcerpts({
  byAuthor,
  byTag,
}: { byAuthor?: string; byTag?: string } = {}): IPostExcerpt[] {
  const slugs = getAllPostSlugs();
  const posts = slugs
    .map((slug) => {
      const { data, content } = readPostData(slug);
      return {
        slug,
        date: data.date,
        title: data.title,
        author: getAuthorExcerptBySlug(data.author),
        imageSrc: data.imageSrc
          ? join("/content", "posts", slug, data.imageSrc)
          : null,
        subtitle: data.subtitle || null,
        excerpt: getPostContentExcerpt(content),
        readingTime: readingTime(content).text,
        imageAlt: data.imageAlt || null,
        tags: data.tags,
      } as IPostExcerpt;
    })
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  if (byAuthor) {
    return posts.filter((p) => p.author.slug === byAuthor);
  }
  if (byTag) {
    return posts.filter(
      (p) => p.tags && p.tags.map((tag) => tag.toLowerCase()).includes(byTag)
    );
  }
  return posts;
}

export function getAllTagSlugs(): string[] {
  const slugs = getAllPostSlugs();
  const tags = slugs.reduce((tags, slug) => {
    const { data } = readPostData(slug);
    return [...tags, ...(data.tags || [])];
  }, [] as string[]);

  return [...new Set(tags)].map((tag) => slugify(tag, { lower: true }));
}
