import Link from "next/link";

import { DarkModeToggle } from "./DarkModeToggle";

const titleClass =
  "text-2xl md:text-4xl font-bold tracking-tight md:tracking-tighter leading-tight mr-auto";

const Header = ({ isHome = false }: { isHome?: boolean }) => {
  const title = (
    <Link href="/">
      <a className="hover:underline">Fishbrain Tech Blog</a>
    </Link>
  );
  return (
    <>
      <div className="flex items-center mt-8 mb-4">
        <Link href="/">
          <a>
            <img src="/app-icon.png" alt="Fishbrain" className="h-12 mr-2" />
          </a>
        </Link>
        {isHome ? (
          <h1 className={titleClass}>{title}</h1>
        ) : (
          <h2 className={titleClass}>{title}</h2>
        )}
        <DarkModeToggle />
      </div>
      <hr />
      <div className="py-2 uppercase text-sm text-gray-500">
        <a className="hover:underline" href="https://fishbrain.com">Get the app</a>
        <span className="px-2">|</span>
        <a className="hover:underline" href="https://careers.fishbrain.com/">Join the team</a>
      </div>
      <hr className="mb-8" />
    </>
  );
};

export default Header;
