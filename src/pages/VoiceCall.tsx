import { useEffect, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';

const APP_ID = '8288b6e09055465e851d526cd75b676a';

const VoiceCall = () => {
  const [client, setClient] = useState<any>(null);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
      const initAgora = async () => {
          const agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
          setClient(agoraClient);
      };
      initAgora();
  }, []);

  const joinChannel = async () => {
    //   const uid = Math.floor(Math.random() * 10000);
      const uid = 0
      const channelName = 'test1';

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

      client.on('user-published', async (user: any, mediaType: any) => {
          await client.subscribe(user, mediaType);
          if (mediaType === 'audio') {
              user.audioTrack.play();
          }
      });

      setJoined(true);
  };

  const leaveChannel = async () => {
      await client.leave();
      setJoined(false);
  };

  return (
    <div>
            <h1>Agora Voice Call</h1>
            <button onClick={joined ? leaveChannel : joinChannel}>
                {joined ? 'Leave' : 'Join'} Call
            </button>
        </div>
  );
};

export default VoiceCall;
