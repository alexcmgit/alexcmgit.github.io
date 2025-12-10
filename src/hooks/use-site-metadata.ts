import { useStaticQuery, graphql } from "gatsby";

export function useSiteMetadata() {
  const { site } = useStaticQuery(
    graphql`
      query SiteMetaData {
        site {
          siteMetadata {
            about {
              name
              description
              bannerImageUrl
            }
            siteUrl
            deploySha
          }
        }
      }
    `
  );

  return site.siteMetadata;
}
