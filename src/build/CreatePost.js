import React, { useContext, useState } from "react";
import styled from "styled-components";
import { app } from "../base";
import pix from "./dd.jpg";
import { AuthContext } from "./Global/AuthProvider";
import firebase from "firebase";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const { currentUser } = useContext(AuthContext);
  const [userData, setUserData] = useState([]);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const [image, setImage] = useState(pix);
  const [yourPix, setYourPix] = useState("");
  const [percent, setPercent] = useState(0);

  const [email, setEmail] = useState("");

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    const save = URL.createObjectURL(file);
    setImage(save);

    const fileRef = await app.storage().ref();
    const storageRef = fileRef.child("newImage/" + file.name).put(file);

    storageRef.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        const count = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setPercent(count);
        console.log(count);
      },
      (err) => console.log(err.message),
      () => {
        storageRef.snapshot.ref.getDownloadURL().then((url) => {
          setYourPix(url);
          console.log(url);
        });
      }
    );
  };

  const post = async () => {
    await app.firestore().collection("post").doc().set({
      createdBy: currentUser.uid,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      yourPix,
    });
    setYourPix("");
    navigate("/");
  };

  return (
    <Container>
      <Wrapper>
        <Card>
          <Image src={image} />
          <Label htmlFor="pix">Upload your most Beautiful Pix </Label>
          <Input
            placeholder=" image"
            type="file"
            accept="image/jpg"
            id="pix"
            onChange={uploadImage}
          />
          <div>{show}</div>

          {yourPix === "" ? (
            <Button
              bg="green"
              cl="white"
              onClick={() => {
                setShow(!show);
                console.log("Hello: ", show);
              }}
            >
              Post
            </Button>
          ) : (
            <Button
              bg="red"
              cl="white"
              onClick={() => {
                console.log("Click: ");
                post();
              }}
            >
              Post
            </Button>
          )}

          {show ? (
            <div>
              {yourPix !== "" ? <div> You can't upload yet</div> : null}
            </div>
          ) : null}
        </Card>
      </Wrapper>
    </Container>
  );
};

export default CreatePost;

const Button = styled.button`
  border: 0;
  padding: 15px 35px;
  margin: 15px 10px;
  background-color: ${({ bg }) => bg};
  color: ${({ cl }) => cl};
  font-weight: bold;
  border-radius: 3px;
  transition: all 350ms;
  transform: scale(1);
  text-transform: uppercase;

  :hover {
    cursor: pointer;
    transform: scale(1.012);
  }
`;

const Label = styled.label`
  margin: 10px 0;
  padding: 10px 50px;
  background: #004080;
  transition: all 350ms;
  transform: scale(1);
  text-transform: uppercase;
  border-radius: 30px;
  color: white;

  :hover {
    cursor: pointer;
    transform: scale(1.012);
  }
`;
const Input = styled.input`
  display: none;
`;
const Image = styled.img`
  width: 300px;
  height: 350px;
  border-radius: 5px;
  object-fit: cover;
  border: 1px solid lightgray;
`;

const Card = styled.div`
  padding-top: 80px;
  width: 500px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const Container = styled.div`
  width: 100%;
  height: 600px;
`;
