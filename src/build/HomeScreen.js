import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { app } from "../base";
import { AuthContext } from "./Global/AuthProvider";
import Personal from "./Personal";
import Personal2 from "./Personal2";

const HomeScreen = () => {
  const { currentUser } = useContext(AuthContext);
  const [myData, setMyData] = useState([]);
  const [userData, setUserData] = useState([]);

  const getPost = async () => {
    await app
      .firestore()
      .collection("post")
      .onSnapshot((snap) => {
        const r = [];
        snap.forEach((doc) => {
          r.push({ ...doc.data(), id: doc.id });
        });
        setMyData(r);
      });
  };
  const getUser = async () => {
    await app
      .firestore()
      .collection("newUser")
      .doc(currentUser?.uid)
      .get()
      .then((user) => {
        setUserData(user.data());
      });
  };

  useEffect(() => {
    getPost();
    getUser();
  }, []);

  return (
    <Container>
      <Wrapper>
        <Div>Welcome Back {userData?.userName}</Div>
        <Holder>
          {myData?.map(({ createdAt, createdBy, id, yourPix }) => (
            <Card key={id} to={`/${id}`}>
              <Hold>
                <Personal time={createdAt} who={createdBy} id={id} />
                <Personal2 who={createdBy} id={id} />
              </Hold>

              <MainImage src={yourPix} />
            </Card>
          ))}
        </Holder>
      </Wrapper>
    </Container>
  );
};

export default HomeScreen;

const Div = styled.div`
  font-weight: bold;
  font-size: 22px;
  margin-bottom: 30px;
`;

const MainImage = styled.img`
  width: 100%;
  height: 100%;
  flex: 1;
  background: orange;
  object-fit: cover;
`;

const Hold = styled.div`
  display: flex;
  justify-content: space-between;
  margin-right: 20px;
`;

const Detail = styled.div`
  display: flex;
  flex-direction: column;

  padding-left: 10px;
`;
const Time = styled.div``;
const Name = styled.div``;
const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  background: orange;
`;
const Top = styled.div`
  display: flex;
  align-items: center;
  padding-top: 10px;
  padding-left: 10px;
  margin-bottom: 10px;
`;

const Card = styled(Link)`
  text-decoration: none;
  color: black;
  margin: 10px;
  overflow: hidden;
  box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px,
    rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
  width: 300px;
  height: 400px;
  border-radius: 5px;
`;

const Holder = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;

const Wrapper = styled.div`
  padding-top: 100px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Container = styled.div`
  width: 100%;
  min-height: calc(100vh - 100px);
  height: 100%;
  background: lightgray;
  font-family: Poppins;
`;
