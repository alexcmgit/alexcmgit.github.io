import React from "react";
import styled from "styled-components";

export const HeaderWrapper = styled.div<ISHeaderProps>`
  display: flex;
  justify-content: center;
  z-index: 10;
`;

export const HeaderContainer = styled.div<ISHeaderProps>`
  width: 100%;
  max-width: var(--container-width);

  padding: 1.5rem;

  display: flex;
  flex-direction: column;
  font-size: 1rem;
`;

export type ISHeaderProps = {};

export function Header({ children }: React.PropsWithChildren<ISHeaderProps>) {
  return (
    <HeaderWrapper>
      <HeaderContainer>{children}</HeaderContainer>
    </HeaderWrapper>
  );
}

export const OwnerHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0;
  margin-bottom: 1rem;
  margin-top: 2rem;
  text-align: center;
`;

export const OwnerPfp = styled.div`
  border-radius: 100%;
  width: 50px;
  height: 50px;

  box-sizing: content-box;

  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;
