import { useEffect, useState } from "react";
import NewFriend from "./NewFriend";

export default function FriendRequests({ requestData }) {
  return (
    <>
      <h2>Oczekujące zaproszenia:</h2>
      {requestData.length > 0 ? (
        <>
          {requestData.map((pendingFriend) => (
            <NewFriend key={pendingFriend.id} newFriendData={pendingFriend} />
          ))}
        </>
      ) : (
        <p>Brak oczekujacych zaproszen</p>
      )}
    </>
  );
}
