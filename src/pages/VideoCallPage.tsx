import { useEffect, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { Button, Flex } from '@chakra-ui/react';

const APP_ID = '8288b6e09055465e851d526cd75b676a';

function VideoCallPage() {
    const [client, setClient] = useState<any>(null);
    const [localTracks, setLocalTracks] = useState<any>({ videoTrack: null, audioTrack: null });
    const [remoteUsers, setRemoteUsers] = useState<any>([]);
    const [joined, setJoined] = useState<any>(false);

    useEffect(() => {
        const initAgora = async () => {
            const agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
            setClient(agoraClient);

            agoraClient.on('user-published', async (user, mediaType) => {
                await agoraClient.subscribe(user, mediaType);

                if (mediaType === 'video') {
                    const remoteVideoTrack = user.videoTrack;
                    const remoteVideoContainer = document.createElement('div');
                    remoteVideoContainer.id = user.uid as string;
                    remoteVideoContainer.className = 'remote-video';
                    document.body.append(remoteVideoContainer);
                    remoteVideoTrack?.play(remoteVideoContainer);
                }

                if (mediaType === 'audio') {
                    const remoteAudioTrack = user.audioTrack;
                    remoteAudioTrack?.play();
                }

                setRemoteUsers((prevUsers: any) => [...prevUsers, user]);
            });

            agoraClient.on('user-unpublished', (user: any) => {
                setRemoteUsers((prevUsers: any) => prevUsers.filter((u: any) => u.uid !== user.uid));
                document.getElementById(user.uid)?.remove();
            });
        };
        initAgora();
    }, []);

    const joinChannel = async () => {
        // const uid = Math.floor(Math.random() * 10000);
        const uid = 0;

        const channelName = 'test2';

        // const response = await axios.get('http://localhost:3333/rtcToken', {
        //     params: { channelName, uid }
        // });

        // const response = await fetch(`http://localhost:3333/api/v1/chat/agora-token?channelName=${channelName}&uid=${uid}`, {
        //   method: 'GET',
        //   headers: {
        //       'Content-Type': 'application/json',
        //   },
        //   credentials: 'include'
        // });

        const response = await fetch(`https://upside-backend-node.onrender.com/api/v1/chat/agora-token?channelName=${channelName}&uid=${uid}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
          credentials: 'include'
      });

        const data = await response.json();

        const token = data?.data?.token;

        await client.join(APP_ID, channelName, token, uid);

        const [videoTrack, audioTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
        setLocalTracks({ videoTrack, audioTrack });

        await client.publish([videoTrack, audioTrack]);

        const localVideoContainer = document.createElement('div');
        localVideoContainer.id = 'local';
        document.body.append(localVideoContainer);
        videoTrack.play();

        setJoined(true);
    };

    const leaveChannel = async () => {
        localTracks.videoTrack.close();
        localTracks.audioTrack.close();
        await client.leave();
        setJoined(false);
        document.getElementById('local')?.remove();
        remoteUsers.forEach((user: any) => {
            document.getElementById(user.uid)?.remove();
        });
        setRemoteUsers([]);
    };

    const toggleAudio = async () => {
        if (localTracks.audioTrack.isMuted()) {
            await localTracks.audioTrack.setMuted(false);
        } else {
            await localTracks.audioTrack.setMuted(true);
        }
    };

    const toggleVideo = async () => {
        if (localTracks?.videoTrack?.isMuted()) {
            await localTracks?.videoTrack?.setMuted(false);
        } else {
            await localTracks?.videoTrack?.setMuted(true);
        }
    };

    return (
        <div>
            <h1>Agora Video Call</h1>
            <Button onClick={joined ? leaveChannel : joinChannel}>
                {joined ? 'Leave' : 'Join'} Call
            </Button>
            {joined && (
                <Flex gap={2}>
                    <Button onClick={toggleAudio}>Toggle Audio</Button>
                    <Button onClick={toggleVideo}>Toggle Video</Button>
                </Flex>
            )}
        </div>
    );
}

export default VideoCallPage;
