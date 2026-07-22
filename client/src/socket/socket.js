import { io } from "socket.io-client";

const SOCKET_URL =
  process.env.REACT_APP_SOCKET_URL ||
  "https://chatsphere-server-ahyx.onrender.com";

const createSocket = () => {
  const token = (() => {
    try {
      return localStorage.getItem("token");
    } catch {
      return null;
    }
  })();

  const socketInstance = io(SOCKET_URL, {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 10000,
    randomizationFactor: 0.5,
    withCredentials: true,
    auth: token ? { token } : undefined,
  });

  let reconnectTimer = null;

  const startReconnectCheck = () => {
    const check = () => {
      if (!socketInstance.connected && localStorage.getItem("token")) {
        socketInstance.connect();
      }
    };
    reconnectTimer = setInterval(check, 30000);
  };

  const stopReconnectCheck = () => {
    if (reconnectTimer) {
      clearInterval(reconnectTimer);
      reconnectTimer = null;
    }
  };

  socketInstance.on("connect", () => {
    stopReconnectCheck();
    const token = (() => {
      try {
        return localStorage.getItem("token");
      } catch {
        return null;
      }
    })();
    if (token) {
      socketInstance.auth = { token };
    }
  });

  socketInstance.on("disconnect", (reason) => {
    if (reason === "io server disconnect" || reason === "transport close") {
      startReconnectCheck();
    }
  });

  socketInstance.on("connect_error", () => {
    startReconnectCheck();
  });

  return socketInstance;
};

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = createSocket();
  }
  return socket;
};

export const getToken = () => {
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
};

export default socket;
