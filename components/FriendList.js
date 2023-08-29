import { useState, useEffect } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";

import Link from "next/link";

export default function FriendsList() {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    async function fetchFriends() {
      try {
        const response = await fetch("/api/friends/friends_list");
        const data = await response.json();
        console.log(data);
        setFriends(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchFriends();
  }, []);

  return (
    <Container>
      <h2>Znajomi</h2>

      {friends.length > 0 ? (
        <Row className="mb-3 d-flex flex-column">
          {friends.map((friend) => (
            <Col key={friend.id} className="w-75 d-flex friend_list">
              <img
                className="rounded-circle"
                src={`${friend.user.images[0].imgURL}`}
                style={{ width: "6vh", height: "6vh" }}
              />
              <p className="d-flex align-items-center mt-3 ms-4 fw-bold">
                <Link
                  href={`/user/${friend.friendId}`}
                  style={{ textDecoration: "none" }}
                >
                  {friend.user.firstName} {friend.user.lastName}
                </Link>
              </p>
            </Col>
          ))}
        </Row>
      ) : (
        <p>Nie masz jeszcze żadnych znajomych</p>
      )}
    </Container>
  );
}
