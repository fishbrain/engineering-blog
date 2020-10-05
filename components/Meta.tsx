import Head from "next/head";
import { HOME_OG_IMAGE_URL } from "../lib/constants";

const Meta = () => {
  return (
    <Head>
      <link rel="shortcut icon" href="/favicon.ico" />
      <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
      <meta name="description" content="We make an app for fishing, the world’s most popular hobby." />
      <meta property="og:image" content={HOME_OG_IMAGE_URL} />

      <link
        href="https://unpkg.com/prism-themes@1.4.0/themes/prism-nord.css"
        rel="stylesheet"
      />
    </Head>
  );
};

export default Meta;
