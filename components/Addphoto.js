import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Col, Row, Button } from "react-bootstrap";

export default function Addimg() {
  const [avatarSrc, setAvatarSrc] = useState();
  const [uploadData, setUploadData] = useState();

  const router = useRouter();

  const { data: session } = useSession();

  const handleOnChange = (changeEvent) => {
    const reader = new FileReader();

    reader.onload = function (onLoadEvent) {
      setAvatarSrc(onLoadEvent.target.result);
      setUploadData(undefined);
    };
    reader.readAsDataURL(changeEvent.target.files[0]);
  };

  async function handleOnSumbit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const fileInput = Array.from(form.elements).find(
      ({ name }) => name === "file"
    );
    const formData = new FormData();
    for (const file of fileInput.files) {
      formData.append("file", file);
    }

    formData.append("upload_preset", "my-upload");

    const data = await fetch(env("CLOUDINARY_DB"), {
      method: "POST",
      body: formData,
    }).then((res) => res.json());
    setAvatarSrc(data.secure_url);
    setUploadData(data);
  }
  if (uploadData) {
    console.log("wyslij zdjecie");
    console.log(uploadData.secure_url);
    const imgURL = uploadData.secure_url;
    const userId = session.user.id;

    fetch("/api/user/addavatar", {
      method: "POST",
      body: JSON.stringify({ imgURL, userId }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(router.replace(router.asPath));
    setUploadData("");
    setAvatarSrc();
  }

  return (
    <Row className="d-flex align-items-center">
      <h4> Wybierz nowe zdjecie, ktore chcesz dodać</h4>
      <form method="POST" onChange={handleOnChange} onSubmit={handleOnSumbit}>
        <Col className="d-flex flex-column align-items-center">
          <input type="file" name="file" accept=".jpg, .png" />
          <img src={avatarSrc} className="setting_img_size" />
        </Col>

        {avatarSrc && !uploadData && (
          <>
            <Button type="submit" className="mt-2">
              Dodaj to zdjecie
            </Button>
          </>
        )}
      </form>
    </Row>
  );
}
