import * as React from "react";

import * as S from "../../style/style";
import { LayoutHeader } from "../layout-header";
import { LayoutNav } from "../layout-nav";
import { LayoutFooter } from "../layout-footer";
import LineDecoration from "../line-decoration";
import { ImageDataLike } from "gatsby-plugin-image";
import EmblaCarousel from "../carousel";

export type GitHubUser = {
  readonly login?: string | null;
  readonly bio?: string | null;
  readonly name?: string | null;
  readonly githubId?: string | null;
  readonly avatarUrlSharpOptimized: ImageDataLike;
};

export type ILayoutProps = {
  owner: GitHubUser;
};

export function Layout({
  children,
  owner,
}: React.PropsWithChildren<ILayoutProps>) {
  return (
    <React.Fragment>
      <S.GlobalStyle />
      <LineDecoration />
      <LayoutHeader owner={owner} />
      <LayoutNav />
      {children}
      <LayoutFooter />
    </React.Fragment>
  );
}
