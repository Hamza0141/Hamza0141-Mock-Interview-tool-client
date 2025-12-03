// src/pages/TicketsPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusCircle,
  Loader2,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchTickets, createTicket } from "../features/tickets/ticketSlice";

// Map status → inline styles
const statusStyles = {
  open: {
    backgroundColor: "rgba(59,130,246,0.15)",
    color: "#bfdbfe",
    borderColor: "rgba(59,130,246,0.3)",
  },
  in_progress: {
    backgroundColor: "rgba(234,179,8,0.15)",
    color: "#fde68a",
    borderColor: "rgba(234,179,8,0.3)",
  },
  resolved: {
    backgroundColor: "rgba(34,197,94,0.15)",
    color: "#bbf7d0",
    borderColor: "rgba(34,197,94,0.3)",
  },
  closed: {
    backgroundColor: "rgba(107,114,128,0.15)",
    color: "#d1d5db",
    borderColor: "rgba(107,114,128,0.3)",
  },
};

// Map priority → inline styles
const priorityStyles = {
  low: {
    backgroundColor: "rgba(107,114,128,0.15)",
    color: "#d1d5db",
    borderColor: "rgba(107,114,128,0.3)",
  },
  medium: {
    backgroundColor: "rgba(249,115,22,0.15)",
    color: "#fed7aa",
    borderColor: "rgba(249,115,22,0.3)",
  },
  high: {
    backgroundColor: "rgba(239,68,68,0.15)",
    color: "#fecaca",
    borderColor: "rgba(239,68,68,0.3)",
  },
};

function fmtDate(d) {
  try {
    if (!d) return "—";
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return "—";
    return dt.toLocaleString();
  } catch {
    return "—";
  }
}

