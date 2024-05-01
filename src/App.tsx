import { Button, Container } from "@chakra-ui/react";
import { Navigate, Route, Routes } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import { RouteNames } from "./routes";
import LogoutButton from "./components/LogoutButton";
import EditProfilePage from "./pages/EditProfilePage";
import CreatePost from "./components/CreatePost";

function App() {

  const user = useRecoilValue(userAtom);
  console.log("🚀 ~ App ~ user:", user)

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={user && Object.keys(user).length > 0 ? <Button>Home</Button> : <Navigate to={RouteNames.signup.path}/>}/>
        <Route path="/register" element={!user || Object.keys(user).length === 0 ? <SignupPage /> : <Navigate to={RouteNames.home.path}/>} />
        <Route path="/login" element={!user || Object.keys(user).length === 0 ? <LoginPage /> : <Navigate to={RouteNames.home.path}/>} />
        <Route
          path="/:username"
          element={
            <Container maxW={"620px"}>
              <UserPage />
            </Container>
          }
        />
        <Route
          path="/:username/post/:pid"
          element={
            <Container maxW={"620px"}>
              <PostPage />
            </Container>
          }
        />
        <Route path="/profile/edit" element={user && Object.keys(user).length > 0 ? <Container maxW={"620px"}><EditProfilePage /></Container> : <Navigate to={RouteNames.login.path}/>}/>
      </Routes>
      

      {user && Object.keys(user).length > 0 && <LogoutButton />}
      {user && Object.keys(user).length > 0 && <CreatePost />}

    </>
  );
}

export default App;
