import * as React from "react";
import { graphql, HeadFC, navigate, PageProps, Link } from "gatsby";
import { GatsbyImage, getImage, ImageDataLike } from "gatsby-plugin-image";
import { GitHubUser, Layout } from "../components/layout";
import * as S from "./blog-post.style";
import Seo from "../components/seo";
import { BlogPostItem } from "../components/blog-post-item";
import { InLink } from "../components/inlink";
import EmblaCarousel from "../components/carousel";

export type IBlogPostPageContext = {
  listingBasePath: string;
};

export type IRawBlogPostItem = Exclude<Queries.BlogPostPageQuery["gitHubDiscussion"], null>

export function getThumbImageSharpFromPost(post: IRawBlogPostItem): ImageDataLike | undefined {
  return post?.childMarkdownRemark?.childMarkdownRemarkThumbnail?.childFile?.childImageSharp ?? undefined
}

export function getThumbImagePublicURLFromPost(post: IRawBlogPostItem): string | undefined {
  return post?.childMarkdownRemark?.childMarkdownRemarkThumbnail?.childFile?.publicURL ?? undefined
}

export function getThumbImagePublicURLFromMarkdownRemark(markdownRemark: IRawBlogPostItem["childMarkdownRemark"]): string | undefined {
  return markdownRemark?.childMarkdownRemarkThumbnail?.childFile?.publicURL ?? undefined
}

export default function BlogPostPage(
  props: PageProps<Queries.BlogPostPageQuery, IBlogPostPageContext>
) {
  const {
    pageContext: { listingBasePath },
    data: { gitHubDiscussion, relatedPosts, owner },
  } = props;

  const post = gitHubDiscussion!;

  const embeddedImages = post!.childMarkdownRemark!.childrenMarkdownRemarkEmbeddedImage;

  return (
    <Layout owner={owner as GitHubUser}>
      <S.MarkdownStyle />
      <div>
        <EmblaCarousel>
          {embeddedImages!.map((e) => {
            const childFile = e?.children[0] as Queries.File | undefined;
            const image = childFile?.childImageSharp as unknown as ImageDataLike | undefined;
            if (!image) {
              return null;
            }
            return (
              <GatsbyImage
                key={childFile!.id}
                image={getImage(image)!}
                alt={post!.title!}
              />
            );
          }).filter(Boolean)}
        </EmblaCarousel>
      </div>
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
          __html: post.childMarkdownRemark!.html!,
        }}
      />
      <S.ContentDivider>
        {relatedPosts.nodes.length > 0 && <h1>Other posts</h1>}
      </S.ContentDivider>
      <S.ContentMeta $noPadding>
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

export const Head: HeadFC<Queries.BlogPostPageQuery> = (props) => {
  return (
    <Seo
      title={props.data.gitHubDiscussion?.title ?? undefined}
      description={
        props.data.gitHubDiscussion?.shortExcerpt?.excerpt ?? undefined
      }
      image={
        getThumbImagePublicURLFromPost(props.data.gitHubDiscussion!) ?? undefined
      }
    />
  );
};

export const query = graphql`
  fragment PostPreviewInfo on GitHubDiscussion {
    slug
    title
    githubId
    discussionUrl
    editPostUrl: discussionUrl
    humanReadableCreatedAt: createdAt(formatString: "dddd, MMMM Do YYYY")
    shortExcerpt: childMarkdownRemark {
      excerpt(format: PLAIN, pruneLength: 240)
    }
  }

  fragment PostDetailsThumbInfo on MarkdownRemark {
    childMarkdownRemarkThumbnail {
      childFile {
        ...PostDetailsThumbImageData
        publicURL
      }
    }
  }

  fragment PostListThumbInfo on MarkdownRemark {
    childMarkdownRemarkThumbnail {
      childFile {
        ...PostListThumbImageData
        publicURL
      }
    }
  }

  query BlogPostPage($discussionGithubId: String!, $ownerLogin: String!) {
    ...OwnerInfo
    relatedPosts: allGitHubDiscussion(
      filter: { githubId: { ne: $discussionGithubId } }
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

    gitHubDiscussion(githubId: { eq: $discussionGithubId }) {
      childMarkdownRemark {
        html
        id
        ...PostDetailsThumbInfo
        childrenMarkdownRemarkEmbeddedImage {
          children {
            ... on File {
              childImageSharp {
                gatsbyImageData(
                  layout: CONSTRAINED
                  width: 1920
                  placeholder: BLURRED
                  formats: [AUTO, WEBP, AVIF]
                )
              }
            }
          }
        }
      }
      author {
        login
      }
      ...PostPreviewInfo
    }
  }
`;
