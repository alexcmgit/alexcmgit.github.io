
import dotenv from "dotenv";
dotenv.config();

import type { GatsbyConfig } from "gatsby";
import { getGatsbySourceGitHubDiscussionsPlugin } from "./gatsby-config/gatsby-source-github-graphql.ts";
import { getGatsbyTransformerRemarkPlugin } from "./gatsby-config/gatsby-transformer-remark.ts";

import blogConfig from "./blog.config.ts";

const config: GatsbyConfig = {
  // Important: remove this prefix if you are deploying to a root domain, e.g https://myblog.com
  // Otherwise rename to the path you're going to use, e.g https://myblog.com/notes.
  // See https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting/path-prefix/.
  pathPrefix: blogConfig.siteBasePath,

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
    // "gatsby-plugin-mdx",
    getGatsbyTransformerRemarkPlugin(),
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
      __key: "src-pages",
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "evergreen",
        path: "./evergreen/",
      },
      __key: "evergreen",
    },
    getGatsbySourceGitHubDiscussionsPlugin(),
  ],
};

export default config;
