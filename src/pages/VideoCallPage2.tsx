import React, { CSSProperties, useEffect, useState } from 'react'
import AgoraUIKit, { layout } from 'agora-react-uikit'
import 'agora-react-uikit/dist/index.css'
import { useRecoilState, useRecoilValue } from 'recoil'
import { callAtom, incomingCallAtom } from '../atoms/callAtom'
import customFetch from '../api'
import useShowToast from '../hooks/useShowToast'
import userAtom from '../atoms/userAtom'
import { useSocket } from '../context/SocketContext'
import { useParams } from 'react-router-dom'
import { Button } from '@chakra-ui/react'

const VideoCallPage2: React.FunctionComponent = () => {

  const { calleeId } = useParams();

  const showToast = useShowToast();

  const user = useRecoilValue(userAtom);

  const { socket } = useSocket();

  const [call, setCallAtom] = useRecoilState(callAtom);
  const [ringing, setRingingAtom] = useRecoilState(incomingCallAtom);

  const [videocall, setVideocall] = useState(true)
  const [isHost, setHost] = useState(true)
  console.log("🚀 ~ setHost:", setHost)
  const [isPinned, setPinned] = useState(false)
  console.log("🚀 ~ setPinned:", setPinned)
  const [username, setUsername] = useState('')

  // const [channelName, setChannelName] = useState('test')
  const [loading, setLoading] = useState(false)
  console.log("🚀 ~ loading:", loading)
  const [token, setToken] = useState('')
  // const [ringing, setRinging] = useState(false)
  const [callerId, setCallerId] = useState('')

  useEffect(() => {
    startCall()
  }, [])

  useEffect(() => {
    console.log('caaaaalll atom:',call)
  }, [call])

  const fetchAgoraToken = async () => {
    try {
      // Fetch user data
      const res = await customFetch(`/api/v1/chat/agora-token?channelName=${calleeId}&uid=${user?._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });

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
      await fetchAgoraToken()
      // socket.emit('call', { callerId: user?._id, calleeId });
      setVideocall(true)
      setCallAtom(true)
  }

  useEffect(() => {
    socket?.on('incomingCall', ({ callerId }: { callerId: string }) => {
      console.log('incoming call from', callerId);
      setCallerId(callerId);
      setRingingAtom(true);
    });

    return () => {
      socket?.off('incomingCall');
      socket?.off('callAnswered');
    };
  }, [socket]);

  const answerCall = () => {
    socket.emit('answer', { callerId, calleeId: user?._id });
    setRingingAtom(false);
    setVideocall(true);
    setCallAtom(true)
  };
  

  return (
    <div style={styles.container}>
      <div style={styles.videoContainer}>
      {ringing && (
        <div>
          <p>Incoming call from {callerId}</p>
          <Button onClick={answerCall}>Answer</Button>
        </div>
      )}
        {videocall ? (
          <>
            {/* <div style={styles.nav}>
              <p style={{ fontSize: 20, width: 200 }}>
                You're {isHost ? 'a host' : 'an audience'}
              </p>
              <p style={styles.btn} onClick={() => setHost(!isHost)}>
                Change Role
              </p>
              <p style={styles.btn} onClick={() => setPinned(!isPinned)}>
                Change Layout
              </p>
            </div> */}
            <AgoraUIKit
              rtcProps={{
                appId: '8288b6e09055465e851d526cd75b676a',
                channel: calleeId as string,
                uid: user?._id,
                token: token, // add your token if using app in secured mode
                role: isHost ? 'host' : 'audience',
                layout: isPinned ? layout.pin : layout.grid,
                enableScreensharing: true
              }}
              rtmProps={{ username: username || 'user', displayUsername: true }}
              callbacks={{
                EndCall: () => {
                    setVideocall(false)
                    setCallAtom(false)
                }
              }}
            />
          </>
        ) : (
          <div style={styles.nav}>
            <input
              style={styles.input}
              placeholder='nickname'
              type='text'
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
              }}
            />
            <h3 style={styles.btn} onClick={startCall}>
              Start Call
            </h3>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flex: 1,
    backgroundColor: '#007bff22'
  },
  heading: { textAlign: 'center' as const, marginBottom: 0 },
  videoContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  } as CSSProperties,
  nav: { display: 'flex', justifyContent: 'space-around' },
  btn: {
    backgroundColor: '#007bff',
    cursor: 'pointer',
    borderRadius: 5,
    padding: '4px 8px',
    color: '#ffffff',
    fontSize: 20
  },
  input: { display: 'flex', height: 24, alignSelf: 'center' } as CSSProperties
}

export default VideoCallPage2