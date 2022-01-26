import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { app } from "../base";
import { AuthContext } from "./Global/AuthProvider";

const DetailPersonal = ({ who, time }) => {
  const { currentUser } = useContext(AuthContext);
  const [userData, setUserData] = useState([]);

  const getUser = async () => {
    await app
      .firestore()
      .collection("newUser")
      .doc(who)
      .get()
      .then((user) => {
        setUserData(user.data());
      });
  };
  useEffect(() => {
    getUser();
  }, [userData]);
  return (
    <div>
      <Top>
        <Image src={userData?.avatar} />
        <Detail>
          <Name>{userData?.userName}</Name>
          <Time>{moment(time?.toDate()).fromNow()}</Time>
        </Detail>
      </Top>
    </div>
  );
};

export default DetailPersonal;

const Time = styled.div`
  font-size: 10px;
  font-weight: 500;
`;
const Name = styled.div`
  font-weight: bold;
`;
const Detail = styled.div`
  display: flex;
  flex-direction: column;

  padding-left: 10px;
`;
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
