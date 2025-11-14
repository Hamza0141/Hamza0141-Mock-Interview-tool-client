// src/pages/PublicSpeechSetup.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { Loader2, Mic, Keyboard } from "lucide-react";

export default function PublicSpeechSetup() {
  const { user } = useAppSelector((state) => state.user);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    speech_title: "",
    speech_goal: "",
  });
  const [status, setStatus] = useState("idle"); // "idle" | "loading"
  const [feedback, setFeedback] = useState("");
  const [processing, setProcessing] = useState(false); // for the spinner screen

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleContinueSpeech = (e) => {
    e.preventDefault();

    // basic validation
    if (!form.speech_title.trim()) {
      setFeedback("⚠️ Please provide a speech title.");
      return;
    }
    if (!form.speech_goal.trim()) {
      setFeedback("⚠️ Please describe your speech goal.");
      return;
    }

    // must be logged in
    if (!user) {
      navigate("/login");
      return;
    }

    // credit / trial check
    const credits = user?.credit_balance ?? 0;
    const trial = user?.free_trial ?? 0;

    if (credits <= 0 && trial <= 0) {
      navigate("/pricing");
      return;
    }

    // ✅ allowed → show small "preparing" state then go to session
    setStatus("loading");
    setProcessing(true);
    setFeedback("Setting up your speech practice session...");

    setTimeout(() => {
      navigate("/speech/session", {
        state: {
          speechTitle: form.speech_title.trim(),
          speechGoal: form.speech_goal.trim(),
          firstName: user?.first_name || "Speaker",
        },
      });
    }, 800);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Hero */}
      <div
        className="rounded-2xl shadow-md border mb-8 p-8 text-center"
        style={{
          background:
            "linear-gradient(135deg, var(--color-primary) 30%, #4b6cb7)",
          color: "white",
        }}
      >
        <h1 className="text-3xl font-semibold mb-2">
          Prepare Your Public Speech
        </h1>
        <p className="opacity-90 max-w-lg mx-auto text-sm">
          Practice any presentation or speech and get AI-powered feedback on
          clarity, structure, tone, and more.
        </p>
        <p className="text-xs italic opacity-60 mt-2">
          SelfMock may make mistakes; verify key information.
        </p>
      </div>

      {!processing ? (
        <form
          onSubmit={handleContinueSpeech}
          className="rounded-xl border shadow-md p-6 bg-[var(--color-bg-panel)]"
        >
          <h3 className="text-lg font-semibold mb-4 text-[var(--color-primary)]">
            Describe Your Speech
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">
                Speech Title <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <Mic size={16} className="text-[var(--color-primary)]" />
                <input
                  required
                  type="text"
                  name="speech_title"
                  value={form.speech_title}
                  onChange={handleChange}
                  placeholder="e.g., The Power of Perseverance"
                  className="w-full px-3 py-2 rounded-md border bg-transparent focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1">
                Speech Goal <span className="text-red-500">*</span>
              </label>
              <div className="flex items-start gap-2">
                <Keyboard
                  size={16}
                  className="text-[var(--color-primary)] mt-1"
                />
                <textarea
                  required
                  name="speech_goal"
                  value={form.speech_goal}
                  onChange={handleChange}
                  rows="3"
                  placeholder="e.g., Inspire students to never give up."
                  className="w-full px-3 py-2 rounded-md border bg-transparent focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>
            </div>

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

            <div className="flex justify-center mt-4">
              <button
                type="submit"
                disabled={status === "loading"}
                className="flex items-center gap-2 px-6 py-2 rounded-md text-white font-medium transition bg-[var(--color-primary)] hover:opacity-90"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="animate-spin" size={18} /> Preparing...
                  </>
                ) : (
                  "Continue to Speech"
                )}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-6 text-[var(--color-text-main)] font-medium">
              Preparing your speech session...
            </p>
            <p className="text-sm text-[var(--color-text-muted)] mt-2">
              You’ll record your speech next.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
