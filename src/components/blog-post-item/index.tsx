import React from "react";

import { GatsbyImage, ImageDataLike, getImage } from "gatsby-plugin-image";

import * as S from "./style";
import { noTrailingSlash } from "../../utils/url";
import blogConfig from "../../../blog.config";

export type IBlogPostItem = {
  listingBasePath: string;
  post: {
    title: string;
    shortExcerpt: {
      excerpt: string;
    };
    path: string;
    thumbnailImage?: {
      childImageSharp: ImageDataLike;
    };
    humanReadableCreatedAt: string;
    slug: string;
  };
};

export function BlogPostItem({ post, listingBasePath }: IBlogPostItem) {
  return (
    <S.BlogPostItem>
      <S.BlogPostItemLink to={noTrailingSlash(listingBasePath, post.slug)}>
        {post.thumbnailImage ? (
          <S.BlogPostItemThumb>
            <GatsbyImage
              image={
                getImage(
                  post.thumbnailImage!.childImageSharp! as ImageDataLike
                )!
              }
              alt={post.title}
            />
          </S.BlogPostItemThumb>
        ) : (
          <S.BlogPostItemFallbackThumb>
            {post.title[0].toUpperCase()}
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
