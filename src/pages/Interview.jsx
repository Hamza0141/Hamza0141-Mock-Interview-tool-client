import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Brain, Briefcase, Mic } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getUserById } from "../features/user/userSlice";
import { fetchUserReport } from "../features/report/reportSlice";

export default function InterviewPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // match ReportPage shape
  const { user, status: userStatus } = useAppSelector((s) => s.user);
  const {
    data: report, // same as ReportPage
    loading: reportLoading,
    error: reportError,
  } = useAppSelector((s) => s.report);

  const storedUser = localStorage.getItem("user_data");
  const activeUser = user || (storedUser ? JSON.parse(storedUser) : null);

  // fetch user once
useEffect(() => {
  dispatch(getUserById());
}, [dispatch]);

  // fetch report after user known
useEffect(() => {
  if (user?.profile_id) {
    dispatch(fetchUserReport(user.profile_id));
  }
}, [dispatch, user?.profile_id]);

  // derive recent with a safe fallback for either shape:
  const recent =
    report?.data?.recent ?? // your working ReportPage path
    report?.data?.data?.recent ?? // extra-nested fallback (per JSON you pasted)
    [];

  // normalize to interviews (sessions) & speeches
  const sessions = recent
    .filter((it) => it?.type === "interview")
    .map((it) => ({
      interview_id: it.id,
      job_title: it.title,
      difficulty: it.difficulty,
      status: it.status,
      created_at: it.started_at,
      ended_at: it.ended_at,
      score:
        typeof it.average_score === "number"
          ? Math.round(it.average_score)
          : null,
    }));

const speechSessions = recent
  .filter((it) => it?.type === "speech")
  .map((it) => {
    const metrics =
      it && typeof it.metrics === "object" && it.metrics !== null
        ? it.metrics
        : {};

    // derive feedback text (summary or note)
    const feedbackText =
      metrics.summary ??
      metrics.note ??
      (typeof it.metrics === "string" ? it.metrics : null) ??
      "";

    // derive status based on available fields
    const status =
      it.status === "completed"
        ? "completed"
        : it.status === "pending"
        ? "pending"
        : metrics.note
        ? "pending"
        : metrics.summary
        ? "completed"
        : "pending";

    return {
      speech_id: it.id,
      speech_title: it.title ?? "Untitled speech",
      feedback: feedbackText, // raw feedback (may be empty if pending)
      status, // <— HERE is your status value
      score:
        typeof it.average_score === "number"
          ? Math.round(it.average_score)
          : null,
      created_at: it.started_at,
    };
  });

  // Loading / error states
  if (userStatus === "loading" && !activeUser) {
    return (
      <div className="text-center py-20 text-[var(--color-text-muted)]">
        Loading user information...
      </div>
    );
  }

  if (!activeUser) {
    return (
      <div className="text-center py-20 text-red-500">
        Could not load user data. Please log in again.
      </div>
    );
  }

  if (reportLoading) {
    return (
      <div className="text-center py-20 text-[var(--color-text-muted)]">
        Fetching your interviews...
      </div>
    );
  }

  if (reportError) {
    return <div className="text-center py-20 text-red-500">{reportError}</div>;
  }

  const requireCreditsAndNavigate = (targetPath) => (e) => {
    e.preventDefault();
    // 1) Must be logged in
    if (!activeUser) {
      navigate("/login");
      return;
    }
    // 2) Check credits / free trial
    const credits = activeUser?.credit_balance ?? 0;
    const trial = activeUser?.free_trial ?? 0;
    if (credits <= 0 && trial <= 0) {
      navigate("/pricing");
    } else {
      navigate(targetPath);
    }
  };
  // interview button handler
  const handleStartInterview = requireCreditsAndNavigate(
    "/interview/interviewSetup"
  );
  // speech button handler
  const handleStartSpeech = requireCreditsAndNavigate("/speech/setup");

  console.log(recent);
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
                {activeUser.credit_balance }
              </span>
            </p>
              {activeUser?.free_trial == 1 && (
            <p>
              🎟️ Free Trial:{" "}
                <span className="text-green-300 font-semibold">Available</span>
            </p>
              ) }
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
              <Link to="/reports">
                <div
                  key={s.interview_id}
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
                    Difficulty:{" "}
                    <span className="capitalize">{s.difficulty}</span>
                  </p>
                  <p className="text-sm text-[var(--color-text-muted)] mb-2">
                    Status: <span className="capitalize">{s.status}</span>
                  </p>
                  <div className="flex justify-between text-xs opacity-70">
                    <span>
                      {s.created_at
                        ? new Date(s.created_at).toLocaleString()
                        : "—"}
                    </span>
                    <span>Score: {s.score ?? "N/A"}%</span>
                  </div>
                </div>
              </Link>
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
          className="px-4 py-2 rounded-md bg-gradient-to-r from-[var(--color-primary)] to-blue-500 text-white font-medium shadow hover:opacity-90 transition"
          onClick={handleStartSpeech}
        >
          🎙️ Go to Speech Practice
        </button>

        {speechSessions?.length > 0 && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {speechSessions?.map((s) => (
              <Link to="/reports">
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
                    Status: {s.status || "AI feedback coming soon"}
                  </p>
                  <div className="flex justify-between text-xs opacity-70">
                    <span>
                      {s.created_at
                        ? new Date(s.created_at).toLocaleString()
                        : "—"}
                    </span>
                    <span>Score: {s.score ?? "N/A"}%</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
