import Link from "next/link";
import { Container, Button } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  const { data: session } = useSession();

  return (
    <Navbar expand="lg" className="navbar">
      <Container>
        <Navbar.Brand as={Link} href="/" className="fw-bold">
          Vector
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav ">
          <Nav className="ms-auto">
            {session && (
              <>
                <Nav.Link as={Link} href="/user/friends" className="navlink">
                  Znajomi
                  <FontAwesomeIcon icon={faUserGroup} className="ms-1" />
                </Nav.Link>
                <Nav.Link as={Link} href="/user/myprofile" className="navlink">
                  Moj profil <FontAwesomeIcon icon={faUser} className="ms-1" />
                </Nav.Link>
                <Nav.Link as={Link} href="/user/settings" className="navlink">
                  Ustawienia
                  <FontAwesomeIcon icon={faGear} className="ms-1" />
                </Nav.Link>

                <Nav.Item className="ms-3">
                  <Button onClick={() => signOut()}>Wyloguj</Button>
                </Nav.Item>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
