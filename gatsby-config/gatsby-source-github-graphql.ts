import parse from "html-dom-parser";
import type { Element } from "domhandler";
import slugify from "slugify";
import blogConfig from "../blog.config.ts";

function mapDiscussions(discussion: any) {
  // type of discussion == "Discussion", see GitHub API reference below.
  // https://docs.github.com/en/graphql/guides/using-the-graphql-api-for-discussions#discussion
  // Not all fields are included but most of them.

  const slug = slugify(discussion.title);
  // const url = blogConfig.domain + path;

  function getThumbnailUrlIfAny(string: string): string | undefined {
    const source = string.trim();
    const isMarkImg = source.startsWith(`![`);
    const isHtmlImg = source.startsWith(`<img`);

    if (!isMarkImg && !isHtmlImg) {
      return undefined;
    }

    function htmlImgFromMarkImg(source: string): string {
      const regex = /!\[(.*?)]\((.+)\)/g;

      // Dangerous but we trust the HTML source since only users with repo write access can publish posts.
      return source.replace(regex, `<img alt="$1" src="$2" />`);
    }

    const imgString = isMarkImg ? htmlImgFromMarkImg(source) : source;
    const imgNode = parse(imgString)[0] as Element;
    const src = imgNode.attribs.src;

    if (!src.startsWith(`http`)) {
      return undefined;
    }

    return src;
  }

  const postLines = discussion.body.split(`\n`);

  const thumbnailImage = getThumbnailUrlIfAny(postLines[0]);
  const hasThumbnailImage = typeof thumbnailImage === `string`;

  return {
    ...discussion,
    discussionUrl: discussion.url,
    body: hasThumbnailImage ? postLines.slice(1).join(`\n`) : discussion.body,
    thumbnailImage: hasThumbnailImage ? thumbnailImage : null,
    hasThumbnailImage,
    // url,
    slug,
  };
}

export function getGatsbySourceGitHubDiscussionsPlugin() {
  return {
    resolve: `@libsrcdev/gatsby-source-github-graphql`,
    options: {
      // Required, GitHub only allow authenticated requests.
      // Your token is not shared across subplugins even if you specify a custom token to it.
      token: process.env.PERSONAL_GITHUB_TOKEN,

      // In this project we are going to check if the first line of the discussion body
      // is a markdown (or html) image, if it is then set the [thumbnailImage] field with it.
      // To make it possible we need to map the responsive at build-time (through sourceNodes Gatsby API).
      createCustomMapper: ({
        githubSourcePlugin: { pluginNodeTypes },
      }: any) => {
        return {
          [pluginNodeTypes.DISCUSSION]: mapDiscussions,
        };
      },

      // To optimize the custom [thumbnailImage] field created in the mapping step, that is,
      // create a responsive image, we need to create the respective [File] node from the image URL.
      // In order to do that, we can use this helper function provided by the plugin:
      onCreateNode: async (
        {
          node,
          isInternalType,
          githubSourcePlugin: { pluginNodeTypes, createFileNodeFrom },
        }: any,
        pluginOptions: any
      ) => {
        if (node.internal.type === pluginNodeTypes.DISCUSSION) {
          await createFileNodeFrom({
            node,
            key: `thumbnailImage`,
            fieldName: `thumbnailImageFile`,
          });
        }
      },

      // The last step is to make define the custom field in the schema.
      createSchemaCustomization: (
        {
          actions: { createTypes },
          githubSourcePlugin: { pluginNodeTypes },
        }: any,
        pluginOptions: any
      ) => {
        // Always use [pluginNodeTypes] since you can also customize these Node types
        // if it is conflicting with another plugin.
        const typedef = `
            type ${pluginNodeTypes.DISCUSSION} implements Node {
              thumbnailImage: File @link(from: "fields.thumbnailImageFile")
            }
          `;

        createTypes(typedef);
      },
      plugins: [
        {
          resolve: `@libsrcdev/gatsby-source-github-graphql-discussions`,
          options: {
            owner: blogConfig.owner,
            repo: blogConfig.repo,
            categorySlugs: (() => {
              if (process.env.NODE_ENV === "development") {
                return [...blogConfig.safeCategories, ...blogConfig.debugCategories]
              }
              return blogConfig.safeCategories
            })(),
            key: `posts`,
          },
        },
      ],
    },
  }

}
