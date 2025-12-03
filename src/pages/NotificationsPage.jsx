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
      <div
        className="d-flex flex-column align-items-center justify-content-center text-center"
        style={{ minHeight: "70vh" }}
      >
        <p className="small text-muted">
          Please log in to view your notifications.
        </p>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center"
        style={{ minHeight: "70vh" }}
      >
        <Loader2 size={32} style={{ color: "var(--color-primary)" }} />
        <p className="mt-2 small text-muted">Loading your notifications...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
        <div className="d-flex align-items-center gap-2">
          <div
            className="d-flex align-items-center justify-content-center rounded-circle border"
            style={{
              padding: "0.5rem",
              backgroundColor: "rgba(243,146,40,0.1)",
              borderColor: "rgba(243,146,40,0.3)",
            }}
          >
            <Bell size={18} style={{ color: "var(--color-primary)" }} />
          </div>
          <div>
            <h1
              className="h5 mb-0 fw-semibold"
              style={{ color: "var(--color-text-main)" }}
            >
              Notifications
            </h1>
            <p
              className="mb-0"
              style={{
                fontSize: "12px",
                color: "var(--color-text-muted)",
              }}
            >
              Stay up to date on interviews, speeches, credits, and support
              activity.
            </p>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          {typeof unreadCount === "number" && (
            <span
              className="badge rounded-pill"
              style={{
                padding: "0.35rem 0.75rem",
                backgroundColor: "rgba(243,146,40,0.1)",
                border: "1px solid rgba(243,146,40,0.3)",
                color: "var(--color-primary)",
                fontSize: "12px",
                fontWeight: 500,
              }}
            >
              Unread: {unreadCount}
            </span>
          )}
          <button
            type="button"
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0 || markAllStatus === "loading"}
            className="btn d-flex align-items-center rounded-pill"
            style={{
              padding: "0.3rem 0.7rem",
              fontSize: "11px",
              border: "1px solid var(--color-border)",
              color: "var(--color-text-main)",
              backgroundColor: "transparent",
              opacity:
                unreadCount === 0 || markAllStatus === "loading" ? 0.6 : 1,
            }}
          >
            <CheckCheck size={14} className="me-1" />
            {markAllStatus === "loading" ? "Marking..." : "Mark all read"}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
        <span
          className="d-flex align-items-center gap-1"
          style={{ fontSize: "12px", color: "var(--color-text-muted)" }}
        >
          <Filter size={14} /> Filter:
        </span>
        {FILTERS.map((f) => {
          const isActive = activeFilter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setActiveFilter(f.key)}
              className="btn btn-sm rounded-pill"
              style={{
                padding: "0.25rem 0.8rem",
                fontSize: "11px",
                backgroundColor: isActive
                  ? "var(--color-primary)"
                  : "var(--color-bg-panel)",
                color: isActive ? "#ffffff" : "var(--color-text-muted)",
                border: `1px solid ${
                  isActive ? "var(--color-primary)" : "var(--color-border)"
                }`,
                boxShadow: isActive ? "0 0 10px rgba(243,146,40,0.6)" : "none",
                transition: "all 0.15s ease-in-out",
              }}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Error */}
      {error && (
        <div
          className="p-3 rounded-3 mb-3"
          style={{
            backgroundColor: "rgba(248,113,113,0.1)",
            border: "1px solid rgba(248,113,113,0.4)",
            fontSize: "12px",
            color: "#fecaca",
          }}
        >
          {error}
        </div>
      )}

      {/* List */}
      <div
        className="border rounded-3 p-3 p-md-4"
        style={{
          backgroundColor: "var(--color-bg-panel)",
          minHeight: "40vh",
        }}
      >
        {filteredItems.length === 0 ? (
          <p
            className="text-center mb-0"
            style={{ fontSize: "14px", color: "var(--color-text-muted)" }}
          >
            {items.length === 0
              ? "You don't have any notifications yet."
              : "No notifications match this filter."}
          </p>
        ) : (
          <ul className="list-unstyled mb-0">
            {filteredItems.map((n) => {
              const entityType = n.entity_type || n.type;
              const isRead = !!n.is_read;

              return (
                <li
                  key={n.notification_id || n.id || n.created_at}
                  className="mb-2"
                >
                  <button
                    type="button"
                    onClick={() => handleClickNotification(n)}
                    className="w-100 text-start border-0 bg-transparent p-0"
                  >
                    <div
                      className="d-flex flex-column rounded-3 border p-3"
                      style={{
                        gap: "0.25rem",
                        opacity: isRead ? 0.75 : 1,
                        borderColor: isRead
                          ? "rgba(255,255,255,0.1)"
                          : "rgba(243,146,40,0.4)",
                        backgroundColor: isRead
                          ? "transparent"
                          : "rgba(243,146,40,0.03)",
                        transition: "all 0.15s ease-in-out",
                      }}
                    >
                      <div className="d-flex align-items-start justify-content-between gap-3">
                        <div className="d-flex align-items-start gap-2">
                          <div
                            className="rounded-circle"
                            style={{
                              marginTop: "0.15rem",
                              padding: "0.35rem",
                              backgroundColor: "rgba(0,0,0,0.3)",
                            }}
                          >
                            {typeIcon(entityType)}
                          </div>
                          <div>
                            <div className="d-flex align-items-center gap-2">
                              <span
                                className="fw-semibold"
                                style={{
                                  fontSize: "14px",
                                  color: "var(--color-text-main)",
                                }}
                              >
                                {n.title || "Notification"}
                              </span>
                              {!isRead && (
                                <span
                                  className="badge rounded-pill"
                                  style={{
                                    fontSize: "9px",
                                    padding: "0.15rem 0.5rem",
                                    backgroundColor: "var(--color-primary)",
                                    color: "#ffffff",
                                  }}
                                >
                                  New
                                </span>
                              )}
                            </div>
                            <p
                              className="mb-0"
                              style={{
                                fontSize: "11px",
                                color: "var(--color-text-muted)",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                              }}
                            >
                              {n.body || n.message || "Update available."}
                            </p>
                          </div>
                        </div>

                        <div className="d-flex flex-column align-items-end gap-1">
                          <span
                            style={{
                              fontSize: "9px",
                              color: "var(--color-text-muted)",
                            }}
                          >
                            {fmtDate(n.created_at)}
                          </span>
                          <span
                            className="badge rounded-pill"
                            style={{
                              fontSize: "9px",
                              padding: "0.15rem 0.6rem",
                              backgroundColor: "rgba(0,0,0,0.25)",
                              color: "var(--color-text-muted)",
                            }}
                          >
                            {typeLabel(entityType)}
                          </span>
                        </div>
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
