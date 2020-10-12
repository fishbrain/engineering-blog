import { IAuthorExcerpt } from './author'

export interface IPost {
  slug: string
  title: string
  date: string
  subtitle?: string | null;
  author: IAuthorExcerpt
  imageSrc?: string | null;
  imageAlt?: string
  tags?: string[]
  content: string
  readingTime: string;
  excerpt: string;
}

export interface IPostExcerpt {
  slug: string
  title: string
  date: string
  subtitle?: string | null;
  imageSrc?: string | null;
  imageAlt?: string
  author: IAuthorExcerpt
  tags?: string[]
  readingTime: string;
  excerpt: string;
}
