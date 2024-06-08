import { createContext, useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { io } from "socket.io-client";
import userAtom from "../atoms/userAtom";

const SocketContext = createContext<any>(null);

export const useSocket = () => {
    return useContext(SocketContext);
}

export const SocketContextProvider = ({ children }: any) => {
  const [socket, setSocket] = useState<any>();
  const [onlineUsers, setOnlineUsers] = useState([]);

  const currentUser = useRecoilValue(userAtom);

  useEffect(() => {
    const socket = io("https://upside-backend-node.onrender.com", {
      query: {
        userId: currentUser?._id,
      },
    });

    setSocket(socket);

    socket.on('getOnlineUsers', (users: any) => {
        console.log("🚀 ~ getOnlineUsers ~ users:", users)
        setOnlineUsers(users)        
    })

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [currentUser?._id]);

  return (
    <SocketContext.Provider value={{socket, onlineUsers}}>
      {children}
    </SocketContext.Provider>
  );
};
