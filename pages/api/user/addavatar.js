import client from "../../../lib/prismadb";
// import { setSession } from "next-auth/server";

export default async function handler(req, res) {
  const body = req.body;
  if (req.method === "POST") {
    const setUpAvatar = await client.image.create({
      data: body,
    });
    res.status(200).json({ name: "Avatar" });
  }
}
