import logo from "./logo.svg";
import "./App.css";
import Header from "./build/Header";
import Register from "./build/Register/Register";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "./build/Register/SignIn";
import CreatePost from "./build/CreatePost";
import styled from "styled-components";
import HomeScreen from "./build/HomeScreen";
import ImageDetail from "./build/ImageDetail";

function App() {
  return (
    <Container>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/post" element={<CreatePost />} />
          <Route path="/" element={<HomeScreen />} />
          <Route path="/:id" element={<ImageDetail />} />
        </Routes>
      </BrowserRouter>
    </Container>
  );
}

export default App;
const Container = styled.div`
  font-family: Poppins;
`;
