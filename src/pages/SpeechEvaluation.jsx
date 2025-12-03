// src/pages/SpeechEvaluation.jsx
import { useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchSpeechEvaluation } from "../features/speech/speechSlice";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Mic,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ClipboardList,
  FileText,
} from "lucide-react";

const ACCENT = "#f39228";

function fmtDate(d) {
  try {
    if (!d) return "—";
    const dt = new Date(d);
    return isNaN(dt.getTime()) ? "—" : dt.toLocaleString();
  } catch {
    return "—";
  }
}

function safeNum(n) {
  const v = Number(n);
  return Number.isFinite(v) ? v : 0;
}

function Stat({ label, value }) {
  const v = safeNum(value);
  const pct = Math.max(0, Math.min(100, Math.round(v)));

  return (
    <div style={{ marginBottom: "0.75rem" }}>
      <div
        className="d-flex justify-content-between align-items-center"
        style={{
          fontSize: "0.75rem",
          color: "var(--color-text-muted)",
          textTransform: "uppercase",
          marginBottom: "0.25rem",
        }}
      >
        <span>{label}</span>
        <span
          style={{
            color: ACCENT,
            fontWeight: 600,
          }}
        >
          {v ? `${Math.round(v)}%` : "—"}
        </span>
      </div>
      <div
        style={{
          height: "0.5rem",
          borderRadius: "999px",
          backgroundColor: "var(--color-bg-panel)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            borderRadius: "999px",
            background: `linear-gradient(90deg, ${ACCENT}, #ffb258)`,
            transition: "width 0.3s ease",
          }}
        />
      </div>
    </div>
  );
}

function statusBadgeStyle(status) {
  if (status === "completed") {
    return {
      backgroundColor: "rgba(34,197,94,0.15)", // green
      color: "rgba(74,222,128,1)",
    };
  }
  return {
    backgroundColor: "rgba(234,179,8,0.15)", // yellow
    color: "rgba(250,204,21,1)",
  };
}

