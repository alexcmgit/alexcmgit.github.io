import type { GatsbyConfig } from "gatsby";
import parse from "html-dom-parser";
import type { Element } from "domhandler";
import dotenv from "dotenv";
import {
  transformerNotationDiff,
  // ...
} from '@shikijs/transformers'
import hljs from "highlight.js";

export function detectLanguage(snippet: string): string | undefined {
  return hljs.highlightAuto(snippet).language;
}

import blogConfig from "./blog.config.ts";
import { slugify } from "./src/utils/slugify.ts";

dotenv.config();

function mapDiscussions(discussion: any) {
  // type of discussion == "Discussion", see GitHub API reference below.
  // https://docs.github.com/en/graphql/guides/using-the-graphql-api-for-discussions#discussion
  // Not all fields are included but most of them.

  const slug = slugify(discussion.title);
  const path = `/` + slug;
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
    path,
    slug,
  };
}

const config: GatsbyConfig = {
  // Important: remove this prefix if you are deploying to a root domain, e.g https://myblog.com
  // Otherwise rename to the path you're going to use, e.g https://myblog.com/notes.
  // See https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting/path-prefix/.
  pathPrefix: blogConfig.pathPrefix,

  siteMetadata: blogConfig.siteMetadata,
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [
          `Roboto Mono`,
          `JetBrains Mono`,
        ],
        display: "swap",
      },
    },
    `gatsby-plugin-transition-link`,
    `gatsby-plugin-styled-components`,
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    "gatsby-plugin-styled-components",
    // "gatsby-plugin-google-gtag",
    "gatsby-plugin-sitemap",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        icon: "src/images/icon.png",
      },
    },
    "gatsby-plugin-mdx",
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        // Footnotes mode (default: true)
        footnotes: true,
        // GitHub Flavored Markdown mode (default: true)
        gfm: true,
        // Add your gatsby-remark-* plugins here
        plugins: [
          {
            resolve: `@libsrcdev/gatsby-remark-shiki`,
            options: {
              highlighterOptions: null,
              codeToHtmlOptions: {
                themes: {
                  light: 'min-light',
                  dark: 'everforest-dark',
                },
                transformers: [
                  transformerNotationDiff(),
                  // ...
                ],
              },
              inferLang: async (snippet: string) => {
                return detectLanguage(snippet)
              }
            },
          },
          {
            resolve: `gatsby-remark-images-anywhere`,
            options: {
              staticDir: `/static`,
              backgroundColor: "var(--background-color)",
              linkImagesToOriginal: true,
              sharpMethod: "fluid",
              maxWidth: 880,
            },
          },
        ],
        // Enable JS for https://github.com/jonschlinkert/gray-matter#optionsengines (default: false)
        // It's not advised to set this to "true" and this option will likely be removed in the future
        jsFrontmatterEngine: false,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./src/images/",
      },
      __key: "images",
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages",
        path: "./src/pages/",
      },
      __key: "pages",
    },
    {
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
            },
          },
        ],
      },
    },
  ],
};

export default config;
