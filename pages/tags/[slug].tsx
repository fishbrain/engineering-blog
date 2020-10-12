import { useRouter } from "next/router";
import ErrorPage from "next/error";
import Head from "next/head";

import Container from "../../components/Container";
import Header from "../../components/Header";
import { PostList } from "../../components/PostList";
import Layout from "../../components/Layout";
import PostTitle from "../../components/PostTitle";
import { IPost } from "../../types/post";
import { getAllPostExcerpts, getAllTagSlugs } from "../../lib/api/posts";

type Props = {
  tag: string;
  posts: IPost[];
};

const Tag = ({ tag, posts }: Props) => {
  const router = useRouter();
  if (!router.isFallback && !tag) {
    return <ErrorPage statusCode={404} />;
  }
  return (
    <Layout>
      <Container>
        <Header />
        {router.isFallback ? (
          <PostTitle title="Loading..." />
        ) : (
          <>
            <article className="mb-32">
              <Head>
                <title>{tag} | Fishbrain Tech Blog</title>
              </Head>
              <PostTitle title={tag} />
              <PostList posts={posts} />
            </article>
          </>
        )}
      </Container>
    </Layout>
  );
};

export default Tag;

type Params = {
  params: {
    slug: string;
  };
};

export async function getStaticProps({ params }: Params) {
  return {
    props: {
      tag: params.slug.split('-').join(' '),
      posts: getAllPostExcerpts({ byTag: params.slug }),
    },
  };
}

export async function getStaticPaths() {
  return {
    paths: getAllTagSlugs().map((slug) => {
      return {
        params: {
          slug,
        },
      };
    }),
    fallback: false,
  };
}
