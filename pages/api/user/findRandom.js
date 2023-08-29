import client from "../../../lib/prismadb";

export default async function handler(req, res) {
  const usersCount = await client.user.count();
  const loggedUserEmail = req.body.loggedUserEmail;
  const users = await client.user.findMany({
    where: {
      sex: req.body.sex,
      age: {
        lte: req.body.ageRange,
      },
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      images: true,
      description: true,
      age: true,
      images: {
        select: {
          imgURL: true,
        },
      },
    },
  });
  const checkId = async () => {
    let randomIndex = Math.floor(Math.random() * usersCount);
    if (users[randomIndex]?.email !== loggedUserEmail) {
      if (users[randomIndex] == null) {
        return checkId();
      } else {
        return users[randomIndex];
      }
    }
    return checkId();
  };

  const randomUser = await checkId();

  res.status(200).json(randomUser);
}
