import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Addimg from "../components/Addimg";
import { Container, Row, Col, Button } from "react-bootstrap";
import RandomPerson from "../components/RandomPerson";
import client from "../lib/prismadb";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";

export default function Home({ images, message }) {
  const { data: session } = useSession();
  const router = useRouter();
  const handleClick = (e) => {
    e.preventDefault();
    router.push("/auth/register");
  };

  if (session) {
    if (images.length == 0) {
      return <Addimg />;
    }
    return <RandomPerson session={session} />;
  } else {
    return (
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "90vh" }}
      >
        <Row className="d-flex flex-column align-items-center justify-content-center welcome pb-3 pt-3">
          <Col className=" text-center">
            <h2>{message}</h2>
          </Col>

          <Button
            className="w-75"
            variant="outline-primary"
            onClick={() => signIn()}
          >
            Zaloguj się
          </Button>
          <Col className="text-center mt-2">Nie masz jeszcze konta?</Col>
          <Button
            variant="outline-primary"
            className=" w-75"
            onClick={handleClick}
          >
            Zarejestruj się
          </Button>
        </Row>
      </Container>
    );
  }
}

export const getServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  if (!session) {
    return {
      props: {
        message: "Witaj na stronie",
      },
    };
  }

  const userWithAvatar = await client.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      images: true,
    },
  });
  return { props: { images: userWithAvatar.images } };
};
