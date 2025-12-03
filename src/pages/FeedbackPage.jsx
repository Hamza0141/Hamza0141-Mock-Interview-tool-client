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
    label:
      "How likely are you to recommend Prepare With AI to a friend or colleague?",
  },
];

function RatingRow({ label, value, onChange }) {
  return (
    <div className="mb-3">
      <p
        className="mb-1"
        style={{ fontSize: "0.9rem", color: "var(--color-text-main)" }}
      >
        {label}
      </p>
      <div className="d-flex align-items-center" style={{ gap: "0.5rem" }}>
        {[1, 2, 3, 4, 5].map((n) => {
          const active = value === n;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              className="btn d-flex align-items-center justify-content-center p-0 border"
              style={{
                width: "2.25rem",
                height: "2.25rem",
                borderRadius: "999px",
                fontSize: "0.8rem",
                fontWeight: 500,
                transition: "all 0.15s ease-in-out",
                backgroundColor: active
                  ? "var(--color-primary)"
                    ? "var(--color-primary)"
                    : "var(--color-primary)"
                  : "var(--color-bg-panel)",
                color: active ? "#ffffff" : "var(--color-text-muted)",
                borderColor: active
                  ? "var(--color-primary)"
                  : "var(--color-border)",
                boxShadow: active ? "0 0 10px rgba(243,146,40,0.7)" : "none",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.borderColor = "rgba(243,146,40,0.6)";
                  e.currentTarget.style.color = "var(--color-primary)";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.borderColor = "var(--color-border)";
                  e.currentTarget.style.color = "var(--color-text-muted)";
                }
              }}
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
  const [submitted, setSubmitted] = useState(false); // controls thank-you state

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

      // switch to thank-you state
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
      <div
        className="d-flex flex-column align-items-center justify-content-center text-center"
        style={{ minHeight: "70vh" }}
      >
        <p
          className="mb-0"
          style={{
            fontSize: "0.9rem",
            color: "var(--color-text-muted)",
          }}
        >
          Please log in to share your feedback.
        </p>
      </div>
    );
  }

  // Decide feedback alert styles
  let feedbackStyle = {};
  if (feedbackMsg) {
    if (feedbackMsg.startsWith("❌")) {
      feedbackStyle = {
        color: "#fca5a5",
        backgroundColor: "rgba(248,113,113,0.05)",
      };
    } else if (feedbackMsg.startsWith("⚠️")) {
      feedbackStyle = {
        color: "#facc15",
        backgroundColor: "rgba(250,204,21,0.05)",
      };
    } else {
      feedbackStyle = {
        color: "#4ade80",
        backgroundColor: "rgba(34,197,94,0.05)",
      };
    }
  }

  return (
    <div
      className="container"
      style={{
        maxWidth: "56rem",
        paddingTop: "1.5rem",
        paddingBottom: "1.5rem",
      }}
    >
      {/* Header */}
      <div
        className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between rounded-4 border shadow-sm p-4 gap-3"
        style={{
          background:
            "linear-gradient(135deg, var(--color-primary) 30%, #4b6cb7)",
          color: "#ffffff",
          borderColor: "rgba(255,255,255,0.3)",
        }}
      >
        <div className="d-flex align-items-start gap-3">
          <div
            className="d-flex align-items-center justify-content-center rounded-circle"
            style={{
              padding: "0.5rem",
              backgroundColor: "rgba(0,0,0,0.2)",
            }}
          >
            <Star size={20} />
          </div>
          <div>
            <h1 className="mb-1 fw-semibold" style={{ fontSize: "1.2rem" }}>
              How is Prepare With AI working for you?
            </h1>
            <p
              className="mb-0"
              style={{
                marginTop: "0.25rem",
                fontSize: "0.8rem",
                opacity: 0.85,
              }}
            >
              Your feedback helps us improve interviews, speeches, and overall
              experience for you and other job seekers.
            </p>
          </div>
        </div>
        <div
          className="text-md-end"
          style={{ fontSize: "0.8rem", opacity: 0.8 }}
        >
          <p className="mb-1">Signed in as</p>
          <p className="mb-0 fw-semibold">
            {user.first_name} {user.last_name}
          </p>
        </div>
      </div>

      {/* Either show the form OR the thank-you screen */}
      {!submitted ? (
        <form
          onSubmit={handleSubmit}
          className="mt-4 rounded-4 border shadow-sm"
          style={{
            backgroundColor: "var(--color-bg-panel)",
            padding: "1.5rem",
          }}
        >
          <h2
            className="d-flex align-items-center gap-2 mb-1 fw-semibold"
            style={{
              fontSize: "0.9rem",
              color: "var(--color-text-main)",
            }}
          >
            <MessageSquare
              size={16}
              style={{ color: "var(--color-primary)" }}
            />
            Quick Feedback
          </h2>
          <p
            className="mb-3"
            style={{
              fontSize: "0.7rem",
              color: "var(--color-text-muted)",
            }}
          >
            1 = Poor, 5 = Excellent
          </p>

          <div className="mb-3">
            {QUESTIONS.map((q) => (
              <RatingRow
                key={q.key}
                label={q.label}
                value={form[q.key]}
                onChange={(val) => handleRatingChange(q.key, val)}
              />
            ))}
          </div>

          <div className="mb-3">
            <label
              className="mb-1"
              style={{
                fontSize: "0.9rem",
                color: "var(--color-text-main)",
              }}
            >
              Anything specific you’d like us to improve or add? (optional)
            </label>
            <textarea
              rows={4}
              value={form.comment}
              onChange={handleCommentChange}
              placeholder="Tell us what’s working well, what’s confusing, or what features you’d love to see."
              className="w-full p-2 border rounded-md bg-transparent focus:ring-2 focus:ring-[var(--color-primary)]"
              style={{
                fontSize: "0.9rem",
                borderColor: "var(--color-border)",
                backgroundColor: "transparent",
                color: "var(--color-text-main)",
              }}
            />
          </div>

          {feedbackMsg && (
            <p
              className="text-center rounded-3 mb-3"
              style={{
                fontSize: "0.75rem",
                padding: "0.4rem 0.6rem",
                ...feedbackStyle,
              }}
            >
              {feedbackMsg}
            </p>
          )}

          <div className="d-flex justify-content-end">
            <button
              type="submit"
              disabled={submitting}
              className="btn d-flex align-items-center gap-2"
              style={{
                padding: "0.4rem 1.5rem",
                borderRadius: "0.5rem",
                fontSize: "0.9rem",
                fontWeight: 500,
                backgroundColor: "var(--color-primary)",
                color: "#ffffff",
                opacity: submitting ? 0.6 : 1,
              }}
            >
              {submitting ? (
                <>
                  <Loader2
                    size={16}
                    className="me-1"
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                  Submitting...
                </>
              ) : (
                "Submit Feedback"
              )}
            </button>
          </div>
        </form>
      ) : (
        // Thank-you state after submit
        <div
          className="mt-4 rounded-4 border shadow-sm d-flex flex-column align-items-center text-center"
          style={{
            backgroundColor: "var(--color-bg-panel)",
            padding: "2rem",
            gap: "1rem",
          }}
        >
          <div
            className="d-flex align-items-center justify-content-center rounded-circle mb-1"
            style={{
              width: "3.5rem",
              height: "3.5rem",
              backgroundColor: "rgba(34,197,94,0.15)",
              border: "1px solid rgba(74,222,128,0.4)",
            }}
          >
            <CheckCircle2 size={30} style={{ color: "#4ade80" }} />
          </div>
          <h2
            className="mb-1 fw-semibold"
            style={{
              fontSize: "1.1rem",
              color: "var(--color-text-main)",
            }}
          >
            Thank you for your feedback! 🎉
          </h2>
          <p
            className="mb-0"
            style={{
              fontSize: "0.9rem",
              color: "var(--color-text-muted)",
              maxWidth: "26rem",
            }}
          >
            We really appreciate you taking the time to help us improve Prepare
            With AI. Your responses will guide how we shape upcoming features
            and enhancements.
          </p>
        </div>
      )}
    </div>
  );
}
