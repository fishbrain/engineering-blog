import { IPostExcerpt } from "../types/post";
import PostPreview from "./PostPreview";

interface IProps {
  posts: IPostExcerpt[];
}

export const PostList = ({ posts }: IProps): JSX.Element => (
  <section className="grid grid-cols-1 row-gap-0 mb-32">
    {posts.map((post) => (
      <PostPreview
        key={post.slug}
        title={post.title}
        imageSrc={post.imageSrc}
        imageAlt={post.imageAlt}
        date={post.date}
        author={post.author}
        slug={post.slug}
        excerpt={post.subtitle || post.excerpt}
        readingTime={post.readingTime}
      />
    ))}
  </section>
);
