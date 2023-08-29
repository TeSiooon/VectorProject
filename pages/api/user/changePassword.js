import { unstable_getServerSession } from "next-auth";
import client from "../../../lib/prismadb";
import bcrypt from "bcrypt";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res, context) {
  if (typeof req === "undefined") {
    return res.status(500).json({ message: "Blad" });
  }
  const { oldPassword, newPassword } = req.body;

  const session = await unstable_getServerSession(req, res, authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Nieautoryzowany" });
  }

  const user = await client.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      password: true,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "Nie ma takiego uzytkownika" });
  }

  const passwordMatch = await bcrypt.compare(oldPassword, user.password);

  if (!passwordMatch) {
    return res.status(400).json({ message: "Podane haslo jest niepoprawne" });
  }

  const updateUser = await client.user.update({
    where: {
      id: userId,
    },
    data: {
      password: await bcrypt.hash(newPassword, 10),
    },
  });

  return res.status(200).json({ message: "Haslo pomyslnie zaktualizowane" });
}
