import { Col, Row } from "react-bootstrap";
import styles from "../../styles/MyProfile.module.css";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import client from "../../lib/prismadb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faSnapchat,
} from "@fortawesome/free-brands-svg-icons";

export default function MyProfile({ user }) {
  const avatarImg = user.images.find((image) => image.isAvatar === true);
  console.log(user);
  return (
    <Row
      className={`${styles.pro} d-flex align-items-center justify-content-center `}
    >
      <Col className="welcome d-flex justify-content-center pt-5 pb-5 profile_wave">
        <Col className=" d-flex justify-content-center ">
          <img
            src={`${avatarImg?.imgURL}`}
            className={`${styles.img} image_shadow`}
          />
        </Col>
        <Col>
          <p>Imie: {user.firstName}</p>
          <p>Nazwisko: {user.lastName}</p>
          <p>Data urodzenia: {user.dateOfBirth}</p>
          <p className="fw-bold">Opis:</p>
          <p>{user.description}</p>
          <p className="fw-bold">Social media:</p>
          <Col className="d-flex gap-3">
            {user.facebook.length === 0 ? (
              <></>
            ) : (
              <a href={`${user.facebook}`} target="_blank">
                <FontAwesomeIcon icon={faFacebook} size="2x" />
              </a>
            )}
            {user.instagram.length === 0 ? (
              <></>
            ) : (
              <a href={`${user.instagram}`} target="_blank">
                <FontAwesomeIcon icon={faInstagram} size="2x" />
              </a>
            )}
            {user.snapchat.length === 0 ? (
              <></>
            ) : (
              <>
                <FontAwesomeIcon icon={faSnapchat} size="2x" />
                <p>{user.snapchat}</p>
              </>
            )}
          </Col>
        </Col>
      </Col>
    </Row>
  );
}

export const getServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session) {
    return {
      redirect: {
        destination: "/auth/credentials-signin",
        permanent: false,
      },
    };
  }
  // console.log(session.user.id);
  const user = await client.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      images: true,
      firstName: true,
      dateOfBirth: true,
      lastName: true,
      description: true,
      snapchat: true,
      facebook: true,
      instagram: true,
    },
  });
  return {
    props: { user },
  };
};
