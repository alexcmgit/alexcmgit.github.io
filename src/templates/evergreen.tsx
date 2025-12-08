import * as React from "react";
import { graphql, HeadFC, PageProps } from "gatsby";
import { GitHubUser, Layout } from "../components/layout";
import * as S from "./blog-post.style";
import Seo from "../components/seo";
import { BlogPostItem } from "../components/blog-post-item";
import { getThumbImagePublicURLFromMarkdownRemark, IRawBlogPostItem } from "./blog-post";

export type IEvergreenPageContext = {
  listingBasePath: string;
};

export default function EvergreenPage(
  props: PageProps<Queries.EvergreenPageQuery, IEvergreenPageContext>
) {
  const {
    pageContext: { listingBasePath },
    data: { file, relatedPosts, owner },
  } = props;

  const htmlContent = file!.childMarkdownRemark!.html!;

  return (
    <Layout owner={owner as GitHubUser}>
      <S.MarkdownStyle />
      <S.Content
        className="markdown-body"
        dangerouslySetInnerHTML={{
          __html: htmlContent,
        }}
      />
      <S.ContentDivider>
        {relatedPosts.nodes.length > 0 && <h1>Other posts</h1>}
      </S.ContentDivider>
      <S.ContentMeta noPadding>
        {relatedPosts.nodes.map((relatedPost) => {
          return (
            <BlogPostItem
              listingBasePath={listingBasePath}
              key={relatedPost.githubId}
              post={relatedPost as unknown as IRawBlogPostItem}
            />
          );
        })}
      </S.ContentMeta>
    </Layout>
  );
}

export const Head: HeadFC<Queries.EvergreenPageQuery> = (props) => {
  return (
    <Seo
      title={props.data.file?.name ?? undefined}
      description={
        props.data.file?.childMarkdownRemark?.excerpt ?? undefined
      }
      image={
        getThumbImagePublicURLFromMarkdownRemark(props.data.file!.childMarkdownRemark! as any) ?? undefined
      }
    />
  );
};

export const query = graphql`
  query EvergreenPage($fileId: String!, $ownerLogin: String!) {
    ...OwnerInfo
    relatedPosts: allGitHubDiscussion(
      limit: 50
    ) {
      totalCount
      nodes {
        childMarkdownRemark {
          html
          id
          ...PostListThumbInfo
        }
        author {
          login
        }
        ...PostPreviewInfo
      }
    }
    file(id: {eq: $fileId}) {
      name
      relativeDirectory
      relativePath
      id
      childMarkdownRemark {
        html
        id
        excerpt
      }
    }
  }
`;
