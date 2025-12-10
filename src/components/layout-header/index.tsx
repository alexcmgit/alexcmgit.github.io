import * as React from "react";
import { Link } from "gatsby";

import * as S from "./style.tsx";
import { GitHubUser } from "../layout/index.tsx";
import { GatsbyImage, getImage } from "gatsby-plugin-image";

export type ILayoutHeaderProps = {
  owner: GitHubUser;
};

export function LayoutHeader({
  owner,
}: React.PropsWithoutRef<ILayoutHeaderProps>) {
  return (
    <S.Header>
      <S.OwnerHeader>
        <S.OwnerPfp>
          <GatsbyImage
            image={getImage(owner.avatarUrlSharpOptimized!)!}
            alt={owner.login!}
          />
        </S.OwnerPfp>
        <div style={{ marginLeft: "0.5rem", display: "flex", flexDirection: "column", alignItems: "start" }}>
          <Link to={`https://github.com/${owner.login}`}>{owner.name}</Link>
          <Link style={{opacity: 0.5}} to={`https://github.com/${owner.login}`}>@{owner.login}</Link>
          {owner.bio}
        </div>
      </S.OwnerHeader>
    </S.Header>
  );
}
