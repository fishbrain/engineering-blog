import fs from "fs";
import matter from "gray-matter";
import { join } from "path";

export function getAllSlugs(directory: string) {
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

export function readContentData(directory: string) {
  const fileContents = fs.readFileSync(join(directory, "index.md"), "utf8");
  const frontMatter = matter(fileContents);
  return frontMatter;
}
