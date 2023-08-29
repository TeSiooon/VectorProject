import { Button, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useRouter } from "next/router";

export default function NewFriend({ newFriendData }) {
  const router = useRouter();

  const handleAccept = async () => {
    await fetch("/api/friends/request_accept", {
      method: "POST",
      body: JSON.stringify({
        friendRequestId: newFriendData.id,
        status: "zaakceptowane",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => console.log(res))
      .finally(() => router.replace(router.asPath));
  };

  const handleReject = async () => {
    await fetch("/api/friends/request_accept", {
      method: "POST",
      body: JSON.stringify({
        friendRequestId: newFriendData.id,
        status: "odrzucone",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(() => router.replace(router.asPath));
  };

  return (
    <Col className="w-75 d-flex friend_list">
      <img
        className="rounded-circle ms-3"
        src={`${newFriendData.fromUser.images[0].imgURL}`}
        style={{ width: "6vh", height: "6vh" }}
      />
      <p className="d-flex align-items-center mt-3 ms-4 fw-bold">
        <Link
          href={`/user/${newFriendData.fromUserId}`}
          style={{ textDecoration: "none" }}
        >
          {newFriendData.fromUser.firstName} {newFriendData.fromUser.lastName}
        </Link>
      </p>
      <Col className="d-flex align-items-center">
        <Button className="ms-2 btn-success" onClick={() => handleAccept()}>
          <FontAwesomeIcon icon={faCheck} />
        </Button>
        <Button className="ms-2 btn-danger" onClick={() => handleReject()}>
          <FontAwesomeIcon icon={faXmark} />
        </Button>
      </Col>
    </Col>
  );
}
