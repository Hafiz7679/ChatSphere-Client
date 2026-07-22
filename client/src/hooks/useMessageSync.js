import { useEffect, useRef } from "react";
import { getSocket } from "../socket/socket";
import useChatStore from "../store/useChatStore";

const useMessageSync = () => {
  const {
    activeChat,
    addMessage,
    removeMessage,
    updateMessage,
    incrementUnread,
    soundEnabled,
  } = useChatStore();

  const activeChatRef = useRef(activeChat);
  useEffect(() => { activeChatRef.current = activeChat; }, [activeChat]);

  useEffect(() => {
    const socket = getSocket();
    const currentUser = JSON.parse(localStorage.getItem("user") || "null");
    if (!currentUser?._id) return;

    const handleReceiveMessage = (message) => {
      const senderId = message.sender?._id || message.sender;
      const active = activeChatRef.current;
      const isOwnMessage = senderId === currentUser._id;

      if (message._id && !isOwnMessage) {
        socket.emit("message_delivered", { messageId: message._id, senderId });
      }

      if (active && (senderId === active._id || isOwnMessage)) {
        addMessage(message);
      } else if (!isOwnMessage) {
        incrementUnread(senderId);
        if (soundEnabled) {
          try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = 800;
            osc.type = "sine";
            gain.gain.value = 0.15;
            osc.start();
            osc.stop(ctx.currentTime + 0.15);
          } catch {}
        }
      }
    };

    const handleMessageDeleted = ({ messageId }) => {
      removeMessage(messageId);
    };

    const handleMessageEdited = ({ messageId, text }) => {
      updateMessage(messageId, { content: text, text, edited: true });
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("message_deleted", handleMessageDeleted);
    socket.on("message_edited", handleMessageEdited);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("message_deleted", handleMessageDeleted);
      socket.off("message_edited", handleMessageEdited);
    };
  }, [addMessage, removeMessage, updateMessage, incrementUnread, soundEnabled]);

  return null;
};

export default useMessageSync;
