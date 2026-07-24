import { useEffect, useRef } from "react";
import { getSocket } from "../socket/socket";
import useChatStore from "../store/useChatStore";

const useSocket = () => {
  const socketRef = useRef(null);
  const { setSocket, setSocketConnected, setOnlineUsers } = useChatStore();

  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;
    setSocket(socket);

    const onConnect = () => {
      setSocketConnected(true);
      const currentUser = JSON.parse(localStorage.getItem("user") || "null");
      if (currentUser?._id) {
        socket.emit("register_user", currentUser._id);
      }
    };

    const onDisconnect = () => {
      setSocketConnected(false);
    };

    const onOnlineUsers = (userIds) => {
      setOnlineUsers(userIds);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("online_users", onOnlineUsers);

    if (!socket.connected) {
      const token = localStorage.getItem("token");
      if (token) {
        socket.auth = { token };
        socket.connect();
      }
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("online_users", onOnlineUsers);
    };
  }, [setSocket, setSocketConnected, setOnlineUsers]);

  return socketRef;
};

export default useSocket;
