# Obsidian

Obsidian is a configurable and serverless blog, fully hosted on GitHub pages and [GitHub discussions](https://github.com/alexcmgit/obsidian/discussions) (CMS).

The general design is original and tries to follow minimalism pattern. The markup content style is from [GitHub markdown CSS](https://github.com/sindresorhus/github-markdown-css).

See [how to clone and use with your posts and your data](https://alexcastro.dev/posts/how-to-use-obsidians-blog-template-built-with-gatsby-and-github-actions-but-no-coding-skills-are-required/).

## Quick start

> [!NOTE]
> Requires: nodejs, ts-node, yarn. (for tools with version constraints see `.tools-version`).

1. Fill `.env`.
2. Run:

```bash
yarn install
yarn clean
yarn dev
```

## Roadmap

- [x] Finalize the plugin for image extraction: `gatsby-remark-structured-content`.
  - [x] Add API docs, and provide visit metadata info (depth, index, etc).~
- [x] Remove thumbnail logic from config and use the new plugin to extract the first image as thumbnail.
- [ ] Add support for video embedding (YouTube, Vimeo, etc).
- [ ] Add support for image captions.
- [ ] Add support for image alt text.
- [ ] Add support for p5js sketches embedding.
- [ ] Showcase my p5js sketches using the embedding system.
- [ ] Showcase my algorithms (need to define how to do this in a post-like view).
- [ ] Showcase my open-source projects.
- [ ] Showcase my photography work.
- [ ] Showcase my work experiences / a.k.a professional app/web/backend experience/projects.
- [ ] Need to create a proper landing page (maybe?).
- [ ] Need to create a proper redirect system for old links and also finish a SaaS for link management (ref. wya. Maybe turning it into a Cloudflare SPA w/ ease UI for link management).
- [ ] Check SEO status of this blog and social media embed integration.
- [x] Create a [plugin to autolink bare domains](https://github.com/libsrcdev/gatsby-remark-autolink-domains) (e.g., `google.com` -> `[google.com](https://google.com)`).
- [ ] Create a plugin to autolink handles for multiple platforms gh@username, tw@username, in@username, ig@username, etc. And also handle default/fallback @username to a default platform.
- [ ] Add option to [@libsrcdev/gatsby-remark-shiki](https://github.com/libsrcdev/gatsby-remark-shiki) plugin to add a 'Copy' button at the top-right code block.
- [ ] Allow remote relative image URLs, by using the static folder (maybe fork gatsby-remark-images-anywhere plugin?).
- [ ] Allow setting custom HTTP headers for fetching markdown images (since GitHub now requires it), will need to modify gatsby-remark-images-anywhere.
  - [ ] Also allow setting custom headers in the structured-content plugin in order to make it properly work.
- [ ] Maybe use this roadmap/README and show it somewhere else in the blog?
- [ ] Use a tracker/roadmap like this for other projects as well.
- [ ] Implement markdown alert syntax.
