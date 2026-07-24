import { useEffect, useRef } from "react";
import useChatStore from "../store/useChatStore";

const usePushNotifications = () => {
  const lastFocusedRef = useRef(Date.now());
  const notifiedRef = useRef(new Set());

  useEffect(() => {
    const onFocus = () => { lastFocusedRef.current = Date.now(); };
    const onBlur = () => {};

    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onBlur);

    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  useEffect(() => {
    const unsub = useChatStore.subscribe((state, prev) => {
      if (state.messages.length <= prev.messages.length) return;
      if (Date.now() - lastFocusedRef.current < 5000) return;
      if (!("Notification" in window) || Notification.permission !== "granted") return;
      if (!state.notificationsEnabled) return;

      const lastMsg = state.messages[state.messages.length - 1];
      if (!lastMsg || notifiedRef.current.has(lastMsg._id)) return;

      if (lastMsg.sender?._id === state.activeChat?._id) return;

      notifiedRef.current.add(lastMsg._id);
      if (notifiedRef.current.size > 100) {
        notifiedRef.current = new Set([...notifiedRef.current].slice(-50));
      }

      try {
        const senderName = lastMsg.sender?.name || "Unknown";
        const text = lastMsg.text || lastMsg.content || "";
        const hasAttachment = lastMsg.attachments?.length > 0;
        const body = hasAttachment
          ? `[${lastMsg.attachments[0].type?.startsWith("image") ? "Photo" : "File"}] ${text}`
          : text || "New message";

        const n = new Notification(senderName, {
          body: body.slice(0, 120),
          icon: lastMsg.sender?.avatar || "/logo192.png",
          tag: `msg-${lastMsg._id}`,
          silent: !state.soundEnabled,
        });

        n.onclick = () => {
          window.focus();
          n.close();
        };
      } catch {
      }
    });

    return () => { unsub(); };
  }, []);
};

export default usePushNotifications;