export default function SpeechEvaluation() {
  const { speech_id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { data, status, error } = useAppSelector((s) => s.speech);

  useEffect(() => {
    if (speech_id) dispatch(fetchSpeechEvaluation(speech_id));
  }, [dispatch, speech_id]);

  const model = useMemo(() => {
    const d = data || {};
    let fb = d.ai_feedback;

    if (typeof fb === "string") {
      try {
        fb = JSON.parse(fb);
      } catch {
        fb = null;
      }
    }

    const scores =
      fb && fb.scores && typeof fb.scores === "object" ? fb.scores : {};

    return {
      id: d.speech_id || speech_id,
      title: d.speech_title || "Speech",
      goal: d.speech_goal || "",
      text: d.speech_text || "",
      status: d.speech_status || d.status || "pending",
      created_at: d.speech_created_at || d.created_at || null,
      feedback_status: d.feedback_status || "pending",
      feedback_created_at: d.feedback_created_at || null,
      scores: {
        overall: safeNum(scores.overall),
        structure: safeNum(scores.structure),
        clarity: safeNum(scores.clarity),
        tone: safeNum(scores.tone),
        engagement: safeNum(scores.engagement),
        persuasiveness: safeNum(scores.persuasiveness),
        grammar: safeNum(scores.grammar),
      },
      summary: fb?.summary || "",
      suggestions: fb?.suggestions || "",
      strengths: Array.isArray(fb?.strengths) ? fb.strengths : [],
      weaknesses: Array.isArray(fb?.weaknesses) ? fb.weaknesses : [],
    };
  }, [data, speech_id]);

  // Loading / error states
  if (status === "loading") {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          minHeight: "60vh",
          color: "var(--color-text-muted)",
          fontSize: "0.9rem",
        }}
      >
        Loading speech evaluation…
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <AlertTriangle
          className="mb-2"
          style={{ color: "rgba(248,113,113,1)" }}
        />
        <p style={{ color: "rgba(248,113,113,1)", fontSize: "0.9rem" }}>
          {error}
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          minHeight: "60vh",
          color: "var(--color-text-muted)",
          fontSize: "0.9rem",
        }}
      >
        Not found.
      </div>
    );
  }

  const metrics = model.scores;
  const hasOverall = metrics.overall > 0;

  const metricList = [
    ["overall", metrics.overall],
    ["structure", metrics.structure],
    ["clarity", metrics.clarity],
    ["tone", metrics.tone],
    ["engagement", metrics.engagement],
    ["persuasiveness", metrics.persuasiveness],
    ["grammar", metrics.grammar],
  ];

  return (
    <div
      className="container"
      style={{
        maxWidth: "64rem",
        padding: "1.5rem 1rem",
      }}
    >
      {/* Top bar */}
      <div
        className="d-flex justify-content-between align-items-center mb-4"
        style={{ gap: "0.75rem" }}
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn btn-link p-0 d-inline-flex align-items-center"
          style={{
            fontSize: "0.85rem",
            textDecoration: "none",
            color: "var(--color-text-muted)",
          }}
        >
          <ArrowLeft size={18} className="me-1" />
          <span>Back</span>
        </button>
        <div
          className="text-end"
          style={{
            fontSize: "0.75rem",
            color: "var(--color-text-muted)",
          }}
        >
          Created: {fmtDate(model.created_at)}
        </div>
      </div>

      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="d-flex justify-content-between align-items-center border rounded-3 shadow-sm mb-4"
        style={{
          padding: "1.5rem",
          backgroundColor: "var(--color-bg-panel)",
        }}
      >
        <div className="d-flex align-items-center" style={{ gap: "0.75rem" }}>
          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              width: "3rem",
              height: "3rem",
              borderRadius: "999px",
              backgroundColor: "rgba(243,146,40,0.12)",
              color: ACCENT,
            }}
          >
            <Mic />
          </div>
          <div>
            <h1
              className="mb-1"
              style={{
                fontSize: "1.25rem",
                fontWeight: 600,
                color: "var(--color-text-main)",
              }}
            >
              {model.title}
            </h1>
            <p
              className="mb-0"
              style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}
            >
              Status:{" "}
              <span
                className="px-2 py-1 rounded-pill"
                style={{
                  fontSize: "0.7rem",
                  ...statusBadgeStyle(model.status),
                }}
              >
                {model.status}
              </span>
            </p>
          </div>
        </div>

        <div className="text-end">
          <p
            className="mb-0"
            style={{
              fontSize: "2.25rem",
              fontWeight: 700,
              color: ACCENT,
              lineHeight: 1.1,
            }}
          >
            {hasOverall ? `${Math.round(metrics.overall)}%` : "—"}
          </p>
          <p
            className="mb-0"
            style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}
          >
            Overall
          </p>
          <p
            className="mb-0"
            style={{ fontSize: "0.7rem", color: "var(--color-text-muted)" }}
          >
            {model.feedback_created_at
              ? `Evaluated: ${fmtDate(model.feedback_created_at)}`
              : ""}
          </p>
        </div>
      </motion.div>

      {/* Metrics */}
      {hasOverall ? (
        <div className="row g-3 mb-4">
          {metricList.map(([label, value]) => (
            <div key={label} className="col-md-6">
              <Stat label={label} value={value} />
            </div>
          ))}
        </div>
      ) : (
        <div
          className="border rounded-3 mb-4"
          style={{
            padding: "1.5rem",
            backgroundColor: "var(--color-bg-panel)",
            color: "var(--color-text-muted)",
            fontSize: "0.9rem",
          }}
        >
          Awaiting evaluation — metrics will appear once feedback is generated.
        </div>
      )}

      {/* Goal / Text */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div
            className="border rounded-3 h-100"
            style={{
              padding: "1.25rem",
              backgroundColor: "var(--color-bg-panel)",
            }}
          >
            <div
              className="d-flex align-items-center mb-2"
              style={{ gap: "0.5rem" }}
            >
              <ClipboardList
                size={16}
                style={{ color: "var(--color-primary)" }}
              />
              <h3
                className="mb-0"
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: "var(--color-text-main)",
                }}
              >
                Goal
              </h3>
            </div>
            <p
              style={{
                fontSize: "0.9rem",
                color: "var(--color-text-muted)",
                whiteSpace: "pre-wrap",
              }}
            >
              {model.goal || "—"}
            </p>
          </div>
        </div>

        <div className="col-md-8">
          <div
            className="border rounded-3 h-100"
            style={{
              padding: "1.25rem",
              backgroundColor: "var(--color-bg-panel)",
            }}
          >
            <div
              className="d-flex align-items-center mb-2"
              style={{ gap: "0.5rem" }}
            >
              <FileText size={16} style={{ color: "var(--color-primary)" }} />
              <h3
                className="mb-0"
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: "var(--color-text-main)",
                }}
              >
                Original Text
              </h3>
            </div>
            <p
              style={{
                fontSize: "0.9rem",
                color: "var(--color-text-muted)",
                whiteSpace: "pre-wrap",
              }}
            >
              {model.text || "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Summary & Suggestions */}
      <div className="row g-3 mb-4">
        <div className="col-md-8">
          <div
            className="border rounded-3 h-100"
            style={{
              padding: "1.25rem",
              backgroundColor: "var(--color-bg-panel)",
            }}
          >
            <div
              className="d-flex align-items-center mb-2"
              style={{ gap: "0.5rem" }}
            >
              <Sparkles size={16} style={{ color: "var(--color-primary)" }} />
              <h3
                className="mb-0"
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: "var(--color-text-main)",
                }}
              >
                Summary
              </h3>
            </div>
            <p
              style={{
                fontSize: "0.9rem",
                color: "var(--color-text-muted)",
                whiteSpace: "pre-wrap",
              }}
            >
              {model.summary || "No summary available."}
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div
            className="border rounded-3 h-100"
            style={{
              padding: "1.25rem",
              backgroundColor: "var(--color-bg-panel)",
            }}
          >
            <div
              className="d-flex align-items-center mb-2"
              style={{ gap: "0.5rem" }}
            >
              <TrendingUp size={16} style={{ color: "var(--color-primary)" }} />
              <h3
                className="mb-0"
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: "var(--color-text-main)",
                }}
              >
                Suggestions
              </h3>
            </div>
            <p
              style={{
                fontSize: "0.9rem",
                color: "var(--color-text-muted)",
                whiteSpace: "pre-wrap",
              }}
            >
              {model.suggestions || "No suggestions yet."}
            </p>
          </div>
        </div>
      </div>

      {/* Strengths / Weaknesses */}
      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <div
            className="border rounded-3 h-100"
            style={{
              padding: "1.25rem",
              backgroundColor: "var(--color-bg-panel)",
            }}
          >
            <div
              className="d-flex align-items-center mb-2"
              style={{ gap: "0.5rem" }}
            >
              <CheckCircle2 size={16} style={{ color: "#4ade80" }} />
              <h3
                className="mb-0"
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: "var(--color-text-main)",
                }}
              >
                Strengths
              </h3>
            </div>
            {model.strengths?.length ? (
              <ul
                className="mb-0"
                style={{
                  paddingLeft: "1.25rem",
                  fontSize: "0.9rem",
                  color: "var(--color-text-muted)",
                }}
              >
                {model.strengths.map((s, i) => (
                  <li key={`str-${i}`}>{String(s)}</li>
                ))}
              </ul>
            ) : (
              <p
                className="mb-0"
                style={{
                  fontSize: "0.9rem",
                  color: "var(--color-text-muted)",
                }}
              >
                —
              </p>
            )}
          </div>
        </div>

        <div className="col-md-6">
          <div
            className="border rounded-3 h-100"
            style={{
              padding: "1.25rem",
              backgroundColor: "var(--color-bg-panel)",
            }}
          >
            <div
              className="d-flex align-items-center mb-2"
              style={{ gap: "0.5rem" }}
            >
              <AlertTriangle size={16} style={{ color: "#facc15" }} />
              <h3
                className="mb-0"
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: "var(--color-text-main)",
                }}
              >
                Weaknesses
              </h3>
            </div>
            {model.weaknesses?.length ? (
              <ul
                className="mb-0"
                style={{
                  paddingLeft: "1.25rem",
                  fontSize: "0.9rem",
                  color: "var(--color-text-muted)",
                }}
              >
                {model.weaknesses.map((w, i) => (
                  <li key={`weak-${i}`}>{String(w)}</li>
                ))}
              </ul>
            ) : (
              <p
                className="mb-0"
                style={{
                  fontSize: "0.9rem",
                  color: "var(--color-text-muted)",
                }}
              >
                —
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Feedback link */}
      <Link to="/feedback">
        <button
          type="button"
          className="btn btn-link p-0"
          style={{
            fontSize: "0.75rem",
            color: "var(--color-text-muted)",
            textDecoration: "underline",
          }}
        >
          Give us your feedback
        </button>
      </Link>
    </div>
  );
}
