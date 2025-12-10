import React from "react";
import styled from "styled-components";
import { NavInLink } from "../inlink";

export const NavWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

export const NavContainer = styled.div<{ justifyContent?: "center" | "flex-start" | "flex-end" }>`
  width: 100%;
  max-width: var(--container-width);
  padding: 1.5rem;
  display: flex;
  justify-content: ${(props) => props.justifyContent || "center"};
  flex-wrap: wrap;
`;

export function Nav({ children, justifyContent }: React.PropsWithChildren<{ justifyContent?: "center" | "flex-start" | "flex-end" }>) {
  return (
    <NavWrapper>
      <NavContainer justifyContent={justifyContent}>{children}</NavContainer>
    </NavWrapper>
  );
}

export const NavLink = styled(NavInLink)`
  margin-right: 1rem;
  margin-bottom: 0.3rem;
  display: block;
`;
