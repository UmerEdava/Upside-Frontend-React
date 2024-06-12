import { useEffect, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';

const APP_ID = '8288b6e09055465e851d526cd75b676a';

const VoiceCall = () => {
  const [client, setClient] = useState<any>(null);
  const [channelName, setChannelName] = useState('test1');
  console.log("🚀 ~ VoiceCall ~ setChannelName:", setChannelName)
  const [token, setToken] = useState(null);

  useEffect(() => {
    const initClient = async () => {
      const rtcClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      setClient(rtcClient);

      // Fetch token from your server
      const response = await fetch(`https://upside-backend-node.onrender.com/api/v1/chat/agora-token?channelName=${channelName}&uid=0`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      const data = await response.json();
      setToken(data?.data?.token);
    };

    initClient();
  }, [channelName]);

  const joinChannel = async () => {
    await client.join(APP_ID, channelName, token, null);
    const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    await client.publish([localAudioTrack]);
    console.log('Published local audio track');
  };

  return (
    <div>
      <button onClick={joinChannel}>Join Voice Call</button>
    </div>
  );
};

export default VoiceCall;
