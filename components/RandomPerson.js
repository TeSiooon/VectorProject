import Link from "next/link";
import { useState } from "react";
import { Button, Row, Col, Spinner } from "react-bootstrap";
import styles from "../styles/RandomPerson.module.css";

export default function RandomPerson({ session }) {
  const [loading, setLoading] = useState(false);
  const [randomUser, setRandomUser] = useState(null);
  const [sex, setSex] = useState("");
  const [ageRange, setAgeRange] = useState(18);

  const loggedUserEmail = session.user.email;

  const handleClick = async () => {
    setLoading(true);
    const response = await fetch("/api/user/findRandom", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ loggedUserEmail, sex, ageRange }),
    });
    const data = await response.json();

    setRandomUser(data);
    setLoading(false);
  };

  const truncateDescription = (description) => {
    if (description.length > 25) {
      return description.slice(0, 25) + "...";
    }
    return description;
  };

  return (
    <Row
      className={`d-flex flex-column align-items-center justify-content-center ${styles.rand} people_background`}
    >
      {loading && <Spinner />}
      <Col className="d-flex justify-content-center" xs={5}>
        {randomUser ? (
          <Col className="d-flex flex-column align-items-center justify-content-center pb-3 pt-3 welcome">
            <img
              className={`rounded-circle ${styles.personAvatar} border image_shadow`}
              src={`${randomUser.images[0].imgURL}`}
              alt="userAvatar"
            />

            <Col className="d-flex flex-row w-100">
              <Col className="ms-5">
                <p className="fs-5 mt-3">{randomUser.firstName}</p>
                <p className="fs-5">Wiek: {randomUser.age}</p>
              </Col>
              <Col className="">
                <p className="fs-5 mt-3 me-2">
                  {truncateDescription(randomUser.description)}
                </p>
              </Col>
            </Col>

            <Button as={Link} href={`/user/${randomUser.id}`}>
              Profil
            </Button>
          </Col>
        ) : null}
      </Col>

      <Col className="d-flex justify-content-center mt-3" xs={5}>
        <Col className="d-flex flex-column align-items-center justify-content-center">
          <Button
            onClick={() => setSex("male")}
            variant={sex === "male" ? "danger" : "outline-danger"}
          >
            Mężczyzna
          </Button>

          <Button
            onClick={() => setSex("female")}
            variant={sex === "female" ? "danger" : "outline-danger"}
          >
            Kobieta
          </Button>
          <Col className="d-flex justify-content-center">
            <span>Wiek do: </span>
            <input
              className="w-25"
              type="number"
              onChange={(event) => setAgeRange(parseInt(event.target.value))}
            />
            <span> lat</span>
          </Col>

          <Button
            onClick={handleClick}
            active={loading}
            disabled={!sex}
            className="w-25"
          >
            Losuj
          </Button>
        </Col>
      </Col>
    </Row>
  );
}
