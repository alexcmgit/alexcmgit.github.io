import React from "react";
import { useSiteMetadata } from "../../hooks/use-site-metadata";

export type SeoProps = {
  title?: string;
  description?: string;
  pathname?: string;
  image?: string;
};

export default function Seo({
  title,
  description,
  pathname,
  image,
  children,
}: React.PropsWithChildren<SeoProps>): JSX.Element {
  const {
    about: { name: defaultTitle, description: defaultDescription, bannerImageUrl: defaultImage },
    siteUrl,
    twitterUsername,
    deploySha,
  } = useSiteMetadata();

  const seo = {
    title: title ?? defaultTitle,
    description: description ?? defaultDescription,
    image:
      typeof image === "undefined" && defaultImage.startsWith("http")
        ? defaultImage
        : `${siteUrl}${image ?? defaultImage}`,
    url: `${siteUrl}${pathname ?? ``}`,
    twitterUsername,
  };

  return (
    <>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="image" content={seo.image} />

      <meta name="theme-color" content="#000000" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:site_name" content={defaultTitle} />
      <meta property="og:type" content="website" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:url" content={seo.url} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />
      {twitterUsername !== "<your-tt-username>" && (
        <meta name="twitter:creator" content={seo.twitterUsername} />
      )}

      <meta property="site:sha" content={deploySha} />

      {children}
    </>
  );
}
