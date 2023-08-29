import client from "../../../lib/prismadb";

export default async function handler(req, res) {
  const { imageId } = req.body;
  console.log(imageId);
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Metoda zabriona" });
  }

  try {
    const deleteImage = await client.image.delete({
      where: {
        id: Number(imageId),
      },
    });
    if (deleteImage.isAvatar) {
      const nextImage = await client.image.findFirst({
        where: {
          NOT: {
            id: deleteImage.id,
          },
        },
      });
      if (nextImage) {
        await client.image.update({
          where: {
            id: nextImage.id,
          },
          data: {
            isAvatar: true,
          },
        });
      }
    }
    res.status(200).json({ message: "Zdjecie pomyslnie usuniete" });
  } catch (error) {
    res.status(500).json({ message: "Blad" });
  }
}
