
import {
  transformerNotationDiff,
  // ...
} from '@shikijs/transformers'
import hljs from "highlight.js";

import { createImageExtractorTransformer, createThumbnailImageTransformer } from "@libsrcdev/gatsby-remark-structured-content";

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
          resolve: `@libsrcdev/gatsby-remark-autolink-domains`,
          options: {
            mapUrl: (domain: string, rest: string) => {
              if (domain === 'gh.com') {
                return {
                  domain: 'github.com',
                }
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
                light: 'min-light',
                dark: 'everforest-dark',
              },
              transformers: [
                transformerNotationDiff(),
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
  }
}