export default function TicketsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.user);

  const {
    list: tickets,
    listStatus,
    listError,
    createStatus,
    createError,
  } = useAppSelector((s) => s.tickets);

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState("medium");
  const [localFeedback, setLocalFeedback] = useState("");

  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLocalFeedback("");

    if (!subject.trim() || !message.trim()) {
      setLocalFeedback("⚠️ Subject and message are required.");
      return;
    }

    try {
      const action = await dispatch(
        createTicket({ subject, message, priority })
      );

      if (createTicket.fulfilled.match(action)) {
        setSubject("");
        setMessage("");
        setPriority("medium");
        setLocalFeedback("✅ Ticket created successfully.");
      } else if (createTicket.rejected.match(action)) {
        setLocalFeedback(action.payload || "❌ Failed to create ticket.");
      }
    } catch (err) {
      setLocalFeedback("❌ Unexpected error occurred.");
    }
  };

  const feedbackText = localFeedback || createError || "";
  const feedbackColor = feedbackText.startsWith("✅") ? "#4ade80" : "#f87171";

  return (
    <div
      className="container"
      style={{
        maxWidth: "64rem",
        padding: "1.5rem 1.5rem 2rem",
      }}
    >
      {/* Header */}
      <div
        className="d-flex flex-column flex-md-row align-items-md-center justify-content-md-between"
        style={{ gap: "0.75rem", marginBottom: "1.75rem" }}
      >
        <div>
          <h1
            className="fw-semibold mb-1"
            style={{ fontSize: "1.4rem", color: "var(--color-text-main)" }}
          >
            Support Center
          </h1>
          <p
            className="mb-0"
            style={{ fontSize: "0.9rem", color: "var(--color-text-muted)" }}
          >
            Create tickets and chat with support about any issues or questions.
          </p>
        </div>
        {user && (
          <div
            className="rounded-3"
            style={{
              fontSize: "0.8rem",
              padding: "0.5rem 1rem",
              backgroundColor: "var(--color-bg-panel)",
              border: "1px solid var(--color-border)",
            }}
          >
            <p className="mb-0" style={{ color: "var(--color-text-muted)" }}>
              Signed in as
            </p>
            <p
              className="mb-0 fw-semibold"
              style={{ color: "var(--color-text-main)" }}
            >
              {user.first_name} {user.last_name}
            </p>
          </div>
        )}
      </div>

      {/* New Ticket Form */}
      <div
        className="rounded-4 border shadow-sm"
        style={{
          padding: "1.5rem",
          marginBottom: "1.75rem",
          backgroundColor: "var(--color-bg-panel)",
          borderColor: "var(--color-border)",
        }}
      >
        <div
          className="d-flex align-items-center mb-2"
          style={{ gap: "0.5rem" }}
        >
          <PlusCircle size={18} style={{ color: "var(--color-primary)" }} />
          <h2
            className="fw-semibold mb-0"
            style={{
              fontSize: "0.95rem",
              color: "var(--color-text-main)",
            }}
          >
            Create a New Ticket
          </h2>
        </div>

        <form onSubmit={handleCreate}>
          <div className="mb-3">
            <label className="form-label mb-1" style={{ fontSize: "0.75rem" }}>
              Subject *
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2 border rounded-md bg-transparent focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder="e.g. Credits not added after payment"
              required
              style={{
                borderColor: "var(--color-border)",
                color: "var(--color-text-main)",
              }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label mb-1" style={{ fontSize: "0.75rem" }}>
              Describe your issue *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 border rounded-md bg-transparent focus:ring-2 focus:ring-[var(--color-primary)]"
              rows={3}
              placeholder="Please include as much detail as possible."
              required
              style={{
                fontSize: "0.9rem",
                backgroundColor: "transparent",
                borderColor: "var(--color-border)",
                color: "var(--color-text-main)",
              }}
            />
          </div>

          <div
            className="d-flex flex-wrap align-items-center justify-content-between"
            style={{ gap: "1rem" }}
          >
            <div>
              <label
                className="form-label mb-1"
                style={{ fontSize: "0.75rem" }}
              >
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="form-select"
                style={{
                  fontSize: "0.9rem",
                  width: "auto",
                  minWidth: "9rem",
                  backgroundColor: "var(--color-bg-panel)",
                  color: "var(--color-text-main)",
                  borderColor: "var(--color-border)",
                }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={createStatus === "loading"}
              className="btn d-inline-flex align-items-center"
              style={{
                gap: "0.35rem",
                padding: "0.45rem 1.1rem",
                borderRadius: "0.5rem",
                fontSize: "0.85rem",
                fontWeight: 500,
                backgroundColor: "var(--color-primary)",
                color: "#fff",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                opacity: createStatus === "loading" ? 0.6 : 1,
              }}
            >
              {createStatus === "loading" ? (
                <>
                  <Loader2
                    size={16}
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  Submit Ticket
                </>
              )}
            </button>
          </div>

          {feedbackText && (
            <p
              className="mt-2 mb-0"
              style={{
                fontSize: "0.8rem",
                color: feedbackColor,
              }}
            >
              {feedbackText}
            </p>
          )}
        </form>
      </div>

      {/* Tickets List */}
      <div>
        <div
          className="d-flex align-items-center mb-2"
          style={{ gap: "0.5rem" }}
        >
          <MessageSquare size={18} style={{ color: "var(--color-primary)" }} />
          <h2
            className="fw-semibold mb-0"
            style={{
              fontSize: "0.95rem",
              color: "var(--color-text-main)",
            }}
          >
            Your Tickets
          </h2>
        </div>

        {listStatus === "loading" && (
          <div
            className="d-flex align-items-center"
            style={{
              gap: "0.4rem",
              fontSize: "0.9rem",
              color: "var(--color-text-muted)",
            }}
          >
            <Loader2
              size={16}
              style={{ animation: "spin 1s linear infinite" }}
            />
            Loading tickets...
          </div>
        )}

        {listError && (
          <div
            className="d-flex align-items-center mt-2"
            style={{ gap: "0.4rem", fontSize: "0.9rem", color: "#f87171" }}
          >
            <AlertCircle size={16} />
            {listError}
          </div>
        )}

        {listStatus === "succeeded" && tickets.length === 0 && (
          <p
            className="mt-2 fst-italic"
            style={{ fontSize: "0.9rem", color: "var(--color-text-muted)" }}
          >
            You don’t have any tickets yet.
          </p>
        )}

        {tickets.length > 0 && (
          <div className="row g-3 mt-2">
            {tickets.map((t) => {
              const ticketId = t.ticket_id || t.id;
              const status = t.status || "open";
              const priorityKey = t.priority || "medium";
              const statusStyle = statusStyles[status] || statusStyles.open;
              const prioStyle =
                priorityStyles[priorityKey] || priorityStyles.medium;

              return (
                <div className="col-12 col-sm-6" key={ticketId}>
                  <button
                    type="button"
                    onClick={() => navigate(`/tickets/${ticketId}`)}
                    className="w-100 text-start rounded-3 border"
                    style={{
                      padding: "1rem",
                      backgroundColor: "var(--color-bg-panel)",
                      borderColor: "var(--color-border)",
                      transition:
                        "box-shadow 0.15s ease, border-color 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 4px 10px rgba(0,0,0,0.25)";
                      e.currentTarget.style.borderColor =
                        "rgba(243,146,40,0.6)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.borderColor = "var(--color-border)";
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <h3
                        className="mb-0 fw-semibold"
                        style={{
                          fontSize: "0.9rem",
                          color: "var(--color-text-main)",
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {t.subject || "No subject"}
                      </h3>
                      <span
                        className="badge rounded-pill"
                        style={{
                          ...statusStyle,
                          fontSize: "0.65rem",
                          borderWidth: "1px",
                          borderStyle: "solid",
                          padding: "0.15rem 0.45rem",
                          textTransform: "capitalize",
                        }}
                      >
                        {status.replace("_", " ")}
                      </span>
                    </div>

                    <div
                      className="d-flex justify-content-between align-items-center"
                      style={{
                        marginTop: "0.25rem",
                        fontSize: "0.75rem",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      <span>{fmtDate(t.created_at)}</span>
                      <span
                        className="badge rounded-pill"
                        style={{
                          ...prioStyle,
                          fontSize: "0.65rem",
                          borderWidth: "1px",
                          borderStyle: "solid",
                          padding: "0.15rem 0.45rem",
                          textTransform: "capitalize",
                        }}
                      >
                        {priorityKey} priority
                      </span>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
