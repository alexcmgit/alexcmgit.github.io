import { useStaticQuery, graphql } from "gatsby";

export function useSiteMetadata() {
  const { site } = useStaticQuery(
    graphql`
      query SiteMetaData {
        site {
          siteMetadata {
            title
            description
            image
            siteUrl
						deploySha
          }
        }
      }
    `
  );

  return site.siteMetadata;
}
