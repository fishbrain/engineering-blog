import markdownStyles from './markdown-styles.module.css'
import { Tags } from './Tags'

type Props = {
  content: string
  tags?: string[]
}

const PostBody = ({ content, tags }: Props) => {
  return (
    <div className="max-w-2xl mx-auto">
      <div
        className={markdownStyles['markdown']}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      {tags && <Tags tags={tags} />}
    </div>
  )
}

export default PostBody
