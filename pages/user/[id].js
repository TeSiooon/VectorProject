import client from "../../lib/prismadb";
import { Button, Col, Row } from "react-bootstrap";
// import styles from "../styles/RandomPerson.module.css";
import styles from "../../styles/RandomPerson.module.css";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faSnapchat,
} from "@fortawesome/free-brands-svg-icons";
import AddFriend from "../../components/AddFriend";

const UserDetails = ({ oneUser, friend }) => {
  return (
    <Row className="mt-5 pt-3 ps-3 mb-5 welcome user_wave">
      <Col className="d-flex">
        <Col>
          <h3>Profil {oneUser.firstName}</h3>
          <p className="fw-bold">Troche o mnie:</p>
          {oneUser.description}
        </Col>
        <Col>
          {friend ? (
            <Button className="btn-success" disabled={true}>
              Jestescie znajomymi
            </Button>
          ) : (
            <AddFriend friendId={oneUser.id} />
          )}
        </Col>
      </Col>
      <p className="mt-2">Gdzie mnie znajdziesz</p>
      <Col className="d-flex gap-3 ">
        {oneUser.facebook.length === 0 ? (
          <></>
        ) : (
          <a href={`${oneUser.facebook}`} target="_blank">
            <FontAwesomeIcon icon={faFacebook} size="2x" />
          </a>
        )}
        {oneUser.instagram.length === 0 ? (
          <></>
        ) : (
          <a href={`${oneUser.instagram}`} target="_blank">
            <FontAwesomeIcon icon={faInstagram} size="2x" />
          </a>
        )}
        {oneUser.instagram.length === 0 ? (
          <></>
        ) : (
          <>
            <FontAwesomeIcon icon={faSnapchat} size="2x" />
            <p>{oneUser.snapchat}</p>
          </>
        )}
      </Col>

      <p>Zdjecia od uzytkownika</p>
      <Row className={`row-cols-3 mb-3`}>
        {oneUser.images.map((image) => (
          <Col key={image.id} className="mt-2 mb-3">
            <img src={`${image.imgURL}`} className="user_profile_images" />
          </Col>
        ))}
      </Row>
    </Row>
  );
};

export default UserDetails;

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

  const id = context.params.id;

  const oneUser = await client.user.findUnique({
    where: {
      id: Number(id),
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      images: true,
      description: true,
      snapchat: true,
      facebook: true,
      instagram: true,
    },
  });

  const loggedUsserId = session?.user?.id;
  const friends = await client.friendList.findMany({
    where: {
      userId: loggedUsserId,
      friendId: Number(id),
    },
  });
  if (friends.length > 0) {
    return {
      props: { oneUser, friend: true },
    };
  }
  return {
    props: { oneUser, friend: false },
  };
};
