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
  const [status, setStatus] = useState("idle");
  const [feedback, setFeedback] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
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
         first_name: user?.first_name || "Candidate",
        job_title: form.job_title,
        job_description: form.job_description || null,
        difficulty: form.difficulty,
      };

      const res = await axiosClient.post("/user/startinterview", payload);

      if (res.data?.success) {
        setStatus("success");
        setFeedback("✨ AI is preparing your interview questions...");
        setTimeout(() => {
          navigate("/interview/session", {
            state: {
              interviewId: res.data.interview_id,
              jobTitle: form.job_title,
              jobDescription: form.job_description,
              difficulty: form.difficulty,
              mode,
            },
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
      <div
        className="rounded-2xl shadow-md border mb-8 p-8 text-center"
        style={{
          background:
            "linear-gradient(135deg, var(--color-primary) 30%, #4b6cb7)",
          color: "white",
        }}
      >
        <h1 className="text-3xl font-semibold mb-2">
          Ready for Your Mock Interview?
        </h1>
        <p className="opacity-90 max-w-lg mx-auto text-sm">
          You’ll go through 9 realistic AI-generated questions tailored to your
          selected job title.
        </p>
        <p className="text-xs italic opacity-60 mt-2">
          SelfMock may make mistakes; verify key information.
        </p>
      </div>

      {!processing ? (
        <form
          onSubmit={handleStart}
          className="rounded-xl border shadow-md p-6 bg-[var(--color-bg-panel)]"
        >
          <h3 className="text-lg font-semibold mb-4 text-[var(--color-primary)]">
            Customize Your Interview
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Job Title *</label>
              <input
                type="text"
                name="job_title"
                value={form.job_title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded-md border bg-transparent focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>

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
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Difficulty Level</label>
              <select
                name="difficulty"
                value={form.difficulty}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-[var(--color-primary)] appearance-none bg-[var(--color-bg-panel)] text-[var(--color-text-main)]"
              >
                <option className="bg-[var(--color-bg-panel)]">Easy</option>
                <option className="bg-[var(--color-bg-panel)]">Medium</option>
                <option className="bg-[var(--color-bg-panel)]">Hard</option>
              </select>
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
        <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-6 text-[var(--color-text-main)] font-medium">
              Preparing your personalized AI interview...
            </p>
            <p className="text-sm text-[var(--color-text-muted)] mt-2">
              This may take up to 30 seconds.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
