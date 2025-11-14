import { useState, useEffect, useRef, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import {
  Mic,
  MicOff,
  Type,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  Video,
  RefreshCw,
} from "lucide-react";
import LiveWaveform from "../components/LiveWaveform";

export default function PublicSpeechSession() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const speechTitle = state?.speechTitle;
  const speechGoal = state?.speechGoal;

  // Permissions & phase
  const [permissions, setPermissions] = useState({
    camera: false,
    mic: false,
  });
  const [started, setStarted] = useState(false);

  // Recording / transcript
  const [recording, setRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [typedText, setTypedText] = useState("");
  const [mode, setMode] = useState("record"); // "record" | "type"
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");

  // Media refs
  const cameraStreamRef = useRef(null);
  const audioStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const videoRef = useRef(null);
  const [mirror, setMirror] = useState(true);

  // Redirect if opened directly
  useEffect(() => {
    if (!speechTitle || !speechGoal) {
      navigate("/speech/setup", { replace: true });
    }
  }, [speechTitle, speechGoal, navigate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cameraStreamRef.current?.getTracks().forEach((t) => t.stop());
      audioStreamRef.current?.getTracks().forEach((t) => t.stop());
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  // Attach existing camera stream to current <video>
  useEffect(() => {
    if (permissions.camera && cameraStreamRef.current && videoRef.current) {
      videoRef.current.srcObject = cameraStreamRef.current;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play().catch(() => {});
      };
    }
  }, [permissions.camera, started]);

  // ===== PERMISSIONS =====

  const enableCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      cameraStreamRef.current?.getTracks().forEach((t) => t.stop());
      cameraStreamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch(() => {});
        };
      }

      setPermissions((p) => ({ ...p, camera: true }));
      setFeedback("✅ Camera enabled.");
    } catch (err) {
      console.error("Camera error:", err);
      setFeedback("⚠️ Camera permission denied or unavailable.");
    }
  };

  const enableMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // only for permission; stop immediately
      stream.getTracks().forEach((t) => t.stop());
      setPermissions((p) => ({ ...p, mic: true }));
      setFeedback("✅ Microphone enabled.");
    } catch (err) {
      console.error("Mic permission error:", err);
      setFeedback("⚠️ Microphone permission denied or unavailable.");
    }
  };

  const startSession = () => {
    if (!permissions.mic) {
      setFeedback("⚠️ Please enable microphone before starting.");
      return;
    }
    setStarted(true);
    setFeedback("You can start recording your speech when you’re ready.");

    if (permissions.camera && !cameraStreamRef.current) {
      enableCamera().catch(() => {});
    }
  };

  // ===== RECORDING / TRANSCRIBE =====

  const startRecording = async () => {
    try {
      if (!permissions.mic) {
        await enableMic();
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current?.getTracks().forEach((t) => t.stop());
      audioStreamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        audioStreamRef.current?.getTracks().forEach((t) => t.stop());
        setIsTranscribing(true);
        try {
          const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          await transcribeAudio(blob);
        } catch (err) {
          console.error("Transcription error:", err);
          setFeedback(
            "❌ Failed to transcribe audio. Please try again or type your speech."
          );
        } finally {
          setIsTranscribing(false);
        }
      };

      mediaRecorder.start();
      setRecording(true);
      setFeedback("🎙️ Recording... Speak naturally. Click stop when finished.");
    } catch (err) {
      console.error("Mic error:", err);
      setFeedback("⚠️ Microphone permission denied or unavailable.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      setRecording(false);
      mediaRecorderRef.current.stop();
    }
  };

  const transcribeAudio = async (blob) => {
    const formData = new FormData();
    formData.append("audio", blob, "speech.webm");

    const res = await axiosClient.post("/voice/transcribe", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const text =
      res.data?.data?.text || res.data?.text || res.data?.transcript || "";

    if (!text) {
      setFeedback(
        "⚠️ No speech detected. You can try again or type your speech."
      );
      return;
    }

    setTranscript((prev) =>
      prev ? `${prev.trim()} ${text.trim()}` : text.trim()
    );
    setMode("type");
    setFeedback("✅ Transcription complete. You can edit the text below.");
  };

  const finalText = useMemo(() => {
    const combined = `${transcript || ""} ${typedText || ""}`.trim();
    return combined || transcript || typedText || "";
  }, [transcript, typedText]);

  // ===== SUBMIT =====

  const handleSubmit = async () => {
    if (!finalText) {
      setFeedback("⚠️ Please record or type your speech before submitting.");
      return;
    }

    setSubmitting(true);
    setFeedback("⏳ Submitting your speech for AI evaluation...");

    try {
      const payload = {
        speech_title: speechTitle,
        speech_goal: speechGoal,
        speech_text: finalText,
      };

      const res = await axiosClient.post("/user/speech", payload);

      if (res.data?.success) {
        const speechId =
          res.data?.speech_id || res.data?.data?.speech_id || null;

        setFeedback("✅ Speech submitted! Redirecting to evaluation...");
        setTimeout(() => {
          if (speechId) {
            navigate(`/speech/${speechId}`, { replace: true });
          } else {
            navigate("/report", { replace: true });
          }
        }, 1800);
      } else {
        setFeedback(res.data?.message || "❌ Failed to submit speech.");
        setSubmitting(false);
      }
    } catch (err) {
      console.error("Submit error:", err);
      setFeedback("❌ Network error. Please try again.");
      setSubmitting(false);
    }
  };

  // ===== RENDER =====

  // Permission screen
  if (!started) {
    return (
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition"
          >
            <ArrowLeft size={18} /> Back
          </button>
        </div>

        <div className="p-5 rounded-xl border bg-[var(--color-bg-panel)] mb-4">
          <h2 className="text-xl font-semibold text-[var(--color-primary)]">
            {speechTitle}
          </h2>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            Goal: {speechGoal}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-center">
          {/* Camera preview */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-72 h-56 border rounded-lg overflow-hidden bg-black flex items-center justify-center">
              {permissions.camera && cameraStreamRef.current ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  style={{ transform: mirror ? "scaleX(-1)" : "none" }}
                />
              ) : (
                <div className="flex flex-col items-center text-gray-400 text-sm">
                  <Video className="mb-2" />
                  Camera preview will appear here
                </div>
              )}
            </div>
            <button
              onClick={() => setMirror((m) => !m)}
              disabled={!permissions.camera}
              className="flex items-center gap-2 px-3 py-1 rounded-md border text-xs text-[var(--color-text-muted)] hover:text-[var(--color-primary)] disabled:opacity-40"
            >
              <RefreshCw size={14} />
              Flip mirror
            </button>
          </div>

          {/* Permission controls */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--color-text-main)]">
              Allow Camera & Microphone
            </h3>
            <p className="text-sm text-[var(--color-text-muted)]">
              We use your camera for a live selfie preview and your microphone
              to record audio for transcription. Only the text of your speech is
              stored for AI feedback.
            </p>

            <div className="flex flex-col gap-2">
              <button
                onClick={enableCamera}
                className={`px-5 py-2 rounded-md border font-medium flex items-center gap-2 ${
                  permissions.camera
                    ? "text-green-400 border-green-400/60 shadow-[0_0_10px_rgba(34,197,94,0.4)]"
                    : "text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10"
                }`}
              >
                <Video size={18} />
                {permissions.camera ? "Camera Enabled" : "Enable Camera"}
              </button>

              <button
                onClick={enableMic}
                className={`px-5 py-2 rounded-md border font-medium flex items-center gap-2 ${
                  permissions.mic
                    ? "text-green-400 border-green-400/60 shadow-[0_0_10px_rgba(34,197,94,0.4)]"
                    : "text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10"
                }`}
              >
                <Mic size={18} />
                {permissions.mic ? "Microphone Enabled" : "Enable Microphone"}
              </button>
            </div>

            <button
              onClick={startSession}
              className="mt-2 px-5 py-2 rounded-md bg-[var(--color-primary)] text-white font-medium hover:opacity-90"
            >
              Start Speech Practice
            </button>

            {feedback && (
              <p
                className={`text-xs p-2 rounded-md ${
                  feedback.startsWith("❌") || feedback.startsWith("⚠️")
                    ? "text-red-400 bg-red-500/10"
                    : "text-green-400 bg-green-500/10"
                }`}
              >
                {feedback}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Main session UI
  return (
    <div className="relative max-w-5xl mx-auto p-6 space-y-6">
      {/* Fullscreen overlay on submit */}
      {submitting && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 text-white text-center px-4">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-lg font-semibold mb-2">
            Submitting your speech for AI evaluation...
          </p>
          <p className="text-sm opacity-80 max-w-md">
            Please don&apos;t refresh or close the page until this finishes.
          </p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <div className="text-right text-xs text-[var(--color-text-muted)]">
          Public Speech Practice
        </div>
      </div>

      {/* Title & controls */}
      <div className="p-5 rounded-xl border bg-[var(--color-bg-panel)] flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-[var(--color-primary)]">
            {speechTitle}
          </h2>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            Goal: {speechGoal}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (recording) stopRecording();
              else startRecording();
            }}
            className={`px-4 py-2 rounded-md border text-sm font-medium flex items-center gap-2 ${
              recording
                ? "text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)] animate-pulse"
                : "text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10"
            }`}
          >
            {recording ? <MicOff size={16} /> : <Mic size={16} />}
            {recording ? "Stop Recording" : "Start Recording"}
          </button>
          <button
            onClick={() => setMode("type")}
            className={`px-4 py-2 rounded-md border text-sm font-medium flex items-center gap-2 ${
              mode === "type"
                ? "text-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)] animate-pulse"
                : "text-gray-500 hover:text-[var(--color-primary)]"
            }`}
          >
            <Type size={16} />
            Edit / Type
          </button>
        </div>
      </div>

      {/* Status row (no waveform here now) */}
      {(recording || isTranscribing || feedback) && (
        <div className="flex items-center gap-3 text-sm flex-wrap">
          {recording && (
            <span className="text-[var(--color-text-muted)]">
              🎙️ Recording… speak at your normal pace.
            </span>
          )}
          {isTranscribing && (
            <span className="flex items-center gap-2 text-[var(--color-text-muted)]">
              <Loader2 size={16} className="animate-spin" /> Transcribing
              audio...
            </span>
          )}
          {feedback && (
            <span
              className={`text-xs px-3 py-1 rounded-full ${
                feedback.startsWith("❌") || feedback.startsWith("⚠️")
                  ? "bg-red-500/10 text-red-400"
                  : "bg-green-500/10 text-green-400"
              }`}
            >
              {feedback}
            </span>
          )}
        </div>
      )}

      {/* Layout: selfie + text */}
      <div className="grid md:grid-cols-2 gap-6 items-start">
        {/* Selfie video */}
        <div className="flex flex-col items-center">
          <div className="w-72 h-56 border rounded-lg overflow-hidden bg-black flex items-center justify-center">
            {permissions.camera && cameraStreamRef.current ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
                style={{ transform: mirror ? "scaleX(-1)" : "none" }}
              />
            ) : (
              <div className="flex flex-col items-center text-gray-400 text-sm">
                <Video className="mb-2" />
                Camera preview unavailable
              </div>
            )}
          </div>
          <button
            onClick={() => setMirror((m) => !m)}
            disabled={!permissions.camera}
            className="mt-2 flex items-center gap-2 px-3 py-1 rounded-md border text-xs text-[var(--color-text-muted)] hover:text-[var(--color-primary)] disabled:opacity-40"
          >
            <RefreshCw size={14} />
            Flip mirror
          </button>
          <p className="mt-2 text-xs text-[var(--color-text-muted)] text-center">
            This live preview helps you practice body language and eye contact.
            It&apos;s not recorded.
          </p>
        </div>

        {/* Text / waveform area (single audio signal here) */}
        <div className="rounded-xl border bg-[var(--color-bg-card)] p-4 w-full">
          <label className="block text-xs mb-2 text-[var(--color-text-muted)]">
            Full Speech Text (editable after transcription)
          </label>

          {recording ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3 text-sm text-[var(--color-text-muted)]">
              <LiveWaveform
                stream={audioStreamRef.current}
                active={recording}
              />
              <p>Recording…</p>
            </div>
          ) : isTranscribing ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3 text-sm text-[var(--color-text-muted)]">
              <Loader2 size={20} className="animate-spin" />
              <p>Transcribing your speech...</p>
            </div>
          ) : (
            <textarea
              className="w-full min-h-[220px] border rounded-md p-3 text-sm bg-transparent focus:ring-2 focus:ring-[var(--color-primary)]"
              value={finalText}
              onChange={(e) => {
                setTranscript("");
                setTypedText(e.target.value);
              }}
              placeholder="Your speech text will appear here after transcription. You can edit or type manually."
            />
          )}
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="px-5 py-2 rounded-md text-white font-medium bg-green-600 hover:opacity-90 flex items-center gap-2"
        >
          <CheckCircle2 size={18} />
          {submitting ? "Submitting..." : "Submit for AI Evaluation"}
        </button>
      </div>
    </div>
  );
}
