// src/pages/TicketDetailPage.jsx
import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  Send,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  fetchTicketById,
  addTicketMessage,
  updateTicketStatus,
} from "../features/tickets/ticketSlice";

const statusOptions = ["open", "in_progress", "resolved", "closed"];

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

// ------- badge styles (replacing Tailwind classes) -------

function statusBadgeStyle(status) {
  switch (status) {
    case "open":
      return {
        backgroundColor: "rgba(16,185,129,0.10)",
        color: "#6ee7b7",
        borderColor: "rgba(16,185,129,0.4)",
      };
    case "in_progress":
      return {
        backgroundColor: "rgba(245,158,11,0.10)",
        color: "#fde68a",
        borderColor: "rgba(245,158,11,0.4)",
      };
    case "resolved":
      return {
        backgroundColor: "rgba(56,189,248,0.10)",
        color: "#7dd3fc",
        borderColor: "rgba(56,189,248,0.4)",
      };
    case "closed":
      return {
        backgroundColor: "rgba(244,63,94,0.10)",
        color: "#fecaca",
        borderColor: "rgba(248,113,113,0.4)",
      };
    default:
      return {
        backgroundColor: "rgba(243,146,40,0.10)",
        color: "var(--color-primary)",
        borderColor: "rgba(243,146,40,0.4)",
      };
  }
}

function priorityBadgeStyle(priority) {
  switch (priority) {
    case "high":
      return {
        backgroundColor: "rgba(244,63,94,0.10)",
        color: "#fecaca",
        borderColor: "rgba(248,113,113,0.4)",
      };
    case "low":
      return {
        backgroundColor: "rgba(16,185,129,0.10)",
        color: "#6ee7b7",
        borderColor: "rgba(16,185,129,0.4)",
      };
    case "medium":
    default:
      return {
        backgroundColor: "rgba(245,158,11,0.10)",
        color: "#fde68a",
        borderColor: "rgba(245,158,11,0.4)",
      };
  }
}

