import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, Briefcase, Mic } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getUserById } from "../features/user/userSlice";

export default function InterviewPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Redux store
  const { user, status } = useAppSelector((state) => state.user);

  // Fallback from localStorage while Redux initializes
  const storedUser = localStorage.getItem("user_data");
  const activeUser = user || (storedUser ? JSON.parse(storedUser) : null);




// console.log("user" + storedUser);
  // 🧩 Fetch fresh user data on mount (like Profile)
  useEffect(() => {
    if (!user) dispatch(getUserById());
  }, [dispatch, user]);

  const [sessions] = useState([
    {
      interview_id: "8f2a91cd",
      job_title: "Frontend Developer",
      difficulty: "hard",
      created_at: "2025-11-07",
      score: 88,
    },
    {
      interview_id: "b5a73e10",
      job_title: "IT Support Specialist",
      difficulty: "medium",
      created_at: "2025-11-05",
      score: 91,
    },
  ]);

  const [speechSessions] = useState([
    {
      speech_id: "sp1",
      speech_title: "The Power of Perseverance",
      feedback: "Strong tone and clear structure.",
      score: 87,
      created_at: "2025-11-01",
    },
  ]);

  // 🌀 Loading UI
  if (status === "loading" && !activeUser) {
    return (
      <div className="text-center py-20 text-[var(--color-text-muted)]">
        Loading user information...
      </div>
    );
  }

  // 🚫 If user still missing (unauthorized)
  if (!activeUser) {
    return (
      <div className="text-center py-20 text-red-500">
        Could not load user data. Please log in again.
      </div>
    );
  }
  const handleStartInterview = (e) => {
    e.preventDefault();
    if (!activeUser) {
      navigate("/login");
      return;
    }

    // Check credit and free trial
    const credits = activeUser?.credit_balance ?? 0;
    const trial = activeUser?.free_trial ?? 0;

    if (credits <= 0 && trial <= 0) {
      navigate("/pricing"); // redirect if no balance/trial
    } else {
      navigate("/interview/setup");
    }
  };

  return (
    <div className="min-h-screen">
      {/* ===== HEADER ===== */}
      <section className="relative overflow-hidden mb-10">
        <div
          className="p-8 rounded-xl shadow-md border flex flex-col md:flex-row justify-between items-center gap-6"
          style={{
            background:
              "linear-gradient(135deg, var(--color-primary) 30%, #4b6cb7)",
            color: "#fff",
          }}
        >
          {/* User Info */}
          <div className="flex items-center gap-4">
            <img
              src={
                activeUser.profile_url
                  ? `${import.meta.env.VITE_API_IMG_URL}${
                      activeUser.profile_url
                    }`
                  : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="Profile"
              className="w-20 h-20 rounded-full border-4 border-white/40 object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Brain size={24} className="text-yellow-300" />
                Welcome back, {activeUser.first_name} 👋
              </h1>
              <p className="text-sm opacity-90">
                Boost your confidence through AI-powered mock interviews and
                speech practice.
              </p>
            </div>
          </div>

          {/* Credit Info */}
          <div className="text-sm mt-4 md:mt-0 bg-white/10 p-3 rounded-lg shadow-md backdrop-blur-sm">
            <p>
              💰 Credits:{" "}
              <span className="font-semibold">
                {activeUser.credit_balance ?? 0}
              </span>
            </p>
            <p>
              🎟️ Free Trial:{" "}
              {activeUser.free_trial > 0 ? (
                <span className="text-green-300 font-semibold">Available</span>
              ) : (
                <span className="text-red-300">Used</span>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ===== INTERVIEW PRACTICE SECTION ===== */}
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-[var(--color-text-main)] flex items-center gap-2">
            <Briefcase className="text-[var(--color-primary)]" size={20} />
            Interview Practice
          </h2>
          <button
            onClick={handleStartInterview}
            className="px-4 py-2 rounded-md bg-[var(--color-primary)] text-white font-medium shadow hover:opacity-90 transition"
          >
            + Start New Interview
          </button>
        </div>

        {sessions.length === 0 ? (
          <p className="text-[var(--color-text-muted)]">
            You haven’t started any interviews yet. Click “Start New Interview”
            to begin.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sessions.map((s) => (
              <div
                key={s.interview_id}
                onClick={() => navigate(`/interview/${s.interview_id}`)}
                className="p-5 rounded-xl shadow-md border hover:shadow-lg transition cursor-pointer"
                style={{
                  backgroundColor: "var(--color-bg-panel)",
                  borderColor: "var(--color-border)",
                }}
              >
                <h3 className="font-semibold text-[var(--color-text-main)] mb-1">
                  {s.job_title}
                </h3>
                <p className="text-sm text-[var(--color-text-muted)] mb-2">
                  Difficulty: <span className="capitalize">{s.difficulty}</span>
                </p>
                <div className="flex justify-between text-xs opacity-70">
                  <span>{s.created_at}</span>
                  <span>Score: {s.score}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== SPEECH PRACTICE SECTION ===== */}
      <div className="p-6 max-w-6xl mx-auto mt-12 border-t border-[var(--color-border)]">
        <h2 className="text-xl font-semibold text-[var(--color-text-main)] flex items-center gap-2 mb-4">
          <Mic className="text-[var(--color-primary)]" size={20} />
          Speech Practice
        </h2>
        <p className="text-sm text-[var(--color-text-muted)] mb-4 max-w-xl">
          Practice delivering impactful speeches. Receive detailed AI-based
          feedback on tone, clarity, and confidence.
        </p>

        <button
          onClick={() => navigate("/speech")}
          className="px-4 py-2 rounded-md bg-gradient-to-r from-[var(--color-primary)] to-blue-500 text-white font-medium shadow hover:opacity-90 transition"
        >
          🎙️ Go to Speech Evaluation
        </button>

        {speechSessions.length > 0 && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {speechSessions.map((s) => (
              <div
                key={s.speech_id}
                className="p-5 rounded-xl shadow-md border hover:shadow-lg transition"
                style={{
                  backgroundColor: "var(--color-bg-panel)",
                  borderColor: "var(--color-border)",
                }}
              >
                <h3 className="font-semibold text-[var(--color-text-main)] mb-1">
                  {s.speech_title}
                </h3>
                <p className="text-sm text-[var(--color-text-muted)] mb-2">
                  {s.feedback}
                </p>
                <div className="flex justify-between text-xs opacity-70">
                  <span>{s.created_at}</span>
                  <span>Score: {s.score}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
