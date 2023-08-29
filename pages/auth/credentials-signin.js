import { getCsrfToken, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { Container, Col, Button, Row } from "react-bootstrap";

export default function SignIn({ csrfToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      setErrorMessage("Wprowadź adres email i hasło");
      return;
    }

    const data = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (data.error === null) {
      router.push("/");
    } else {
      setErrorMessage(data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Container
        className="d-flex flex-column align-items-center justify-content-center"
        style={{ minHeight: "90vh" }}
      >
        <Row className="d-flex flex-column welcome pb-3 pt-3 ps-3 pe-3">
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <h3 className="text-center">Logowanie</h3>
          <Col>
            <label className="d-flex flex-column mt-1">
              Email:
              <input
                placeholder="Podaj e-mail"
                type="email"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>
          </Col>
          <Col>
            <label className="d-flex flex-column mt-2">
              Hasło:
              <input
                placeholder="Podaj haslo"
                type="password"
                name="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
          </Col>
          <Button variant="outline-primary" type="submit" className="mt-3">
            Zaloguj się
          </Button>
          {errorMessage && (
            <p className="text-danger fw-bold">{errorMessage}</p>
          )}
        </Row>
      </Container>
    </form>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
