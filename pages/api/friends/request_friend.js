import client from "../../../lib/prismadb";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const { friendId } = req.body;
  const session = await unstable_getServerSession(req, res, authOptions);
  const userId = session?.user?.id;
  // Sprawdzenie, czy użytkownik już jest w znajomych
  const isFriend = await client.friendList.findFirst({
    where: {
      userId: userId,
      friendId: friendId,
    },
  });
  if (isFriend) {
    return res
      .status(400)
      .json({ message: "Użytkownik już jest w Twojej liście znajomych" });
  }

  // Sprawdzenie, czy użytkownik już otrzymał zaproszenie
  const existingRequest = await client.friendRequest.findFirst({
    where: {
      fromUserId: userId,
      toUserId: Number(friendId),
      status: "oczekujace",
    },
  });
  if (existingRequest) {
    return res.status(400).json({ message: "Zaproszenie już zostało wysłane" });
  }

  // Utworzenie nowego zaproszenia
  const friendRequest = await client.friendRequest.create({
    data: {
      fromUserId: userId,
      toUserId: Number(friendId),
    },
  });

  return res.status(201).json({ message: "Zaproszenie zostało wysłane" });
}
