import client from "../../../lib/prismadb";

export default async function handler(req, res) {
  //console.log(req.method);
  if (req.method === "GET") {
    const users = await client.user.findMany({});
    res.status(200).json(users);
  }
}
