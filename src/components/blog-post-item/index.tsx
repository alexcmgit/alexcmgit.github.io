import React from "react";

import { GatsbyImage, ImageDataLike, getImage } from "gatsby-plugin-image";

import * as S from "./style";
import { noTrailingSlash } from "../../utils/url";
import blogConfig from "../../../blog.config";
import { getThumbImageSharpFromPost, IRawBlogPostItem } from "../../templates/blog-post";

export type IBlogPostItem = {
  listingBasePath: string;
  post: IRawBlogPostItem;
};

export function BlogPostItem({ post, listingBasePath }: IBlogPostItem) {
  const thumbImage = getThumbImageSharpFromPost(post)

  return (
    <S.BlogPostItem>
      <S.BlogPostItemLink to={noTrailingSlash(listingBasePath, post.slug)}>
        {thumbImage ? (
          <S.BlogPostItemThumb>
            <GatsbyImage
              image={getImage(thumbImage)!}
              alt={post.title ?? ''}
            />
          </S.BlogPostItemThumb>
        ) : (
          <S.BlogPostItemFallbackThumb>
            {post.title![0].toUpperCase()}
          </S.BlogPostItemFallbackThumb>
        )}
        <S.BlogPostItemContent>
          <p className="date">{post.humanReadableCreatedAt}</p>
          <h1>{post.title}</h1>
          {/* <p className="excerpt">{post.shortExcerpt.excerpt}</p> */}
        </S.BlogPostItemContent>
      </S.BlogPostItemLink>
    </S.BlogPostItem>
  );
}

function getLastCharsOf(s: string, n: number): string {
  return s.slice(-n);
}
