import readingTime from "eleventy-plugin-reading-time";
import markdownItPrism from "markdown-it-prism";

export default async function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("./index.css");

  eleventyConfig.addShortcode("formatDate", function (dateString) {
    return new Date(dateString).toLocaleDateString(undefined, { dateStyle: 'medium' });
  });

  eleventyConfig.addShortcode("excerpt", function (post) {
    if (post.data.subtitle) {
      return post.data.subtitle;
    }

    const strings = post.content.slice(0, 160).split(" ");
    strings.pop();
    return `${strings.join(" ")}…`;
  });

  eleventyConfig.addPlugin(readingTime);

  eleventyConfig.addCollection("tags", function (collectionApi) {
    return [
      ...new Set(
        collectionApi
          .getAll()
          .map((item) => item.data?.postTags || [])
          .flat()
      ),
    ];
  });

  eleventyConfig.amendLibrary("md", mdLib => mdLib.use(markdownItPrism));
};
