import { unstable_getServerSession } from "next-auth";
import client from "../../../lib/prismadb";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const { avatarId } = req.body;
  const session = await unstable_getServerSession(req, res, authOptions);
  const userId = session?.user?.id;

  // console.log(req.method);

  if (req.method === "POST") {
    try {
      await client.image.updateMany({
        where: {
          userId: Number(userId),
          isAvatar: true,
        },
        data: {
          isAvatar: false,
        },
      });

      await client.image.update({
        where: {
          id: Number(avatarId),
        },
        data: {
          isAvatar: true,
        },
      });

      res
        .status(200)
        .json({ message: "Zdjecie profilowe pomyślnie ustawione" });
    } catch (error) {
      res.status(500).json({ message: "Blad" });
    }
  }
}
