import { Box, Container } from "@chakra-ui/react";
import { Navigate, Route, Routes } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import { RouteNames } from "./routes";
// import LogoutButton from "./components/LogoutButton";
import EditProfilePage from "./pages/EditProfilePage";
import CreatePost from "./components/CreatePost";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import SettingsPage from "./pages/SettingsPage";

function App() {

  const user = useRecoilValue(userAtom);

  return (
    <>
    <Box position={'relative'} w={'full'}>
      {user && Object.keys(user).length > 0 ? <Container maxW={"620px"}><Header /></Container> : <Header />}
      <Routes>
        <Route path="/register" element={!user || Object.keys(user).length === 0 ? <SignupPage /> : <Navigate to={RouteNames.home.path}/>} />
        <Route path="/login" element={!user || Object.keys(user).length === 0 ? <LoginPage /> : <Navigate to={RouteNames.home.path}/>} />
        
        <Route path="/" element={user && Object.keys(user).length > 0 ? <Container maxW={"900px"}><HomePage/></Container> : <Navigate to={RouteNames.signup.path}/>}/>
        <Route
          path="/:username"
          element={
            user && Object.keys(user).length > 0 ?
            <Container maxW={"620px"}>
              <UserPage />
              <CreatePost />
            </Container>
            : <Navigate to={RouteNames.login.path}/>
          }
        />
        <Route
          path="/:username/post/:pid"
          element={
            user && Object.keys(user).length > 0 ?
            <Container maxW={"620px"}>
              <PostPage />
            </Container>
            : <Navigate to={RouteNames.login.path}/>
          }
        />
        <Route path="/profile/edit" element={user && Object.keys(user).length > 0 ? <Container maxW={"620px"}><EditProfilePage /></Container> : <Navigate to={RouteNames.login.path}/>}/>
        <Route path="/chat" element={user && Object.keys(user).length > 0 ? <Container maxW={"620px"}><ChatPage /></Container> : <Navigate to={RouteNames.login.path}/>}/>
        <Route path="/settings" element={user && Object.keys(user).length > 0 ? <Container maxW={"620px"}><SettingsPage /></Container> : <Navigate to={RouteNames.login.path}/>}/>

        
      </Routes>
      

      {/* {user && Object.keys(user).length > 0 && <LogoutButton />} */}
      {/* {user && Object.keys(user).length > 0 && <CreatePost />} */}

    </Box>
    </>
  );
}

export default App;
