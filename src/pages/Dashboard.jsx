// src/pages/DashboardPage.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  BarChart3,
  Mic,
  Clock,
  TrendingUp,
  Star,
  ArrowRight,
  Activity,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchUserReport } from "../features/report/reportSlice";
import { getUserById } from "../features/user/userSlice";

// ---------- helpers ----------
function fmtDate(d) {
  try {
    if (!d) return "—";
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return "—";
    return dt.toLocaleDateString();
  } catch {
    return "—";
  }
}

function safeNum(n) {
  const v = Number(n);
  return Number.isFinite(v) ? v : 0;
}

function safeRoundPercent(n) {
  const v = safeNum(n);
  return v > 0 ? `${Math.round(v)}%` : "—";
}

function statusBadge(status) {
  if (status === "completed") {
    return "badge rounded-pill bg-success text-light";
  }
  if (status === "active") {
    return "badge rounded-pill bg-warning text-dark";
  }
  return "badge rounded-pill bg-secondary text-light";
}

function LoaderSpinner() {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: "80vh" }}
    >
      <div
        className="spinner-border"
        role="status"
        style={{ color: "var(--color-primary)" }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3 small" style={{ color: "var(--color-text-muted)" }}>
        Loading your dashboard...
      </p>
    </div>
  );
}

// small stat card component
function StatCard({ icon, label, value, accent }) {
  return (
    <motion.div
      whileHover={{
        y: -4,
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        borderColor: accent || "var(--color-border)",
      }}
      className="card h-100"
      style={{
        backgroundColor: "var(--color-bg-panel)",
        borderColor: "var(--color-border)",
        borderWidth: "1px",
        borderStyle: "solid",
      }}
    >
      <div className="card-body d-flex flex-column gap-2">
        <div
          className="d-flex align-items-center gap-2 small"
          style={{ color: "var(--color-text-muted)" }}
        >
          <span
            className="d-flex align-items-center justify-content-center rounded-circle"
            style={{
              padding: "0.35rem",
              backgroundColor: "rgba(0,0,0,0.12)",
            }}
          >
            {icon}
          </span>
          <span>{label}</span>
        </div>
        <div className="fs-5 fw-semibold" style={{ color: accent }}>
          {value}
        </div>
      </div>
    </motion.div>
  );
}

