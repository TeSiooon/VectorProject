import client from "../../../lib/prismadb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { friendRequestId, status } = req.body;
    console.log(friendRequestId);
    try {
      await client.friendRequest.update({
        where: {
          id: parseInt(friendRequestId),
        },
        data: {
          status: status,
        },
      });
      if (status === "zaakceptowane") {
        const friendRequest = await client.friendRequest.findUnique({
          where: {
            id: parseInt(friendRequestId),
          },
          select: {
            fromUserId: true,
            toUserId: true,
          },
        });
        console.log("dodaje kolejnego");
        await client.friendList.create({
          data: {
            userId: friendRequest.toUserId,
            friendId: friendRequest.fromUserId,
          },
        });
        console.log("Why");
        await client.friendList.create({
          data: {
            userId: friendRequest.fromUserId,
            friendId: friendRequest.toUserId,
          },
        });
      }

      await client.friendRequest.deleteMany({
        where: {
          id: parseInt(friendRequestId),
          status: {
            contains: "zaakceptowane",
          },
        },
      });
      if (status === "odrzucone") {
        await client.friendRequest.deleteMany({
          where: {
            id: parseInt(friendRequestId),
            status: {
              contains: "odrzucone",
            },
          },
        });
      }
      res.status(200).json({ message: "Zmiana statusu pomyślnie zakonczona" });
    } catch (error) {
      res.json({ message: error });
    }
  }
}
