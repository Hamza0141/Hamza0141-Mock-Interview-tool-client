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
        status,
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
      <div
        className="text-center"
        style={{ padding: "5rem 0", color: "var(--color-text-muted)" }}
      >
        Loading user information...
      </div>
    );
  }

  if (!activeUser) {
    return (
      <div
        className="text-center"
        style={{ padding: "5rem 0", color: "#ef4444" }}
      >
        Could not load user data. Please log in again.
      </div>
    );
  }

  if (reportLoading) {
    return (
      <div
        className="text-center"
        style={{ padding: "5rem 0", color: "var(--color-text-muted)" }}
      >
        Fetching your interviews...
      </div>
    );
  }

  if (reportError) {
    return (
      <div
        className="text-center"
        style={{ padding: "5rem 0", color: "#ef4444" }}
      >
        {reportError}
      </div>
    );
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
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      {/* ===== HEADER ===== */}
      <section className="mb-4 position-relative overflow-hidden">
        <div
          className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-4 rounded-3 shadow border p-4 p-md-5"
          style={{
            background:
              "linear-gradient(135deg, var(--color-primary) 30%, #4b6cb7)",
            color: "#ffffff",
            borderColor: "rgba(255,255,255,0.3)",
          }}
        >
          {/* User Info */}
          <div className="d-flex align-items-center gap-3">
            <img
              src={
                activeUser.profile_url
                  ? `${import.meta.env.VITE_API_IMG_URL}${
                      activeUser.profile_url
                    }`
                  : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="Profile"
              style={{
                width: "5rem",
                height: "5rem",
                borderRadius: "999px",
                border: "4px solid rgba(255,255,255,0.4)",
                objectFit: "cover",
              }}
            />
            <div>
              <h1 className="mb-1 d-flex align-items-center gap-2">
                <Brain size={24} style={{ color: "#fde68a" }} />
                <span className="fw-bold" style={{ fontSize: "1.5rem" }}>
                  Welcome back, {activeUser.first_name} 👋
                </span>
              </h1>
              <p className="mb-0" style={{ fontSize: "0.9rem", opacity: 0.9 }}>
                Boost your confidence through AI-powered mock interviews and
                speech practice.
              </p>
            </div>
          </div>

          {/* Credit Info */}
          <div
            className="mt-3 mt-md-0 shadow-sm"
            style={{
              fontSize: "0.9rem",
              backgroundColor: "rgba(255,255,255,0.1)",
              padding: "0.75rem 1rem",
              borderRadius: "0.75rem",
              backdropFilter: "blur(6px)",
            }}
          >
            <p className="mb-1">
              💰 Credits:{" "}
              <span className="fw-semibold">{activeUser.credit_balance}</span>
            </p>
            {activeUser?.free_trial == 1 && (
              <p className="mb-0">
                🎟️ Free Trial:{" "}
                <span className="fw-semibold" style={{ color: "#bbf7d0" }}>
                  Available
                </span>
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ===== INTERVIEW PRACTICE SECTION ===== */}
      <div className="container" style={{ maxWidth: "72rem" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2
            className="d-flex align-items-center gap-2 mb-0"
            style={{
              fontSize: "1.25rem",
              fontWeight: 600,
              color: "var(--color-text-main)",
            }}
          >
            <Briefcase size={20} style={{ color: "var(--color-primary)" }} />
            Interview Practice
          </h2>
          <button
            type="button"
            onClick={handleStartInterview}
            className="btn"
            style={{
              padding: "0.4rem 1rem",
              borderRadius: "0.5rem",
              backgroundColor: "var(--color-primary)",
              color: "#ffffff",
              fontWeight: 500,
              boxShadow: "0 0.25rem 0.5rem rgba(0,0,0,0.25)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = 0.9;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = 1;
            }}
          >
            + Start New Interview
          </button>
        </div>

        {sessions.length === 0 ? (
          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "0.9rem",
            }}
          >
            You haven’t started any interviews yet. Click “Start New Interview”
            to begin.
          </p>
        ) : (
          <div className="row g-3 mb-4">
            {sessions.map((s) => (
              <div className="col-12 col-sm-6 col-lg-4" key={s.interview_id}>
                <Link to="/reports" className="text-decoration-none">
                  <div
                    className="h-100 rounded-3 shadow border p-4"
                    style={{
                      cursor: "pointer",
                      backgroundColor: "var(--color-bg-panel)",
                      borderColor: "var(--color-border)",
                      transition: "box-shadow 0.15s ease-in-out",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 0.6rem 1rem rgba(0,0,0,0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 0.25rem 0.5rem rgba(0,0,0,0.2)";
                    }}
                  >
                    <h3
                      className="mb-1 fw-semibold"
                      style={{ color: "var(--color-text-main)" }}
                    >
                      {s.job_title}
                    </h3>
                    <p
                      className="mb-1"
                      style={{
                        fontSize: "0.9rem",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      Difficulty:{" "}
                      <span className="text-capitalize">{s.difficulty}</span>
                    </p>
                    <p
                      className="mb-2"
                      style={{
                        fontSize: "0.9rem",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      Status:{" "}
                      <span className="text-capitalize">{s.status}</span>
                    </p>
                    <div
                      className="d-flex justify-content-between"
                      style={{ fontSize: "0.75rem", opacity: 0.7 }}
                    >
                      <span>
                        {s.created_at
                          ? new Date(s.created_at).toLocaleString()
                          : "—"}
                      </span>
                      <span>Score: {s.score ?? "N/A"}%</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== SPEECH PRACTICE SECTION ===== */}
      <div
        className="mt-4"
        style={{
          borderTop: "1px solid var(--color-border)",
          paddingTop: "2rem",
        }}
      >
        <div className="container" style={{ maxWidth: "72rem" }}>
          <h2
            className="d-flex align-items-center gap-2 mb-2"
            style={{
              fontSize: "1.25rem",
              fontWeight: 600,
              color: "var(--color-text-main)",
            }}
          >
            <Mic size={20} style={{ color: "var(--color-primary)" }} />
            Speech Practice
          </h2>
          <p
            className="mb-3"
            style={{
              fontSize: "0.9rem",
              color: "var(--color-text-muted)",
              maxWidth: "32rem",
            }}
          >
            Practice delivering impactful speeches. Receive detailed AI-based
            feedback on tone, clarity, and confidence.
          </p>

          <button
            type="button"
            className="btn mb-2"
            onClick={handleStartSpeech}
            style={{
              padding: "0.4rem 1rem",
              borderRadius: "0.5rem",
              backgroundImage:
                "linear-gradient(to right, var(--color-primary), #3b82f6)",
              color: "#ffffff",
              fontWeight: 500,
              boxShadow: "0 0.25rem 0.5rem rgba(0,0,0,0.25)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = 0.9;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = 1;
            }}
          >
            🎙️ Go to Speech Practice
          </button>

          {speechSessions?.length > 0 && (
            <div className="row g-3 mt-3">
              {speechSessions.map((s) => (
                <div className="col-12 col-sm-6 col-lg-4" key={s.speech_id}>
                  <Link to="/reports" className="text-decoration-none">
                    <div
                      className="h-100 rounded-3 shadow border p-4"
                      style={{
                        backgroundColor: "var(--color-bg-panel)",
                        borderColor: "var(--color-border)",
                        transition: "box-shadow 0.15s ease-in-out",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow =
                          "0 0.6rem 1rem rgba(0,0,0,0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow =
                          "0 0.25rem 0.5rem rgba(0,0,0,0.2)";
                      }}
                    >
                      <h4
                        className="mb-1 fw-semibold"
                        style={{
                          color: "var(--color-text-main)",
                        }}
                      >
                        {s.speech_title}
                      </h4>
                      <p
                        className="mb-2"
                        style={{
                          fontSize: "0.9rem",
                          color: "var(--color-text-muted)",
                        }}
                      >
                        Status: {s.status || "AI feedback coming soon"}
                      </p>
                      <div
                        className="d-flex justify-content-between"
                        style={{ fontSize: "0.75rem", opacity: 0.7 }}
                      >
                        <span>
                          {s.created_at
                            ? new Date(s.created_at).toLocaleString()
                            : "—"}
                        </span>
                        <span>Score: {s.score ?? "N/A"}%</span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}