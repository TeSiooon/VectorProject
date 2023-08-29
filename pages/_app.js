import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.css";
import { SessionProvider } from "next-auth/react";
import { Container, SSRProvider } from "react-bootstrap";
import Header from "../components/Header";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SSRProvider>
      <SessionProvider session={session}>
        <Header />
        <Container>
          <Component {...pageProps} />
        </Container>
      </SessionProvider>
    </SSRProvider>
  );
}

export default MyApp;
