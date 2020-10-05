import unified from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import mdxPrism from 'mdx-prism'

export default async function markdownToHtml(markdown: string) {
  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(mdxPrism)
    .use(rehypeStringify)
    .process(markdown)
  return result.toString()
}
