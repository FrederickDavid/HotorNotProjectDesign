import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { app } from "../base";
import { AuthContext } from "./Global/AuthProvider";

const Personal2 = ({ who, time, id }) => {
  const { currentUser } = useContext(AuthContext);
  const [userData, setUserData] = useState([]);
  const [voters, setVoters] = useState([]);

  const [totalPoints, setTotalPoints] = useState(0);
  const [totalVoters, setTotalVoters] = useState(0);
  const [result, setResult] = useState(0);

  const votersRecords = async () => {
    await app
      .firestore()
      .collection("post")
      .doc(id)
      .collection("vote")

      .onSnapshot((snap) => {
        const r = [];
        snap.forEach((doc) => {
          r.push({ ...doc.data(), id: doc.id });
        });
        setVoters(r);
      });
  };

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

  const getRating = async () => {
    setTotalVoters(
      parseInt(voters?.filter((el) => el.vote === 100).length * 100) +
        parseInt(voters?.filter((el) => el.vote === 90).length * 90) +
        parseInt(voters?.filter((el) => el.vote === 80).length * 80) +
        parseInt(voters?.filter((el) => el.vote === 70).length * 70) +
        parseInt(voters?.filter((el) => el.vote === 40).length * 40) +
        parseInt(voters?.filter((el) => el.vote === 50).length * 50) +
        parseInt(voters?.filter((el) => el.vote === 30).length * 30) +
        parseInt(voters?.filter((el) => el.vote === 20).length * 20) +
        parseInt(voters?.filter((el) => el.vote === 10).length * 10) +
        parseInt(voters?.filter((el) => el.vote === 0).length * 0) +
        parseInt(voters?.filter((el) => el.vote === 60).length * 60)
    );
    setTotalPoints(voters.length);
  };

  useEffect(() => {
    getUser();
    votersRecords();
    getRating();
    setResult((totalVoters / totalPoints / 10).toFixed(1));
  }, [voters]);

  return (
    <div>
      <Top>
        <div>Total Votes: {totalPoints}</div>
        <div>
          Rating:
          {voters.length <= 0 ? (
            <div style={{ color: "blue", textTransform: "uppercase" }}>
              No Rating Yet
            </div>
          ) : (
            <div>{(totalVoters / totalPoints / 10).toFixed(1)}</div>
          )}
        </div>
        <div>
          Remark:{" "}
          {(totalVoters / totalPoints / 10).toFixed() <= 4 ? (
            <div style={{ color: "blue", textTransform: "uppercase" }}>
              not hot{" "}
            </div>
          ) : (totalVoters / totalPoints / 10).toFixed() <= 7 ? (
            <div style={{ color: "orange", textTransform: "uppercase" }}>
              fairly hot{" "}
            </div>
          ) : (totalVoters / totalPoints / 10).toFixed() >= 8 ? (
            <div style={{ color: "red", textTransform: "uppercase" }}>
              {" "}
              hot{" "}
            </div>
          ) : null}
        </div>
      </Top>
    </div>
  );
};

export default Personal2;

const Time = styled.div``;
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
  text-align: left;
  width: 100%;
  flex-direction: column;
  font-size: 11px;
  display: flex;
  /* align-items: center; */
  padding-top: 10px;
  padding-left: 10px;
  margin-bottom: 10px;
  font-weight: bold;
`;

// <Image src={userData?.avatar} />
// <Detail>
//   <Name>{userData?.userName}</Name>
//   <Time>{moment(time?.toDate()).fromNow()}</Time>
// </Detail>
