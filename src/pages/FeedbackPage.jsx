// src/pages/FeedbackPage.jsx
import { useState } from "react";
import { useAppSelector } from "../app/hooks";
import feedbackApi from "../api/feedbackApi";
import { Loader2, Star, MessageSquare, CheckCircle2 } from "lucide-react";

const QUESTIONS = [
  {
    key: "q1_rating",
    label: "How satisfied are you with the mock interview experience?",
  },
  {
    key: "q2_rating",
    label:
      "How helpful was the AI feedback in understanding your strengths and weaknesses?",
  },
  {
    key: "q3_rating",
    label: "How easy is it to use the platform (navigation, speed, clarity)?",
  },
  {
    key: "q4_rating",
    label: "How likely are you to recommend SelfMock to a friend or colleague?",
  },
];

function RatingRow({ label, value, onChange }) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-[var(--color-text-main)]">{label}</p>
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((n) => {
          const active = value === n;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              className={`w-9 h-9 rounded-full border flex items-center justify-center text-xs font-medium transition
                ${
                  active
                    ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-[0_0_10px_rgba(243,146,40,0.7)]"
                    : "bg-[var(--color-bg-panel)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)]/60 hover:text-[var(--color-primary)]"
                }`}
            >
              {n}
            </button>
          );
        })}
        
      </div>
    </div>
  );
}

export default function FeedbackPage() {
  const { user } = useAppSelector((s) => s.user);

  const [form, setForm] = useState({
    q1_rating: null,
    q2_rating: null,
    q3_rating: null,
    q4_rating: null,
    comment: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [submitted, setSubmitted] = useState(false); // 🔥 controls thank-you state

  const handleRatingChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFeedbackMsg("");
  };

  const handleCommentChange = (e) => {
    setForm((prev) => ({ ...prev, comment: e.target.value }));
    setFeedbackMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedbackMsg("");

    const { q1_rating, q2_rating, q3_rating, q4_rating, comment } = form;

    if (!q1_rating || !q2_rating || !q3_rating || !q4_rating) {
      setFeedbackMsg("⚠️ Please answer all 4 rating questions.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        q1_rating,
        q2_rating,
        q3_rating,
        q4_rating,
        comment: comment || "",
      };

      await feedbackApi.submit(payload);

      // ✅ switch to thank-you state
      setSubmitted(true);
    } catch (err) {
      console.error("Submit feedback error:", err.message);
      setFeedbackMsg("❌ Failed to submit feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        <p className="text-sm text-[var(--color-text-muted)]">
          Please log in to share your feedback.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 space-y-6">
      {/* Header */}
      <div
        className="rounded-2xl border shadow-sm p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        style={{
          background:
            "linear-gradient(135deg, var(--color-primary) 30%, #4b6cb7)",
          color: "white",
        }}
      >
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-full bg-black/20">
            <Star size={20} />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-semibold">
              How is SelfMock working for you?
            </h1>
            <p className="text-xs md:text-sm opacity-85 mt-1">
              Your feedback helps us improve interviews, speeches, and overall
              experience for you and other job seekers.
            </p>
          </div>
        </div>
        <div className="text-right text-xs opacity-80">
          <p>Signed in as</p>
          <p className="font-semibold">
            {user.first_name} {user.last_name}
          </p>
        </div>
      </div>

      {/* 🔁 Either show the form OR the thank-you screen */}
      {!submitted ? (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border bg-[var(--color-bg-panel)] p-5 space-y-5 shadow-sm"
        >
          <h2 className="text-sm font-semibold text-[var(--color-text-main)] flex items-center gap-2">
            <MessageSquare size={16} className="text-[var(--color-primary)]" />
            Quick Feedback
          </h2>
          <h2 className="text-[11px] text-[var(--color-text-muted)]">
            1 = Poor, 5 = Excellent
          </h2>

          <div className="space-y-4">
            {QUESTIONS.map((q) => (
              <RatingRow
                key={q.key}
                label={q.label}
                value={form[q.key]}
                onChange={(val) => handleRatingChange(q.key, val)}
              />
            ))}
          </div>

          <div className="space-y-1">
            <label className="text-sm text-[var(--color-text-main)]">
              Anything specific you’d like us to improve or add? (optional)
            </label>
            <textarea
              rows={4}
              value={form.comment}
              onChange={handleCommentChange}
              placeholder="Tell us what’s working well, what’s confusing, or what features you’d love to see."
              className="w-full px-3 py-2 rounded-md border bg-transparent text-sm focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>

          {feedbackMsg && (
            <p
              className={`text-xs text-center p-2 rounded-md ${
                feedbackMsg.startsWith("❌")
                  ? "text-red-400 bg-red-100/5"
                  : feedbackMsg.startsWith("⚠️")
                  ? "text-yellow-300 bg-yellow-100/5"
                  : "text-green-400 bg-green-100/5"
              }`}
            >
              {feedbackMsg}
            </p>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2 rounded-md text-white text-sm font-medium bg-[var(--color-primary)] hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Feedback"
              )}
            </button>
          </div>
        </form>
      ) : (
        // 🎉 Thank-you state after submit
        <div className="rounded-xl border bg-[var(--color-bg-panel)] p-8 flex flex-col items-center text-center gap-4 shadow-sm">
          <div className="w-14 h-14 rounded-full flex items-center justify-center bg-green-500/15 border border-green-400/40 mb-1">
            <CheckCircle2 size={30} className="text-green-400" />
          </div>
          <h2 className="text-lg font-semibold text-[var(--color-text-main)]">
            Thank you for your feedback! 🎉
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] max-w-md">
            We really appreciate you taking the time to help us improve
            SelfMock. Your responses will guide how we shape upcoming features
            and enhancements.
          </p>
        </div>
      )}
    </div>
  );
}
