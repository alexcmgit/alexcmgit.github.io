
import {
  transformerNotationDiff,
  // ...
} from '@shikijs/transformers'
import hljs from "highlight.js";

import {} from "@libsrcdev/gatsby-remark-structured-data-content";

export function detectLanguage(snippet: string): string | undefined {
  return hljs.highlightAuto(snippet).language;
}

export function getGatsbyTransformerRemarkPlugin() {
  return {
    resolve: `gatsby-transformer-remark`,
    options: {
      // Footnotes mode (default: true)
      footnotes: true,
      // GitHub Flavored Markdown mode (default: true)
      gfm: true,
      // Add your gatsby-remark-* plugins here
      plugins: [
        {
          resolve: `@libsrcdev/gatsby-remark-structured-content`,
          options: {
            transformers: {},
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
