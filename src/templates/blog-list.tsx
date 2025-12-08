import * as React from "react";
import { graphql, PageProps, HeadFC } from "gatsby";

import * as S from "./blog-list.style.tsx";
import { GitHubUser, Layout } from "../components/layout";
import { BlogListPaginator } from "../components/blog-list-paginator/index.tsx";
import Seo from "../components/seo/index.tsx";
import { BlogPostItem, IBlogPostItem } from "../components/blog-post-item/index.tsx";
import { noTrailingSlash } from "../utils/url.ts";
import blogConfig from "../../blog.config.ts";
import { getThumbImageSharpFromPost, IRawBlogPostItem } from "./blog-post.tsx";

export type BlogListPageContext = {
  currentPage: number;
  pageCount: number;
  skip: number;
  listingBasePath: string,
  limit: number;
};

export default function BlogListPage(
  props: PageProps<Queries.BlogListPageQuery, BlogListPageContext>
) {
  const {
    pageContext: { currentPage, pageCount, listingBasePath },
    data: {
      discussions: { nodes: discussions },
      owner,
    },
  } = props;

  if (discussions.length <= 0) {
    return <></>;
  }

  type DiscussionPostItemType = typeof discussions[number];

  const discussionsGroupedByYear: { [year: string]: typeof discussions } = (() => {
    const groups: { [year: string]: any[] } = {};
    for (const discussion of discussions) {
      const year = new Date(discussion.createdAt!).getFullYear().toString();
      if (!groups[year]) {
        groups[year] = [];
      }
      groups[year].push(discussion);
    }
    return groups
  })();

  const years = Object.keys(discussionsGroupedByYear).map(Number).sort((a, z) => z - a).map((e) => e.toString());

  return (
    <Layout owner={owner as GitHubUser}>
      <S.Main>
        {years.map((year) => {
          return (
            <>
              <S.YearDivider>{year}</S.YearDivider>
              {discussionsGroupedByYear[year].map((e: DiscussionPostItemType) => {
                const post = e as unknown as IRawBlogPostItem
                return <BlogPostItem key={e.githubId} listingBasePath={listingBasePath} post={post} />;
              })}
            </>
          )
        })}
        <BlogListPaginator
          currentPage={currentPage}
          totalPages={pageCount}
          isDisabled={(page: number) => page === currentPage}
          generateLink={(page: number) => {
            if (page === 1) {
              return listingBasePath;
            }
            return noTrailingSlash(listingBasePath, blogConfig.paginationPrefix, page.toString());
          }}
        />
      </S.Main>
    </Layout>
  );
}

export const Head: HeadFC = () => <Seo />;

export const query = graphql`
  fragment PostDetailsThumbImageData on File {
    childImageSharp {
      gatsbyImageData(
        layout: CONSTRAINED
        width: 1920
        placeholder: BLURRED
        formats: [AUTO, WEBP, AVIF]
      )
    }
  }
  fragment PostListThumbImageData on File {
    childImageSharp {
      gatsbyImageData(
        layout: CONSTRAINED
        width: 100
        placeholder: BLURRED
        formats: [AUTO, WEBP, AVIF]
      )
    }
  }
  query BlogListPage($skip: Int!, $limit: Int!, $ownerLogin: String!) {
    owner: gitHubUser(login: { eq: $ownerLogin }) {
      avatarUrl
      githubId
      login
      bio
      avatarUrlSharpOptimized {
        childImageSharp {
          gatsbyImageData(
            layout: FIXED
            width: 50
            height: 50
            placeholder: TRACED_SVG
            formats: [AUTO, WEBP, AVIF]
          )
        }
        publicURL
      }
    }
    discussions: allGitHubDiscussion(
      sort: [{ createdAt: DESC }, { updatedAt: DESC }]
      skip: $skip
      limit: $limit
    ) {
      totalCount
      nodes {
        githubId
        title
        slug
        humanReadableCreatedAt: createdAt(formatString: "dddd, MMMM Do YYYY")
        createdAt
        childMarkdownRemark {
          html
          ...PostListThumbInfo
        }
      }
    }
  }
`;
