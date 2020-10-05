export interface IAuthor {
  slug: string;
  name: string
  avatar?: string | null
  shortDescription?: string
  content: string;
}

export interface IAuthorExcerpt {
  slug: string
  name: string
  avatar?: string | null
  shortDescription?: string
}
