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

const statusColors = {
  open: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  in_progress: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
  resolved: "bg-green-500/15 text-green-300 border-green-500/30",
  closed: "bg-gray-500/15 text-gray-300 border-gray-500/30",
};

const priorityColors = {
  low: "bg-gray-500/15 text-gray-300 border-gray-500/30",
  medium: "bg-orange-500/15 text-orange-300 border-orange-500/30",
  high: "bg-red-500/15 text-red-300 border-red-500/30",
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

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-text-main)]">
            Support Center
          </h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            Create tickets and chat with support about any issues or questions.
          </p>
        </div>
        {user && (
          <div className="text-xs bg-[var(--color-bg-panel)] border border-[var(--color-border)] rounded-lg px-4 py-2">
            <p className="text-[var(--color-text-muted)]">Signed in as</p>
            <p className="font-semibold text-[var(--color-text-main)]">
              {user.first_name} {user.last_name}
            </p>
          </div>
        )}
      </div>

      {/* New Ticket Form */}
      <div className="rounded-xl border bg-[var(--color-bg-panel)] p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <PlusCircle size={18} className="text-[var(--color-primary)]" />
          <h2 className="text-sm font-semibold text-[var(--color-text-main)]">
            Create a New Ticket
          </h2>
        </div>

        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs mb-1">Subject *</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 rounded-md border bg-transparent focus:ring-2 focus:ring-[var(--color-primary)] text-sm"
              placeholder="e.g. Credits not added after payment"
              required
            />
          </div>

          <div>
            <label className="block text-xs mb-1">Describe your issue *</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 rounded-md border bg-transparent focus:ring-2 focus:ring-[var(--color-primary)] text-sm"
              rows={3}
              placeholder="Please include as much detail as possible."
              required
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 justify-between">
            <div>
              <label className="block text-xs mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="px-3 py-2 rounded-md border bg-[var(--color-bg-panel)] text-sm focus:ring-2 focus:ring-[var(--color-primary)]"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={createStatus === "loading"}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[var(--color-primary)] text-white text-sm font-medium shadow hover:opacity-90 disabled:opacity-60"
            >
              {createStatus === "loading" ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
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

          {(localFeedback || createError) && (
            <p
              className={`text-xs mt-1 ${
                (localFeedback || createError).startsWith("✅")
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {localFeedback || createError}
            </p>
          )}
        </form>
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <MessageSquare size={18} className="text-[var(--color-primary)]" />
          <h2 className="text-sm font-semibold text-[var(--color-text-main)]">
            Your Tickets
          </h2>
        </div>

        {listStatus === "loading" && (
          <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
            <Loader2 size={16} className="animate-spin" />
            Loading tickets...
          </div>
        )}

        {listError && (
          <div className="flex items-center gap-2 text-sm text-red-400">
            <AlertCircle size={16} />
            {listError}
          </div>
        )}

        {listStatus === "succeeded" && tickets.length === 0 && (
          <p className="text-sm text-[var(--color-text-muted)] italic">
            You don’t have any tickets yet.
          </p>
        )}

        {tickets.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-4">
            {tickets.map((t) => {
              const ticketId = t.ticket_id || t.id;
              const status = t.status || "open";
              const priorityKey = t.priority || "medium";

              return (
                <button
                  key={ticketId}
                  onClick={() => navigate(`/tickets/${ticketId}`)}
                  className="w-full text-left rounded-lg border bg-[var(--color-bg-panel)] p-4 hover:shadow-md hover:border-[var(--color-primary)]/50 transition-all"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-semibold text-[var(--color-text-main)] line-clamp-2">
                      {t.subject || "No subject"}
                    </h3>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full border ${
                        statusColors[status] || statusColors.open
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[var(--color-text-muted)] mt-1">
                    <span>{fmtDate(t.created_at)}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full border ${priorityColors[priorityKey]}`}
                    >
                      {priorityKey} priority
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
