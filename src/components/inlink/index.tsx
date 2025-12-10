import React from "react";

import * as S from "./style";

export type IInLink = {
  to: string;
};

export function InLink({
  to,
  children,
  ...props
}: React.PropsWithChildren<IInLink>) {
  if (isExternalLink(to)) {
    return (
      <a
        href={to}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <S.InLink
      to={to}
      {...props}
    >
      {children}
    </S.InLink>
  );
}

export function NavInLink({
  to,
  children,
  ...props
}: React.PropsWithChildren<IInLink>) {
  if (isExternalLink(to)) {
    return (
      <S.ExternalNavInLink
        href={to}
        {...props}
      >
        {children}
      </S.ExternalNavInLink>
    );
  }
  return (
    <S.NavInLink
      to={to}
      {...props}
    >
      {children}
    </S.NavInLink>
  );
}

const isExternalLink = (url: string) => {
  return /^(https?:)?\/\//.test(url);
}
