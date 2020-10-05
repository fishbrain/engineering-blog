import Avatar from "./Avatar";
import DateFormatter from "./DateFormatter";
import CoverImage from "./CoverImage";
import Link from "next/link";
import markdownStyles from './markdown-styles.module.css'
import { IAuthorExcerpt } from "../types/author";

type Props = {
  title: string;
  imageSrc?: string | null;
  imageAlt?: string;
  date: string;
  excerpt: string;
  author: IAuthorExcerpt;
  slug: string;
  readingTime: string;
};

const PostPreview = ({
  title,
  imageSrc,
  imageAlt,
  date,
  excerpt,
  author,
  slug,
  readingTime,
}: Props) => {
  return (
    <div>
      {imageSrc && (
        <div className="mb-5">
          <CoverImage
            slug={slug}
            title={title}
            src={imageSrc}
            alt={imageAlt}
          />
        </div>
      )}
      <h3 className="text-3xl mb-3 leading-snug">
        <Link as={`/posts/${slug}`} href="/posts/[slug]">
          <a className="hover:underline">{title}</a>
        </Link>
      </h3>
      <div
        className={markdownStyles['markdown'] + " text-lg"}
        dangerouslySetInnerHTML={{ __html: excerpt }}
      />
      <div className="text-md my-4">
        <DateFormatter dateString={date} /> - {readingTime}
      </div>
      <Avatar author={author} />
    </div>
  );
};

export default PostPreview;
