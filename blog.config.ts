import { noTrailingSlash, withLeadingSlash } from "./src/utils/url";

const socialMedia = `
GitHub https://github.com/alexcmgit/obsidian
Fork this blog https://alexcmgit.github.io/obsidian/how-to-use-obsidian's-blog-template-(built-with-gatsby-and-github-actions-but-no-coding-skills-are-required)/
`;

export default ((config) => ({
  ...config,
  siteBasePathWithLeadingSlash: withLeadingSlash(config.siteBasePath),
}))(((config) => ({
  ...config,
  siteBasePath: noTrailingSlash(config.siteBasePath),
  postsBasePath: noTrailingSlash(config.siteBasePath, config.postsBasePath),
  postsPaginationBasePath: noTrailingSlash(config.siteBasePath, config.postsBasePath, config.paginationPrefix),
  paginationPrefix: noTrailingSlash(config.paginationPrefix),
}))({
  owner: "alexcmgit",
  repo: "alexcmgit.github.io",

  siteBasePath: "/",
  postsBasePath: `/posts`,
  paginationPrefix: `/page`,

  postsPerPage: 3,

  siteMetadata: {
    title: `Alex Castro`,
    githubUsername: `alexcmgit`,
    twitterUsername: `alexcmtx`,
    description: `Personal blog of Alex Castro about programming, web development, tech, and other stuff.`,
    image: `https://user-images.githubusercontent.com/51419598/240399860-a9fb362c-28a0-4838-b8d5-8332c2feecb5.png`,
    siteUrl: `https://alexcastro.dev`,
    deploySha: process.env.DEPLOY_SHA ?? "0",
  },

  socialMedia: socialMedia,

  // This will prevent someone else creating a discussion and publishing to your blog without your authorization.
  // Only users with repo-write access can modify announcement-type categories.
  safeCategories: [`Published`],
  debugCategories: [`Debug`],
}));
