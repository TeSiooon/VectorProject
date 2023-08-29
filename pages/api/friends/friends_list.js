import client from "../../../lib/prismadb";
import { authOptions } from "../auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth";

export default async function handler(req, res) {
  const session = await unstable_getServerSession(req, res, authOptions);
  const userId = session?.user?.id;

  const friendLists = await client.friendList.findMany({
    where: {
      userId: userId,
    },
    include: {
      user: {
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
          },
        },
      },
    },
  });
  res.json(friendLists);
}
