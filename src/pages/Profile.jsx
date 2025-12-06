// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getUserById, updateUserInfo } from "../features/user/userSlice";
import userApi from "../api/userApi";
import axiosClient from "../api/axiosClient";
import { fetchNotifications } from "../features/notifications/notificationsSlice";
import { Link } from "react-router-dom";

export default function Profile() {
  const dispatch = useAppDispatch();
  const { user, status } = useAppSelector((state) => state.user);
  const authUser = useAppSelector((state) => state.auth.user);
  const [form, setForm] = useState({});
  const [feedback, setFeedback] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  // Modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Password change
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordMsg, setPasswordMsg] = useState("");

  // Share credit (stepper)
  const [shareStep, setShareStep] = useState(1);
  const [receiverEmail, setReceiverEmail] = useState("");
  const [receiverData, setReceiverData] = useState(null);
  const [amount, setAmount] = useState("");
  const [shareMsg, setShareMsg] = useState("");
  const [shareLoading, setShareLoading] = useState(false);

  useEffect(() => {
    dispatch(getUserById());
  }, [dispatch]);

  useEffect(() => {
    if (user?.profile_id) {
      dispatch(fetchNotifications());
    }
  }, [dispatch, user?.profile_id]);

  useEffect(() => {
    if (user) {
      setForm(user);
      setIsActive(!!authUser?.is_active);
    }
  }, [user, authUser]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFeedback("");
  };

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const handleImageChange = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  if (file.size > MAX_IMAGE_SIZE) {
    setFeedback("❌ Image is too large. Max size is 5 MB.");
    setImageFile(null);
    // reset the input so user can pick again
    e.target.value = "";
    return;
  }

  setFeedback(""); // clear old errors
  setImageFile(file);
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let profile_url = form.profile_url;

      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        const res = await userApi.uploadImage(formData);
        profile_url = res.data.url; // e.g. /uploads/...
      }

      const { profile_id, first_name, last_name, profession } = form;
      const payload = {
        profile_id,
        first_name,
        last_name,
        profession,
        profile_url,
      };

      await userApi.updateUser(payload);

      // update UI immediately
      const updatedUser = { ...form, profile_url };
      setForm(updatedUser);
      localStorage.setItem("user_data", JSON.stringify(updatedUser));
      dispatch(getUserById());
      setFeedback("✅ Profile updated successfully!");
      setShowEditModal(false);
      setImageFile(null);
    } catch (err) {
      setFeedback(`❌ ${err.message}`);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMsg("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMsg("❌ New passwords do not match");
      return;
    }

    try {
      const payload = {
        userEmail: form.user_email,
        current_password: passwordForm.currentPassword,
        new_password: passwordForm.newPassword,
        reEnterpassword: passwordForm.confirmPassword,
      };

      const res = await userApi.changePassword(payload);
      setPasswordMsg(
        `✅ ${res.data.message || "Password updated successfully"}`
      );
      setTimeout(() => setShowPasswordModal(false), 1200);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setPasswordMsg(`❌ ${err.message}`);
    }
  };

  // ---------- Share Credit flow ----------
  const resetShareState = () => {
    setShowShareModal(false);
    setShareStep(1);
    setReceiverEmail("");
    setReceiverData(null);
    setAmount("");
    setShareMsg("");
    setShareLoading(false);
  };

  const handleCheckUser = async (e) => {
    e.preventDefault();
    setShareMsg("");
    setShareLoading(true);
    try {
      const res = await axiosClient.post("/user/getUserByEmail", {
        user_email: receiverEmail,
      });

      if (res.data?.userinfo) {
        setReceiverData(res.data.userinfo);
        setShareStep(2);
      } else {
        setShareMsg("❌ No user found with that email.");
        setShareStep(3);
      }
    } catch (err) {
      setShareMsg(`❌ ${err.message}`);
      setShareStep(3);
    } finally {
      setShareLoading(false);
    }
  };

  const handleTransferCredit = async (e) => {
    e.preventDefault();
    setShareMsg("");
    setShareLoading(true);

    const amt = parseInt(amount, 10);
    if (isNaN(amt) || amt <= 0) {
      setShareMsg("❌ Enter a valid amount greater than 0.");
      setShareStep(3);
      setShareLoading(false);
      return;
    }
    if ((form.credit_balance ?? 0) < amt) {
      setShareMsg("❌ Insufficient credits.");
      setShareStep(3);
      setShareLoading(false);
      return;
    }

    try {
      const res = await axiosClient.post("/user/transfer", {
        receiver_email: receiverEmail,
        amount: String(amt),
      });

      const newBalance = Math.max((form.credit_balance ?? 0) - amt, 0);
      const updated = { ...form, credit_balance: newBalance };
      setForm(updated);
      localStorage.setItem("user_data", JSON.stringify(updated));
      dispatch(getUserById());
      dispatch(fetchNotifications())

      setShareMsg(
        `✅ ${res.data?.message || "Credit transferred successfully!"}`
      );
      setShareStep(3);
    } catch (err) {
      setShareMsg(`❌ ${err.message}`);
      setShareStep(3);
    } finally {
      setShareLoading(false);
    }
  };
