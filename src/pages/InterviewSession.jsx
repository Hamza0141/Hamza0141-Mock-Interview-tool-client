import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useAppSelector } from "../app/hooks";
import {
  Mic,
  Video,
  Volume2,
  VolumeX,
  Loader2,
  Play,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function InterviewSession() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.user);

  // core states
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [answer, setAnswer] = useState("");
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);

  // permission/toggle states
  const [permissions, setPermissions] = useState({
    camera: false,
    mic: false,
    speaker: false,
  });
  const [activeToggles, setActiveToggles] = useState({
    camera: true,
    mic: true,
    speaker: true,
  });

  // refs
  const videoRef = useRef(null);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const streamRef = useRef(null);
  const voicesRef = useRef([]);

  // fetch questions
  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await axiosClient.get(`/user/interview/${id}/questions`);
        if (res.data.success) setQuestions(res.data.data);
      } catch (err) {
        console.error("❌ Failed to fetch questions:", err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, [id]);

  // load available voices
  useEffect(() => {
    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // independent permission handlers
  const togglePermission = async (type) => {
    try {
      if (type === "camera") {
        if (!permissions.camera) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          streamRef.current = stream;
          if (videoRef.current) videoRef.current.srcObject = stream;
          setPermissions((p) => ({ ...p, camera: true }));
        } else {
          streamRef.current?.getTracks()?.forEach((t) => t.stop());
          setPermissions((p) => ({ ...p, camera: false }));
        }
      } else if (type === "mic") {
        if (!permissions.mic) {
          await navigator.mediaDevices.getUserMedia({ audio: true });
          setPermissions((p) => ({ ...p, mic: true }));
        } else {
          setPermissions((p) => ({ ...p, mic: false }));
        }
      } else if (type === "speaker") {
        setPermissions((p) => ({ ...p, speaker: !p.speaker }));
      }
    } catch (err) {
      alert(`⚠️ ${type} permission denied`);
    }
  };

  // text-to-speech (respects speaker toggle)
  const speakQuestion = (text) => {
    if (!activeToggles.speaker || !window.speechSynthesis) return;
    const voice =
      voicesRef.current.find((v) =>
        v.name.match(/(Google US English|Microsoft|Aria|Jenny|Guy)/i)
      ) || voicesRef.current[0];
    const u = new SpeechSynthesisUtterance(text);
    u.voice = voice;
    u.pitch = 1.05;
    u.rate = 0.95;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };

  // start speech recognition (respects mic toggle)
  const startSpeechRecognition = () => {
    stopSpeechRecognition();
    if (!activeToggles.mic) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    recognitionRef.current = new SR();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onresult = (e) => {
      let text = "";
      for (let i = e.resultIndex; i < e.results.length; ++i)
        text += e.results[i][0].transcript;
      setAnswer(text.trim());
    };

    recognitionRef.current.start();
  };

  const stopSpeechRecognition = () => {
    recognitionRef.current?.stop();
  };

  // start timer (unchanged)
  useEffect(() => {
    if (!started) return;
    setTimeLeft(120);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [current, started]);

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(
      2,
      "0"
    )}`;

  const startInterview = () => {
    setStarted(true);
    speakQuestion(questions[0]?.question_text);
    startSpeechRecognition();
  };

  const nextQuestion = () => {
    setAnswers((prev) => [
      ...prev,
      {
        question_id: questions[current].id,
        asked_question: questions[current].question_text,
        user_response: answer,
      },
    ]);
    setAnswer("");
    stopSpeechRecognition();
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
      speakQuestion(questions[current + 1]?.question_text);
      startSpeechRecognition();
    }
  };
console.log(id)
const submitInterview = async () => {
  try {
    // 🔒 Stop all listeners before sending
    stopSpeechRecognition();
    streamRef.current?.getTracks()?.forEach((t) => t.stop());
    setSubmitting(true);

    // ✅ Build a clean, serializable payload
    const cleanAskedQuestions = [
      ...answers.map((a) => ({
        question_id: a.question_id,
        asked_question: a.asked_question,
        user_response: a.user_response,
      })),
      {
        question_id: questions[current].id,
        asked_question: questions[current].question_text,
        user_response: answer,
      },
    ];

    const payload = {
      session_id: id, // ✅ use the same session id
      first_name: user?.first_name || "Candidate",
      job_title: "Front-end Developer",
      job_description:
        "Builds and maintains client-side components, ensures responsive design, and collaborates with backend developers.",
      difficulty: "hard",
      asked_questions: cleanAskedQuestions,
    };

    console.log("✅ Sending payload:", payload);

    const res = await axiosClient.post("/ai/evaluate", payload);

    if (res.data.success) {
      // ✅ Use session_id for routing (no feedback_id needed)
      navigate(`/evaluation/${id}`, { replace: true });
    } else {
      alert(res.data.message || "Evaluation failed");
    }
  } catch (err) {
    console.error("❌ Evaluation error:", err);
    alert("Failed to send for AI evaluation. Check console for details.");
  } finally {
    setSubmitting(false);
  }
};

  // ------------------- UI -------------------

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-[var(--color-text-muted)]">
        <Loader2 className="animate-spin" size={32} />
        <p className="mt-4 text-sm">Loading interview...</p>
      </div>
    );

  if (!started)
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
        <h2 className="text-xl font-semibold mb-4 text-[var(--color-primary)]">
          Setup Permissions
        </h2>
        <div className="flex gap-6 mb-6">
          {/* Camera */}
          <button
            onClick={() => togglePermission("camera")}
            className={`flex flex-col items-center px-4 py-2 rounded-md border ${
              permissions.camera
                ? "bg-green-500/20 border-green-500/30 text-green-400"
                : "bg-gray-500/10 border-gray-400/20 text-gray-400"
            }`}
          >
            <Video />
            <span className="text-xs mt-1">Camera</span>
          </button>

          {/* Mic */}
          <button
            onClick={() => togglePermission("mic")}
            className={`flex flex-col items-center px-4 py-2 rounded-md border ${
              permissions.mic
                ? "bg-green-500/20 border-green-500/30 text-green-400"
                : "bg-gray-500/10 border-gray-400/20 text-gray-400"
            }`}
          >
            <Mic />
            <span className="text-xs mt-1">Microphone</span>
          </button>

          {/* Speaker */}
          <button
            onClick={() => togglePermission("speaker")}
            className={`flex flex-col items-center px-4 py-2 rounded-md border ${
              permissions.speaker
                ? "bg-green-500/20 border-green-500/30 text-green-400"
                : "bg-gray-500/10 border-gray-400/20 text-gray-400"
            }`}
          >
            <Volume2 />
            <span className="text-xs mt-1">Speaker</span>
          </button>
        </div>

        <button
          disabled={
            !permissions.camera && !permissions.mic && !permissions.speaker
          }
          onClick={startInterview}
          className="px-6 py-2 rounded-md text-white font-medium bg-[var(--color-primary)] hover:opacity-90 flex items-center gap-2"
        >
          <Play size={16} /> Start Interview
        </button>
      </div>
    );

  if (submitting)
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <Loader2
          className="animate-spin text-[var(--color-primary)]"
          size={40}
        />
        <p className="mt-4 font-medium">Evaluating your responses...</p>
        <p className="text-sm text-[var(--color-text-muted)]">
          Please don’t refresh the page
        </p>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-[var(--color-primary)]">
          Question {current + 1} of {questions.length}
        </h2>
        <span className="text-sm text-[var(--color-text-muted)]">
          ⏱️ {formatTime(timeLeft)}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.4 }}
          className="p-4 rounded-lg border shadow-sm bg-[var(--color-bg-panel)] text-[var(--color-text-main)]"
        >
          {questions[current]?.question_text}
        </motion.div>
      </AnimatePresence>

      {/* toggles inside interview */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => setActiveToggles((t) => ({ ...t, camera: !t.camera }))}
          className={`text-xs px-3 py-1 rounded-full border ${
            activeToggles.camera
              ? "text-green-400 border-green-400"
              : "text-gray-400 border-gray-400"
          }`}
        >
          {activeToggles.camera ? "Disable Camera" : "Enable Camera"}
        </button>

        <button
          onClick={() => setActiveToggles((t) => ({ ...t, mic: !t.mic }))}
          className={`text-xs px-3 py-1 rounded-full border ${
            activeToggles.mic
              ? "text-green-400 border-green-400"
              : "text-gray-400 border-gray-400"
          }`}
        >
          {activeToggles.mic ? "Disable Mic" : "Enable Mic"}
        </button>

        <button
          onClick={() =>
            setActiveToggles((t) => ({ ...t, speaker: !t.speaker }))
          }
          className={`text-xs px-3 py-1 rounded-full border ${
            activeToggles.speaker
              ? "text-green-400 border-green-400"
              : "text-gray-400 border-gray-400"
          }`}
        >
          {activeToggles.speaker ? "Mute Speaker" : "Unmute Speaker"}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {activeToggles.camera ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-72 h-56 rounded-lg border bg-black mx-auto"
          />
        ) : (
          <div className="w-72 h-56 rounded-lg border bg-[var(--color-bg-panel)] flex items-center justify-center text-[var(--color-text-muted)] mx-auto">
            Camera Disabled
          </div>
        )}

        <textarea
          className="w-full h-48 border rounded-md p-3 bg-transparent text-sm focus:ring-2 focus:ring-[var(--color-primary)]"
          style={{
            borderColor: "var(--color-border)",
            color: "var(--color-text-main)",
          }}
          placeholder="Your answer appears here..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        ></textarea>
      </div>

      {/* keep buttons here, not footer */}
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
