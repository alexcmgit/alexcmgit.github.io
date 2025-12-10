import { Link } from "gatsby";

import styled, { css } from "styled-components";

const LinkComponent = Link;

export const InLink = styled(LinkComponent)`
  display: inline-block;
`;

export const navLinkStyles = css`
  display: inline-block;
  border: 2px solid transparent;
  padding: 0 0.5rem;
  border-radius: 8px;
  &:hover {
    background-color: var(--link-color);
    color: var(--surface-color);
    text-decoration: none;
    border: 2px solid var(--link-color);
    transition: all .3s ease-in-out;
  }
`

export const NavInLink = styled(LinkComponent)`
  ${navLinkStyles}
`;

export const ExternalNavInLink = styled.a`
  ${navLinkStyles}
`;
