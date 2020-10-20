import cn from 'classnames'
import Link from 'next/link'

type Props = {
  title: string
  src: string
  slug?: string
  alt?: string
}

const CoverImage = ({ title, src, slug, alt }: Props) => {
  const image = (
    <img
      src={src}
      alt={alt || title}
      className={cn('shadow-small', {
        'hover:shadow-medium transition-shadow duration-200 w-full': slug,
      })}
    />
  )
  return (
    <div className="sm:mx-0">
      {slug ? (
        <Link as={`/posts/${slug}`} href="/posts/[slug]">
          <a aria-label={title}>{image}</a>
        </Link>
      ) : (
        image
      )}
    </div>
  )
}

export default CoverImage
