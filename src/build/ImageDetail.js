import React, { useContext, useState } from "react";
import styled from "styled-components";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { useNavigate, useParams } from "react-router-dom";
import { app } from "../base";
import { useEffect } from "react";
import Personal from "./Personal";
import Personal2 from "./Personal2";
import firebase from "firebase";
import { AuthContext } from "./Global/AuthProvider";
import DetailPersonal from "./DetailPersonal";
import axios from "axios";

const ImageDetail = ({}) => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [viewer, setViewer] = useState("");

  const marks = [
    {
      value: 0,
      label: "0",
    },
    {
      value: 10,
      label: "1",
    },
    {
      value: 20,
      label: "2",
    },
    {
      value: 30,
      label: "3",
    },
    {
      value: 40,
      label: "4",
    },
    {
      value: 50,
      label: "5",
    },
    {
      value: 60,
      label: "6",
    },
    {
      value: 70,
      label: "7",
    },
    {
      value: 80,
      label: "8",
    },
    {
      value: 90,
      label: "9",
    },

    {
      value: 100,
      label: "10",
    },
  ];

  const getDataProfile = async () => {
    await app
      .firestore()
      .collection("post")
      .doc(id)
      .get()
      .then((dataSamp) => {
        setData(dataSamp.data());
      });
  };

  const [valueHolder, setValueHolder] = useState(0);

  const voteHotness = async () => {
    await app
      .firestore()
      .collection("post")
      .doc(id)
      .collection("vote")
      .doc(currentUser.uid)
      .set({
        vote: parseInt(valueHolder),
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: currentUser.uid,
      });

    navigate("/");
    // window.location.reload();
  };

  const voteViewers = async () => {
    await app
      .firestore()
      .collection("post")
      .doc(id)
      .collection("viewer")
      .doc(currentUser.uid)
      .set({
        viewedBy: currentUser.uid,
        time: firebase.firestore.FieldValue.serverTimestamp(),
        viewer,
      });
    // window.location.reload();
  };

  const valuetext = (value) => {
    return `${value}°C`;
  };

  const getViewer = async () => {
    const res = await axios.get("https://api64.ipify.org/?format=json");
    if (res) {
      // setViewer(res.data.ip);
      // console.log("IP: ", viewer);
      console.log("IP from Console: ", res.data.ip);
    }
  };

  useEffect(() => {
    getDataProfile();
    getViewer();
    voteViewers();
  }, []);

  return (
    <Container>
      <Wrapper>
        <div>Choose the degree of Hotness or Notness</div>

        <Slide>
          <Div cl="blue">Not</Div>
          <Slider
            color="secondary"
            aria-label="Always visible"
            defaultValue={8}
            getAriaValueText={valuetext}
            step={10}
            marks={marks}
            valueLabelDisplay="off"
            onChange={(e) => {
              setValueHolder(e.target.value);
            }}
          />
          <Div cl="red">Hot</Div>
        </Slide>
        <div
          style={{ fontWeight: "bold", display: "flex", alignItems: "center" }}
        >
          You voted{" "}
          <span
            style={{
              color: "red",
              margin: "0 5px ",
              fontSize: "22px",
              marginBottom: "5px",
            }}
          >
            {parseInt(valueHolder) / 10}{" "}
          </span>
          which is:
          <span style={{ marginLeft: "5px" }}>
            {parseInt(valueHolder) / 10 <= 4 ? (
              <div
                style={{ color: "blue", fontSize: "22px", marginBottom: "5px" }}
              >
                {" "}
                Not Hot{" "}
              </div>
            ) : parseInt(valueHolder) / 10 <= 7 ? (
              <div
                style={{
                  color: "orange",
                  fontSize: "22px",
                  marginBottom: "5px",
                }}
              >
                {" "}
                Faitly Hot{" "}
              </div>
            ) : parseInt(valueHolder) / 10 <= 10 ? (
              <div
                style={{ color: "red", fontSize: "22px", marginBottom: "5px" }}
              >
                {" "}
                Hot{" "}
              </div>
            ) : null}
          </span>
        </div>

        {currentUser?.uid ? (
          <Vote
            bg="#004080"
            cl="white"
            onClick={() => {
              console.log("show: ", valueHolder);
              voteHotness();
            }}
          >
            Vote
          </Vote>
        ) : null}
        <Holder>
          <Card>
            <DetailPersonal who={data?.createdBy} time={data?.createdAt} />
            <MainImage src={data?.yourPix} />
          </Card>
        </Holder>
      </Wrapper>
    </Container>
  );
};

export default ImageDetail;

const Div = styled.div`
  font-weight: bold;
  margin: 0 15px;
  color: ${({ cl }) => cl};
`;

const Vote = styled.div`
  font-size: 13px;
  text-decoration: none;
  padding: 15px 35px;
  margin: 20px 10px;
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

const Slide = styled.div`
  margin: 10px 0;
  width: 420px;
  display: flex;
  /* align-items: center; */
`;

const MainImage = styled.img`
  width: 100%;
  height: 100%;
  flex: 1;
  background: orange;
  object-fit: cover;
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

const Card = styled.div`
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
