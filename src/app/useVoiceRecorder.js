import { useRef, useState } from "react";
import axiosClient from "../api/axiosClient";

export default function useVoiceRecorder() {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setRecording(true);
    } catch (err) {
      alert("Microphone access denied.");
    }
  };

  const stopRecording = async (questionId, sessionId) => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current) return resolve("");

      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("audio", blob, "answer.webm");
        formData.append("question_id", questionId);
        formData.append("session_id", sessionId);

        try {
          const res = await axiosClient.post(
            "/voice/transcribe",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );

          if (res.data.success) {
            setTranscript(res.data.transcript);
            resolve(res.data.transcript);
          } else {
            resolve("");
          }
        } catch (err) {
          console.error("Transcription error:", err);
          resolve("");
        } finally {
          setRecording(false);
        }
      };

      mediaRecorderRef.current.stop();
    });
  };

  return {
    recording,
    transcript,
    setTranscript,
    startRecording,
    stopRecording,
  };
}
