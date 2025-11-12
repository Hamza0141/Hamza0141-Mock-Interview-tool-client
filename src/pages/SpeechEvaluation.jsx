import { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-[var(--color-text-muted)]">
        <span className="uppercase">{label}</span>
        <span className="font-semibold" style={{ color: ACCENT }}>
          {v ? `${Math.round(v)}%` : "—"}
        </span>
      </div>
      <div className="h-2 rounded-full bg-[var(--color-bg-panel)] overflow-hidden">
        <div
          className="h-2 rounded-full"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${ACCENT}, #ffb258)`,
          }}
        />
      </div>
    </div>
  );
}

export default function SpeechEvaluation() {
  const { speech_id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { data, status, error } = useAppSelector((s) => s.speech);

  useEffect(() => {
    if (speech_id) dispatch(fetchSpeechEvaluation(speech_id));
  }, [dispatch, speech_id]);

  // Defensive normalization
  const model = useMemo(() => {
    const d = data || {};
    // ai_feedback could be object or string; make object if possible
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

  // Loading / error
  if (status === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-[var(--color-text-muted)]">
        Loading speech evaluation…
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <AlertTriangle className="text-red-400 mb-2" />
        <p className="text-red-400">{error}</p>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-[var(--color-text-muted)]">
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
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <div className="text-right text-xs text-[var(--color-text-muted)]">
          Created: {fmtDate(model.created_at)}
        </div>
      </div>

      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-xl border bg-[var(--color-bg-panel)] flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: `${ACCENT}20`, color: ACCENT }}
          >
            <Mic />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-[var(--color-text-main)]">
              {model.title}
            </h1>
            <p className="text-xs text-[var(--color-text-muted)]">
              Status:{" "}
              <span
                className={`px-2 py-0.5 rounded-full ${
                  model.status === "completed"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-yellow-500/20 text-yellow-400"
                }`}
              >
                {model.status}
              </span>{" "}
           
            
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-4xl font-bold" style={{ color: ACCENT }}>
            {hasOverall ? `${Math.round(metrics.overall)}%` : "—"}
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">Overall</p>
          <p className="text-[10px] text-[var(--color-text-muted)]">
            {model.feedback_created_at
              ? `Evaluated: ${fmtDate(model.feedback_created_at)}`
              : ""}
          </p>
        </div>
      </motion.div>

      {/* Metrics */}
      {hasOverall ? (
        <div className="grid md:grid-cols-2 gap-5">
          {metricList.map(([label, value]) => (
            <Stat key={label} label={label} value={value} />
          ))}
        </div>
      ) : (
        <div className="p-6 rounded-xl border bg-[var(--color-bg-card)] text-[var(--color-text-muted)]">
          Awaiting evaluation — metrics will appear once feedback is generated.
        </div>
      )}

      {/* Goal / Text */}
      <div className="grid md:grid-cols-3 gap-5">
        <div className="md:col-span-1 p-5 rounded-xl border bg-[var(--color-bg-card)]">
          <div className="flex items-center gap-2 mb-2">
            <ClipboardList className="text-[var(--color-primary)]" />
            <h3 className="font-semibold text-[var(--color-text-main)]">
              Goal
            </h3>
          </div>
          <p className="text-sm text-[var(--color-text-muted)] whitespace-pre-wrap">
            {model.goal || "—"}
          </p>
        </div>

        <div className="md:col-span-2 p-5 rounded-xl border bg-[var(--color-bg-card)]">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="text-[var(--color-primary)]" />
            <h3 className="font-semibold text-[var(--color-text-main)]">
              Original Text
            </h3>
          </div>
          <p className="text-sm text-[var(--color-text-muted)] whitespace-pre-wrap">
            {model.text || "—"}
          </p>
        </div>
      </div>

      {/* Summary & Suggestions */}
      <div className="grid md:grid-cols-3 gap-5">
        <div className="md:col-span-2 p-5 rounded-xl border bg-[var(--color-bg-card)]">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="text-[var(--color-primary)]" />
            <h3 className="font-semibold text-[var(--color-text-main)]">
              Summary
            </h3>
          </div>
          <p className="text-sm text-[var(--color-text-muted)] whitespace-pre-wrap">
            {model.summary || "No summary available."}
          </p>
        </div>

        <div className="p-5 rounded-xl border bg-[var(--color-bg-card)]">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="text-[var(--color-primary)]" />
            <h3 className="font-semibold text-[var(--color-text-main)]">
              Suggestions
            </h3>
          </div>
          <p className="text-sm text-[var(--color-text-muted)] whitespace-pre-wrap">
            {model.suggestions || "No suggestions yet."}
          </p>
        </div>
      </div>

      {/* Strengths / Weaknesses */}
      <div className="grid md:grid-cols-2 gap-5">
        <div className="p-5 rounded-xl border bg-[var(--color-bg-card)]">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="text-green-400" />
            <h3 className="font-semibold text-[var(--color-text-main)]">
              Strengths
            </h3>
          </div>
          {model.strengths?.length ? (
            <ul className="list-disc pl-5 text-sm text-[var(--color-text-muted)] space-y-1">
              {model.strengths.map((s, i) => (
                <li key={`str-${i}`}>{String(s)}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[var(--color-text-muted)]">—</p>
          )}
        </div>

        <div className="p-5 rounded-xl border bg-[var(--color-bg-card)]">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="text-yellow-400" />
            <h3 className="font-semibold text-[var(--color-text-main)]">
              Weaknesses
            </h3>
          </div>
          {model.weaknesses?.length ? (
            <ul className="list-disc pl-5 text-sm text-[var(--color-text-muted)] space-y-1">
              {model.weaknesses.map((w, i) => (
                <li key={`weak-${i}`}>{String(w)}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[var(--color-text-muted)]">—</p>
          )}
        </div>
      </div>
    </div>
  );
}
