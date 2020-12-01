import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Head from 'next/head'

import Container from '../../components/Container'
import PostBody from '../../components/PostBody'
import Header from '../../components/Header'
import PostHeader from '../../components/PostHeader'
import Layout from '../../components/Layout'
import PostTitle from '../../components/PostTitle'
import markdownToHtml from '../../lib/markdownToHtml'
import { IPost } from '../../types/post'
import { getAllPostSlugs, getPostBySlug } from '../../lib/api/posts'

type Props = {
  post: IPost
}

const Post = ({ post }: Props) => {
  const router = useRouter()
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />
  }
  return (
    <Layout >
      <Container>
        <Header />
        {router.isFallback ? (
          <PostTitle title="Loading..." />
        ) : (
          <>
            <article className="mb-32">
              <Head>
                <title>
                  {post.title} | Fishbrain Engineering Blog
                </title>
                {post.imageSrc && <meta property="og:image" content={post.imageSrc} />}
              </Head>
              <PostHeader
                title={post.title}
                imageSrc={post.imageSrc}
                imageAlt={post.imageAlt}
                date={post.date}
                author={post.author}
                readingTime={post.readingTime}
                subtitle={post.subtitle}
              />
              <PostBody content={post.content} tags={post.tags} />
            </article>
          </>
        )}
      </Container>
    </Layout>
  )
}

export default Post

type Params = {
  params: {
    slug: string
  }
}

export async function getStaticProps({ params }: Params) {
  const post = getPostBySlug(params.slug)

  return {
    props: {
      post: {
        ...post,
        content: await markdownToHtml(post.content || ''),
      },
    },
  }
}

export async function getStaticPaths() {
  return {
    paths: getAllPostSlugs().map((slug) => {
      return {
        params: {
          slug,
        },
      }
    }),
    fallback: false,
  }
}
