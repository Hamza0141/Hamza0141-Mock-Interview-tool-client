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

function statusBadgeClasses(status) {
  switch (status) {
    case "open":
      return "bg-emerald-500/10 text-emerald-300 border-emerald-400/40";
    case "in_progress":
      return "bg-amber-500/10 text-amber-300 border-amber-400/40";
    case "resolved":
      return "bg-sky-500/10 text-sky-300 border-sky-400/40";
    case "closed":
      return "bg-rose-500/10 text-rose-300 border-rose-400/40";
    default:
      return "bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--color-primary)]/40";
  }
}

function priorityBadgeClasses(priority) {
  switch (priority) {
    case "high":
      return "bg-rose-500/10 text-rose-300 border-rose-400/40";
    case "low":
      return "bg-emerald-500/10 text-emerald-300 border-emerald-400/40";
    case "medium":
    default:
      return "bg-amber-500/10 text-amber-300 border-amber-400/40";
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

  if (detailStatus === "loading" || !detail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <Loader2
          className="animate-spin text-[var(--color-primary)]"
          size={32}
        />
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          Loading ticket...
        </p>
      </div>
    );
  }

  if (detailError) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs text-[var(--color-primary)] mb-4 hover:underline"
        >
          <ArrowLeft size={14} />
          Back
        </button>
        <div className="flex items-center gap-2 text-red-400 text-sm rounded-md border border-red-500/30 bg-red-500/5 px-3 py-2">
          <AlertTriangle size={16} />
          {detailError}
        </div>
      </div>
    );
  }

  const status = detail.status;
  const isClosed = detail?.status === "closed";
  const priority = detail.priority || "medium";

  const isUserSender = (msg) =>
    msg.sender_type === "user" &&
    msg.sender_user_profile_id === user?.profile_id;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs text-[var(--color-primary)] hover:underline"
        >
          <ArrowLeft size={14} />
          Back to tickets
        </button>

        {isAdmin && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
            <ShieldCheck size={14} />
            <span>Admin view</span>
          </div>
        )}
      </div>

      {/* Ticket header card */}
      <div className="rounded-2xl border bg-[var(--color-bg-panel)]/90 backdrop-blur-sm p-6 space-y-4 shadow-md">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
              Ticket ID
            </p>
            <p className="font-mono text-xs text-[var(--color-text-muted)]">
              #{detail.ticket_id}
            </p>
            <h1 className="text-xl font-semibold text-[var(--color-text-main)] mt-2">
              {detail.subject}
            </h1>
            <p className="text-[11px] text-[var(--color-text-muted)] mt-1">
              Created: {fmtDate(detail.created_at)}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 text-xs">
            {/* Status */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                Status
              </span>
              {isAdmin ? (
                <select
                  value={status}
                  onChange={handleStatusChange}
                  className={`px-3 py-1 rounded-full border text-xs outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${statusBadgeClasses(
                    status
                  )}`}
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s.replace("_", " ")}
                    </option>
                  ))}
                </select>
              ) : (
                <span
                  className={`px-3 py-1 rounded-full border text-[11px] font-medium ${statusBadgeClasses(
                    status
                  )}`}
                >
                  {status.replace("_", " ")}
                </span>
              )}
            </div>

            {/* Priority */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                Priority
              </span>
              <span
                className={`px-3 py-1 rounded-full border text-[11px] font-medium ${priorityBadgeClasses(
                  priority
                )}`}
              >
                {priority}
              </span>
            </div>
          </div>
        </div>

        {/* Soft divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mt-2" />
        <p className="text-[11px] text-[var(--color-text-muted)]">
          Our support team will respond within 24–48 hours. You’ll see all
          updates in this conversation.
        </p>
      </div>

      {/* Conversation */}
      <div className="rounded-2xl border bg-[var(--color-bg-panel)]/90 backdrop-blur-sm shadow-md">
        <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b border-white/5">
          <div>
            <h2 className="text-sm font-semibold text-[var(--color-text-main)]">
              Conversation
            </h2>
            <p className="text-[11px] text-[var(--color-text-muted)]">
              Messages between you and support.
            </p>
          </div>
        </div>

        <div className="p-4 flex flex-col gap-3 max-h-[55vh] overflow-y-auto custom-scrollbar">
          {sortedMessages.length === 0 && (
            <p className="text-sm text-[var(--color-text-muted)] italic">
              No messages yet. Start the conversation below.
            </p>
          )}

          {sortedMessages.map((msg) => {
            const mine = isUserSender(msg);
            const baseClasses =
              "max-w-[80%] rounded-2xl px-3 py-2 text-xs shadow-sm";
            const bubbleClasses = mine
              ? `${baseClasses} bg-[var(--color-primary)] text-white ml-auto rounded-br-sm`
              : `${baseClasses} bg-black/40 text-[var(--color-text-main)] mr-auto rounded-bl-sm`;

            const whoLabel =
              msg.sender_type === "admin" ? "Support" : mine ? "You" : "User";

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  mine ? "items-end" : "items-start"
                } gap-1`}
              >
                <div className="flex items-center gap-2 text-[10px] text-[var(--color-text-muted)]">
                  {msg.sender_type === "admin" && (
                    <ShieldCheck size={10} className="text-emerald-300" />
                  )}
                  <span>{whoLabel}</span>
                  <span>•</span>
                  <span>{fmtDate(msg.created_at)}</span>
                </div>
                <div className={bubbleClasses}>{msg.message}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Message input / closed banner */}
      {isClosed ? (
        <div className="mt-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-200 text-sm flex items-center gap-2">
          <AlertTriangle size={16} />
          <span>
            This ticket is <strong>closed</strong>. You can no longer send
            messages on this thread.
          </span>
        </div>
      ) : (
        <form
          onSubmit={handleSendMessage}
          className="mt-2 rounded-2xl border bg-[var(--color-bg-panel)]/90 backdrop-blur-sm p-4 space-y-2 shadow-md"
        >
          <label className="block text-xs text-[var(--color-text-muted)] mb-1">
            Add a message
          </label>

          <div className="flex gap-2">
            <textarea
              className="flex-1 px-3 py-2 rounded-xl border bg-[var(--color-bg-panel)] text-sm 
                   focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none resize-none"
              rows={3}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message for support..."
            />

            <button
              type="submit"
              disabled={messageStatus === "loading" || newMessage.trim() === ""}
              className="h-[42px] self-end px-4 rounded-xl bg-[var(--color-primary)] text-white text-sm 
                   font-medium flex items-center gap-2 hover:opacity-90 
                   disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
            >
              {messageStatus === "loading" ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
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

          {(localMsg || messageError) && (
            <p
              className={`text-[11px] ${
                (localMsg || messageError).startsWith("✅")
                  ? "text-emerald-400"
                  : "text-rose-400"
              }`}
            >
              {localMsg || messageError}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
