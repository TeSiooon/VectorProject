import { Button } from "react-bootstrap";

export default function ImgRemove(imageId) {
  const handleRemoveClick = async (e) => {
    //e.preventDefault();

    await fetch("/api/user/imgRemove", {
      method: "DELETE",
      body: JSON.stringify(imageId),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (res) => {
      if (res.status === 200) {
        const error = await res.json();
        console.log(error);
      } else {
        const error = await res.json();
        console.log(error);
      }
    });
  };

  return (
    <Button className="btn-danger w-50" onClick={(e) => handleRemoveClick(e)}>
      Usun zdjecie
    </Button>
  );
}
