import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import styled from "styled-components";
import demo from "./dd.jpg";
import { app } from "../../base";
import firebase from "firebase";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const [image, setImage] = useState(demo);
  const [avatar, setAvatar] = useState("");
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
          setAvatar(url);
          console.log(url);
        });
      }
    );
  };

  const register = async () => {
    const newUser = await app
      .auth()
      .createUserWithEmailAndPassword(email, password);

    if (newUser) {
      await app.firestore().collection("newUser").doc(newUser.user.uid).set({
        password,
        email,
        userName,
        avatar,
        who: newUser.user.uid
      });
    }
    navigate("/");
  };

  return (
    <Container>
      <Wrapper>
        <Card>
          <Image src={image} />
          <Label htmlFor="picture">Upload Image</Label>
          <ImageInput
            placeholder="image upload"
            id="picture"
            type="file"
            accept="image/jpg"
            onChange={uploadImage}
          />

          <InputContent>
            <Input
              placeholder="UserName"
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
              }}
            />
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <Input
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />

            <Button bg="#004080" cl="white" onClick={register}>
              Register
            </Button>
          </InputContent>

          <Text>
            {" "}
            Already have an Account, <Span to="/signIn">Sign in here</Span>{" "}
          </Text>
        </Card>
      </Wrapper>
    </Container>
  );
};

export default Register;

const Span = styled(Link)`
  text-decoration: none;
  color: red;
  font-weight: bold;
`;

const Text = styled.div``;

const Button = styled.div`
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

const InputContent = styled.div`
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Input = styled.input`
  width: 300px;
  height: 40px;
  border-radius: 5px;
  outline: none;
  border: 1px solid lightgray;
  padding-left: 10px;
  margin: 10px 0;

  ::placeholder {
    font-family: Poppins;
  }
`;

const ImageInput = styled.input`
  display: none;
`;

const Label = styled.label`
  margin: 10px 0;
  padding: 10px 30px;
  background: #004080;
  transition: all 350ms;
  transform: scale(1);
  text-transform: uppercase;
  border-radius: 30px;
  color: white;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
    rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;

  :hover {
    cursor: pointer;
    transform: scale(1.012);
  }
`;

const Image = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid lightgray;
`;

const Card = styled.div`
  flex-direction: column;
  align-items: center;
  background: white;
  width: 500px;
  height: 100%;
  padding: 30px 0;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px,
    rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
  /* justify-content: center; */
  display: flex;
`;

const Wrapper = styled.div`
  padding-top: 100px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
`;

const Container = styled.div`
  width: 100%;
  min-height: calc(100vh - 100px);
  height: 100%;
  background: lightgray;
  font-family: Poppins;
`;
