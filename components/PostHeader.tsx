import Avatar from './Avatar'
import DateFormatter from './DateFormatter'
import CoverImage from './CoverImage'
import PostTitle from './PostTitle'
import { IAuthorExcerpt } from '../types/author'

type Props = {
  title: string
  imageSrc?: string | null
  imageAlt?: string
  date: string
  author: IAuthorExcerpt
  readingTime: string
}

const PostHeader = ({ title, imageAlt, imageSrc, date, author, readingTime }: Props) => {
  return (
    <>
      <PostTitle>{title}</PostTitle>
      <div className="hidden md:block md:mb-12">
        <Avatar author={author} />
      </div>
      <div className="mb-8 md:mb-16 max-w-2xl mx-auto">
        {imageSrc && <CoverImage title={title} src={imageSrc} alt={imageAlt} />}
      </div>
      <div className="max-w-2xl mx-auto">
        <div className="block md:hidden mb-6">
          <Avatar author={author} />
        </div>
        <div className="mb-6 text-lg">
          <DateFormatter dateString={date} /> - {readingTime}
        </div>
      </div>
    </>
  )
}

export default PostHeader
