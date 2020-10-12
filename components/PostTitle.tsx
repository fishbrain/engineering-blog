import { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string | null;
}

const PostTitle = ({ title, subtitle }: Props) => {
  return (
    <div className="tracking-tighter leading-tight md:leading-none mb-12 text-center md:text-left">
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-tight md:leading-none text-center md:text-left">
        {title}
      </h1>
      {subtitle && <p className="mt-6 text-lg">{subtitle}</p>}
    </div>
  );
};

export default PostTitle;