const truncate = (text = "", max = 90) =>
  text.length > max ? text.slice(0, max - 1) + "…" : text;

const { items: notifications = [] } = useAppSelector(
  (s) => s.notifications || {}
);

const recentNotifications = [...notifications]
  .sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
  .slice(0, 3);


  const imgSrc = form.profile_url
    ? `${import.meta.env.VITE_API_IMG_URL}${form.profile_url}?t=${Date.now()}`
    : "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  if (status === "loading" && !user) {
    return (
      <div
        className="text-center"
        style={{ padding: "2.5rem 0", color: "var(--color-text-muted)" }}
      >
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className="text-center"
        style={{ padding: "2.5rem 0", color: "#ef4444" }}
      >
        Unable to load user profile.
      </div>
    );
  }

  // status badge styles
  const statusStyle = isActive
    ? {
        backgroundColor: "rgba(34,197,94,0.2)",
        color: "#4ade80",
        border: "1px solid rgba(34,197,94,0.3)",
      }
    : {
        backgroundColor: "rgba(239,68,68,0.2)",
        color: "#fca5a5",
        border: "1px solid rgba(239,68,68,0.3)",
      };

return (
  <>
    <h2
      className="fw-semibold mb-3 mb-md-4"
      style={{
        fontSize: "1.4rem",
        color: "var(--color-text-main)",
      }}
    >
      Profile
    </h2>

    <div
      className="profile-card mx-auto rounded-4 border shadow-sm w-100"
      style={{
        maxWidth: "56rem",
        transition: "color 0.2s, background-color 0.2s",
        backgroundColor: "var(--color-bg-panel)",
        borderColor: "var(--color-border)",
        color: "var(--color-text-main)",
      }}
    >
      {/* Inner padding wrapper so we can make it responsive */}
      <div className="p-3 p-sm-4">
        {/* Header */}
        <div
          className="d-flex flex-column flex-md-row align-items-center align-items-md-start gap-3 gap-md-4 mb-3 mb-md-4 pb-3 pb-md-4"
          style={{
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <img
            src={imgSrc}
            alt="User Avatar"
            style={{
              width: "6rem",
              height: "6rem",
              borderRadius: "999px",
              objectFit: "cover",
              border: "4px solid var(--color-primary)",
            }}
          />

          <div className="flex-grow-1 text-center text-md-start">
            <h2
              className="fw-semibold mb-1"
              style={{
                fontSize: "1.5rem",
                color: "var(--color-primary)",
              }}
            >
              {form.first_name} {form.last_name}
            </h2>
            <p
              className="mb-1"
              style={{
                fontSize: "0.9rem",
                color: "var(--color-text-muted)",
              }}
            >
              {form.profession || "—"}
            </p>
            <p
              className="mb-2"
              style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}
            >
              {form.user_email}
            </p>

            <button
              type="button"
              onClick={() => setShowEditModal(true)}
              className="btn btn-sm mt-1"
              style={{
                fontSize: "0.75rem",
                padding: "0.3rem 0.9rem",
                borderRadius: "999px",
                fontWeight: 500,
                border: "1px solid var(--color-primary)",
                backgroundColor: "transparent",
                color: "var(--color-primary)",
              }}
            >
              Edit
            </button>
          </div>

          <div className="d-flex flex-row flex-md-column align-items-center align-items-md-end gap-2">
            <span
              className="badge rounded-pill"
              style={{
                fontSize: "0.7rem",
                padding: "0.25rem 0.75rem",
                fontWeight: 500,
                ...statusStyle,
              }}
            >
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <div
              className="rounded-3 border shadow-sm h-100"
              style={{
                padding: "0.9rem",
                borderColor: "var(--color-border)",
              }}
            >
              <h4
                className="fw-semibold mb-2 text-uppercase"
                style={{
                  fontSize: "0.8rem",
                  letterSpacing: "0.08em",
                  color: "var(--color-primary)",
                }}
              >
                Account Details
              </h4>
              <ul
                className="mb-0"
                style={{
                  listStyle: "none",
                  paddingLeft: 0,
                  fontSize: "0.9rem",
                }}
              >
                <li className="mb-1">
                  <strong>Joined:</strong>{" "}
                  {form.created_at
                    ? new Date(form.created_at).toLocaleDateString()
                    : "—"}
                </li>
                <li className="mb-1">
                  <strong>Credit Balance:</strong>{" "}
                  <span
                    className="fw-semibold"
                    style={{ color: "var(--color-primary)" }}
                  >
                    {form.credit_balance ?? 0} Credits
                  </span>
                </li>
                {form?.free_trial == 1 && (
                  <li className="mb-1">
                    <strong>Free Trial:</strong>{" "}
                    {form.free_trial ? "Active" : "Used"}
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div
              className="rounded-3 border shadow-sm h-100"
              style={{
                padding: "0.9rem",
                borderColor: "var(--color-border)",
              }}
            >
              <h4
                className="fw-semibold mb-2 text-uppercase"
                style={{
                  fontSize: "0.8rem",
                  letterSpacing: "0.08em",
                  color: "var(--color-primary)",
                }}
              >
                Recent Activity
              </h4>
              <ul
                className="mb-0"
                style={{
                  listStyle: "none",
                  paddingLeft: 0,
                  fontSize: "0.9rem",
                }}
              >
                {recentNotifications.length === 0 ? (
                  <li
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    No recent activity yet.
                  </li>
                ) : (
                  recentNotifications.map((n) => (
                    <li
                      key={n.notification_id}
                      className="mb-2"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      <div
                        style={{
                          fontSize: "0.8rem",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        <strong>{n.title}: </strong>
                        {truncate(n.body, 90)}
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Additional Options */}
        <div className="row g-3 mt-3 mt-md-4">
          {/* Share My Credit */}
          <div className="col-12 col-md-6">
            <div
              className="rounded-3 border shadow-sm h-100"
              style={{
                padding: "1rem",
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-bg-panel)",
                color: "var(--color-text-main)",
              }}
            >
              <h4
                className="fw-semibold mb-2 text-uppercase d-flex align-items-center"
                style={{
                  fontSize: "0.8rem",
                  letterSpacing: "0.08em",
                  color: "var(--color-primary)",
                }}
              >
                💰 Share My Credit
              </h4>

              <p
                className="mb-3"
                style={{
                  fontSize: "0.9rem",
                  color: "var(--color-text-muted)",
                }}
              >
                You currently have{" "}
                <span
                  className="fw-semibold"
                  style={{ color: "var(--color-primary)" }}
                >
                  {form.credit_balance ?? 0}
                </span>{" "}
                credits. Share credits with a friend.
              </p>

              <button
                type="button"
                onClick={() => setShowShareModal(true)}
                className="btn"
                style={{
                  fontSize: "0.85rem",
                  padding: "0.45rem 1.25rem",
                  borderRadius: "0.5rem",
                  fontWeight: 500,
                  color: "#fff",
                  backgroundColor: "var(--color-primary)",
                }}
              >
                Share My Credit
              </button>
            </div>
          </div>

          {/* Change Password CTA */}
          <div className="col-12 col-md-6">
            <div
              className="rounded-3 border shadow-sm h-100"
              style={{
                padding: "1rem",
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-bg-panel)",
                color: "var(--color-text-main)",
              }}
            >
              <h4
                className="fw-semibold mb-2 text-uppercase d-flex align-items-center"
                style={{
                  fontSize: "0.8rem",
                  letterSpacing: "0.08em",
                  color: "var(--color-primary)",
                }}
              >
                🔒 Security Settings
              </h4>

              <p
                className="mb-3"
                style={{
                  fontSize: "0.9rem",
                  color: "var(--color-text-muted)",
                }}
              >
                Keep your account secure by changing your password regularly.
              </p>

              <button
                type="button"
                onClick={() => setShowPasswordModal(true)}
                className="btn"
                style={{
                  fontSize: "0.85rem",
                  padding: "0.45rem 1.25rem",
                  borderRadius: "0.5rem",
                  fontWeight: 500,
                  color: "#fff",
                  backgroundColor: "var(--color-primary)",
                }}
              >
                Change Password
              </button>

              <div
                className="mt-3"
                style={{
                  fontSize: "0.75rem",
                  color: "var(--color-text-muted)",
                }}
              >
                <p className="mb-0">
                  💡 Tip: Use letters, numbers, and special symbols.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="text-center mt-4 pt-3"
          style={{
            borderTop: "1px solid var(--color-border)",
            fontSize: "0.85rem",
            color: "var(--color-text-muted)",
          }}
        >
          <p className="mb-0">
            Member since{" "}
            <span style={{ color: "var(--color-primary)" }}>
              {form.created_at
                ? new Date(form.created_at).toLocaleDateString()
                : "Unknown"}
            </span>{" "}
            |{" "}
            <span style={{ opacity: 0.7 }}>
              Last updated:{" "}
              {form.updated_at
                ? new Date(form.updated_at).toLocaleDateString()
                : "—"}
            </span>
          </p>
        </div>
      </div>

      {/* -------------------- Modals -------------------- */}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1050,
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            className="position-relative rounded-4 border shadow-lg w-100 mx-3 mx-sm-0"
            style={{
              maxWidth: "28rem",
              padding: "1.5rem 1.75rem",
              backgroundColor: "var(--color-bg-panel)",
              borderColor: "var(--color-border)",
              color: "var(--color-text-main)",
            }}
          >
            <button
              type="button"
              className="btn-close theme-close-btn"
              aria-label="Close"
              onClick={() => setShowEditModal(false)}
              style={{
                position: "absolute",
                top: "0.75rem",
                right: "0.75rem",
              }}
            />

            <h3
              className="text-center fw-semibold mb-4"
              style={{
                fontSize: "1.25rem",
                color: "var(--color-primary)",
              }}
            >
              Edit Profile
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="text"
                  name="first_name"
                  value={form.first_name || ""}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="w-100 p-3 border rounded-md bg-transparent focus:ring-2 focus:ring-[var(--color-primary)]"
                  style={{
                    fontSize: "0.9rem",
                    backgroundColor: "transparent",
                    borderColor: "var(--color-border)",
                    color: "var(--color-text-main)",
                  }}
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  name="last_name"
                  value={form.last_name || ""}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="w-100 p-3 border rounded-md bg-transparent focus:ring-2 focus:ring-[var(--color-primary)]"
                  style={{
                    fontSize: "0.9rem",
                    backgroundColor: "transparent",
                    borderColor: "var(--color-border)",
                    color: "var(--color-text-main)",
                  }}
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  name="profession"
                  value={form.profession || ""}
                  onChange={handleChange}
                  placeholder="Profession"
                  className="w-100 p-3 border rounded-md bg-transparent focus:ring-2 focus:ring-[var(--color-primary)]"
                  style={{
                    fontSize: "0.9rem",
                    backgroundColor: "transparent",
                    borderColor: "var(--color-border)",
                    color: "var(--color-text-main)",
                  }}
                />
              </div>

              <div className="mb-3">
                <label
                  className="form-label mb-1"
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--color-text-muted)",
                  }}
                >
                  Profile Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-100 p-2 border rounded-md bg-transparent focus:ring-2 focus:ring-[var(--color-primary)]"
                  style={{
                    fontSize: "0.85rem",
                    backgroundColor: "transparent",
                    borderColor: "var(--color-border)",
                    color: "var(--color-text-main)",
                    cursor: "pointer",
                  }}
                />
              </div>

              {feedback && (
                <p
                  className="text-center rounded-3 mb-3"
                  style={{
                    fontSize: "0.85rem",
                    padding: "0.4rem 0.6rem",
                    color: feedback.startsWith("✅") ? "#4ade80" : "#f87171",
                    backgroundColor: feedback.startsWith("✅")
                      ? "rgba(34,197,94,0.08)"
                      : "rgba(248,113,113,0.08)",
                  }}
                >
                  {feedback}
                </p>
              )}

              <div className="d-flex justify-content-center">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn"
                  style={{
                    padding: "0.4rem 1.5rem",
                    borderRadius: "0.5rem",
                    color: "#fff",
                    fontWeight: 500,
                    fontSize: "0.9rem",
                    backgroundColor: "var(--color-primary)",
                    opacity: status === "loading" ? 0.7 : 1,
                  }}
                >
                  {status === "loading" ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1050,
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            className="position-relative rounded-4 border shadow-lg w-100 mx-3 mx-sm-0"
            style={{
              maxWidth: "28rem",
              padding: "1.5rem 1.75rem",
              backgroundColor: "var(--color-bg-panel)",
              borderColor: "var(--color-border)",
              color: "var(--color-text-main)",
            }}
          >
            <button
              type="button"
              className="btn-close theme-close-btn"
              aria-label="Close"
              onClick={() => setShowPasswordModal(false)}
              style={{
                position: "absolute",
                top: "0.75rem",
                right: "0.75rem",
              }}
            />

            <h3
              className="text-center fw-semibold mb-4"
              style={{
                fontSize: "1.25rem",
                color: "var(--color-primary)",
              }}
            >
              Change Password
            </h3>

            <form onSubmit={handlePasswordChange}>
              <div className="mb-3">
                <input
                  type="password"
                  placeholder="Current Password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      currentPassword: e.target.value,
                    })
                  }
                  className="w-100 p-3 border rounded-md bg-transparent focus:ring-2 focus:ring-[var(--color-primary)]"
                  style={{
                    fontSize: "0.9rem",
                    backgroundColor: "transparent",
                    borderColor: "var(--color-border)",
                    color: "var(--color-text-main)",
                    borderRadius: "0.85rem",
                  }}
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  placeholder="New Password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-100 p-3 border rounded-md bg-transparent focus:ring-2 focus:ring-[var(--color-primary)]"
                  style={{
                    fontSize: "0.9rem",
                    backgroundColor: "transparent",
                    borderColor: "var(--color-border)",
                    color: "var(--color-text-main)",
                    borderRadius: "0.85rem",
                  }}
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-100 p-3 border rounded-md bg-transparent focus:ring-2 focus:ring-[var(--color-primary)]"
                  style={{
                    fontSize: "0.9rem",
                    backgroundColor: "transparent",
                    borderColor: "var(--color-border)",
                    color: "var(--color-text-main)",
                    borderRadius: "0.85rem",
                  }}
                />
              </div>

              {passwordMsg && (
                <p
                  className="text-center rounded-3 mb-3"
                  style={{
                    fontSize: "0.85rem",
                    padding: "0.4rem 0.6rem",
                    color: passwordMsg.startsWith("✅") ? "#4ade80" : "#f87171",
                    backgroundColor: passwordMsg.startsWith("✅")
                      ? "rgba(34,197,94,0.08)"
                      : "rgba(248,113,113,0.08)",
                  }}
                >
                  {passwordMsg}
                </p>
              )}

              <div className="d-flex justify-content-center">
                <button
                  type="submit"
                  className="btn"
                  style={{
                    padding: "0.4rem 1.5rem",
                    borderRadius: "0.5rem",
                    color: "#fff",
                    fontWeight: 500,
                    fontSize: "0.9rem",
                    backgroundColor: "var(--color-primary)",
                  }}
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Share Credit Modal */}
      {showShareModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1050,
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            className="position-relative rounded-4 border shadow-lg w-100 mx-3 mx-sm-0"
            style={{
              maxWidth: "28rem",
              padding: "1.5rem 1.75rem",
              backgroundColor: "var(--color-bg-panel)",
              borderColor: "var(--color-border)",
              color: "var(--color-text-main)",
            }}
          >
            <button
              type="button"
              onClick={resetShareState}
              className="btn-close theme-close-btn"
              aria-label="Close"
              style={{
                position: "absolute",
                top: "0.75rem",
                right: "0.75rem",
              }}
            />

            <h3
              className="text-center fw-semibold mb-4"
              style={{
                fontSize: "1.25rem",
                color: "var(--color-primary)",
              }}
            >
              Share Credits
            </h3>

            {/* Step 1: Email */}
            {shareStep === 1 && (
              <form onSubmit={handleCheckUser}>
                <p
                  className="text-center mb-3"
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--color-text-muted)",
                  }}
                >
                  Enter the recipient&apos;s email to verify.
                </p>
                <div className="mb-3">
                  <input
                    type="email"
                    value={receiverEmail}
                    onChange={(e) => setReceiverEmail(e.target.value)}
                    placeholder="Receiver email"
                    required
                    className="w-100 p-2 border rounded-md bg-transparent focus:ring-2 focus:ring-[var(--color-primary)]"
                    style={{
                      fontSize: "0.9rem",
                      backgroundColor: "transparent",
                      borderColor: "var(--color-border)",
                      color: "var(--color-text-main)",
                      borderRadius: "0.85rem",
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={shareLoading}
                  className="btn w-100"
                  style={{
                    padding: "0.45rem 1.25rem",
                    borderRadius: "0.5rem",
                    color: "#fff",
                    fontWeight: 500,
                    fontSize: "0.9rem",
                    backgroundColor: "var(--color-primary)",
                    opacity: shareLoading ? 0.8 : 1,
                  }}
                >
                  {shareLoading ? "Checking..." : "Next"}
                </button>
              </form>
            )}

            {/* Step 2: Amount */}
            {shareStep === 2 && receiverData && (
              <form onSubmit={handleTransferCredit}>
                <p
                  className="text-center mb-3"
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--color-text-muted)",
                  }}
                >
                  Sending credit to{" "}
                  <strong style={{ color: "var(--color-primary)" }}>
                    {receiverData.user_email}
                  </strong>
                </p>

                <div className="mb-3">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Amount to send"
                    required
                    min="1"
                    className="form-control"
                    style={{
                      fontSize: "0.9rem",
                      backgroundColor: "transparent",
                      borderColor: "var(--color-border)",
                      color: "var(--color-text-main)",
                    }}
                  />
                </div>

                <div className="d-flex flex-column flex-sm-row gap-2">
                  <button
                    type="submit"
                    disabled={shareLoading}
                    className="btn flex-grow-1"
                    style={{
                      padding: "0.45rem 1.25rem",
                      borderRadius: "0.5rem",
                      color: "#fff",
                      fontWeight: 500,
                      fontSize: "0.9rem",
                      backgroundColor: "var(--color-primary)",
                      opacity: shareLoading ? 0.8 : 1,
                    }}
                  >
                    {shareLoading ? "Sending..." : "Send Credit"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShareStep(1)}
                    className="btn flex-grow-1"
                    style={{
                      padding: "0.45rem 1.25rem",
                      borderRadius: "0.5rem",
                      fontSize: "0.8rem",
                      backgroundColor: "transparent",
                      border: "1px solid var(--color-border)",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    Back
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Result */}
            {shareStep === 3 && (
              <div className="text-center">
                <p
                  className="rounded-3 mb-3"
                  style={{
                    fontSize: "0.85rem",
                    padding: "0.6rem 0.8rem",
                    color: shareMsg.startsWith("✅") ? "#4ade80" : "#f87171",
                    backgroundColor: shareMsg.startsWith("✅")
                      ? "rgba(34,197,94,0.08)"
                      : "rgba(248,113,113,0.08)",
                  }}
                >
                  {shareMsg}
                </p>
                <button
                  type="button"
                  onClick={resetShareState}
                  className="btn"
                  style={{
                    padding: "0.45rem 1.5rem",
                    borderRadius: "0.5rem",
                    color: "#fff",
                    fontWeight: 500,
                    fontSize: "0.9rem",
                    backgroundColor: "var(--color-primary)",
                  }}
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* ------------------ end modals ------------------ */}
    </div>
  </>
);


}
