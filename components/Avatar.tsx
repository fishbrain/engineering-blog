import Link from "next/link";
import { IAuthorExcerpt } from "../types/author";

type Props = {
  author: IAuthorExcerpt;
};

const Avatar = ({ author: { name, avatar, slug } }: Props) => {
  return (
    <div className="flex items-center">
      {avatar && (
        <Link as={`/authors/${slug}`} href="/authors/[slug]">
          <a aria-label={name}>
            <img
              src={avatar}
              className="w-12 h-12 rounded-full mr-4"
              alt={name}
            />
          </a>
        </Link>
      )}
      <Link as={`/authors/${slug}`} href="/authors/[slug]">
        <a className="text-xl font-bold hover:underline">{name}</a>
      </Link>
    </div>
  );
};

export default Avatar;
