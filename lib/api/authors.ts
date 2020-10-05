import { join } from "path";

import { IAuthor, IAuthorExcerpt } from "../../types/author";
import { getAllSlugs, readContentData } from "./shared";

const authorsDirectory = join(process.cwd(), "public", "content", "authors");

export function getAllAuthorSlugs() {
  return getAllSlugs(authorsDirectory);
}

function readAuthorData(slug: string) {
  return readContentData(join(authorsDirectory, slug));
}

export function getAuthorExcerptBySlug(slug: string): IAuthorExcerpt {
  const { data } = readAuthorData(slug);

  return {
    slug,
    ...data,
    avatar: data.avatar ? join("/content", "authors", slug, data.avatar) : null,
  } as IAuthorExcerpt;
}

export function getAuthorBySlug(slug: string): IAuthor {
  const { data, content } = readAuthorData(slug);

  return {
    slug,
    content,
    ...data,
    avatar: data.avatar ? join("/content", "authors", slug, data.avatar) : null,
  } as IAuthor;
}
