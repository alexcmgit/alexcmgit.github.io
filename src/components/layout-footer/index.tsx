import * as React from "react";
import { graphql, Link, useStaticQuery } from "gatsby";

import * as S from "./style.tsx";
import { useSiteMetadata } from "../../hooks/use-site-metadata.ts";
import blogConfig from "../../../blog.config.ts";
import { NavInLink } from "../inlink/index.tsx";

export type ILayoutFooterProps = {
	title?: string;
};

export function LayoutFooter({
	title,
}: React.PropsWithoutRef<ILayoutFooterProps>) {
	const {
		deploySha,
	} = useSiteMetadata();

  const sha = deploySha;

return <>
		<S.Footer>you reached the end</S.Footer>
		<div style={{ fontSize: "0.75rem", margin: "auto", textAlign: "center", padding: "1rem", marginBottom: "2rem" }}>
      <NavInLink to="/license">CC BY-NC-SA 4.0</NavInLink> v{sha.substring(0, 7)} 2021-{new Date().getFullYear()} @{blogConfig.owner}
		</div>
	</>
}
