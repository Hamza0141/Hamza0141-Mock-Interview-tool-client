import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import {
  Loader2,
  ArrowLeft,
  RefreshCcw,
  Download,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Star,
  ListChecks,
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

export default function EvaluationPage() {
  const { session_id } = useParams();
  const navigate = useNavigate();
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const accent = "#f39228";

  useEffect(() => {
    async function fetchEvaluation() {
      try {
        const res = await axiosClient.get(
          `/user/interview/${session_id}/Ai_feedback`
        );
        if (res.data.success) setEvaluation(res.data.data);
      } catch (err) {
        console.error("❌ Failed to fetch evaluation:", err.message);
      } finally {
        setLoading(false);
      }
    }
    if (session_id) fetchEvaluation();
  }, [session_id]);

  if (loading)
    return (
      <div className="d-flex flex-column align-items-center justify-content-center min-vh-75">
        <Loader2
          className="animate-spin"
          size={36}
          style={{ color: "var(--color-primary)" }}
        />
        <p className="mt-3 small" style={{ color: "var(--color-text-muted)" }}>
          Loading your evaluation summary...
        </p>
      </div>
    );

  if (!evaluation)
    return (
      <div className="container py-5 text-center">
        <p className="text-danger fw-semibold">
          No evaluation found for this session.
        </p>
      </div>
    );

  const {
    meta_evaluation,
    ai_feedbacks,
    behavioral_skill_tags,
    job_title,
    difficulty,
  } = evaluation;

  const avgRaw =
    meta_evaluation &&
    meta_evaluation.average_scores &&
    typeof meta_evaluation.average_scores === "object"
      ? meta_evaluation.average_scores
      : {};

  const avgEntries = Object.entries(avgRaw).filter(([_, v]) =>
    Number.isFinite(Number(v))
  );

  const avg = avgEntries.reduce((acc, [k, v]) => {
    acc[k] = Number(v);
    return acc;
  }, {});

  const radarData = avgEntries.map(([k, v]) => ({
    metric: k,
    value: Number(v),
  }));

  const feedbacks = Array.isArray(ai_feedbacks) ? ai_feedbacks : [];

  return (
    <div className="container py-4">
      {/* ===== HEADER ===== */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-link p-0 d-inline-flex align-items-center text-decoration-none"
          style={{ color: "var(--color-text-muted)" }}
        >
          <ArrowLeft size={16} className="me-1" />
          Back
        </button>

        <h1
          className="h4 mb-0 text-center flex-grow-1"
          style={{ color: "var(--color-primary)" }}
        >
          AI Interview Evaluation
        </h1>

        <div className="d-flex gap-2 justify-content-end">
          <button
            onClick={() => navigate("/interview/interviewSetup")}
            className="btn btn-sm d-inline-flex align-items-center text-white"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <RefreshCcw size={16} className="me-1" />
            Retake
          </button>
          <button
            disabled
            className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center"
          >
            <Download size={16} className="me-1" />
            Export PDF
          </button>
        </div>
      </div>

      {/* ===== META SCORES ===== */}
      {avgEntries.length > 0 && (
        <div className="row g-3 mb-4">
          {avgEntries.map(([key, val]) => (
            <div className="col-12 col-md-4" key={key}>
              <motion.div
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 0.5rem 1rem rgba(0,0,0,0.08)",
                }}
                className="card h-100 border-0 shadow-sm"
                style={{
                  backgroundColor: "var(--color-bg-panel)",
                  color: "var(--color-text-main)",
                }}
              >
                <div className="card-body text-center py-3">
                  <p
                    className="text-uppercase small mb-1"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {key}
                  </p>
                  <p
                    className="display-6 fw-semibold mb-0"
                    style={{ color: "var(--color-primary)" }}
                  >
                    {Math.round(val)}%
                  </p>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      )}

      {/* ===== RADAR CHART ===== */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="card border-0 shadow-sm mb-4"
        style={{ backgroundColor: "var(--color-bg-panel)" }}
      >
        <div className="card-body">
          <div className="d-flex align-items-center mb-3">
            <BarChart3
              size={18}
              className="me-2"
              style={{ color: "var(--color-primary)" }}
            />
            <h2 className="h6 mb-0" style={{ color: "var(--color-primary)" }}>
              Performance Overview
            </h2>
          </div>

          {radarData.length > 0 ? (
            <div style={{ width: "100%", height: 320 }}>
              <ResponsiveContainer>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="var(--color-border)" />
                  <PolarAngleAxis
                    dataKey="metric"
                    stroke="var(--color-text-muted)"
                  />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="Average"
                    dataKey="value"
                    stroke={accent}
                    fill={accent}
                    fillOpacity={0.4}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p
              className="small mb-0"
              style={{ color: "var(--color-text-muted)" }}
            >
              No performance metrics are available yet. Complete an interview to
              see your chart.
            </p>
          )}
        </div>
      </motion.div>

      {/* ===== SUMMARY TEXT ===== */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="card border-0 shadow-sm mb-4"
        style={{ backgroundColor: "var(--color-bg-panel)" }}
      >
        <div className="card-body">
          <h3 className="h6 mb-2" style={{ color: "var(--color-primary)" }}>
            Overall Summary
          </h3>
          <p
            className="small mb-0"
            style={{ color: "var(--color-text-main)", whiteSpace: "pre-wrap" }}
          >
            {meta_evaluation?.summary || "No summary is available yet."}
          </p>
        </div>
      </motion.div>

      {/* ===== BEHAVIORAL TAGS ===== */}
      {behavioral_skill_tags?.length > 0 && (
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="card border-0 shadow-sm mb-4"
          style={{ backgroundColor: "var(--color-bg-panel)" }}
        >
          <div className="card-body">
            <h3 className="h6 mb-3" style={{ color: "var(--color-primary)" }}>
              Behavioral & Soft Skills
            </h3>
            <div className="d-flex flex-wrap gap-2">
              {behavioral_skill_tags.map((tag, i) => (
                <span
                  key={i}
                  className="badge rounded-pill"
                  style={{
                    backgroundColor: "rgba(130,49,211,0.1)",
                    border: "1px solid rgba(130,49,211,0.3)",
                    color: "var(--color-primary)",
                    fontSize: "0.75rem",
                    padding: "0.25rem 0.75rem",
                  }}
                >
                  {String(tag)}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ===== QUESTION FEEDBACK ===== */}
      <div className="mb-4">
        <h3 className="h6 mb-3" style={{ color: "var(--color-primary)" }}>
          Question-by-Question Feedback
        </h3>

        {feedbacks.length === 0 && (
          <p
            className="small fst-italic"
            style={{ color: "var(--color-text-muted)" }}
          >
            No per-question feedback is available yet.
          </p>
        )}

        <div className="vstack gap-3">
          {feedbacks.map((f, idx) => {
            const ev = f.evaluation || {};
            const scores = ev.scores || {};
            const scoreData = Object.entries(scores)
              .filter(([_, v]) => Number.isFinite(Number(v)))
              .map(([k, v]) => ({
                metric: k,
                value: Number(v),
              }));

            const overallScore = Number(ev.overall_score) || 0;

            return (
              <motion.div
                key={idx}
                whileHover={{
                  scale: 1.01,
                  boxShadow: "0 0.5rem 1rem rgba(0,0,0,0.06)",
                }}
                className="card border-0 shadow-sm"
                style={{ backgroundColor: "var(--color-bg-panel)" }}
              >
                <div
                  className="card-body"
                  style={{
                    paddingBottom: expanded === idx ? "0.75rem" : "1rem",
                  }}
                >
                  <div
                    className="d-flex justify-content-between align-items-center"
                    style={{ cursor: "pointer" }}
                    onClick={() => setExpanded(expanded === idx ? null : idx)}
                  >
                    <div>
                      <h4
                        className="mb-1"
                        style={{
                          fontSize: "0.95rem",
                          color: "var(--color-text-main)",
                        }}
                      >
                        {f.question_text?.replace("undefined,", "") ||
                          "Question text not available"}
                      </h4>
                      <p
                        className="small mb-0 fst-italic"
                        style={{ opacity: 0.7 }}
                      >
                        Q{f.question_id}
                      </p>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <span
                        className="fw-semibold"
                        style={{
                          fontSize: "0.9rem",
                          color:
                            overallScore > 60
                              ? "#22c55e"
                              : overallScore > 40
                              ? "#eab308"
                              : "#ef4444",
                        }}
                      >
                        {overallScore ? `${Math.round(overallScore)}%` : "—"}
                      </span>
                      {expanded === idx ? (
                        <ChevronUp
                          size={18}
                          style={{ color: "var(--color-text-muted)" }}
                        />
                      ) : (
                        <ChevronDown
                          size={18}
                          style={{ color: "var(--color-text-muted)" }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Collapsible body */}
                  <AnimatePresence>
                    {expanded === idx && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25 }}
                        className="mt-3 pt-3 border-top"
                        style={{ borderColor: "var(--color-border)" }}
                      >
                        {/* User response */}
                        <p
                          className="small fst-italic mb-3"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          {f.user_response
                            ? `“${f.user_response}”`
                            : "No response provided."}
                        </p>

                        {/* Mini bar chart */}
                        {scoreData.length > 0 && (
                          <div style={{ width: "100%", height: 120 }}>
                            <ResponsiveContainer>
                              <BarChart data={scoreData}>
                                <XAxis
                                  dataKey="metric"
                                  tick={{
                                    fill: "var(--color-text-muted)",
                                    fontSize: 11,
                                  }}
                                />
                                <YAxis hide />
                                <Tooltip />
                                <Bar
                                  dataKey="value"
                                  fill={accent}
                                  radius={[6, 6, 0, 0]}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        )}

                        {/* Strengths & Weaknesses */}
                        <div className="row g-3 mt-3 small">
                          <div className="col-md-6">
                            <h5
                              className="d-flex align-items-center mb-1"
                              style={{ color: "#22c55e", fontSize: "0.85rem" }}
                            >
                              <Star size={14} className="me-1" /> Strengths
                            </h5>
                            <ul
                              className="mb-0 ps-3"
                              style={{ color: "var(--color-text-main)" }}
                            >
                              {Array.isArray(ev.strengths) &&
                              ev.strengths.length ? (
                                ev.strengths.map((s, i) => (
                                  <li key={i}>{String(s)}</li>
                                ))
                              ) : (
                                <li className="fst-italic opacity-75">
                                  No strengths listed.
                                </li>
                              )}
                            </ul>
                          </div>

                          <div className="col-md-6">
                            <h5
                              className="d-flex align-items-center mb-1"
                              style={{ color: "#ef4444", fontSize: "0.85rem" }}
                            >
                              <ListChecks size={14} className="me-1" />{" "}
                              Weaknesses
                            </h5>
                            <ul
                              className="mb-0 ps-3"
                              style={{ color: "var(--color-text-main)" }}
                            >
                              {Array.isArray(ev.weaknesses) &&
                              ev.weaknesses.length ? (
                                ev.weaknesses.map((w, i) => (
                                  <li key={i}>{String(w)}</li>
                                ))
                              ) : (
                                <li className="fst-italic opacity-75">
                                  No weaknesses listed.
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>

                        {/* Suggestions */}
                        <div className="mt-3">
                          <h5
                            className="mb-1"
                            style={{
                              fontSize: "0.85rem",
                              color: "var(--color-primary)",
                            }}
                          >
                            💡 Suggestion
                          </h5>
                          <p
                            className="small mb-0"
                            style={{
                              color: "var(--color-text-muted)",
                              whiteSpace: "pre-wrap",
                            }}
                          >
                            {ev.suggestions || "No suggestions available."}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <div className="text-center mt-4 mb-2">
        <p className="small mb-0" style={{ color: "var(--color-text-muted)" }}>
          Interview Level:{" "}
          <span
            className="fw-semibold"
            style={{ color: "var(--color-primary)" }}
          >
            {difficulty ? difficulty.toUpperCase() : "N/A"}
          </span>{" "}
          | Role:{" "}
          <span
            className="fw-semibold"
            style={{ color: "var(--color-primary)" }}
          >
            {job_title || "N/A"}
          </span>
        </p>
      </div>
    </div>
  );
}
