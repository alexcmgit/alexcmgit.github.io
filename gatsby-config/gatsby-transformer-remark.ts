import {
  transformerNotationDiff,
  // ...
} from "@shikijs/transformers";
import hljs from "highlight.js";

import {
  createImageExtractorTransformer,
  createThumbnailImageTransformer,
} from "@libsrcdev/gatsby-remark-structured-content";

import {
  CreateMarkupArgs as GriaCreateMarkupArgs,
  MarkupOptions as GriaMarkupOptions,
  defaultMarkup,
  forTrustedDomains,
} from "@libsrcdev/gatsby-remark-images-anywhere";

export function detectLanguage(snippet: string): string | undefined {
  return hljs.highlightAuto(snippet).language;
}

export function getGatsbyTransformerRemarkPlugin() {
  return {
    resolve: `gatsby-transformer-remark`,
    options: {
      footnotes: true,
      gfm: true,
      plugins: [
        {
          resolve: `@libsrcdev/gatsby-remark-github-markdown-alerts`,
        },
        {
          resolve: `@libsrcdev/gatsby-remark-autolink-domains`,
          options: {
            mapUrl: (domain: string, rest: string) => {
              if (domain === "gh.com") {
                return {
                  domain: "github.com",
                };
              }
            },
          },
        },
        {
          resolve: `@libsrcdev/gatsby-remark-structured-content`,
          options: {
            transformers: [
              createImageExtractorTransformer(),
              createThumbnailImageTransformer(),
            ],
          },
        },
        {
          resolve: `@libsrcdev/gatsby-remark-shiki`,
          options: {
            highlighterOptions: null,
            codeToHtmlOptions: {
              themes: {
                light: "min-light",
                dark: "everforest-dark",
              },
              transformers: [transformerNotationDiff()],
            },
            inferLang: async (snippet: string) => {
              return detectLanguage(snippet);
            },
          },
        },
        {
          // resolve: `gatsby-remark-images-anywhere`,
          resolve: `@libsrcdev/gatsby-remark-images-anywhere`,
          options: {
            staticDir: `/static`,
            backgroundColor: "var(--background-color)",
            linkImagesToOriginal: true,
            sharpMethod: "fluid",
            createMarkup: (
              args: GriaCreateMarkupArgs,
              options: GriaMarkupOptions,
            ) =>
              `<div style="padding-bottom: 2rem;">${defaultMarkup(args, options)}</div>`,
            maxWidth: 880,
            // httpHeaderProviders: [
            //   forTrustedDomains(["github.com"], (_: string) => ({
            //     Authorization: `Bearer ${process.env.PERSONAL_GITHUB_TOKEN}`,
            //   })),
            // ],
          },
        },
      ],
      // Enable JS for https://github.com/jonschlinkert/gray-matter#optionsengines (default: false)
      // It's not advised to set this to "true" and this option will likely be removed in the future
      jsFrontmatterEngine: false,
    },
  };
}
