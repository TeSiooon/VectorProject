import client from "../../../lib/prismadb";

export default async function handler(req, res) {
  //console.log(req.method);
  if (req.method === "GET") {
    const { id } = req.query;
    const users = await client.user.findUnique({
      where: {
        id: Number(id),
      },
    });
    res.status(200).json(users);
  }
}
