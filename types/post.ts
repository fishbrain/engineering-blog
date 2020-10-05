import { IAuthorExcerpt } from './author'

export interface IPost {
  slug: string
  title: string
  date: string
  description: string
  author: IAuthorExcerpt
  imageSrc?: string | null;
  imageAlt?: string
  tags?: string[]
  content: string
  readingTime: string;
}

export interface IPostExcerpt {
  slug: string
  title: string
  date: string
  description: string
  imageSrc?: string | null;
  imageAlt?: string
  author: IAuthorExcerpt
  tags?: string[]
  readingTime: string;
}
