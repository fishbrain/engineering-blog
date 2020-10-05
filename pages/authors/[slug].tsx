import { useRouter } from "next/router";
import ErrorPage from "next/error";
import Head from "next/head";

import Container from "../../components/Container";
import Header from "../../components/Header";
import { PostList } from "../../components/PostList";
import Layout from "../../components/Layout";
import PostTitle from "../../components/PostTitle";
import markdownToHtml from "../../lib/markdownToHtml";
import { IAuthor } from "../../types/author";
import { IPost } from "../../types/post";
import { getAllAuthorSlugs, getAuthorBySlug } from "../../lib/api/authors";
import { getAllPostExcerpts } from "../../lib/api/posts";

type Props = {
  author: IAuthor;
  posts: IPost[];
};

const Authors = ({ author, posts }: Props) => {
  const router = useRouter();
  if (!router.isFallback && !author?.slug) {
    return <ErrorPage statusCode={404} />;
  }
  return (
    <Layout>
      <Container>
        <Header />
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article className="mb-32">
              <Head>
                <title>{author.name} | Fishbrain Tech Blog</title>
              </Head>
              <PostTitle>{author.name}</PostTitle>
              <PostList posts={posts} />
            </article>
          </>
        )}
      </Container>
    </Layout>
  );
};

export default Authors;

type Params = {
  params: {
    slug: string;
  };
};

export async function getStaticProps({ params }: Params) {
  const author = getAuthorBySlug(params.slug);

  return {
    props: {
      author: {
        ...author,
        content: await markdownToHtml(author.content || ""),
      },
      posts: getAllPostExcerpts({ byAuthor: params.slug }),
    },
  };
}

export async function getStaticPaths() {
  return {
    paths: getAllAuthorSlugs().map((slug) => {
      return {
        params: {
          slug,
        },
      };
    }),
    fallback: false,
  };
}
