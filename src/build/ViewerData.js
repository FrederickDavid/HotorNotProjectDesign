import React, { useContext, useEffect, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import styled from "styled-components";
import { AuthContext } from "./Global/AuthProvider";
import { app } from "../base";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const ViewerData = ({ id }) => {
  const { currentUser } = useContext(AuthContext);
  const [viewers, setViewers] = useState([]);

  const voteViewers = async () => {
    await app
      .firestore()
      .collection("post")
      .doc(id)
      .collection("viewer")
      //   .doc(currentUser.uid)
      .onSnapshot((snap) => {
        const r = [];
        snap.forEach((doc) => {
          r.push({ ...doc.data(), id: doc.id });
        });
        setViewers(r);
      });
    // window.location.reload();
  };
  useEffect(() => {
    voteViewers();
  }, []);
  return (
    <Container>
      <Div>
        {viewers <= 0 ? <VisibilityOffIcon /> : <VisibilityIcon />}

        <Numb>
          {viewers.length <= 0 ? (
            <div style={{ fontSize: "10px" }}>No Viwer yet</div>
          ) : (
            <div>{viewers.length}</div>
          )}
        </Numb>
        <View>Viewers</View>
      </Div>
    </Container>
  );
};

export default ViewerData;

const View = styled.div`
  margin: 0 7px;
  font-size: 13px;
  margin-top: 3px;
  font-weight: 500;
`;
const Numb = styled.div`
  margin-left: 5px;
  font-weight: 500;
  font-size: 15px;
  color: gray;
  margin-top: 3px;
`;

const Div = styled.div`
  display: flex;
  align-items: center;
  .MuiSvgIcon-root {
    color: gray;
  }
`;
const Container = styled.div`
  margin-left: 10px;
`;
