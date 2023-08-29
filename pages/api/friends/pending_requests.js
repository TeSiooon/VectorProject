import { unstable_getServerSession } from "next-auth";
import client from "../../../lib/prismadb";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await unstable_getServerSession(req, res, authOptions);
  const userId = session?.user?.id;

  const friendRequests = await client.friendRequest.findMany({
    where: {
      toUserId: parseInt(userId),
      status: "oczekujace",
    },
    include: {
      fromUser: {
        select: {
          firstName: true,
          lastName: true,
          images: {
            select: {
              imgURL: true,
            },
            where: {
              isAvatar: true,
            },
            take: 1,
          },
        },
      },
    },
  });
  res.json(friendRequests);
}
