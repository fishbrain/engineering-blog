import unified from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import mdxPrism from "mdx-prism";

const EMBED_WHITELIST = ["https://www.youtube.com/", "https://twitframe.com"];
const EMBED_TYPE = "embed";
const EMBED_SYMBOL = "?";

function parseEmbedLinks() {
  return transformer;

  function transformer(tree: any) {
    tree.children.forEach((child: any) => {
      if (child.type === "paragraph" && child.children.length === 2) {
        if (
          child.children[0].type === "text" &&
          child.children[0].value === EMBED_SYMBOL &&
          child.children[1].type === "link" &&
          EMBED_WHITELIST.some((domain) =>
            child.children[1].url.startsWith(domain)
          )
        ) {
          child.children[1].type = EMBED_TYPE;
          child.children = [child.children[1]];
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
          const iframeNode = h(node, "iframe", {
            src: node.url,
            height: 480,
            width: 670,
            allowfullscreen: true,
            frameborder: 0,
          });
          if (node.children && (node.children as any).length) {
            return h(node, "figure", {}, [
              iframeNode,
              h(node, "figcaption", {}, node.children as any),
            ]);
          }
          return iframeNode;
        },
      },
    })
    .use(mdxPrism)
    .use(rehypeStringify)
    .process(markdown);
  return result.toString();
}
