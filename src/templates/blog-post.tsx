import * as React from "react";
import { graphql, HeadFC, navigate, PageProps, Link } from "gatsby";
import { GatsbyImage, getImage, ImageDataLike } from "gatsby-plugin-image";
import { GitHubUser, Layout } from "../components/layout";
import * as S from "./blog-post.style";
import { LayoutHeader } from "../components/layout-header";
import { NavLink } from "../components/layout-nav/style";
import Seo from "../components/seo";
import { BlogPostItem } from "../components/blog-post-item";
import { InLink } from "../components/inlink";

export type IBlogPostPageContext = {
  listingBasePath: string;
};

export default function BlogPostPage(
  props: PageProps<Queries.BlogPostPageQuery, IBlogPostPageContext>
) {
  const {
    pageContext: { listingBasePath },
    data: { gitHubDiscussion, relatedPosts, owner },
  } = props;

  const post = gitHubDiscussion!;

  return (
    <Layout owner={owner as GitHubUser}>
      <S.MarkdownStyle />
      {post?.thumbnailImage && (
        <S.ContentHero>
          <GatsbyImage
            image={getImage(post!.thumbnailImage.childImageSharp)!}
            alt={post!.title!}
          />
        </S.ContentHero>
      )}
      <S.ContentMeta>
        <S.ContentTitle>{post.title}</S.ContentTitle>
        {post?.humanReadableCreatedAt} by @
        <InLink to={`https://github.com/${post?.author?.login}`}>
          {post?.author?.login}
        </InLink>{" "}
        at <InLink to={post!.editPostUrl!}>GitHub</InLink>
      </S.ContentMeta>
      <S.Content
        className="markdown-body"
        dangerouslySetInnerHTML={{
          __html: post!.childMarkdownRemark!.html!,
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
              post={relatedPost as any}
            />
          );
        })}
      </S.ContentMeta>
    </Layout>
  );
}

export const Head: HeadFC<Queries.BlogPostPageQuery> = (props) => {
  return (
    <Seo
      title={props.data.gitHubDiscussion?.title ?? undefined}
      description={
        props.data.gitHubDiscussion?.shortExcerpt?.excerpt ?? undefined
      }
      image={
        props.data.gitHubDiscussion?.thumbnailImage?.publicURL ?? undefined
      }
    />
  );
};

export const query = graphql`
  fragment PostPreviewInfo on GitHubDiscussion {
    slug
    title
    githubId
    url
    path
    editPostUrl: discussionUrl
    humanReadableCreatedAt: createdAt(formatString: "dddd, MMMM Do YYYY")
    shortExcerpt: childMarkdownRemark {
      excerpt(format: PLAIN, pruneLength: 240)
    }
  }

  query BlogPostPage($discussionGithubId: String!, $ownerLogin: String!) {
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

    relatedPosts: allGitHubDiscussion(
      filter: { githubId: { ne: $discussionGithubId } }
      limit: 50
    ) {
      totalCount
      nodes {
        childMarkdownRemark {
          html
          id
        }
        author {
          login
        }
        thumbnailImage {
          ...PostDetailsThumbImageData
          publicURL
        }
        ...PostPreviewInfo
      }
    }

    gitHubDiscussion(githubId: { eq: $discussionGithubId }) {
      childMarkdownRemark {
        html
        id
      }
      author {
        login
      }
      thumbnailImage {
        ...PostDetailsThumbImageData
        publicURL
      }
      ...PostPreviewInfo
    }
  }
`;
