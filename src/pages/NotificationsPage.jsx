import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  Bell,
  Filter,
  CheckCheck,
  MessageSquare,
  CreditCard,
  Mic,
  Briefcase,
  Info,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../features/notifications/notificationsSlice";

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

function typeIcon(entityType) {
  switch (entityType) {
    case "interview_session":
      return <Briefcase size={16} />;
    case "public_speech":
      return <Mic size={16} />;
    case "support_ticket":
      return <MessageSquare size={16} />;
    case "credit_transaction":
    case "credit_transfer":
    case "Purchased":
      return <CreditCard size={16} />;
    default:
      return <Info size={16} />;
  }
}

function typeLabel(entityType) {
  switch (entityType) {
    case "interview_session":
      return "Interview";
    case "public_speech":
      return "Speech";
    case "support_ticket":
      return "Support";
    case "credit_transaction":
      return "Credits";
    case "credit_transfer":
      return "Transfer";
    default:
      return "System";
  }
}

// Filters: align these keys with your entity_type / type values
const FILTERS = [
  { key: "all", label: "All" },
  { key: "interview", label: "Interviews" },
  { key: "speech", label: "Speeches" },
  { key: "credits", label: "Credits" },
  { key: "tickets", label: "Tickets" },
  { key: "system", label: "System" },
];

function matchesFilter(n, activeFilter) {
  if (activeFilter === "all") return true;

  const t = (n.entity_type || n.type || "").toLowerCase();

  if (activeFilter === "interview") return t === "interview_session";
  if (activeFilter === "speech") return t === "public_speech";
  if (activeFilter === "credits")
    return t === "credit_transaction" || t === "credit_transfer";
  if (activeFilter === "tickets") return t === "support_ticket";
  if (activeFilter === "system")
    return ![
      "interview_session",
      "public_speech",
      "credit_transaction",
      "credit_transfer",
      "support_ticket",
    ].includes(t);

  return true;
}

export default function NotificationsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user } = useAppSelector((s) => s.user);
  const {
    items = [],
    unreadCount,
    status,
    error,
    markAllStatus,
  } = useAppSelector((s) => s.notifications);

  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    if (user?.profile_id) {
      dispatch(fetchNotifications());
    }
  }, [dispatch, user?.profile_id]);

  const filteredItems = useMemo(
    () =>
      (items || [])
        .filter((n) => matchesFilter(n, activeFilter))
        .sort(
          (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
        ),
    [items, activeFilter]
  );

  const handleNavigate = (n) => {
    const entityType = n.entity_type || n.type;

    switch (entityType) {
      case "interview_session":
        navigate(`/evaluation/${n.entity_id}`);
        break;
      case "public_speech":
        navigate(`/speech/evaluation/${n.entity_id}`);
        break;
      case "support_ticket":
        navigate(`/tickets/${n.entity_id}`);
        break;
      case "credit_transaction":
      case "credit_transfer":
        navigate("/billing");
        break;
      default:
        navigate("/dashboard");
    }
  };

  const handleClickNotification = async (n) => {
    if (!n.notification_id) {
      handleNavigate(n);
      return;
    }
    await dispatch(markNotificationRead(n.notification_id));
  };

  const handleMarkAllRead = () => {
    if (!items?.length || unreadCount === 0) return;
    dispatch(markAllNotificationsRead());
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        <p className="text-sm text-[var(--color-text-muted)]">
          Please log in to view your notifications.
        </p>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <Loader2
          size={32}
          className="animate-spin text-[var(--color-primary)]"
        />
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          Loading your notifications...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30">
            <Bell className="text-[var(--color-primary)]" size={18} />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-semibold text-[var(--color-text-main)]">
              Notifications
            </h1>
            <p className="text-xs text-[var(--color-text-muted)]">
              Stay up to date on interviews, speeches, credits, and support
              activity.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          {typeof unreadCount === "number" && (
            <span className="px-3 py-1 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 text-[var(--color-primary)] font-medium">
              Unread: {unreadCount}
            </span>
          )}
          <button
            type="button"
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0 || markAllStatus === "loading"}
            className="flex items-center gap-1 px-3 py-1 rounded-full border text-[var(--color-text-main)] text-[11px] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:opacity-50"
          >
            <CheckCheck size={14} />
            {markAllStatus === "loading" ? "Marking..." : "Mark all read"}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="flex items-center gap-1 text-[var(--color-text-muted)]">
          <Filter size={14} /> Filter:
        </span>
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setActiveFilter(f.key)}
            className={`px-3 py-1 rounded-full border text-[11px] transition ${
              activeFilter === f.key
                ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-[0_0_10px_rgba(243,146,40,0.6)]"
                : "bg-[var(--color-bg-panel)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)]/60 hover:text-[var(--color-primary)]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 rounded-md bg-red-100/10 border border-red-400/40 text-xs text-red-300">
          {error}
        </div>
      )}

      {/* List */}
      <div className="rounded-xl border bg-[var(--color-bg-panel)] p-3 md:p-4 space-y-2 min-h-[40vh]">
        {filteredItems.length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)] text-center py-8">
            {items.length === 0
              ? "You don't have any notifications yet."
              : "No notifications match this filter."}
          </p>
        ) : (
          <ul className="space-y-2">
            {filteredItems.map((n) => {
              const entityType = n.entity_type || n.type;
              const isRead = !!n.is_read;

              return (
                <li key={n.notification_id || n.id || n.created_at}>
                  <button
                    type="button"
                    onClick={() => handleClickNotification(n)}
                    className={`w-full text-left px-3 py-3 rounded-lg border flex flex-col gap-1 transition ${
                      isRead
                        ? "opacity-75 border-white/10 hover:border-[var(--color-primary)]/40"
                        : "border-[var(--color-primary)]/40 bg-[var(--color-primary)]/3 hover:bg-[var(--color-primary)]/8"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5 p-1.5 rounded-full bg-black/30">
                          {typeIcon(entityType)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-[var(--color-text-main)]">
                              {n.title || "Notification"}
                            </span>
                            {!isRead && (
                              <span className="text-[9px] px-2 py-0.5 rounded-full bg-[var(--color-primary)] text-white">
                                New
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[var(--color-text-muted)] line-clamp-2">
                            {n.body || n.message || "Update available."}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[9px] text-[var(--color-text-muted)]">
                          {fmtDate(n.created_at)}
                        </span>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-black/25 text-[var(--color-text-muted)]">
                          {typeLabel(entityType)}
                        </span>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
