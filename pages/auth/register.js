import { useState } from "react";
import { useRouter } from "next/router";
import bcrypt from "bcryptjs";
import "react-datepicker/dist/react-datepicker.css";
import styles from "../../styles/Register.module.css";
import { Container, Col, Button } from "react-bootstrap";
import { signIn } from "next-auth/react";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faSnapchat,
} from "@fortawesome/free-brands-svg-icons";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState();
  const [sex, setSex] = useState("");
  const [description, setDescription] = useState("");
  // Social comm
  const [facebook, setFacebook] = useState("");
  const [snapchat, setSnapchat] = useState("");
  const [instagram, setInstagram] = useState("");

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const validateForm = () => {
    let newErrors = {};

    if (!firstName) {
      newErrors.firstName = "Pierwsze imię jest wymagane";
    } else if (!/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/u.test(firstName)) {
      newErrors.firstName = "Imię może zawierać tylko litery i polskie znaki";
    }

    if (!lastName) {
      newErrors.lastName = "Nazwisko jest wymaganie";
    } else if (!/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/u.test(lastName)) {
      newErrors.lastName =
        "Nazwisko może zawierać tylko litery i polskie znaki";
    }

    if (!email) {
      newErrors.email = "Email jest wymagany";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email jest niepoprawny";
    }
    //Test
    if (!instagram && !facebook && !snapchat) {
      newErrors.social = "Przynajmniej jedno pole musi zostać wypelnione";
    } else if (facebook) {
      const facebookRegex =
        /^(https?:\/\/)?(www\.)?facebook\.com\/[a-zA-Z0-9(\.\?)?]/;
      if (!facebookRegex.test(facebook)) {
        newErrors.facebook = "Niepoprawny link do profilu";
      }
    } else if (instagram) {
      const instaRegex =
        /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9_\.]+\/?$/;
      if (instaRegex.test(instagram)) {
        newErrors.instagram = "Niepoprawny link do profilu";
      }
    }
    //
    if (!description) {
      newErrors.description = "Napisz coś o sobie :D";
    } else if (description.length < 25) {
      newErrors.description = "Napisz cos wiecej";
    }

    if (!password) {
      newErrors.password = "Hasło jest wymagane";
    } else if (password.length < 8) {
      newErrors.password = "Hasło musi mieć przynajmniej 8 znaków";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/g.test(
        password
      )
    ) {
      newErrors.password =
        "Hasło musi zawierać co najmniej jedną małą literę, jedną wielką literę, jedną cyfrę i jeden znak specjalny";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const hashedPassword = await bcrypt.hash(password, 10);

    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const age_now = today.getFullYear() - birthDate.getFullYear();

    if (validateForm()) {
      const data = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword,
        dateOfBirth: dateOfBirth,
        age: age_now,
        sex: sex,
        instagram: instagram,
        facebook: facebook,
        snapchat: snapchat,
        description: description,
      };
      fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }).then(async (response) => {
        if (response.status === 400) {
          const error = await response.json();
          setServerError(error.error);
          //console.log(error);
        } else if (response.status === 200) {
          router.push("/auth/credentials-signin");
        }
      });
    }
  };

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center ">
      <form
        onSubmit={handleSubmit}
        className="welcome pe-3 ps-3 mt-3 pb-3 w-25"
      >
        <Col>
          <label className="d-flex flex-column mt-2">
            Imie:
            <input
              type="text"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
            {errors.firstName && (
              <p className="text-danger">{errors.firstName}</p>
            )}
          </label>
        </Col>
        <Col>
          <label className="d-flex flex-column mt-2">
            Nazwisko:
            <input
              type="text"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
            {errors.lastName && (
              <p className="text-danger">{errors.lastName}</p>
            )}
          </label>
        </Col>
        <Col>
          <label className="d-flex flex-column mt-2">
            Email:
            <input
              type="text"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            {errors.email && <p className="text-danger">{errors.email}</p>}
            {serverError && <p className="text-danger">{serverError}</p>}
          </label>
        </Col>
        <Col>
          <label className="d-flex flex-column mt-2">
            Podaj date swoich urodzin:
            <input
              required
              type="date"
              value={dateOfBirth}
              onChange={(event) => {
                setDateOfBirth(event.target.value);
              }}
              max={new Date().toISOString().split("T")[0]}
            />
          </label>
        </Col>
        <Col>
          <label className="d-flex flex-column mt-2">
            Haslo:
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            {errors.password && (
              <p className="text-danger">{errors.password}</p>
            )}
          </label>
          <Button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="w-100"
          >
            {showPassword ? (
              <>
                Ukryj haslo <FontAwesomeIcon icon={faEyeSlash} />
              </>
            ) : (
              <>
                Pokaz haslo <FontAwesomeIcon icon={faEye} />
              </>
            )}
          </Button>
        </Col>
        <Col>
          <label className="">
            Mezczyzna
            <input
              type="checkbox"
              name="sex"
              value="male"
              checked={sex === "male"}
              onChange={(event) => setSex(event.target.value)}
            />
          </label>
          <label className="ms-5">
            Kobieta
            <input
              type="checkbox"
              name="sex"
              value="female"
              checked={sex === "female"}
              onChange={(event) => setSex(event.target.value)}
            />
          </label>
        </Col>
        <Col className="mt-2">
          <label style={{ width: "100%" }}>
            <textarea
              placeholder="Napisz cos o sobie"
              style={{ width: "100%" }}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </label>
          {errors.description && (
            <p className="text-danger">Uzupelnij swoj opis</p>
          )}
        </Col>
        <Col>
          <label className={`d-flex mt-2 ${styles.input_with_icon}`}>
            <FontAwesomeIcon icon={faInstagram} size="lg" />
            <Col>
              <input
                type="text"
                value={instagram}
                placeholder="Podaj link do profilu"
                onChange={(event) => setInstagram(event.target.value)}
              />
              {errors.instagram && (
                <p className="text-danger">{errors.instagram}</p>
              )}
            </Col>
          </label>
        </Col>
        <Col>
          <label className={`d-flex mt-2 ${styles.input_with_icon}`}>
            <FontAwesomeIcon icon={faFacebook} size="lg" />
            <Col>
              <input
                type="text"
                value={facebook}
                onChange={(event) => setFacebook(event.target.value)}
                placeholder="Podaj link do profilu"
              />
              {errors.facebook && (
                <p className="text-danger">{errors.facebook}</p>
              )}
            </Col>
          </label>
        </Col>
        <Col>
          <label className={`d-flex mt-2 ${styles.input_with_icon}`}>
            <FontAwesomeIcon icon={faSnapchat} size="lg" />
            <Col>
              <input
                type="text"
                value={snapchat}
                placeholder="Podaj nick ze snapa"
                onChange={(event) => setSnapchat(event.target.value)}
              />
              {/* {errors.firstName && (
                <p className="text-danger">{errors.instagram}</p>
              )} */}
            </Col>
          </label>
          {errors.social && (
            <p className="text-danger">
              Przynajmniej jedno z tych
              <br /> pol musi zostac wypelnione
            </p>
          )}
        </Col>
        <Col className="d-flex justify-content-center">
          <Button
            variant="outline-primary"
            type="submit"
            disabled={!sex}
            className="mt-2"
          >
            Zarejestruj
          </Button>
        </Col>
      </form>
      <Col className="d-flex flex-column mb-5">
        <p className="mt-4">Masz juz konto?</p>
        <Button variant="outline-primary" onClick={() => signIn()}>
          Zaloguj
        </Button>
      </Col>
    </Container>
  );
}

export const getServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};
