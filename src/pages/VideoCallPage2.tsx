import React, { CSSProperties, useEffect, useRef, useState } from "react";
import AgoraUIKit, { layout } from "agora-react-uikit";
import "agora-react-uikit/dist/index.css";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  callAtom,
  incomingCallAtom,
  videoCallDetailsAtom,
} from "../atoms/callAtom";
import customFetch from "../api";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";
import { useNavigate, useParams } from "react-router-dom";
import { Avatar, Button, WrapItem } from "@chakra-ui/react";
import { FaPhoneAlt } from "react-icons/fa";
import { Icon } from "@chakra-ui/react";
import { MdCallEnd } from "react-icons/md";
import { VIDEO_CALL_STATUS_TYPES } from "../types/callTypes";

const VideoCallPage2: React.FunctionComponent = () => {
  const { calleeId } = useParams();

  const showToast = useShowToast();

  const user = useRecoilValue(userAtom);

  const { socket } = useSocket();

  const setCallAtom = useSetRecoilState(callAtom);
  const setRingingAtom = useSetRecoilState(incomingCallAtom);
  const [videoCallDetails, setVideoCallDetails] =
    useRecoilState(videoCallDetailsAtom);

  const videoRef = useRef<any>(null);
  const callerAudioRef = useRef<any>(null);
  const receiverAudioRef = useRef<any>(null);
  const mediaStreamRef = useRef<any>(null);
  const rtcClientRef = useRef<any>(null);

  const navigate = useNavigate();

  const [videocall, setVideocall] = useState(false);
  console.log("🚀 ~ videocall:", videocall)
  const [isHost, setHost] = useState(true);
  console.log("🚀 ~ setHost:", setHost);
  const [isPinned, setPinned] = useState(false);
  console.log("🚀 ~ setPinned:", setPinned);

  // const [channelName, setChannelName] = useState('test')
  const [loading, setLoading] = useState(false);
  console.log("🚀 ~ loading:", loading);
  const [token, setToken] = useState("");
  // const [ringing, setRinging] = useState(false)
  const [isCaller, setIsCaller] = useState(videoCallDetails?.callerId == user?._id ? true : false);

  useEffect(() => {
    startCall();
  }, []);

  useEffect(() => {
    setIsCaller(videoCallDetails?.callerId == user?._id ? true : false);
  }, [user, videoCallDetails]);

  const fetchAgoraToken = async () => {
    try {
      // Fetch user data
      const res = await customFetch(
        `/api/v1/chat/agora-token?channelName=${calleeId}&uid=${user?._id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (data?.error) {
        return showToast("Error", data.message, "error", 3000, false);
      }

      setToken(data?.data?.token);
    } catch (error) {
      console.log("In error", error);
    } finally {
      setLoading(false);
    }
  };

  const startCall = async () => {
    await fetchAgoraToken();

    // socket.emit('call', { callerId: user?._id, calleeId });

    // setVideocall(true)
    setCallAtom(true);

    if (calleeId !== user?._id) {
      setIsCaller(true);
    }
  };

  const answerCall = () => {
    socket.emit("answer_call", {
      callerId: videoCallDetails?.callerId,
      calleeId: videoCallDetails?.calleeId,
      channelName: videoCallDetails?.channelName,
      callStatus: VIDEO_CALL_STATUS_TYPES.ON_GOING,
    });
    setRingingAtom(false);
    setVideocall(true);
    setCallAtom(true);

    if (callerAudioRef?.current) {
      callerAudioRef.current?.pause();
      callerAudioRef.current.currentTime = 0;
    }
    if (receiverAudioRef?.current) {
      receiverAudioRef.current?.pause();
      receiverAudioRef.current.currentTime = 0;
    }

    // Stop all media tracks when component unmounts
    if (mediaStreamRef?.current) {
      mediaStreamRef.current.getTracks().forEach((track: any) => track.stop());
    }

    setVideoCallDetails({
      channelName: videoCallDetails?.channelName,
      callStatus: VIDEO_CALL_STATUS_TYPES.ON_GOING,
      callerId: videoCallDetails?.callerId,
      calleeId: videoCallDetails?.calleeId,
      callerName: videoCallDetails?.callerName,
      callerUsername: videoCallDetails?.callerUsername,
      callerProfilePic: videoCallDetails?.callerProfilePic,
      calleeName: videoCallDetails?.calleeName,
      calleeUsername: videoCallDetails?.calleeUsername,
      calleeProfilePic: videoCallDetails?.calleeProfilePic,
    });
  };

  useEffect(() => {
    const getUserMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        mediaStreamRef.current = stream;
        // Mute the audio tracks
        stream.getAudioTracks().forEach((track) => (track.enabled = false));

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing media devices.", error);
        // history.push('/'); // Redirect back to home if media access fails
      }
    };

    getUserMedia();

    if (receiverAudioRef?.current) {
      receiverAudioRef.current?.play();
    }

    if (callerAudioRef?.current) {
      callerAudioRef.current?.play();
    }

    return () => {
      if (receiverAudioRef?.current) {
        receiverAudioRef.current?.pause();
        receiverAudioRef.current.currentTime = 0;
      }

      if (callerAudioRef?.current) {
        callerAudioRef.current?.pause();
        callerAudioRef.current.currentTime = 0;
      }

      // Stop all media tracks when component unmounts
      if (mediaStreamRef?.current) {
        mediaStreamRef.current
          .getTracks()
          .forEach((track: any) => track.stop());
      }
    };
  }, [history]);

  const endCall = () => {
    setVideocall(false);
    setCallAtom(false);
    setRingingAtom(false);
    setVideoCallDetails({
      channelName: "",
      callStatus: "",
      callerId: "",
      calleeId: "",
      callerName: "",
      callerUsername: "",
      callerProfilePic: "",
      calleeName: "",
      calleeUsername: "",
      calleeProfilePic: "",
    });
    if (callerAudioRef?.current) {
      callerAudioRef.current?.pause();
      callerAudioRef.current.currentTime = 0;
    }
    if (receiverAudioRef?.current) {
      receiverAudioRef.current?.pause();
      receiverAudioRef.current.currentTime = 0;
    }

    // Stop all media tracks when component unmounts
    if (mediaStreamRef?.current) {
      mediaStreamRef.current.getTracks().forEach((track: any) => track.stop());
    }


    if (rtcClientRef?.current) {
      rtcClientRef.current.leave();
      rtcClientRef.current.removeAllListeners();
      rtcClientRef.current.destroy();
      rtcClientRef.current = null;
    }


    navigate("/");
  };

  const handleGoHome = () => {
    setCallAtom(false);
    navigate("/");
  };

  useEffect(() => {
    socket?.on(
      "callAccepted",
      ({
        callerId,
        calleeId,
        channelName,
        callStatus,
      }: {
        callerId: string;
        calleeId: string;
        channelName: string;
        callStatus: string;
      }) => {
        console.log(
          "call accepted",
          channelName,
          callerId,
          calleeId,
          callStatus
        );

        if (
          (channelName === videoCallDetails?.channelName &&
            callerId === videoCallDetails?.callerId &&
            calleeId === videoCallDetails?.calleeId,
          videoCallDetails?.callStatus === VIDEO_CALL_STATUS_TYPES.RINGING)
        ) {
          setRingingAtom(false);
          setVideocall(true);
          setCallAtom(true);

          if (callerAudioRef?.current) {
            callerAudioRef.current?.pause();
            callerAudioRef.current.currentTime = 0;
          }
          if (receiverAudioRef?.current) {
            receiverAudioRef.current?.pause();
            receiverAudioRef.current.currentTime = 0;
          }

          // Stop all media tracks when component unmounts
          if (mediaStreamRef?.current) {
            mediaStreamRef.current
              .getTracks()
              .forEach((track: any) => track.stop());
          }

          setVideoCallDetails({
            channelName: videoCallDetails?.channelName,
            callStatus: callStatus,
            callerId: videoCallDetails?.callerId,
            calleeId: videoCallDetails?.calleeId,
            callerName: videoCallDetails?.callerName,
            callerUsername: videoCallDetails?.callerUsername,
            callerProfilePic: videoCallDetails?.callerProfilePic,
            calleeName: videoCallDetails?.calleeName,
            calleeUsername: videoCallDetails?.calleeUsername,
            calleeProfilePic: videoCallDetails?.calleeProfilePic,
          });
        }
      }
    );

    return () => {
      socket?.off("callAccepted");
    };
  }, [socket]);

  return (
    <div style={styles.container}>
      <div style={styles.videoContainer}>
        {/* {ringing && (
          <div>
            <p>Incoming call from {callerId}</p>
            <Button onClick={answerCall}>Answer</Button>
          </div>
        )} */}

        {videoCallDetails?.callStatus === VIDEO_CALL_STATUS_TYPES.RINGING ? (
          <>
            {videoCallDetails?.callerId == user?._id ? (
              // Caller side
              <div className="call-page">
                <audio ref={callerAudioRef} src="/upside-callertone.mp3" loop />
                <div className="caller-info">
                  <WrapItem>
                    <Avatar
                      size="2xl"
                      name={videoCallDetails?.calleeName}
                      src={videoCallDetails?.calleeProfilePic}
                    />{" "}
                  </WrapItem>
                  <h2 style={{ marginTop: "1rem" }}>
                    {videoCallDetails?.calleeName}
                  </h2>
                  <h2>Ringing..</h2>
                </div>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="fullscreen-video"
                />
                <div className="action-buttons">
                  <Button colorScheme="red" onClick={endCall}>
                    <Icon as={MdCallEnd} />
                  </Button>
                </div>
              </div>
            ) : (
              // Receiver side
              <div className="call-page">
                <audio
                  ref={receiverAudioRef}
                  src="/upside-ringtone-1.mp3"
                  loop
                />
                <div className="caller-info">
                  <WrapItem>
                    <Avatar
                      size="2xl"
                      name={videoCallDetails?.callerName}
                      src={videoCallDetails?.callerProfilePic}
                    />{" "}
                  </WrapItem>
                  <h2 style={{ marginTop: "1rem" }}>
                    {videoCallDetails?.callerName}
                  </h2>
                  <h2>Incoming Call</h2>
                </div>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="fullscreen-video"
                />
                <div className="action-buttons">
                  <Button colorScheme="red" onClick={endCall}>
                    <Icon as={MdCallEnd} />
                  </Button>
                  <Button colorScheme="green" onClick={answerCall}>
                    <Icon as={FaPhoneAlt} />
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : videoCallDetails?.callStatus ===
          VIDEO_CALL_STATUS_TYPES.ON_GOING ? (
          <>
            <AgoraUIKit
              rtcProps={{
                appId: "8288b6e09055465e851d526cd75b676a",
                channel: calleeId as string,
                uid: user?._id,
                token: token, // add your token if using app in secured mode
                role: isHost ? "host" : "audience",
                layout: isPinned ? layout.pin : layout.grid,
                enableScreensharing: true,
                customRtcClient: rtcClientRef.current
              }}
              rtmProps={{ username: isCaller ? videoCallDetails?.callerName : videoCallDetails?.calleeName || "user", displayUsername: true }}
              callbacks={{
                EndCall: endCall,
              }}
            />
          </>
        ) : videoCallDetails?.callStatus === VIDEO_CALL_STATUS_TYPES.ENDED ? (
          <></>
        ) : (
          <div style={notFoundstyles.container}>
            <h1 style={notFoundstyles.header}>404 - Page Not Found</h1>
            <p style={notFoundstyles.text}>
              Sorry, the page you are looking for does not exist.
            </p>
            <Button variant="primary" onClick={handleGoHome}>
              Go Home
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    flex: 1,
    backgroundColor: "#007bff22",
  },
  heading: { textAlign: "center" as const, marginBottom: 0 },
  videoContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  } as CSSProperties,
  nav: { display: "flex", justifyContent: "space-around" },
  btn: {
    backgroundColor: "#007bff",
    cursor: "pointer",
    borderRadius: 5,
    padding: "4px 8px",
    color: "#ffffff",
    fontSize: 20,
  },
  input: { display: "flex", height: 24, alignSelf: "center" } as CSSProperties,
};

const notFoundstyles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    textAlign: "center",
    padding: "20px",
  } as CSSProperties,
  header: {
    fontSize: "48px",
    marginBottom: "20px",
  },
  text: {
    fontSize: "18px",
    marginBottom: "40px",
  },
};

export default VideoCallPage2;
