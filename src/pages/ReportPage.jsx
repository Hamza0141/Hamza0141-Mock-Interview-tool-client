import { useEffect, useMemo } from "react";
import { fetchUserReport } from "../features/report/reportSlice";
import { useNavigate } from "react-router-dom";
import { Loader2, TrendingUp, BookOpen, Clock, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getUserById } from "../features/user/userSlice";

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

export default function ReportPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user } = useAppSelector((state) => state.user);
  const {
    data: report,
    loading,
    error,
  } = useAppSelector((state) => state.report);

  // fetch user once
  useEffect(() => {
    dispatch(getUserById());
  }, [dispatch]);

  // fetch report when user is known
  useEffect(() => {
    if (user?.profile_id) {
      dispatch(fetchUserReport(user.profile_id));
    }
  }, [dispatch, user?.profile_id]);

  // ---- Safe unwrapping with defaults (must be BEFORE early returns) ----
  const safeData = report?.data ?? report ?? {};
  const performanceComparison = safeData?.performanceComparison ?? {
    interviews: { avgScore: 0, count: 0 },
    speeches: { avgScore: 0, count: 0 },
  };
  const recent = Array.isArray(safeData?.recent) ? safeData.recent : [];

  // Precompute cards safely (also BEFORE early returns)
  const cards = useMemo(
    () => [
      {
        title: "Interviews",
        icon: <BarChart3 size={20} />,
        color: "#f39228",
        avg: safeNum(performanceComparison?.interviews?.avgScore),
        count: safeNum(performanceComparison?.interviews?.count),
      },
      {
        title: "Public Speeches",
        icon: <BookOpen size={20} />,
        color: "#f39228",
        avg: safeNum(performanceComparison?.speeches?.avgScore),
        count: safeNum(performanceComparison?.speeches?.count),
      },
    ],
    [performanceComparison]
  );

  // ---- Early returns AFTER all hooks ----
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <Loader2
          className="animate-spin text-[var(--color-primary)]"
          size={36}
        />
        <p className="mt-3 text-[var(--color-text-muted)] text-sm">
          Fetching your AI performance summary...
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

  // ---- Main render ----
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* ===== Header Section ===== */}
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-[var(--color-primary)]">
          AI Interview & Speech Report
        </h1>
        <p className="text-[var(--color-text-muted)] mt-2 text-sm">
          Your overall performance summary across completed interviews and
          public speeches.
        </p>
      </div>

      {/* ===== Comparison Summary ===== */}
      <div className="grid md:grid-cols-2 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            whileHover={{
              scale: 1.04,
              borderColor: card.color,
              boxShadow: `0 0 15px ${card.color}40`,
            }}
            transition={{ duration: 0.4 }}
            className="p-6 rounded-xl border shadow-sm bg-[var(--color-bg-panel)] text-center transition-all"
          >
            <div className="flex justify-center items-center gap-2 text-[var(--color-primary)] mb-2">
              {card.icon}
              <h3 className="font-semibold">{card.title}</h3>
            </div>
            <p className="text-4xl font-bold" style={{ color: card.color }}>
              {safeRoundPercent(card.avg)}
            </p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              {safeNum(card.count)} {card.title.toLowerCase()} recorded
            </p>
          </motion.div>
        ))}
      </div>

      {/* ===== Recent Activities ===== */}
      <div>
        <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-4">
          Recent Activities
        </h2>

        {recent.length === 0 ? (
          <p className="text-[var(--color-text-muted)] italic">
            You haven’t completed any sessions yet.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recent.map((raw, idx) => {
              const item = {
                id: raw?.id ?? `item-${idx}`,
                type: raw?.type ?? "interview",
                title: raw?.title ?? "Untitled",
                status: raw?.status ?? "active",
                started_at: raw?.started_at ?? null,
                average_score: safeNum(raw?.average_score),
                metrics:
                  raw?.metrics && typeof raw.metrics === "object"
                    ? raw.metrics
                    : { note: "awaiting evaluation" },
                skills: Array.isArray(raw?.skills) ? raw.skills : [],
                difficulty:
                  raw?.type === "interview" && raw?.difficulty
                    ? String(raw.difficulty)
                    : null,
              };

              const isPending = item.metrics?.note || item.average_score === 0;
              const accent = "#f39228";
              const difficultyLabel = item.difficulty
                ? item.difficulty.toUpperCase()
                : "—";

              const metricEntries = Object.entries(item.metrics || {}).filter(
                ([k, v]) =>
                  k !== "overall" && typeof v === "number" && Number.isFinite(v)
              );

              return (
                <motion.div
                  key={item.id}
                  whileHover={{
                    scale: 1.05,
                    borderColor: accent,
                    boxShadow: `0 0 20px ${accent}50`,
                  }}
                  transition={{ duration: 0.4 }}
                  className={`p-5 rounded-xl border bg-[var(--color-bg-card)] transition-all cursor-pointer relative ${
                    isPending ? "opacity-70" : "opacity-100"
                  }`}
                  onClick={() =>
                    navigate(
                      item.type === "speech"
                        ? `/speech/${item.id}`
                        : `/evaluation/${item.id}`
                    )
                  }
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-[var(--color-primary)] leading-snug">
                      {item.title}
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        item.status === "completed"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                    <Clock size={12} />
                    <span>
                      {fmtDate(item.started_at)} • {difficultyLabel}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <TrendingUp
                      size={16}
                      className="text-[var(--color-primary)]"
                    />
                    <p className="font-semibold" style={{ color: accent }}>
                      {item.average_score > 0
                        ? `${Math.round(item.average_score)}%`
                        : "Awaiting Evaluation"}
                    </p>
                  </div>

                  {metricEntries.length > 0 && !item.metrics?.note && (
                    <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-[var(--color-text-muted)]">
                      {metricEntries.slice(0, 3).map(([k, v], i) => (
                        <div
                          key={i}
                          className="bg-[var(--color-bg-panel)] rounded-md py-1 text-center hover:shadow-md transition-all"
                        >
                          <p className="font-medium" style={{ color: accent }}>
                            {Math.round(v)}%
                          </p>
                          <p className="text-[10px] uppercase opacity-70">
                            {k}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {item.skills.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {item.skills.slice(0, 4).map((skill, i) => (
                        <span
                          key={`${item.id}-skill-${i}`}
                          className="text-[10px] px-2 py-1 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-full text-[var(--color-primary)]"
                        >
                          {String(skill)}
                        </span>
                      ))}
                      {item.skills.length > 4 && (
                        <span className="text-[10px] italic text-[var(--color-text-muted)]">
                          +{item.skills.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
