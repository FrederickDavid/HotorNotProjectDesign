import React, { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { app } from "../base";
import { AuthContext } from "./Global/AuthProvider";
import logo from "./logo10.png";

const Header = () => {
  const { currentUser } = useContext(AuthContext);
  const [userData, setUserData] = useState([]);

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
    getUser();
  }, [userData]);
  return (
    <Container>
      <Wrapper>
        <Holder to="/">
          {/* <Logo src={logo} /> */}
          <Type>Hot or Not</Type>
        </Holder>

        <Space />
        <Nav>
          <Button bg="white" cl="#004080" to="/post">
            Create a post
          </Button>
          <Button bg="white" cl="#004080" to="/detail">
            Edit Profile
          </Button>

          {currentUser ? (
            <Button1
              bg="lightgreen"
              cl="white"
              onClick={async () => {
                await app.auth().signOut();
              }}
            >
              LogOut
            </Button1>
          ) : (
            <Button bg="red" cl="white" to="/register">
              Register
            </Button>
          )}
        </Nav>
      </Wrapper>
    </Container>
  );
};

export default Header;

const Holder = styled(Link)`
  text-decoration: none;
`;

const Type = styled.div`
  color: white;
  margin-left: 20px;
  font-size: 35px;
  font-weight: bold;
  font-style: italic;
`;
const Space = styled.div`
  flex: 1;
`;
const Button1 = styled.div`
  font-size: 13px;
  text-decoration: none;
  padding: 15px 35px;
  margin: 0 10px;
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
const Button = styled(Link)`
  font-size: 13px;
  text-decoration: none;
  padding: 15px 35px;
  margin: 0 10px;
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

const Nav = styled.div`
  margin-right: 20px;
  display: flex;
`;

const Logo = styled.img`
  margin: 0 20px;
  width: 120px;
  height: 60px;
  object-fit: contain;
  border-radius: 5px;
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
`;

const Container = styled.div`
  color: white;
  width: 100%;
  height: 100px;
  background-color: #004080;
`;
