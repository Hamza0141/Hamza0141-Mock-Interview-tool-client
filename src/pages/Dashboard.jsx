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
  if (status === "completed")
    return "bg-green-500/15 text-green-400 border border-green-500/30";
  if (status === "active")
    return "bg-yellow-500/15 text-yellow-300 border border-yellow-500/30";
  return "bg-gray-500/10 text-gray-300 border border-gray-500/30";
}

function LoaderSpinner() {
  return (
    <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
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
      className="rounded-xl border bg-[var(--color-bg-panel)] p-4 flex flex-col gap-2 transition-all"
    >
      <div className="flex items-center gap-2 text-[var(--color-text-muted)] text-xs">
        <span className="p-1.5 rounded-full bg-black/30 flex items-center justify-center">
          {icon}
        </span>
        <span>{label}</span>
      </div>
      <div className="text-lg font-semibold" style={{ color: accent }}>
        {value}
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
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <LoaderSpinner />
        <p className="mt-3 text-[var(--color-text-muted)] text-sm">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="text-center py-20 text-[var(--color-text-muted)]">
        {error || "No performance data available yet."}
      </div>
    );
  }

  // ---- Safe unwrapping with defaults (same pattern as ReportPage) ----
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

  // Convert → sorted → take 5 only
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
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* ===== Top Header ===== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Brain className="text-[var(--color-primary)]" size={24} />
            <h1 className="text-2xl font-semibold text-[var(--color-text-main)]">
              Welcome back, {firstName} 👋
            </h1>
          </div>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Here’s an overview of your latest mock interviews and public
            speeches.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-xs bg-[var(--color-bg-panel)] border border-[var(--color-border)] rounded-lg px-4 py-2">
            <p className="text-[var(--color-text-muted)]">Credits</p>
            <p className="text-lg font-semibold">{user?.credit_balance ?? 0}</p>
          </div>
          {user?.free_trial == 1 && (
            <div className="text-xs bg-[var(--color-bg-panel)] border border-[var(--color-border)] rounded-lg px-4 py-2">
              <p className="text-[var(--color-text-muted)]">Free Trial</p>
              <p className="text-sm font-semibold">
                {user?.free_trial > 0 ? "Available" : "Used"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ===== Overview Cards ===== */}
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard
          icon={<BarChart3 size={18} />}
          label="Avg Interview Score"
          value={safeRoundPercent(interviewsAvg)}
          accent="#f39228"
        />
        <StatCard
          icon={<Mic size={18} />}
          label="Avg Speech Score"
          value={safeRoundPercent(speechesAvg)}
          accent="#4b6cb7"
        />
        <StatCard
          icon={<Activity size={18} />}
          label="Total Interviews"
          value={interviewsCount}
          accent="var(--color-primary)"
        />
        <StatCard
          icon={<Clock size={18} />}
          label="Total Speeches"
          value={speechesCount}
          accent="#4b6cb7"
        />
      </div>

      {/* ===== Middle: Trends + Skills ===== */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Trend chart */}
        <motion.div
          whileHover={{
            boxShadow: "0 0 20px rgba(243,146,40,0.25)",
            borderColor: "#f39228",
          }}
          className="lg:col-span-2 rounded-xl border bg-[var(--color-bg-panel)] p-5 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-[var(--color-primary)]" />
              <h2 className="font-semibold text-[var(--color-text-main)] text-sm">
                Performance Trend (Last {lastN.length || 0} Sessions)
              </h2>
            </div>
            <span className="text-xs text-[var(--color-text-muted)]">
              Based on your recent interviews & speeches
            </span>
          </div>

          {lastN.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)]">
              No sessions yet. Start an interview or speech to see your trend.
            </p>
          ) : (
            <>
              <div className="flex items-end gap-4 h-40">
                {trendLabels.map((label, index) => {
                  const intVal = interviewTrend[index];
                  const spVal = speechTrend[index];
                  const intHeight = (intVal / maxTrend) * 100;
                  const spHeight = (spVal / maxTrend) * 100;

                  return (
                    <div
                      key={`${label}-${index}`}
                      className="flex-1 flex flex-col gap-2"
                    >
                      <div className="flex gap-1 items-end h-28">
                        {/* Interview bar */}
                        <div className="flex-1 flex flex-col justify-end">
                          <div
                            className="w-full rounded-md bg-[var(--color-primary)]/80"
                            style={{ height: `${intHeight || 4}%` }}
                          ></div>
                          {intVal > 0 && (
                            <span className="text-[10px] mt-1 text-[var(--color-text-muted)]">
                              {Math.round(intVal)}%
                            </span>
                          )}
                        </div>
                        {/* Speech bar */}
                        <div className="flex-1 flex flex-col justify-end">
                          <div
                            className="w-full rounded-md bg-blue-500/80"
                            style={{ height: `${spHeight || 4}%` }}
                          ></div>
                          {spVal > 0 && (
                            <span className="text-[10px] mt-1 text-[var(--color-text-muted)]">
                              {Math.round(spVal)}%
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-[10px] text-center text-[var(--color-text-muted)]">
                        {label}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center justify-between text-[10px] text-[var(--color-text-muted)]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[var(--color-primary)]/80" />
                  <span>Interviews</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500/80" />
                  <span>Speeches</span>
                </div>
              </div>
            </>
          )}
        </motion.div>

        {/* Skills card */}
        <motion.div
          whileHover={{
            boxShadow: "0 0 20px rgba(75,108,183,0.25)",
            borderColor: "#4b6cb7",
          }}
          className="rounded-xl border bg-[var(--color-bg-panel)] p-5 transition-all"
        >
          <div className="flex items-center gap-2 mb-4">
            <Star size={18} className="text-yellow-400" />
            <h2 className="font-semibold text-[var(--color-text-main)] text-sm">
              Strengths Snapshot
            </h2>
          </div>

          {topFive.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)]">
              Complete interviews to see your earned skills here.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {topFive.map((skill) => (
                <div
                  key={skill.name}
                  className="px-3 py-1.5 rounded-full border border-[var(--color-primary)]/25 bg-[var(--color-primary)]/10 flex items-center gap-2"
                >
                  <span className="text-xs font-medium text-[var(--color-primary)]">
                    {skill.name}
                  </span>
                  <span className="text-[10px] text-[var(--color-text-muted)]">
                    {skill.count}
                  </span>
                </div>
              ))}

              {/* More badge */}
              {remainingCount > 0 && (
                <div className="px-3 py-1.5 rounded-full border border-[var(--color-primary)]/10 bg-black/10 text-[var(--color-text-muted)] text-xs">
                  +{remainingCount} more
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* ===== Recent Activity ===== */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[var(--color-text-main)] flex items-center gap-2">
            <Clock size={16} className="text-[var(--color-primary)]" />
            Recent Activity
          </h2>
          <button
            onClick={() => navigate("/reports")}
            className="flex items-center gap-1 text-[11px] text-[var(--color-primary)] hover:underline"
          >
            View full report
            <ArrowRight size={12} />
          </button>
        </div>

        {recentCards.length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)]">
            No recent sessions yet.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentCards.map((item) => (
              <motion.div
                key={item.id}
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
                className="p-4 rounded-lg border bg-[var(--color-bg-panel)] cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)] flex items-center gap-1">
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
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${statusBadge(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="text-sm font-semibold text-[var(--color-text-main)] line-clamp-2">
                  {item.title}
                </p>
                <p className="text-[11px] text-[var(--color-text-muted)] mt-1">
                  {fmtDate(item.date)}{" "}
                  {item.difficulty
                    ? `• ${String(item.difficulty).toUpperCase()}`
                    : null}
                </p>
                <div className="flex items-center justify-between mt-3 text-[11px] text-[var(--color-text-muted)]">
                  <span>
                    Score:{" "}
                    {typeof item.score === "number" ? `${item.score}%` : "N/A"}
                  </span>
                  <span className="flex items-center gap-1 text-[var(--color-primary)]">
                    View details <ArrowRight size={12} />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
