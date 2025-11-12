import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useAppSelector } from "../app/hooks";
import {
  Mic,
  MicOff,
  Type,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
  Loader2,
  Play,
  CheckCircle2,
  SwitchCamera,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useVoiceRecorder from "../app/useVoiceRecorder";

// 🎵 Animated wave signal for recording
function WaveBars() {
  return (
    <div className="flex items-end gap-1 h-5">
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.span
          key={i}
          className="w-1 rounded-sm bg-[var(--color-primary)]/80"
          initial={{ scaleY: 0.3 }}
          animate={{ scaleY: [0.3, 1, 0.5, 0.9, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.07 }}
        />
      ))}
    </div>
  );
}

export default function InterviewSession() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.user);

  const interviewId = state?.interviewId;
  const presetMode = state?.mode || "text";

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [evaluating, setEvaluating] = useState(false);

  const [timeLeft, setTimeLeft] = useState(120);
  const [inputMode, setInputMode] = useState("none"); // "record" | "type" | "none"
  const [typedText, setTypedText] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordBlocked, setRecordBlocked] = useState(false);

  const [permissions, setPermissions] = useState({
    camera: false,
    mic: false,
    speaker: true,
  });
  const [cameraFacing, setCameraFacing] = useState("user");

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const voicesRef = useRef([]);
  const timerRef = useRef(null);
  const recordTimeoutRef = useRef(null);

  const {
    recording,
    transcript,
    setTranscript,
    startRecording,
    stopRecording,
  } = useVoiceRecorder();

  // 🚫 Redirect if opened directly
  useEffect(() => {
    if (!interviewId) navigate("/interview/setup", { replace: true });
  }, [interviewId, navigate]);

  // 🧩 Fetch questions
  useEffect(() => {
    if (!interviewId) return;
    (async () => {
      try {
        const res = await axiosClient.get(
          `/user/interview/${interviewId}/questions`
        );
        if (res.data.success) setQuestions(res.data.data || []);
      } catch (err) {
        console.error("❌ Failed to fetch questions:", err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [interviewId]);

  // 🔊 Load speech synthesis voices
  useEffect(() => {
    const loadVoices = () =>
      (voicesRef.current = window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speakQuestion = (text) => {
    if (!permissions.speaker || !window.speechSynthesis) return;
    const voice =
      voicesRef.current.find((v) =>
        v.name.match(/(Google US English|Microsoft|Jenny|Guy)/i)
      ) || voicesRef.current[0];
    const u = new SpeechSynthesisUtterance(text || "");
    u.voice = voice;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };

  // 🎥 Camera controls
  const startCamera = async (facing = "user") => {
    try {
      const constraints = { video: { facingMode: facing } };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current?.getTracks()?.forEach((t) => t.stop());
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () =>
          videoRef.current.play().catch(() => {});
      }
      setPermissions((p) => ({ ...p, camera: true }));
    } catch {
      alert("⚠️ Camera permission denied or not available.");
    }
  };

  const toggleCamera = async () => {
    if (!permissions.camera) await startCamera(cameraFacing);
    else {
      streamRef.current?.getTracks()?.forEach((t) => t.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
      setPermissions((p) => ({ ...p, camera: false }));
    }
  };

  const flipCamera = async () => {
    const nextFacing = cameraFacing === "user" ? "environment" : "user";
    setCameraFacing(nextFacing);
    await startCamera(nextFacing);
  };

  // 🔉 Speaker toggle
  const toggleSpeaker = () => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    if (permissions.speaker) synth.cancel();
    setPermissions((p) => ({ ...p, speaker: !p.speaker }));
  };

  // ⏱ Timer per question
  useEffect(() => {
    if (!started) return;
    setTimeLeft(120);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [current, started]);

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(
      2,
      "0"
    )}`;

  // 🎬 Start
  const startInterview = () => {
    setStarted(true);
    speakQuestion(questions[0]?.question_text);
  };

  // 🎙️ Recording flow with cap
  const startRecordingWithCap = async () => {
    if (recordBlocked) return;
    setInputMode("record");
    setIsTranscribing(false);
    await startRecording();
    clearTimeout(recordTimeoutRef.current);
    recordTimeoutRef.current = setTimeout(async () => {
      await stopRecordingSafe();
      setRecordBlocked(true);
    }, 120000); // 2 minutes cap
  };

  const stopRecordingSafe = async () => {
    clearTimeout(recordTimeoutRef.current);
    setIsTranscribing(true);
    await stopRecording(questions[current]?.id, interviewId);
    setIsTranscribing(false);
  };

  // ⏭ Next
  const nextQuestion = async () => {
    if (recording) await stopRecordingSafe();

    const answerText = `${transcript || ""} ${typedText || ""}`.trim();
    setAnswers((prev) => [
      ...prev,
      {
        question_id: questions[current]?.id,
        asked_question: questions[current]?.question_text,
        user_response: answerText,
      },
    ]);

    // reset input states for next question
    setTypedText("");
    setTranscript("");
    setInputMode("none");
    setRecordBlocked(false);

    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
      speakQuestion(questions[current + 1]?.question_text);
    }
  };

  //  Submit
  const submitInterview = async () => {
    try {
      if (recording) await stopRecordingSafe();
      setEvaluating(true);
      window.speechSynthesis.cancel();
      streamRef.current?.getTracks()?.forEach((t) => t.stop());

      const lastText = `${transcript || ""} ${typedText || ""}`.trim();

      const payload = {
        session_id: interviewId,
        first_name: user?.first_name || "Candidate",
        asked_questions: [
          ...answers,
          {
            question_id: questions[current]?.id,
            asked_question: questions[current]?.question_text,
            user_response: lastText,
          },
        ],
      };

      const res = await axiosClient.post("/ai/evaluate", payload);
      if (res.data.success)
        setTimeout(
          () => navigate(`/evaluation/${interviewId}`, { replace: true }),
          1800
        );
      else {
        alert(res.data.message || "Evaluation failed");
        setEvaluating(false);
      }
    } catch (err) {
      console.error("❌ Submit failed:", err);
      alert("Failed to submit for AI evaluation.");
      setEvaluating(false);
    }
  };

  // 🌀 Evaluating animation
  if (evaluating)
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-6 text-[var(--color-text-main)] font-medium">
            Evaluating your responses...
          </p>
          <p className="text-sm text-[var(--color-text-muted)] mt-2">
            This may take a few seconds.Pleas don't refresh the browser
          </p>
        </div>
      </div>
    );

  // 🖥️ Loading
  if (loading || !interviewId)
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <Loader2 className="animate-spin" size={32} />
        <p className="mt-4 text-sm">Loading interview...</p>
      </div>
    );

  // ⚙️ Permission setup
  if (!started)
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
        <h2 className="text-xl font-semibold mb-4 text-[var(--color-primary)]">
          Setup Permissions
        </h2>

        <div className="flex gap-6 mb-6">
          <button
            onClick={toggleCamera}
            className={`flex flex-col items-center px-4 py-2 rounded-md border ${
              permissions.camera
                ? "text-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)] animate-pulse"
                : "text-gray-400 hover:text-[var(--color-primary)]"
            }`}
          >
            {permissions.camera ? <Video /> : <VideoOff />}
            <span className="text-xs mt-1">Camera</span>
          </button>
          <button
            onClick={flipCamera}
            className="flex flex-col items-center px-4 py-2 rounded-md border text-gray-400 hover:text-[var(--color-primary)]"
          >
            <SwitchCamera />
            <span className="text-xs mt-1">Flip</span>
          </button>
          <button
            onClick={toggleSpeaker}
            className={`flex flex-col items-center px-4 py-2 rounded-md border ${
              permissions.speaker
                ? "text-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)] animate-pulse"
                : "text-gray-400 hover:text-[var(--color-primary)]"
            }`}
          >
            {permissions.speaker ? <Volume2 /> : <VolumeX />}
            <span className="text-xs mt-1">Speaker</span>
          </button>
        </div>

        <button
          onClick={startInterview}
          className="px-6 py-2 rounded-md text-white font-medium bg-[var(--color-primary)] hover:opacity-90 flex items-center gap-2"
        >
          <Play size={16} /> Start Interview
        </button>
      </div>
    );

  // 🧩 Main UI
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--color-primary)]">
          Question {current + 1} of {questions.length}
        </h2>
        <span className="text-sm text-gray-500">⏱️ {formatTime(timeLeft)}</span>
      </div>

      {/* Question */}
      <motion.div
        key={current}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.4 }}
        className="p-4 rounded-lg border shadow-sm relative"
      >
        <p>{questions[current]?.question_text}</p>
        <button
          onClick={toggleSpeaker}
          className={`absolute right-2 bottom-2 p-2 rounded-full ${
            permissions.speaker
              ? "text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.6)] animate-pulse"
              : "text-gray-500 hover:text-[var(--color-primary)]"
          }`}
        >
          {permissions.speaker ? <Volume2 size={22} /> : <VolumeX size={22} />}
        </button>
      </motion.div>

      {/* Camera + Input */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Camera */}
        <div className="relative flex flex-col items-center">
          {permissions.camera ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-72 h-56 rounded-lg border bg-black object-cover"
              style={{
                transform: cameraFacing === "user" ? "scaleX(-1)" : "none",
              }}
            />
          ) : (
            <div className="w-72 h-56 border rounded-lg flex items-center justify-center text-gray-400">
              Camera Disabled
            </div>
          )}
          <div className="flex gap-2 mt-2">
            <button
              onClick={toggleCamera}
              className={`p-2 rounded-full ${
                permissions.camera
                  ? "text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.6)] animate-pulse"
                  : "text-gray-500 hover:text-[var(--color-primary)]"
              }`}
            >
              {permissions.camera ? (
                <Video size={20} />
              ) : (
                <VideoOff size={20} />
              )}
            </button>
            <button
              onClick={flipCamera}
              className="p-2 rounded-full text-gray-500 hover:text-[var(--color-primary)]"
            >
              <SwitchCamera size={20} />
            </button>
          </div>
        </div>

        {/* Input Controls */}
        <div className="flex flex-col">
          <div className="flex gap-3 mb-3">
            <button
              onClick={async () => {
                if (recording) await stopRecordingSafe();
                else await startRecordingWithCap();
              }}
              disabled={inputMode === "type"}
              className={`flex-1 px-4 py-2 rounded-md border font-medium flex items-center justify-center gap-2 ${
                recording
                  ? "text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)] animate-pulse"
                  : "text-gray-500 hover:text-[var(--color-primary)]"
              }`}
            >
              {recording ? <MicOff size={18} /> : <Mic size={18} />}
              {recording ? "Stop Recording" : "Start Recording"}
            </button>

            <button
              onClick={() => setInputMode("type")}
              disabled={inputMode === "record"}
              className={`flex-1 px-4 py-2 rounded-md border font-medium flex items-center justify-center gap-2 ${
                inputMode === "type"
                  ? "text-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.6)] animate-pulse"
                  : "text-gray-500 hover:text-[var(--color-primary)]"
              }`}
            >
              <Type size={18} />
              Type Answer
            </button>
          </div>

          {/* Recording Signal */}
          {recording && (
            <div className="flex items-center gap-3 mb-2">
              <WaveBars />
              <span className="text-xs text-[var(--color-text-muted)]">
                Recording… (auto-stops at 02:00)
              </span>
            </div>
          )}

          {/* Transcribing Spinner */}
          {isTranscribing && (
            <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-2">
              <Loader2 size={16} className="animate-spin" /> Transcribing...
            </div>
          )}

          {/* Input Area */}
          {inputMode === "type" ? (
            <textarea
              className="w-full h-48 border rounded-md p-3 text-sm bg-transparent focus:ring-2 focus:ring-[var(--color-primary)]"
              value={typedText}
              onChange={(e) => setTypedText(e.target.value)}
              placeholder="Type your answer here..."
            />
          ) : (
            (recording || transcript) && (
              <textarea
                className="w-full h-48 border rounded-md p-3 text-sm bg-transparent focus:ring-2 focus:ring-[var(--color-primary)]"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Your recorded response will appear here..."
              />
            )
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-end gap-3 mt-6">
        {current < questions.length - 1 ? (
          <button
            onClick={nextQuestion}
            className="px-4 py-2 text-sm rounded-md text-white font-medium bg-[var(--color-primary)] hover:opacity-90"
          >
            Next
          </button>
        ) : (
          <button
            onClick={submitInterview}
            disabled={submitting}
            className="px-4 py-2 text-sm rounded-md text-white font-medium bg-green-600 hover:opacity-90 flex items-center gap-2"
          >
            <CheckCircle2 size={16} />
            {submitting ? "Submitting..." : "Submit"}
          </button>
        )}
      </div>
    </div>
  );
}
