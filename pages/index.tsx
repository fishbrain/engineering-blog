import Container from "../components/Container";
import Layout from "../components/Layout";
import Head from "next/head";
import markdownToHtml from "../lib/markdownToHtml";
import { IPostExcerpt } from "../types/post";
import { getAllPostExcerpts } from "../lib/api/posts";
import { PostList } from "../components/PostList";
import Header from "../components/Header";

type Props = {
  posts: IPostExcerpt[];
};

const Index = ({ posts }: Props) => {
  return (
    <Layout>
      <Head>
        <title>Fishbrain Tech Blog</title>
      </Head>
      <Container>
        <Header isHome />
        <PostList posts={posts} />
      </Container>
    </Layout>
  );
};

export default Index;

export const getStaticProps = async () => {
  const posts = getAllPostExcerpts();

  const processedPosts = await Promise.all(
    posts.map((post) => {
      return markdownToHtml(post.description || "").then((description) => ({
        ...post,
        description,
      }));
    })
  );

  return {
    props: { posts: processedPosts },
  };
};
