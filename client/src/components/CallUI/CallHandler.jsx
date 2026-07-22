import { useCallback, useEffect, useRef } from "react";
import useChatStore from "../../store/useChatStore";
import { getSocket } from "../../socket/socket";

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

const playSound = (type) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.value = 0.1;

    if (type === "ringtone") {
      osc.frequency.value = 440;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.frequency.value = 540;
        osc2.type = "sine";
        gain2.gain.setValueAtTime(0.1, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc2.start();
        osc2.stop(ctx.currentTime + 0.5);
      }, 600);
    } else if (type === "outgoing") {
      osc.frequency.value = 380;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.frequency.value = 420;
        osc2.type = "sine";
        gain2.gain.setValueAtTime(0.08, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc2.start();
        osc2.stop(ctx.currentTime + 0.4);
      }, 400);
    } else if (type === "connected") {
      osc.frequency.value = 880;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } else if (type === "ended") {
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.3);
      osc.type = "sawtooth";
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    }
  } catch {}
};

const CallHandler = ({ actionRef }) => {
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const callTimeoutRef = useRef(null);
  const callDataRef = useRef(null);
  const ringtoneIntervalRef = useRef(null);

  const setCallData = useChatStore((s) => s.setCallData);
  const setIsCallActive = useChatStore((s) => s.setIsCallActive);
  const setLocalStream = useChatStore((s) => s.setLocalStream);
  const setRemoteStream = useChatStore((s) => s.setRemoteStream);
  const setCallStatus = useChatStore((s) => s.setCallStatus);

  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  const stopRingtone = useCallback(() => {
    if (ringtoneIntervalRef.current) {
      clearInterval(ringtoneIntervalRef.current);
      ringtoneIntervalRef.current = null;
    }
  }, []);

  const cleanupCall = useCallback(() => {
    stopRingtone();
    if (callTimeoutRef.current) {
      clearTimeout(callTimeoutRef.current);
      callTimeoutRef.current = null;
    }
    if (peerRef.current) {
      peerRef.current.close();
      peerRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    remoteStreamRef.current = null;
    setLocalStream(null);
    setRemoteStream(null);
    setIsCallActive(false);
    setCallData(null);
    setCallStatus(null);
    callDataRef.current = null;
  }, [setIsCallActive, setCallData, setLocalStream, setRemoteStream, setCallStatus, stopRingtone]);

  const getMediaStream = useCallback(async (callType) => {
    const constraints = {
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
      video: callType === "video"
        ? { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" }
        : false,
    };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    stream.getAudioTracks().forEach((t) => { t.enabled = true; });
    stream.getVideoTracks().forEach((t) => { t.enabled = true; });
    localStreamRef.current = stream;
    setLocalStream(stream);
    return stream;
  }, [setLocalStream]);

  // ---- Incoming call ----
  useEffect(() => {
    const handleIncomingCall = ({ callerId, callType, callerSocketId }) => {
      if (callDataRef.current) {
        getSocket().emit("reject_call", { callerId });
        return;
      }
      const data = { type: "incoming", callerId, callType, callerSocketId, status: "ringing" };
      callDataRef.current = data;
      setCallData(data);
      setCallStatus("ringing");
      playSound("ringtone");
      ringtoneIntervalRef.current = setInterval(() => playSound("ringtone"), 2000);
    };
    getSocket().on("incoming_call", handleIncomingCall);
    return () => getSocket().off("incoming_call", handleIncomingCall);
  }, [setCallData, setCallStatus]);

  // ---- Accept call (callee side) ----
  const acceptCall = useCallback(async () => {
    const cd = callDataRef.current;
    if (!cd || cd.type !== "incoming") return;
    stopRingtone();
    try {
      const stream = await getMediaStream(cd.callType);
      const peer = new RTCPeerConnection(ICE_SERVERS);
      peerRef.current = peer;

      stream.getTracks().forEach((track) => peer.addTrack(track, stream));

      peer.ontrack = (event) => {
        const remoteStream = event.streams[0];
        remoteStreamRef.current = remoteStream;
        setRemoteStream(remoteStream);
        setCallStatus("connected");
        playSound("connected");
        const active = { ...cd, type: "active", status: "connected" };
        callDataRef.current = active;
        setCallData(active);
      };

      peer.onicecandidate = (event) => {
        if (event.candidate) {
          getSocket().emit("ice_candidate", { targetId: cd.callerId, candidate: event.candidate });
        }
      };

      peer.oniceconnectionstatechange = () => {
        if (peer.iceConnectionState === "disconnected" || peer.iceConnectionState === "failed") {
          cleanupCall();
        }
      };

      const connecting = { ...cd, type: "connecting", status: "connecting" };
      callDataRef.current = connecting;
      setCallData(connecting);
      setCallStatus("connecting");
      setIsCallActive(true);
      getSocket().emit("accept_call", { callerId: cd.callerId });
    } catch (err) {
      console.error("Accept call error:", err);
      cleanupCall();
    }
  }, [getMediaStream, setCallData, setIsCallActive, setCallStatus, setRemoteStream, cleanupCall, stopRingtone]);

  // ---- Reject call ----
  const rejectCall = useCallback(() => {
    stopRingtone();
    const cd = callDataRef.current;
    if (cd && cd.type === "incoming") {
      getSocket().emit("reject_call", { callerId: cd.callerId });
    }
    cleanupCall();
  }, [cleanupCall, stopRingtone]);

  // ---- Start call (caller side) ----
  const startCall = useCallback(async (receiverId, callType) => {
    if (!receiverId) return;
    try {
      const stream = await getMediaStream(callType);
      const peer = new RTCPeerConnection(ICE_SERVERS);
      peerRef.current = peer;

      stream.getTracks().forEach((track) => peer.addTrack(track, stream));

      peer.ontrack = (event) => {
        const remoteStream = event.streams[0];
        remoteStreamRef.current = remoteStream;
        setRemoteStream(remoteStream);
        setCallStatus("connected");
        playSound("connected");
        const active = { type: "active", receiverId, callType, status: "connected" };
        callDataRef.current = active;
        setCallData(active);
      };

      peer.onicecandidate = (event) => {
        if (event.candidate) {
          getSocket().emit("ice_candidate", { targetId: receiverId, candidate: event.candidate });
        }
      };

      peer.oniceconnectionstatechange = () => {
        if (peer.iceConnectionState === "disconnected" || peer.iceConnectionState === "failed") {
          cleanupCall();
        }
      };

      getSocket().emit("call_user", { receiverId, callType, callerId: currentUser._id });

      const outgoing = { type: "outgoing", receiverId, callType, status: "ringing" };
      callDataRef.current = outgoing;
      setCallData(outgoing);
      setCallStatus("ringing");
      setIsCallActive(true);
      playSound("outgoing");
      ringtoneIntervalRef.current = setInterval(() => playSound("outgoing"), 2000);

      callTimeoutRef.current = setTimeout(() => {
        stopRingtone();
        getSocket().emit("end_call", { targetId: receiverId });
        cleanupCall();
      }, 30000);
    } catch (err) {
      console.error("Start call error:", err);
      cleanupCall();
    }
  }, [currentUser, getMediaStream, setCallData, setIsCallActive, setCallStatus, setRemoteStream, cleanupCall, stopRingtone]);

  // ---- End call ----
  const endCall = useCallback(() => {
    stopRingtone();
    playSound("ended");
    const cd = callDataRef.current;
    if (cd) {
      const targetId =
        cd.type === "outgoing" || cd.type === "active" || cd.type === "connecting" ? cd.receiverId : cd.callerId;
      getSocket().emit("end_call", { targetId });
    }
    cleanupCall();
  }, [cleanupCall, stopRingtone]);

  // ---- Toggle mic ----
  const toggleMic = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        const cd = callDataRef.current;
        const targetId = cd?.type === "active" ? cd.receiverId : cd?.callerId;
        getSocket().emit("toggle_mic", { targetId, muted: !audioTrack.enabled });
        return audioTrack.enabled;
      }
    }
    return true;
  }, []);

  // ---- Toggle camera ----
  const toggleCamera = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        const cd = callDataRef.current;
        const targetId = cd?.type === "active" ? cd.receiverId : cd?.callerId;
        getSocket().emit("toggle_camera", { targetId, enabled: videoTrack.enabled });
        return videoTrack.enabled;
      }
    }
    return false;
  }, []);

  // ---- Screen share ----
  const toggleScreenShare = useCallback(async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const peer = peerRef.current;
      if (!peer) return;

      const videoTrack = screenStream.getVideoTracks()[0];
      const sender = peer.getSenders().find((s) => s.track?.kind === "video");
      if (sender) await sender.replaceTrack(videoTrack);

      videoTrack.onended = () => {
        if (localStreamRef.current) {
          const origTrack = localStreamRef.current.getVideoTracks()[0];
          if (origTrack && sender) sender.replaceTrack(origTrack);
        }
        const cd = callDataRef.current;
        const targetId = cd?.type === "active" ? cd.receiverId : cd?.callerId;
        getSocket().emit("screen_share", { targetId, sharing: false });
      };

      const cd = callDataRef.current;
      const targetId = cd?.type === "active" ? cd.receiverId : cd?.callerId;
      getSocket().emit("screen_share", { targetId, sharing: true });
    } catch {
      // User cancelled
    }
  }, []);

  // ---- Call lifecycle socket listeners ----
  useEffect(() => {
    const handleCallAccepted = ({ accepterSocketId }) => {
      const cd = callDataRef.current;
      if (!cd || cd.type !== "outgoing") return;
      stopRingtone();
      if (callTimeoutRef.current) clearTimeout(callTimeoutRef.current);
      const updated = { ...cd, type: "connecting", status: "connecting" };
      callDataRef.current = updated;
      setCallData(updated);
      setCallStatus("connecting");

      const peer = peerRef.current;
      if (!peer) return;
      const createOffer = async () => {
        try {
          const offer = await peer.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: cd.callType === "video",
          });
          await peer.setLocalDescription(offer);
          getSocket().emit("offer", { targetId: cd.receiverId, sdp: peer.localDescription });
        } catch (err) {
          console.error("Create offer error:", err);
          cleanupCall();
        }
      };
      createOffer();
    };

    const handleCallRejected = ({ reason }) => {
      stopRingtone();
      cleanupCall();
    };

    const handleCallEnded = ({ endedBy }) => {
      stopRingtone();
      playSound("ended");
      cleanupCall();
    };

    const handleCallFailed = ({ reason }) => {
      stopRingtone();
      cleanupCall();
    };

    getSocket().on("call_accepted", handleCallAccepted);
    getSocket().on("call_rejected", handleCallRejected);
    getSocket().on("call_ended", handleCallEnded);
    getSocket().on("call_failed", handleCallFailed);

    return () => {
      getSocket().off("call_accepted", handleCallAccepted);
      getSocket().off("call_rejected", handleCallRejected);
      getSocket().off("call_ended", handleCallEnded);
      getSocket().off("call_failed", handleCallFailed);
    };
  }, [setCallData, setCallStatus, cleanupCall, stopRingtone]);

  // ---- WebRTC signaling (offer/answer/ICE) ----
  useEffect(() => {
    const handleOffer = async ({ sdp, from }) => {
      const cd = callDataRef.current;
      if (!cd || (cd.type !== "connecting" && cd.type !== "incoming")) return;
      const peer = peerRef.current;
      if (!peer) return;
      try {
        await peer.setRemoteDescription(new RTCSessionDescription(sdp));
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        getSocket().emit("answer", { targetId: cd.callerId, sdp: peer.localDescription });
      } catch (err) { console.error("Offer error:", err); }
    };

    const handleAnswer = async ({ sdp, from }) => {
      const cd = callDataRef.current;
      if (!cd || cd.type !== "connecting") return;
      const peer = peerRef.current;
      if (!peer) return;
      try {
        await peer.setRemoteDescription(new RTCSessionDescription(sdp));
      } catch (err) { console.error("Answer error:", err); }
    };

    const handleIceCandidate = async ({ candidate }) => {
      const peer = peerRef.current;
      if (!peer) return;
      try {
        await peer.addIceCandidate(new RTCIceCandidate(candidate));
      } catch { /* ignore invalid candidates */ }
    };

    getSocket().on("offer", handleOffer);
    getSocket().on("answer", handleAnswer);
    getSocket().on("ice_candidate", handleIceCandidate);
    return () => {
      getSocket().off("offer", handleOffer);
      getSocket().off("answer", handleAnswer);
      getSocket().off("ice_candidate", handleIceCandidate);
    };
  }, [setCallData]);

  // Expose methods via ref
  useEffect(() => {
    if (actionRef) {
      actionRef.current = {
        startCall,
        acceptCall,
        rejectCall,
        endCall,
        toggleMic,
        toggleCamera,
        toggleScreenShare,
      };
    }
  }, [actionRef, startCall, acceptCall, rejectCall, endCall, toggleMic, toggleCamera, toggleScreenShare]);

  useEffect(() => {
    return () => {
      if (callDataRef.current || peerRef.current || localStreamRef.current) {
        cleanupCall();
      }
    };
  }, [cleanupCall]);

  return null;
};

export default CallHandler;