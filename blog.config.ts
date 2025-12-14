import { noTrailingSlash, withLeadingSlash } from "./src/utils/url";
import { composed } from "./src/utils/composed";
const config = composed({
  siteBasePath: "/",

  pagination: {
    prefix: `/page`,
  },

  siteMetadata: {
    about: {
      name: `Alex Castro`,
      description: `Personal blog of Alex Castro about programming, web development, tech, and other stuff.`,
      bannerImageUrl: `https://user-images.githubusercontent.com/51419598/240399860-a9fb362c-28a0-4838-b8d5-8332c2feecb5.png`,
    },
    social: {
      githubUsername: `alexcmgit`,
      twitterUsername: `alexcmtx`,
      linkedinUsername: `alexgccp`,
    },
    repository: {
      owner: `alexcmgit`,
      name: `alexcmgit.github.io`,
    },
    siteUrl: `https://alexcastro.dev`,
    deploySha: process.env.DEPLOY_SHA ?? "0",
  },
})((config) => ({
  ...config,
  owner: config.siteMetadata.repository.owner,
  repo: config.siteMetadata.repository.name,

  siteBasePath: noTrailingSlash(config.siteBasePath),
  siteBasePathWithLeadingSlash: withLeadingSlash(config.siteBasePath),

  pagination: {
    ...config.pagination,
    prefix: noTrailingSlash(config.pagination.prefix),
    prefixWithLeadingSlash: withLeadingSlash(config.pagination.prefix),
  },
}))((config) => ({
  ...config,
  posts: {
    basePath: `/posts`,
    perPage: 10,
    ghDiscussionSourceRepos: [
      {
        owner: config.owner,
        repo: config.repo,
        // This will prevent someone else creating a discussion and publishing to your blog without your authorization.
        // Only users with repo-write access can modify announcement-type categories.
        publishedCategories: [`Published`],
        debugCategories: [`Debug`],
      },
    ],
  },
}))((config) => ({
  ...config,
  posts: {
    ...config.posts,
    basePath: noTrailingSlash(config.siteBasePath, config.posts.basePath),
    paginationBasePath: noTrailingSlash(config.siteBasePath, config.posts.basePath, config.pagination.prefix),
  },
}))((config) => ({
  ...config,
  posts: {
    ...config.posts,
    paginationBasePathWithLeadingSlash: withLeadingSlash(config.posts.paginationBasePath),
    basePathWithLeadingSlash: withLeadingSlash(config.posts.basePath),
  },
}))((config) => ({
  ...config,
  siteMetadata: {
    ...config.siteMetadata,
    repository: {
      ...config.siteMetadata.repository,
      url: `https://github.com/${config.siteMetadata.repository.owner}/${config.siteMetadata.repository.name}`
    },
    social: {
      ...config.siteMetadata.social,
      linkedinProfileUrl: `https://www.linkedin.com/in/${config.siteMetadata.social.linkedinUsername}`,
      githubProfileUrl: `https://github.com/${config.siteMetadata.social.githubUsername}`,
      twitterProfileUrl: `https://twitter.com/${config.siteMetadata.social.twitterUsername}`,
    },
  },
}))((config) => ({
  ...config,
  navLinks: [
    `~> cd ~ ${config.siteBasePathWithLeadingSlash}`,
    `~> cd ${config.posts.basePathWithLeadingSlash} ${config.posts.basePathWithLeadingSlash}`,
    `~> cd /tools /tools`,
    `~> cd /oss /oss`,
    `~> cd /xp /work-experience`,
    `~> open /src ${config.siteMetadata.repository.url}`,
    `~> open in@${config.siteMetadata.social.linkedinUsername} ${config.siteMetadata.social.linkedinProfileUrl}`,
    `~> open gh@${config.siteMetadata.social.githubUsername} ${config.siteMetadata.social.githubProfileUrl}`,
  ].filter(Boolean),
}))()


export default config;
