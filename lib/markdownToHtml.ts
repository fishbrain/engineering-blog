import unified from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import mdxPrism from "mdx-prism";

const EMBED_WHITELIST = ["https://www.youtube.com/"];
const EMBED_TYPE = "embed";

function parseEmbedLinks() {
  return transformer;

  function transformer(tree: any) {
    tree.children.forEach((child: any) => {
      if (child.type === "paragraph" && child.children.length === 1) {
        if (
          child.children[0].type === "link" &&
          EMBED_WHITELIST.some((domain) =>
            child.children[0].url.startsWith(domain)
          )
        ) {
          child.children[0].type = EMBED_TYPE;
        }
      }
    });
  }
}

export default async function markdownToHtml(markdown: string) {
  const result = await unified()
    .use(remarkParse)
    .use(parseEmbedLinks)
    .use(remarkRehype, undefined, {
      handlers: {
        [EMBED_TYPE]: (h, node) => {
          return h(node, 'iframe', {
            src: node.url,
            height: 480,
            width: 670,
            allowfullscreen: true,
            frameborder: 0,
          })
        },
      },
    })
    .use(mdxPrism)
    .use(rehypeStringify)
    .process(markdown);
  return result.toString();
}
