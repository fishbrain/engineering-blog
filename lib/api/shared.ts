import fs from "fs";
import matter from "gray-matter";
import { join } from "path";

// This function will append the correct directory to any images added to the post.
function mapImages(content: string, pathPrefix: string) {
  console.log({ pathPrefix })
  let currentIndex = 0;
  while (currentIndex !== -1) {
    currentIndex = content.indexOf("![", currentIndex);
    if (currentIndex === -1) {
      return content;
    }
    currentIndex = content.indexOf("]", currentIndex);
    if (currentIndex === -1) {
      return content;
    }
    currentIndex = content.indexOf("(", currentIndex);
    if (currentIndex === -1 || content[currentIndex + 1] === '/') {
      return content;
    }
    content =
      content.slice(0, currentIndex + 1) +
      "/" +
      pathPrefix +
      "/" +
      content.slice(currentIndex + 1);
  }
  return content;
}

export function getAllSlugs(directory: string) {
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

export function readContentData(directory: string) {
  const fileContents = fs.readFileSync(join(directory, "index.md"), "utf8");
  const frontMatter = matter(fileContents);
  const contentPath = directory.split("/public/")[1];
  frontMatter.content = mapImages(frontMatter.content, contentPath);
  return frontMatter;
}
