import styled from "styled-components";

export const StyledPage = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyledHeader = styled.header`
  width: 100%;
  min-height: 50px;
  background-color: #333;
`;

export const StyledMain = styled.main`
  width: 100%;
  min-height: calc(100vh - 100px);
  padding: 1rem;

  @media (min-width: 1200px) {
    max-width: 1200px;
    margin: 0 auto;
  }
`;

export const StyledFooter = styled.footer`
  width: 100%;
  margin-top: auto;
  background-color: #333;
  color: #fff;
  text-align: center;
  font-size: 0.8rem;
  padding: 1rem;
  min-height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
