import { Box, Container } from "@chakra-ui/react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import { RouteNames } from "./routes";
// import LogoutButton from "./components/LogoutButton";
import EditProfilePage from "./pages/EditProfilePage";
import CreatePost from "./components/CreatePost";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import SettingsPage from "./pages/SettingsPage";
import VoiceCall from "./pages/VoiceCall";
import VideoCallPage from "./pages/VideoCallPage";
import VideoCallPage2 from "./pages/VideoCallPage2";
import { callAtom, incomingCallAtom } from "./atoms/callAtom";
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { useEffect, useState } from "react";
import { useSocket } from "./context/SocketContext";

function App() {

  const user = useRecoilValue(userAtom);
  const [ringing, setRingingAtom] = useRecoilState(incomingCallAtom);
  console.log("🚀 ~ App ~ ringing:", ringing)

  const isCall = useRecoilValue(callAtom);

  const { socket } = useSocket();

  const navigate = useNavigate();

  // const [ringing, setRinging] = useState(false)
  const [callerId, setCallerId] = useState('')
  console.log("🚀 ~ App ~ callerId:", callerId)

  // @@@ FIREBASE SETUP STARTS >>
  const firebaseConfig = {
    apiKey: "AIzaSyCQoLdzDHxge26eCrWSsEXLxXUxoE-13W8",
    authDomain: "upside-5b959.firebaseapp.com",
    projectId: "upside-5b959",
    storageBucket: "upside-5b959.appspot.com",
    messagingSenderId: "647791960831",
    appId: "1:647791960831:web:e84771b4192ec3366ba2ca",
    measurementId: "G-SQBDFPZ0YP"
  };

  // const privateVapidKey = 'YagiZj6T5YoRz5pUoF3pt4sI2P55-09AX_BNmSYZe4A'
  const vapidKey = 'BOl8oTWmorynN5o8KmKsGHnpc5Gz3vxOBW09VEHifycOjvI56P0RCs3eB7lIFlfPbOV6jvDMiPC4P948yqiiVBg'

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  // const analytics = getAnalytics(app);
  const messaging = getMessaging(app);

  // Service Worker
  navigator.serviceWorker.register('/firebase-messaging-sw.js').then((registration) => {
    console.log("🚀 ~ navigator.serviceWorker.register ~ registration:", registration)
    // messaging.useServiceWorker(registration);
  
    getToken(messaging, { vapidKey }).then((currentToken: any) => {
      if (currentToken) {
        console.log('FCM Token:', currentToken);
        // Send the token to your server and update the UI if necessary
      } else {
        console.log('No registration token available. Request permission to generate one.');
      }
    }).catch((err: any) => {
      console.log('An error occurred while retrieving token. ', err);
    });
  
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      // Handle incoming message while app is in the foreground
    });
  }).catch((err) => {
    console.log('Service Worker registration failed: ', err);
  });

  // @@@ FIREBASE SETUP ENDS >>


  useEffect(() => {
    socket?.on('incomingCall', ({ callerId, channelName }: { callerId: string, channelName: string }) => {
      console.log('incoming call from', callerId, channelName);
      setCallerId(callerId);
      setRingingAtom(true);

      navigate(RouteNames.home.path + `video2/` + channelName);
    });

    return () => {
      socket?.off('incomingCall');
      socket?.off('callAnswered');
    };
  }, [socket]);


  return (
    <>
    <Box position={'relative'} w={'full'}>
      {!isCall && <>{user && Object.keys(user).length > 0 ? <Container maxW={"620px"}><Header /></Container> : <Header />}</>}
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

        <Route path="/call" element={user && Object.keys(user).length > 0 ? <Container maxW={"620px"}><VoiceCall /></Container> : <Navigate to={RouteNames.login.path}/>}/>
        <Route path="/video-call" element={user && Object.keys(user).length > 0 ? <Container maxW={"620px"}><VideoCallPage /></Container> : <Navigate to={RouteNames.login.path}/>}/>
        <Route path="/video2/:calleeId" element={user && Object.keys(user).length > 0 ? <VideoCallPage2 /> : <Navigate to={RouteNames.login.path}/>}/>



        
      </Routes>
      

      {/* {user && Object.keys(user).length > 0 && <LogoutButton />} */}
      {/* {user && Object.keys(user).length > 0 && <CreatePost />} */}

    </Box>
    </>
  );
}

export default App;
