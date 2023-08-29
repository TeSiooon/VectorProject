import { Button } from "react-bootstrap";

export default function AddFriend({ friendId }) {
  const sendFriendRequest = async () => {
    await fetch("/api/friends/request_friend", {
      method: "POST",
      body: JSON.stringify({ friendId }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (response.ok) {
        console.log(response.message);
      }
    });
  };
  return (
    <Button onClick={() => sendFriendRequest()}>Dodaj do znajomych</Button>
  );
}