export default function TicketDetailPage() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((s) => s.user);
  const { detail, detailStatus, detailError, messageStatus, messageError } =
    useAppSelector((s) => s.tickets);

  const [newMessage, setNewMessage] = useState("");
  const [localMsg, setLocalMsg] = useState("");

  const isAdmin = !!user?.is_admin;

  useEffect(() => {
    if (ticketId) {
      dispatch(fetchTicketById(ticketId));
    }
  }, [dispatch, ticketId]);

  const sortedMessages = useMemo(() => {
    if (!detail?.messages) return [];
    return [...detail.messages].sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );
  }, [detail]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setLocalMsg("");

    if (!newMessage.trim()) {
      setLocalMsg("⚠️ Message cannot be empty.");
      return;
    }

    const action = await dispatch(
      addTicketMessage({ ticketId, message: newMessage.trim() })
    );

    if (addTicketMessage.fulfilled.match(action)) {
      setNewMessage("");
      setLocalMsg("✅ Message sent.");
      setTimeout(() => setLocalMsg(""), 1500);
    } else if (addTicketMessage.rejected.match(action)) {
      setLocalMsg(action.payload || "❌ Failed to send message.");
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    if (!newStatus || !ticketId) return;
    await dispatch(updateTicketStatus({ ticketId, status: newStatus }));
  };

  const isUserSender = (msg) =>
    msg.sender_type === "user" &&
    msg.sender_user_profile_id === user?.profile_id;

  // --------- loading / error ----------

  if (detailStatus === "loading" || !detail) {
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center"
        style={{ minHeight: "70vh" }}
      >
        <Loader2
          size={32}
          style={{
            color: "var(--color-primary)",
            animation: "spin 1s linear infinite",
          }}
        />
        <p
          className="mt-2"
          style={{ fontSize: "0.9rem", color: "var(--color-text-muted)" }}
        >
          Loading ticket...
        </p>
      </div>
    );
  }

  if (detailError) {
    return (
      <div
        className="container"
        style={{ maxWidth: "48rem", padding: "1.5rem" }}
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn btn-link p-0 d-inline-flex align-items-center"
          style={{
            gap: "0.35rem",
            fontSize: "0.75rem",
            color: "var(--color-primary)",
            textDecoration: "none",
            marginBottom: "1rem",
          }}
        >
          <ArrowLeft size={14} />
          Back
        </button>
        <div
          className="d-flex align-items-center rounded-3 border px-3 py-2"
          style={{
            gap: "0.5rem",
            fontSize: "0.9rem",
            color: "#fecaca",
            borderColor: "rgba(248,113,113,0.3)",
            backgroundColor: "rgba(248,113,113,0.05)",
          }}
        >
          <AlertTriangle size={16} />
          {detailError}
        </div>
      </div>
    );
  }

  const status = detail.status;
  const isClosed = detail.status === "closed";
  const priority = detail.priority || "medium";

  const messageFeedback = localMsg || messageError || "";
  const messageFeedbackColor = messageFeedback.startsWith("✅")
    ? "#6ee7b7"
    : "#fecaca";

  // --------- main layout (mirrors original Tailwind layout) ---------

  return (
    <div
      className="container"
      style={{
        maxWidth: "64rem", // ~max-w-5xl
        padding: "1.5rem",
      }}
    >
      {/* Top bar */}
      <div
        className="d-flex justify-content-between align-items-center"
        style={{ marginBottom: "1.5rem" /* space-y-6 gap */ }}
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn btn-link p-0 d-inline-flex align-items-center"
          style={{
            gap: "0.35rem",
            fontSize: "0.75rem",
            color: "var(--color-primary)",
            textDecoration: "none",
          }}
        >
          <ArrowLeft size={14} />
          Back to tickets
        </button>

        {isAdmin && (
          <div
            className="d-inline-flex align-items-center rounded-pill border"
            style={{
              gap: "0.35rem",
              padding: "0.25rem 0.9rem",
              fontSize: "0.75rem",
              backgroundColor: "rgba(16,185,129,0.10)",
              borderColor: "rgba(16,185,129,0.30)",
              color: "#6ee7b7",
            }}
          >
            <ShieldCheck size={14} />
            <span>Admin view</span>
          </div>
        )}
      </div>

      {/* Ticket header card */}
      <div
        className="rounded-4 border shadow-sm"
        style={{
          padding: "1.5rem",
          marginBottom: "1.5rem",
          backgroundColor: "var(--color-bg-panel)", // bg-[var(--color-bg-panel)]/90 approximation
          borderColor: "var(--color-border)",
          color: "var(--color-text-main)",
        }}
      >
        <div
          className="d-flex flex-wrap justify-content-between align-items-start"
          style={{ gap: "1rem" }}
        >
          <div>
            <p
              className="mb-1 text-uppercase"
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.12em",
                color: "var(--color-text-muted)",
              }}
            >
              Ticket ID
            </p>
            <p
              className="mb-1"
              style={{
                fontSize: "0.75rem",
                fontFamily: "monospace",
                color: "var(--color-text-muted)",
              }}
            >
              #{detail.ticket_id}
            </p>
            <h1
              className="mb-1"
              style={{
                fontSize: "1.25rem",
                fontWeight: 600,
                color: "var(--color-text-main)",
                marginTop: "0.5rem",
              }}
            >
              {detail.subject}
            </h1>
            <p
              className="mb-0"
              style={{ fontSize: "0.7rem", color: "var(--color-text-muted)" }}
            >
              Created: {fmtDate(detail.created_at)}
            </p>
          </div>

          <div
            className="d-flex flex-column align-items-end"
            style={{ gap: "0.5rem", fontSize: "0.75rem" }}
          >
            {/* Status */}
            <div
              className="d-flex align-items-center"
              style={{ gap: "0.4rem" }}
            >
              <span
                style={{
                  fontSize: "0.65rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.16em",
                  color: "var(--color-text-muted)",
                }}
              >
                Status
              </span>
              {isAdmin ? (
                <select
                  value={status}
                  onChange={handleStatusChange}
                  className="form-select"
                  style={{
                    ...statusBadgeStyle(status),
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderRadius: "999px",
                    fontSize: "0.7rem",
                    padding: "0.2rem 0.75rem",
                    boxShadow: "none",
                  }}
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s.replace("_", " ")}
                    </option>
                  ))}
                </select>
              ) : (
                <span
                  className="badge rounded-pill"
                  style={{
                    ...statusBadgeStyle(status),
                    borderWidth: "1px",
                    borderStyle: "solid",
                    fontSize: "0.7rem",
                    padding: "0.25rem 0.75rem",
                    textTransform: "capitalize",
                  }}
                >
                  {status.replace("_", " ")}
                </span>
              )}
            </div>

            {/* Priority */}
            <div
              className="d-flex align-items-center"
              style={{ gap: "0.4rem" }}
            >
              <span
                style={{
                  fontSize: "0.65rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.16em",
                  color: "var(--color-text-muted)",
                }}
              >
                Priority
              </span>
              <span
                className="badge rounded-pill"
                style={{
                  ...priorityBadgeStyle(priority),
                  borderWidth: "1px",
                  borderStyle: "solid",
                  fontSize: "0.7rem",
                  padding: "0.25rem 0.75rem",
                  textTransform: "capitalize",
                }}
              >
                {priority}
              </span>
            </div>
          </div>
        </div>

        {/* Soft divider like original h-px + gradient */}
        <div
          style={{
            height: "1px",
            width: "100%",
            marginTop: "0.75rem",
            marginBottom: "0.5rem",
            background:
              "linear-gradient(to right, transparent, rgba(255,255,255,0.15), transparent)",
          }}
        />

        <p
          className="mb-0"
          style={{ fontSize: "0.7rem", color: "var(--color-text-muted)" }}
        >
          Our support team will respond within 24–48 hours. You’ll see all
          updates in this conversation.
        </p>
      </div>

      {/* Conversation card */}
      <div
        className="rounded-4 border shadow-md"
        style={{
          backgroundColor: "var(--color-bg-panel)",
          borderColor: "var(--color-border)",
          marginBottom: "1.5rem",
        }}
      >
        {/* Header */}
        <div
          className="d-flex justify-content-between align-items-center border-bottom"
          style={{
            padding: "0.75rem 1rem",
            borderColor: "rgba(255,255,255,0.05)",
          }}
        >
          <div>
            <h2
              className="mb-0"
              style={{
                fontSize: "0.95rem",
                fontWeight: 600,
                color: "var(--color-text-main)",
              }}
            >
              Conversation
            </h2>
            <p
              className="mb-0"
              style={{
                fontSize: "0.7rem",
                color: "var(--color-text-muted)",
              }}
            >
              Messages between you and support.
            </p>
          </div>
        </div>

        {/* Messages */}
        <div
          className="custom-scrollbar"
          style={{
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            maxHeight: "55vh",
            overflowY: "auto",
          }}
        >
          {sortedMessages.length === 0 && (
            <p
              className="mb-0 fst-italic"
              style={{
                fontSize: "0.9rem",
                color: "var(--color-text-muted)",
              }}
            >
              No messages yet. Start the conversation below.
            </p>
          )}

          {sortedMessages.map((msg) => {
            const mine = isUserSender(msg);
            const isAdminMsg = msg.sender_type === "admin";

            const bubbleBase = {
              maxWidth: "80%",
              borderRadius: "1.25rem",
              padding: "0.5rem 0.75rem",
              fontSize: "0.8rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.35)",
              whiteSpace: "pre-wrap",
            };

            const bubbleStyle = mine
              ? {
                  ...bubbleBase,
                  marginLeft: "auto",
                  borderBottomRightRadius: "0.3rem",
                  backgroundColor: "var(--color-primary)",
                  color: "#fff",
                }
              : {
                  ...bubbleBase,
                  marginRight: "auto",
                  borderBottomLeftRadius: "0.3rem",
                  backgroundColor: "rgba(0,0,0,0.4)",
                  color: "var(--color-text-main)",
                };

            const whoLabel = isAdminMsg ? "Support" : mine ? "You" : "User";

            return (
              <div
                key={msg.id}
                className="d-flex flex-column"
                style={{
                  alignItems: mine ? "flex-end" : "flex-start",
                  gap: "0.25rem",
                }}
              >
                <div
                  className="d-flex align-items-center"
                  style={{
                    gap: "0.25rem",
                    fontSize: "0.65rem",
                    color: "var(--color-text-muted)",
                  }}
                >
                  {isAdminMsg && (
                    <ShieldCheck size={10} style={{ color: "#6ee7b7" }} />
                  )}
                  <span>{whoLabel}</span>
                  <span>•</span>
                  <span>{fmtDate(msg.created_at)}</span>
                </div>
                <div style={bubbleStyle}>{msg.message}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Message input or closed banner */}
      {isClosed ? (
        <div
          className="d-flex align-items-center rounded-3 border"
          style={{
            padding: "0.75rem 1rem",
            gap: "0.5rem",
            fontSize: "0.85rem",
            color: "#fecaca",
            backgroundColor: "rgba(244,63,94,0.10)",
            borderColor: "rgba(244,63,94,0.40)",
          }}
        >
          <AlertTriangle size={16} />
          <span>
            This ticket is <strong>closed</strong>. You can no longer send
            messages on this thread.
          </span>
        </div>
      ) : (
        <form
          onSubmit={handleSendMessage}
          className="rounded-4 border shadow-md"
          style={{
            marginTop: "0.5rem",
            padding: "1rem",
            backgroundColor: "var(--color-bg-panel)",
            borderColor: "var(--color-border)",
          }}
        >
          <label
            className="form-label mb-1"
            style={{
              fontSize: "0.7rem",
              color: "var(--color-text-muted)",
            }}
          >
            Add a message
          </label>
          <div
            className="d-flex"
            style={{ gap: "0.5rem", alignItems: "flex-end" }}
          >
            <textarea
              rows={3}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-full p-2 border rounded-md bg-transparent focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder="Type your message for support..."
              style={{
                fontSize: "0.85rem",
                borderRadius: "0.9rem",
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-bg-panel)",
                color: "var(--color-text-main)",
                resize: "none",
              }}
            />
            <button
              type="submit"
              disabled={messageStatus === "loading" || newMessage.trim() === ""}
              className="btn d-inline-flex align-items-center justify-content-center"
              style={{
                height: "42px",
                padding: "0 1.1rem",
                borderRadius: "0.9rem",
                fontSize: "0.8rem",
                fontWeight: 500,
                backgroundColor: "var(--color-primary)",
                color: "#fff",
                gap: "0.35rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.35)",
                opacity:
                  messageStatus === "loading" || newMessage.trim() === ""
                    ? 0.6
                    : 1,
                cursor:
                  messageStatus === "loading" || newMessage.trim() === ""
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {messageStatus === "loading" ? (
                <>
                  <Loader2
                    size={16}
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                  Sending
                </>
              ) : (
                <>
                  <Send size={16} />
                  Send
                </>
              )}
            </button>
          </div>

          {messageFeedback && (
            <p
              className="mt-2 mb-0"
              style={{
                fontSize: "0.7rem",
                color: messageFeedbackColor,
              }}
            >
              {messageFeedback}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
