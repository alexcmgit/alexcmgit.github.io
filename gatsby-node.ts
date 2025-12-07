import path from "path";
import type { GatsbyNode } from "gatsby";
import blogConfig from "./blog.config";
import { assert } from "console";
import { noTrailingSlash } from "./src/utils/url";

type CreatePagesAPI = GatsbyNode[`createPages`];
type OnCreatePageAPI = GatsbyNode[`onCreatePage`];

const createBlogListPaginationPages: CreatePagesAPI = async ({
  actions,
  graphql,
}) => {
  const { createPage } = actions;

  const query = `
    query GetAllGitHubDiscussions {
      allGitHubDiscussion {
        totalCount
      }
    }
  `;

  const response = await graphql<Queries.Query>(query);

  const data = response.data;

  if (!data) {
    throw Error(
      `Was not possible to fetch data: ` +
      data +
      "\nQuery: " +
      query +
      "\nErrors: " +
      response.errors
    );
  }

  const { totalCount } = data.allGitHubDiscussion;

  const perPage = blogConfig.postsPerPage;

  const pageCount = Math.ceil(totalCount / perPage);

  for (let i = 0; i < pageCount; i++) {
    const skip = i * perPage;
    const limit = perPage;
    const page = i + 1;

    const postListingBasePath = noTrailingSlash(`${blogConfig.postsBasePath}`);
    const postListingPaginationBasePath = noTrailingSlash(`${postListingBasePath}/page`)

    createPage({
      path: page === 1 ? postListingBasePath : `${postListingPaginationBasePath}/${page}`,
      component: path.resolve(`./src/templates/blog-list.tsx`),
      context: {
        currentPage: page,
        pageCount: pageCount,
        listingBasePath: postListingBasePath,
        skip,
        limit,
        ownerLogin: blogConfig.owner,
      },
    });
  }
};

const createBlogPostPages: CreatePagesAPI = async ({ actions, graphql }) => {
  const { createPage } = actions;

  const query = `
    query GetAllGitHubDiscussions {
      allGitHubDiscussion {
        nodes {
          id
          githubId
          slug
        }
      }
    }
  `;

  const response = await graphql<Queries.Query>(query);

  const data = response.data;

  if (!data) {
    throw Error(
      `Was not possible to fetch data: ` +
      data +
      "\nQuery: " +
      query +
      "\nErrors: " +
      response.errors
    );
  }

  for (const discussion of data.allGitHubDiscussion.nodes) {
    assert(discussion.slug !== undefined);

    const postContentPath = noTrailingSlash(blogConfig.postsBasePath, discussion.slug!);

    createPage({
      path: postContentPath,
      component: path.resolve(`./src/templates/blog-post.tsx`),
      ownerNodeId: discussion.id,
      context: {
        listingBasePath: noTrailingSlash(blogConfig.postsBasePath),
        discussionGithubId: discussion.githubId,
        ownerLogin: blogConfig.owner,
      },
    });
  }
};

const createStandalonePages: CreatePagesAPI = async ({ actions, graphql }) => {
  const { createPage } = actions;

  const query = `
    query GetAllGitHubDiscussions {
      allGitHubDiscussion {
        nodes {
          id
          githubId
        }
      }
    }
  `;

  const response = await graphql<Queries.Query>(query);

  const data = response.data;

  if (!data) {
    throw Error(
      `Was not possible to fetch data: ` +
      data +
      "\nQuery: " +
      query +
      "\nErrors: " +
      response.errors
    );
  }

  for (const discussion of data.allGitHubDiscussion.nodes) {
    const postContentPath = noTrailingSlash(blogConfig.postsBasePath, discussion.slug!);

    createPage({
      path: postContentPath,
      component: path.resolve(`./src/templates/blog-post.tsx`),
      ownerNodeId: discussion.id,
      context: {
        listingBasePath: noTrailingSlash(blogConfig.postsBasePath),
        discussionGithubId: discussion.githubId,
        ownerLogin: blogConfig.owner,
      },
    });
  }
};

export const createPages: CreatePagesAPI = async function (...args) {
  // await createProjectsPage(...args);
  await createBlogListPaginationPages(...args);
  await createBlogPostPages(...args);
  // await createStandalonePages(...args);
};
