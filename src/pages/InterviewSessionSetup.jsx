import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import axiosClient from "../api/axiosClient";
import { Mic, Keyboard, Loader2 } from "lucide-react";

export default function InterviewSessionSetup() {
  const { user } = useAppSelector((state) => state.user);
  const navigate = useNavigate();

  const [mode, setMode] = useState("text"); // "text" | "speech"
  const [form, setForm] = useState({
    job_title: "",
    job_description: "",
    difficulty: "medium",
  });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [feedback, setFeedback] = useState("");
  const [processing, setProcessing] = useState(false); // hide form and show loader

  const handleChange = (e) => {
    const { name, value } = e.target;

    // word count validations
    if (name === "job_title") {
      const wordCount = value.trim().split(/\s+/).length;
      if (wordCount > 100) {
        setFeedback("⚠️ Job title cannot exceed 100 words.");
        return;
      } else {
        setFeedback("");
      }
    }

    if (name === "job_description") {
      const wordCount = value.trim().split(/\s+/).length;
      if (wordCount > 500) {
        setFeedback("⚠️ Job description cannot exceed 500 words.");
        return;
      } else {
        setFeedback("");
      }
    }

    setForm({ ...form, [name]: value });
  };

  const handleStart = async (e) => {
    e.preventDefault();
    if (!form.job_title.trim()) {
      setFeedback("⚠️ Please provide a job title.");
      return;
    }

    setStatus("loading");
    setProcessing(true);
    setFeedback("Setting up your AI interview session...");

    try {
     const payload = {
       profile_id: user?.profile_id,
       job_title: form.job_title,
       job_description: form.job_description || null,
       difficulty: form.difficulty,
     };

     const res = await axiosClient.post("/user/startinterview", payload);

      if (res.data?.success) {
        setStatus("success");
        setFeedback("✨ AI is preparing your interview questions...");
        // wait a bit before redirecting to interview session
        setTimeout(() => {
          navigate(`/interview/${res.data.interview_id}`, {
            state: { mode },
          });
        }, 2500);
      } else {
        setStatus("error");
        setFeedback(res.data?.message || "❌ Failed to start interview.");
        setProcessing(false);
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setFeedback("❌ Network error. Please try again later.");
      setProcessing(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* ===== HERO / INTRO ===== */}
      <div
        className="rounded-2xl shadow-md border mb-8 p-8 text-center transition-all duration-500"
        style={{
          background:
            "linear-gradient(135deg, var(--color-primary) 30%, #4b6cb7)",
          color: "white",
          borderColor: "var(--color-border)",
        }}
      >
        <h1 className="text-3xl font-semibold mb-2">
          Ready for Your Mock Interview?
        </h1>
        <p className="opacity-90 max-w-lg mx-auto text-sm">
          You’ll go through 9 realistic AI-generated questions tailored to your
          selected job title and description. You can answer by typing or using
          your microphone for voice-based practice.
        </p>

        <div className="flex justify-center gap-3 mt-6">
          <button
            type="button"
            onClick={() => setMode("text")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border transition ${
              mode === "text"
                ? "bg-white text-[var(--color-primary)]"
                : "bg-transparent border-white/40 text-white hover:bg-white/20"
            }`}
          >
            <Keyboard size={16} /> Text Mode
          </button>
          <button
            type="button"
            onClick={() => setMode("speech")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border transition ${
              mode === "speech"
                ? "bg-white text-[var(--color-primary)]"
                : "bg-transparent border-white/40 text-white hover:bg-white/20"
            }`}
          >
            <Mic size={16} /> Speech (recommended)
          </button>
        </div>
      </div>

      {/* ===== FORM OR PROCESSING ===== */}
      {!processing ? (
        <form
          onSubmit={handleStart}
          className="rounded-xl border shadow-md p-6 bg-[var(--color-bg-panel)]"
          style={{ borderColor: "var(--color-border)" }}
        >
          <h3 className="text-lg font-semibold mb-4 text-[var(--color-primary)]">
            Customize Your Interview
          </h3>

          <div className="space-y-4">
            {/* Job Title */}
            <div>
              <label className="block text-sm mb-1">Job Title *</label>
              <input
                type="text"
                name="job_title"
                value={form.job_title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded-md border bg-transparent focus:ring-2 focus:ring-[var(--color-primary)]"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--color-text-main)",
                }}
              />
            </div>

            {/* Job Description */}
            <div>
              <label className="block text-sm mb-1">
                Job Description (optional)
              </label>
              <textarea
                name="job_description"
                value={form.job_description}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 rounded-md border bg-transparent focus:ring-2 focus:ring-[var(--color-primary)]"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--color-text-main)",
                }}
              ></textarea>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm mb-1">Difficulty Level</label>
              <select
                name="difficulty"
                value={form.difficulty}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-[var(--color-primary)] appearance-none"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--color-text-main)",
                  backgroundColor: "transparent", // ✅ Transparent dropdown for night mode
                }}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {/* Feedback */}
            {feedback && (
              <p
                className={`text-sm text-center p-2 rounded-md ${
                  feedback.startsWith("❌") || feedback.startsWith("⚠️")
                    ? "text-red-500 bg-red-100/10"
                    : "text-green-500 bg-green-100/10"
                }`}
              >
                {feedback}
              </p>
            )}

            {/* Submit */}
            <div className="flex justify-center mt-4">
              <button
                type="submit"
                disabled={status === "loading"}
                className="flex items-center gap-2 px-6 py-2 rounded-md text-white font-medium transition bg-[var(--color-primary)] hover:opacity-90"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="animate-spin" size={18} /> Processing...
                  </>
                ) : (
                  "Start Interview"
                )}
              </button>
            </div>
          </div>
        </form>
      ) : (
        // ===== PROCESSING STATE =====
        <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6 animate-fadeIn">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-6 text-[var(--color-text-main)] font-medium">
              Preparing your personalized AI interview...
            </p>
            <p className="text-sm text-[var(--color-text-muted)] mt-2">
              This may take up to 30 seconds. Sit tight while we build your
              session.
            </p>
          </div>
        </div>
      )}

      {/* ===== FOOTER TIP ===== */}
      <div className="text-center text-sm text-[var(--color-text-muted)] mt-8">
        💡 Tip: Make sure your microphone is enabled if you plan to use Speech
        Mode.
      </div>
    </div>
  );
}
