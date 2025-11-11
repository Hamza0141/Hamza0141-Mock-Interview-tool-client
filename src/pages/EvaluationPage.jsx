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
    fetchEvaluation();
  }, [session_id]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <Loader2
          className="animate-spin text-[var(--color-primary)]"
          size={36}
        />
        <p className="mt-3 text-[var(--color-text-muted)] text-sm">
          Loading your evaluation summary...
        </p>
      </div>
    );

  if (!evaluation)
    return (
      <div className="text-center py-20 text-red-400">
        No evaluation found for this session.
      </div>
    );

  const {
    meta_evaluation,
    ai_feedbacks,
    behavioral_skill_tags,
    job_title,
    difficulty,
  } = evaluation;

  const avg = meta_evaluation?.average_scores || {};
  const radarData = Object.keys(avg).map((k) => ({
    metric: k,
    value: avg[k],
  }));

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      {/* ===== HEADER ===== */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-all hover:scale-[1.03]"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <h1 className="text-2xl font-semibold bg-gradient-to-r from-[var(--color-primary)] to-purple-500 bg-clip-text text-transparent">
          AI Interview Evaluation
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/interview/session")}
            className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-gradient-to-r from-green-600 to-emerald-500 rounded-md hover:opacity-90 transition-all hover:scale-[1.02]"
          >
            <RefreshCcw size={16} /> Retake
          </button>
          <button
            disabled
            className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--color-text-main)] border rounded-md hover:bg-[var(--color-primary)]/10 transition-all"
          >
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      {/* ===== META SCORES ===== */}
      <div className="grid md:grid-cols-3 gap-6">
        {Object.entries(avg).map(([key, val]) => (
          <motion.div
            key={key}
            whileHover={{ scale: 1.03 }}
            className={`p-4 rounded-xl border shadow-sm text-center transition-all duration-200 ${
              key === "overall"
                ? "bg-gradient-to-r from-[var(--color-primary)] to-purple-500 text-white shadow-lg"
                : "bg-[var(--color-bg-panel)] hover:shadow-md hover:border-[var(--color-primary)]/30"
            }`}
          >
            <p
              className={`text-sm uppercase tracking-wide ${
                key === "overall"
                  ? "text-white/90"
                  : "text-[var(--color-text-muted)]"
              }`}
            >
              {key}
            </p>
            <p
              className={`text-3xl font-semibold mt-1 ${
                key === "overall" ? "text-white" : "text-[var(--color-primary)]"
              }`}
            >
              {val.toFixed(1)}%
            </p>
          </motion.div>
        ))}
      </div>

      {/* ===== RADAR CHART ===== */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="rounded-xl border shadow-md bg-[var(--color-bg-panel)] p-6 transition-all"
      >
        <h2 className="text-lg font-semibold text-[var(--color-primary)] mb-4">
          Performance Overview
        </h2>
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="var(--color-border)" />
            <PolarAngleAxis dataKey="metric" stroke="var(--color-text-muted)" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar
              name="Average"
              dataKey="value"
              stroke="var(--color-primary)"
              fill="var(--color-primary)"
              fillOpacity={0.4}
            />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* ===== SUMMARY TEXT ===== */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="rounded-xl border shadow-md bg-[var(--color-bg-panel)] p-6 transition-all"
      >
        <h3 className="text-lg font-semibold text-[var(--color-primary)] mb-2">
          Overall Summary
        </h3>
        <p className="text-[var(--color-text-main)] leading-relaxed text-sm">
          {meta_evaluation?.summary}
        </p>
      </motion.div>

      {/* ===== BEHAVIORAL TAGS ===== */}
      {behavioral_skill_tags?.length > 0 && (
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="rounded-xl border shadow-sm bg-[var(--color-bg-panel)] p-5 transition-all"
        >
          <h3 className="text-lg font-semibold text-[var(--color-primary)] mb-3">
            Behavioral & Soft Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {behavioral_skill_tags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-[var(--color-primary)]/20 to-purple-500/20 text-[var(--color-primary)] border border-[var(--color-primary)]/30 hover:scale-105 transition-transform"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* ===== QUESTION FEEDBACK ===== */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[var(--color-primary)]">
          Question-by-Question Analysis
        </h3>

        {ai_feedbacks.map((f, idx) => {
          const ev = f.evaluation;
          const scoreData = Object.entries(ev.scores).map(([k, v]) => ({
            metric: k,
            value: v,
          }));

          return (
            <motion.div
              whileHover={{ scale: 1.01 }}
              key={idx}
              className="rounded-lg border shadow-sm bg-[var(--color-bg-panel)] p-4 transition-all hover:border-[var(--color-primary)]/40"
            >
              <div
                className="flex justify-between items-center cursor-pointer select-none"
                onClick={() => setExpanded(expanded === idx ? null : idx)}
              >
                <div>
                  <h4 className="font-medium text-[var(--color-text-main)]">
                    Question {f.question_id}
                  </h4>
                  <p className="text-xs italic opacity-70 mt-1">
                    {f.question_text}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm font-semibold ${
                      ev.overall_score > 60
                        ? "text-green-500"
                        : ev.overall_score > 40
                        ? "text-yellow-500"
                        : "text-red-500"
                    }`}
                  >
                    {ev.overall_score}%
                  </span>
                  {expanded === idx ? (
                    <ChevronUp className="text-[var(--color-text-muted)]" />
                  ) : (
                    <ChevronDown className="text-[var(--color-text-muted)]" />
                  )}
                </div>
              </div>

              {/* Collapsible Feedback */}
              <AnimatePresence>
                {expanded === idx && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 border-t border-[var(--color-border)] pt-4 space-y-3"
                  >
                    <p className="text-xs italic opacity-60">
                      Your response: {f.user_response}
                    </p>

                    <ResponsiveContainer width="100%" height={120}>
                      <BarChart data={scoreData}>
                        <XAxis
                          dataKey="metric"
                          tick={{
                            fill: "var(--color-text-muted)",
                            fontSize: 12,
                          }}
                        />
                        <YAxis hide />
                        <Tooltip />
                        <Bar
                          dataKey="value"
                          fill="var(--color-primary)"
                          radius={[6, 6, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>

                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <h5 className="font-medium text-green-400 mb-1">
                          ✅ Strengths
                        </h5>
                        <ul className="list-disc list-inside text-[var(--color-text-main)]">
                          {ev.strengths.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-red-400 mb-1">
                          ⚠️ Weaknesses
                        </h5>
                        <ul className="list-disc list-inside text-[var(--color-text-main)]">
                          {ev.weaknesses.map((w, i) => (
                            <li key={i}>{w}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-[var(--color-primary)] mb-1">
                        💡 Suggestion
                      </h5>
                      <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
                        {ev.suggestions}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* ===== FOOTER ===== */}
      <div className="text-center text-xs text-[var(--color-text-muted)] mt-12">
        <p>
          Interview Level:{" "}
          <span className="text-[var(--color-primary)] font-medium">
            {difficulty?.toUpperCase()}
          </span>{" "}
          | Role:{" "}
          <span className="text-[var(--color-primary)] font-medium">
            {job_title}
          </span>
        </p>
      </div>
    </div>
  );
}
