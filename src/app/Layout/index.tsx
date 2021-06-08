import * as React from "react";
import { Header } from "./Header";
import { Container } from "@material-ui/core";
import { Footer } from "./Footer";

export const Layout: React.FC = (props) => {
  const { children } = props;

  return (
    <>
      <Header />
      <Container>
        <>{children}</>
      </Container>
      <Footer />
    </>
  );
};
