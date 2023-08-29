import { useState } from "react";
import { Row, Col, Button, Tooltip } from "react-bootstrap";
import { useSession } from "next-auth/react";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import client from "../../lib/prismadb";
import AddPhoto from "../../components/Addphoto";
import { useRouter } from "next/router";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";

const Settings = ({ images }) => {
  const { data: session } = useSession();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [serverResponse, setServerResponse] = useState("");

  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [imageEdit, setImageEdit] = useState(false);

  //Test
  const [displayImages, setDisplayImages] = useState(images);

  const router = useRouter();

  const passwordChange = () => {
    let newErrors = {};
    if (!newPassword) {
      newErrors.newPassword = "Nowe haslo jest wymagane";
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "Haslo musi miec minimum 8 znakow";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/g.test(
        newPassword
      )
    ) {
      newErrors.newPassword =
        "Hasło musi zawierać co najmniej jedną małą literę, jedną wielką literę, jedną cyfrę i jeden znak specjalny";
    }

    if (!oldPassword) {
      newErrors.oldPassword = "Stare haslo jest wymagane";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordChange()) {
      await fetch("/api/user/changePassword", {
        method: "POST",
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then(async (response) => {
        if (response.status === 200) {
          setNewPassword("");
          setOldPassword("");
          const error = await response.json();
          setServerResponse(error.message);
        } else {
          const error = await response.json();
          setServerError(error.message);
        }
      });
    }
  };

  const handleAvatar = async (e, id) => {
    e.preventDefault();
    await fetch("/api/user/avatarChange", {
      method: "POST",
      body: JSON.stringify({ avatarId: id }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (res) => {
      if (res.status === 200) {
        const error = await res.json();
        router.push("/user/myprofile");
      } else {
        const error = await res.json();
      }
    });
  };

  const handleDelete = async (id) => {
    await fetch("/api/user/imgRemove", {
      method: "DELETE",
      body: JSON.stringify({ imageId: id }),
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
    setDisplayImages(images.filter((image) => image.id !== id));
  };

  if (!session) {
    return;
  }
  return (
    <Row className="align-items-center text-center mt-5 mb-5 pb-5 pt-5 flex-column welcome">
      <Col className="align-items-center text-center d-flex justify-content-evenly">
        <h2>Ustawienia</h2>
        <Button
          className="btn"
          onClick={() => {
            setShowPasswordChange(!showPasswordChange);
            setImageEdit(false);
          }}
        >
          Haslo
          <FontAwesomeIcon icon={faKey} className="ms-1" />
        </Button>
        <Button
          className="btn"
          onClick={() => {
            setImageEdit(!imageEdit);
            setShowPasswordChange(false);
          }}
        >
          Zdjecie profilowe
          <FontAwesomeIcon icon={faImage} className="ms-1" />
        </Button>
      </Col>
      {showPasswordChange && (
        <Col
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: "70vh" }}
        >
          <Col>
            <p className="fw-bold mt-3">Zmiana hasla</p>
            <form onSubmit={handleSubmit}>
              <Col className="d-flex flex-column  align-items-center">
                <p>Stare haslo:</p>
                <input
                  className="mb-3"
                  placeholder="Wpisz stare haslo"
                  type="password"
                  onChange={(e) => setOldPassword(e.target.value)}
                />
                {errors.oldPassword && (
                  <p className="text-danger">{errors.oldPassword}</p>
                )}
                {serverError && <p className="text-danger">{serverError}</p>}
                <p>Nowe haslo:</p>
                <input
                  placeholder="Wpisz nowe haslo"
                  type="password"
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                {errors.newPassword && (
                  <p className="text-danger">{errors.newPassword}</p>
                )}
              </Col>
              <Button variant="outline-primary" type="submit" className="mt-2">
                Zapisz nowe haslo
              </Button>
              {serverResponse && (
                <p className="text-success">{serverResponse}</p>
              )}
            </form>
          </Col>
        </Col>
      )}

      {imageEdit && (
        <Col>
          <h3>Zmiana zdjęcia profilowego</h3>
          {displayImages.map((image) => (
            <Col
              key={image.id}
              className="d-flex flex-column align-items-center mb-3"
            >
              <img src={`${image.imgURL}`} className="setting_img_size"></img>
              <Row className="w-50 d-flex mt-2">
                {image.isAvatar ? (
                  <p className="fw-bold">Aktualne zdjecie profilowe</p>
                ) : (
                  <Button
                    className="w-50"
                    onClick={(e) => handleAvatar(e, image.id)}
                  >
                    Ustaw jako zdjęcie profilowe
                  </Button>
                )}

                {images.length > 1 ? (
                  <>
                    {!image.isAvatar && (
                      <Button
                        onClick={() => handleDelete(image.id)}
                        className="w-50 btn-danger"
                      >
                        Usun zdjecie
                      </Button>
                    )}
                  </>
                ) : null}
              </Row>
            </Col>
          ))}
          {images.length > 4 ? null : <AddPhoto />}
        </Col>
      )}
    </Row>
  );
};

export default Settings;

export const getServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session) {
    return {
      redirect: {
        destination: "/auth/credentials-signin",
        permanent: false,
      },
    };
  }
  const userId = session?.user?.id;
  const user = await client.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      images: true,
    },
  });

  return {
    props: { images: user.images },
  };
};