// ---------- main page ----------
export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user } = useAppSelector((s) => s.user);
  const { data: report, loading, error } = useAppSelector((s) => s.report);

  // fetch user once
  useEffect(() => {
    dispatch(getUserById());
  }, [dispatch]);

  // fetch report when we know the user
  useEffect(() => {
    if (user?.profile_id) {
      dispatch(fetchUserReport(user.profile_id));
    }
  }, [dispatch, user?.profile_id]);

  if (loading) {
    return <LoaderSpinner />;
  }

  if (error || !report) {
    return (
      <div className="container py-5 text-center">
        <p style={{ color: "var(--color-text-muted)" }}>
          {error || "No performance data available yet."}
        </p>
      </div>
    );
  }

  // ---- Safe unwrapping with defaults ----
  const safeData = report?.data ?? report ?? {};
  const performanceComparison = safeData?.performanceComparison ?? {
    interviews: { avgScore: 0, count: 0 },
    speeches: { avgScore: 0, count: 0 },
  };
  const recent = Array.isArray(safeData?.recent) ? safeData.recent : [];

  // ---- overview values ----
  const interviewsAvg = safeNum(performanceComparison?.interviews?.avgScore);
  const interviewsCount = safeNum(performanceComparison?.interviews?.count);
  const speechesAvg = safeNum(performanceComparison?.speeches?.avgScore);
  const speechesCount = safeNum(performanceComparison?.speeches?.count);

  // ---- trend data (last 5 sessions) ----
  const lastN = recent.slice(0, 5);
  const interviewTrend = lastN.map((item) =>
    item.type === "interview" ? safeNum(item.average_score) : 0
  );
  const speechTrend = lastN.map((item) =>
    item.type === "speech" ? safeNum(item.average_score) : 0
  );
  const trendLabels = lastN.map((item, idx) => {
    const labelDate = fmtDate(item.started_at);
    return labelDate !== "—" ? labelDate : `#${idx + 1}`;
  });
  const maxTrend = Math.max(100, ...interviewTrend, ...speechTrend);

  // ---- skills snapshot from recent interview.skills ----
  const skillCounts = {};
  recent
    .filter((it) => it.type === "interview" && Array.isArray(it.skills))
    .forEach((it) => {
      it.skills.forEach((skill) => {
        const key = String(skill);
        skillCounts[key] = (skillCounts[key] || 0) + 1;
      });
    });

  const sortedSkills = Object.entries(skillCounts).sort((a, b) => b[1] - a[1]);
  const topFive = sortedSkills.slice(0, 5).map(([name, count]) => ({
    name,
    count,
  }));
  const remainingCount = Math.max(sortedSkills.length - 5, 0);

  // ---- recent cards ----
  const recentCards = lastN.map((item) => ({
    id: item.id,
    type: item.type,
    title:
      item.title || (item.type === "speech" ? "Speech session" : "Interview"),
    status: item.status || "completed",
    score:
      typeof item.average_score === "number"
        ? Math.round(item.average_score)
        : null,
    date: item.started_at,
    difficulty: item.type === "interview" ? item.difficulty : null,
  }));

  const firstName = user?.first_name || "There";

  return (
    <div className="container py-4">
      {/* ===== Top Header ===== */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-md-between gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2">
            <Brain size={24} style={{ color: "var(--color-primary)" }} />
            <h1
              className="h4 mb-0 fw-semibold"
              style={{ color: "var(--color-text-main)" }}
            >
              Welcome back, {firstName} 👋
            </h1>
          </div>
          <p
            className="small mt-1 mb-0"
            style={{ color: "var(--color-text-muted)" }}
          >
            Here’s an overview of your latest mock interviews and public
            speeches.
          </p>
        </div>

        <div className="d-flex align-items-center gap-3">
          <div
            className="small px-3 py-2 rounded-3 border"
            style={{
              backgroundColor: "var(--color-bg-panel)",
              borderColor: "var(--color-border)",
            }}
          >
            <p
              className="mb-0"
              style={{ color: "var(--color-text-muted)", fontSize: "11px" }}
            >
              Credits
            </p>
            <p
              className="mb-0 fs-5 fw-semibold"
              style={{ color: "var(--color-text-main)" }}
            >
              {user?.credit_balance ?? 0}
            </p>
          </div>
          {user?.free_trial == 1 && (
            <div
              className="small px-3 py-2 rounded-3 border"
              style={{
                backgroundColor: "var(--color-bg-panel)",
                borderColor: "var(--color-border)",
              }}
            >
              <p
                className="mb-0"
                style={{ color: "var(--color-text-muted)", fontSize: "11px" }}
              >
                Free Trial
              </p>
              <p
                className="mb-0 fw-semibold"
                style={{ color: "var(--color-text-main)" }}
              >
                {user?.free_trial > 0 ? "Available" : "Used"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ===== Overview Cards ===== */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-3">
          <StatCard
            icon={<BarChart3 size={18} />}
            label="Avg Interview Score"
            value={safeRoundPercent(interviewsAvg)}
            accent="#f39228"
          />
        </div>
        <div className="col-12 col-md-3">
          <StatCard
            icon={<Mic size={18} />}
            label="Avg Speech Score"
            value={safeRoundPercent(speechesAvg)}
            accent="#4b6cb7"
          />
        </div>
        <div className="col-12 col-md-3">
          <StatCard
            icon={<Activity size={18} />}
            label="Total Interviews"
            value={interviewsCount}
            accent="var(--color-primary)"
          />
        </div>
        <div className="col-12 col-md-3">
          <StatCard
            icon={<Clock size={18} />}
            label="Total Speeches"
            value={speechesCount}
            accent="#4b6cb7"
          />
        </div>
      </div>

      {/* ===== Middle: Trends + Skills ===== */}
      <div className="row g-4 mb-4">
        {/* Trend chart */}
        <div className="col-12 col-lg-8">
          <motion.div
            whileHover={{
              boxShadow: "0 0 20px rgba(243,146,40,0.25)",
              borderColor: "#f39228",
            }}
            className="h-100 rounded-3 p-4 border"
            style={{
              backgroundColor: "var(--color-bg-panel)",
              borderColor: "var(--color-border)",
            }}
          >
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="d-flex align-items-center gap-2">
                <TrendingUp
                  size={18}
                  style={{ color: "var(--color-primary)" }}
                />
                <h2
                  className="h6 mb-0 fw-semibold"
                  style={{ color: "var(--color-text-main)" }}
                >
                  Performance Trend (Last {lastN.length || 0} Sessions)
                </h2>
              </div>
              <span
                className="small"
                style={{ color: "var(--color-text-muted)" }}
              >
                Based on your recent interviews & speeches
              </span>
            </div>

            {lastN.length === 0 ? (
              <p
                className="small mb-0"
                style={{ color: "var(--color-text-muted)" }}
              >
                No sessions yet. Start an interview or speech to see your trend.
              </p>
            ) : (
              <>
                <div
                  className="d-flex align-items-end gap-3"
                  style={{ height: "10rem" }}
                >
                  {trendLabels.map((label, index) => {
                    const intVal = interviewTrend[index];
                    const spVal = speechTrend[index];
                    const intHeight = (intVal / maxTrend) * 100;
                    const spHeight = (spVal / maxTrend) * 100;

                    return (
                      <div
                        key={`${label}-${index}`}
                        className="d-flex flex-column gap-2 flex-grow-1"
                      >
                        <div
                          className="d-flex gap-1 align-items-end"
                          style={{ height: "7rem" }}
                        >
                          {/* Interview bar */}
                          <div className="d-flex flex-column justify-content-end flex-grow-1">
                            <div
                              className="w-100 rounded-2"
                              style={{
                                height: `${intHeight || 4}%`,
                                backgroundColor: "var(--color-primary)",
                              }}
                            />
                            {intVal > 0 && (
                              <span
                                className="mt-1"
                                style={{
                                  fontSize: "10px",
                                  color: "var(--color-text-muted)",
                                }}
                              >
                                {Math.round(intVal)}%
                              </span>
                            )}
                          </div>
                          {/* Speech bar */}
                          <div className="d-flex flex-column justify-content-end flex-grow-1">
                            <div
                              className="w-100 rounded-2"
                              style={{
                                height: `${spHeight || 4}%`,
                                backgroundColor: "rgba(59,130,246,0.8)",
                              }}
                            />
                            {spVal > 0 && (
                              <span
                                className="mt-1"
                                style={{
                                  fontSize: "10px",
                                  color: "var(--color-text-muted)",
                                }}
                              >
                                {Math.round(spVal)}%
                              </span>
                            )}
                          </div>
                        </div>
                        <p
                          className="text-center mb-0"
                          style={{
                            fontSize: "10px",
                            color: "var(--color-text-muted)",
                          }}
                        >
                          {label}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div
                  className="mt-3 d-flex align-items-center justify-content-between"
                  style={{
                    fontSize: "10px",
                    color: "var(--color-text-muted)",
                  }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <span
                      className="rounded-circle"
                      style={{
                        width: "0.75rem",
                        height: "0.75rem",
                        backgroundColor: "var(--color-primary)",
                      }}
                    />
                    <span>Interviews</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span
                      className="rounded-circle"
                      style={{
                        width: "0.75rem",
                        height: "0.75rem",
                        backgroundColor: "rgba(59,130,246,0.8)",
                      }}
                    />
                    <span>Speeches</span>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>

        {/* Skills card */}
        <div className="col-12 col-lg-4">
          <motion.div
            whileHover={{
              boxShadow: "0 0 20px rgba(75,108,183,0.25)",
              borderColor: "#4b6cb7",
            }}
            className="h-100 rounded-3 p-4 border"
            style={{
              backgroundColor: "var(--color-bg-panel)",
              borderColor: "var(--color-border)",
            }}
          >
            <div className="d-flex align-items-center gap-2 mb-3">
              <Star size={18} style={{ color: "#facc15" }} />
              <h2
                className="h6 mb-0 fw-semibold"
                style={{ color: "var(--color-text-main)" }}
              >
                Strengths Snapshot
              </h2>
            </div>

            {topFive.length === 0 ? (
              <p
                className="small mb-0"
                style={{ color: "var(--color-text-muted)" }}
              >
                Complete interviews to see your earned skills here.
              </p>
            ) : (
              <div className="d-flex flex-wrap gap-2">
                {topFive.map((skill) => (
                  <div
                    key={skill.name}
                    className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill border"
                    style={{
                      borderColor: "rgba(243,146,40,0.25)",
                      backgroundColor: "rgba(243,146,40,0.1)",
                    }}
                  >
                    <span
                      className="fw-medium"
                      style={{
                        fontSize: "12px",
                        color: "var(--color-primary)",
                      }}
                    >
                      {skill.name}
                    </span>
                    <span
                      style={{
                        fontSize: "10px",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      {skill.count}
                    </span>
                  </div>
                ))}

                {remainingCount > 0 && (
                  <div
                    className="px-3 py-1 rounded-pill border"
                    style={{
                      fontSize: "12px",
                      borderColor: "rgba(243,146,40,0.1)",
                      backgroundColor: "rgba(0,0,0,0.1)",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    +{remainingCount} more
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* ===== Recent Activity ===== */}
      <div>
        <div className="d-flex align-items-center justify-content-between mb-2">
          <h2
            className="h6 mb-0 fw-semibold d-flex align-items-center gap-2"
            style={{ color: "var(--color-text-main)" }}
          >
            <Clock size={16} style={{ color: "var(--color-primary)" }} />
            Recent Activity
          </h2>
          <button
            type="button"
            onClick={() => navigate("/reports")}
            className="btn btn-link p-0 d-flex align-items-center gap-1 text-decoration-none"
            style={{ fontSize: "11px", color: "var(--color-primary)" }}
          >
            View full report
            <ArrowRight size={12} />
          </button>
        </div>

        {recentCards.length === 0 ? (
          <p
            className="small mb-0"
            style={{ color: "var(--color-text-muted)" }}
          >
            No recent sessions yet.
          </p>
        ) : (
          <div className="row g-3">
            {recentCards.map((item) => (
              <div key={item.id} className="col-12 col-sm-6 col-lg-3">
                <motion.div
                  whileHover={{
                    scale: 1.03,
                    borderColor:
                      item.type === "interview"
                        ? "#f39228"
                        : "rgba(59,130,246,0.8)",
                    boxShadow:
                      item.type === "interview"
                        ? "0 0 16px rgba(243,146,40,0.3)"
                        : "0 0 16px rgba(59,130,246,0.3)",
                  }}
                  onClick={() =>
                    item.type === "interview"
                      ? navigate(`/evaluation/${item.id}`)
                      : navigate(`/speech/${item.id}`)
                  }
                  className="h-100 p-3 rounded-3 border"
                  style={{
                    backgroundColor: "var(--color-bg-panel)",
                    borderColor: "var(--color-border)",
                    cursor: "pointer",
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <span
                      className="text-uppercase d-flex align-items-center gap-1"
                      style={{
                        fontSize: "10px",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      {item.type === "interview" ? (
                        <>
                          <BarChart3 size={12} /> Interview
                        </>
                      ) : (
                        <>
                          <Mic size={12} /> Speech
                        </>
                      )}
                    </span>
                    <span className={statusBadge(item.status)}>
                      {item.status}
                    </span>
                  </div>
                  <p
                    className="mb-0 fw-semibold"
                    style={{
                      fontSize: "14px",
                      color: "var(--color-text-main)",
                    }}
                  >
                    {item.title}
                  </p>
                  <p
                    className="mt-1 mb-0"
                    style={{
                      fontSize: "11px",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    {fmtDate(item.date)}{" "}
                    {item.difficulty
                      ? `• ${String(item.difficulty).toUpperCase()}`
                      : null}
                  </p>
                  <div
                    className="d-flex align-items-center justify-content-between mt-3"
                    style={{
                      fontSize: "11px",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    <span>
                      Score:{" "}
                      {typeof item.score === "number"
                        ? `${item.score}%`
                        : "N/A"}
                    </span>
                    <span
                      className="d-flex align-items-center gap-1"
                      style={{ color: "var(--color-primary)" }}
                    >
                      View details <ArrowRight size={12} />
                    </span>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
