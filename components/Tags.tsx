import Link from "next/link";
import slugify from "slugify";

interface IProps {
  tags: string[];
}

export const Tags = ({ tags }: IProps): JSX.Element => (
  <section className="flex flex-wrap">
    {tags.map((tag) => (
      <Link as={`/tags/${slugify(tag, { lower: true })}`} href="/tags/[slug]">
        <a className="bg-gray-400 py-2 px-4 text-gray-900 mr-4 mb-4">{tag}</a>
      </Link>
    ))}
  </section>
);
