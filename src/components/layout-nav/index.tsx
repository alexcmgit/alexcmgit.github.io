import * as React from "react";

import * as S from "./style.tsx";
import blogConfig from "../../../blog.config.ts";

export type ILayoutNavProps = {
  justifyContent?: "center" | "flex-start" | "flex-end";
};

export function LayoutNav({ justifyContent }: ILayoutNavProps) {
  const links = blogConfig.navLinks
    .filter((e) => e.length !== 0)
    .map((e) => e.split(" "))
    .map((e) => [e.slice(0, e.length - 1).join(" "), e[e.length - 1]]);

  return (
    <S.Nav justifyContent={justifyContent}>
      {links.map(([linkName, linkUrl]) => {
        return (
          <S.NavLink key={linkName + linkUrl} to={linkUrl}>
            {linkName}
          </S.NavLink>
        );
      })}
    </S.Nav>
  );
}
