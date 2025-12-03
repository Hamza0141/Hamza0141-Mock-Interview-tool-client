import { useEffect, useMemo } from "react";
import { fetchUserReport } from "../features/report/reportSlice";
import { Link, useNavigate } from "react-router-dom";
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
      <div
        className="d-flex flex-column align-items-center justify-content-center text-center"
        style={{ minHeight: "80vh" }}
      >
        <Loader2
          size={36}
          className="mb-2"
          style={{ color: "var(--color-primary)" }}
        />
        <p
          className="mb-0"
          style={{
            marginTop: "0.75rem",
            fontSize: "0.9rem",
            color: "var(--color-text-muted)",
          }}
        >
          Fetching your AI performance summary...
        </p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div
        className="text-center"
        style={{
          padding: "5rem 0",
          color: "var(--color-text-muted)",
        }}
      >
        {error || "No performance data available yet."}
      </div>
    );
  }

  // ---- Main render ----
  return (
    <div
      className="container"
      style={{
        maxWidth: "72rem",
        paddingTop: "1.5rem",
        paddingBottom: "1.5rem",
      }}
    >
      {/* ===== Header Section ===== */}
      <div className="text-center mb-4">
        <h1
          className="fw-semibold"
          style={{
            fontSize: "1.9rem",
            color: "var(--color-primary)",
          }}
        >
          AI Interview &amp; Speech Report
        </h1>
        <p
          className="mb-0"
          style={{
            marginTop: "0.5rem",
            fontSize: "0.9rem",
            color: "var(--color-text-muted)",
          }}
        >
          Your overall performance summary across completed interviews and
          public speeches.
        </p>
      </div>

      {/* ===== Comparison Summary ===== */}
      <div className="row g-4 mb-4">
        {cards.map((card, i) => (
          <div className="col-12 col-md-6" key={i}>
            <motion.div
              whileHover={{
                scale: 1.04,
                borderColor: card.color,
                boxShadow: `0 0 15px ${card.color}40`,
              }}
              transition={{ duration: 0.4 }}
              className="h-100 text-center border rounded-4 shadow-sm"
              style={{
                padding: "1.5rem",
                backgroundColor: "var(--color-bg-panel)",
                borderColor: "var(--color-border)",
                transition: "all 0.2s ease-in-out",
              }}
            >
              <div
                className="d-flex justify-content-center align-items-center gap-2 mb-2"
                style={{ color: "var(--color-primary)" }}
              >
                {card.icon}
                <h3
                  className="mb-0 fw-semibold"
                  style={{ fontSize: "1rem" }}
                >
                  {card.title}
                </h3>
              </div>
              <p
                className="mb-1 fw-bold"
                style={{ fontSize: "2.2rem", color: card.color }}
              >
                {safeRoundPercent(card.avg)}
              </p>
              <p
                className="mb-0"
                style={{
                  fontSize: "0.8rem",
                  color: "var(--color-text-muted)",
                  marginTop: "0.3rem",
                }}
              >
                {safeNum(card.count)} {card.title.toLowerCase()} recorded
              </p>
            </motion.div>
          </div>
        ))}
      </div>

      {/* ===== Recent Activities ===== */}
      <div className="mb-3">
        <h2
          className="fw-semibold mb-3"
          style={{ fontSize: "1.25rem", color: "var(--color-primary)" }}
        >
          Recent Activities
        </h2>

        {recent.length === 0 ? (
          <p
            className="fst-italic mb-0"
            style={{ color: "var(--color-text-muted)" }}
          >
            You haven’t completed any sessions yet.
          </p>
        ) : (
          <div className="row g-4">
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
                <div
                  className="col-12 col-sm-6 col-lg-4"
                  key={item.id}
                >
                  <motion.div
                    whileHover={{
                      scale: 1.05,
                      borderColor: accent,
                      boxShadow: `0 0 20px ${accent}50`,
                    }}
                    transition={{ duration: 0.4 }}
                    className="h-100 border rounded-4 position-relative"
                    style={{
                      padding: "1.25rem",
                      backgroundColor: "var(--color-bg-card)",
                      cursor: "pointer",
                      opacity: isPending ? 0.7 : 1,
                      transition: "all 0.2s ease-in-out",
                    }}
                    onClick={() =>
                      navigate(
                        item.type === "speech"
                          ? `/speech/${item.id}`
                          : `/evaluation/${item.id}`
                      )
                    }
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <h3
                        className="mb-1 fw-semibold"
                        style={{
                          fontSize: "1rem",
                          color: "var(--color-primary)",
                          lineHeight: 1.25,
                        }}
                      >
                        {item.title}
                      </h3>
                      <span
                        className="badge rounded-pill text-capitalize"
                        style={{
                          fontSize: "0.7rem",
                          padding: "0.25rem 0.6rem",
                          backgroundColor:
                            item.status === "completed"
                              ? "rgba(34,197,94,0.2)"
                              : "rgba(234,179,8,0.2)",
                          color:
                            item.status === "completed"
                              ? "#4ade80"
                              : "#facc15",
                        }}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div
                      className="d-flex align-items-center gap-2 mt-2"
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      <Clock size={12} />
                      <span>
                        {fmtDate(item.started_at)} • {difficultyLabel}
                      </span>
                    </div>

                    <div className="d-flex align-items-center gap-2 mt-3">
                      <TrendingUp
                        size={16}
                        style={{ color: "var(--color-primary)" }}
                      />
                      <p
                        className="mb-0 fw-semibold"
                        style={{
                          color: accent,
                          fontSize: "0.9rem",
                        }}
                      >
                        {item.average_score > 0
                          ? `${Math.round(item.average_score)}%`
                          : "Awaiting Evaluation"}
                      </p>
                    </div>

                    {metricEntries.length > 0 && !item.metrics?.note && (
                      <div className="mt-2">
                        <div className="row g-2" style={{ fontSize: "0.75rem" }}>
                          {metricEntries.slice(0, 3).map(([k, v], i) => (
                            <div
                              className="col-4"
                              key={i}
                            >
                              <div
                                className="text-center rounded-3"
                                style={{
                                  padding: "0.25rem 0.2rem",
                                  backgroundColor: "var(--color-bg-panel)",
                                  transition: "box-shadow 0.15s ease-in-out",
                                }}
                              >
                                <p
                                  className="mb-0 fw-medium"
                                  style={{
                                    color: accent,
                                    fontSize: "0.8rem",
                                  }}
                                >
                                  {Math.round(v)}%
                                </p>
                                <p
                                  className="mb-0 text-uppercase"
                                  style={{
                                    fontSize: "0.6rem",
                                    opacity: 0.7,
                                  }}
                                >
                                  {k}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {item.skills.length > 0 && (
                      <div
                        className="d-flex flex-wrap mt-3"
                        style={{ gap: "0.25rem" }}
                      >
                        {item.skills.slice(0, 4).map((skill, i) => (
                          <span
                            key={`${item.id}-skill-${i}`}
                            className="badge rounded-pill"
                            style={{
                              fontSize: "0.6rem",
                              padding: "0.2rem 0.55rem",
                              backgroundColor: "rgba(243,146,40,0.1)",
                              border: "1px solid rgba(243,146,40,0.2)",
                              color: "var(--color-primary)",
                            }}
                          >
                            {String(skill)}
                          </span>
                        ))}
                        {item.skills.length > 4 && (
                          <span
                            className="fst-italic"
                            style={{
                              fontSize: "0.6rem",
                              color: "var(--color-text-muted)",
                            }}
                          >
                            +{item.skills.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                  </motion.div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Feedback link */}
      <Link to="/feedback">
        <button
          type="button"
          onClick={() => {}}
          className="btn btn-link p-0 mt-2"
          style={{
            fontSize: "0.75rem",
            color: "var(--color-text-muted)",
            textDecoration: "none",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.textDecoration = "underline";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.textDecoration = "none";
          }}
        >
          Give us your feedback
        </button>
      </Link>
    </div>
  );
}
