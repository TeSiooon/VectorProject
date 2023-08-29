import client from "../../../lib/prismadb";

export default async function handler(req, res) {
  const body = req.body;
  //console.log("body", body);
  if (req.method === "POST") {
    const existingUser = await client.user.findUnique({
      where: {
        email: body.email,
      },
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Podany email jest zajety. Prosze uzyj innego" });
    }
    const createUser = await client.user.create({
      data: body,
    });
  }
  const register = await res
    .status(200)
    .json({ name: "Registered succesfuly" });
}
