// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getUserById, updateUserInfo } from "../features/user/userSlice";
import userApi from "../api/userApi";
import axiosClient from "../api/axiosClient";

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
    if (user) {
      setForm(user);
      setIsActive(!!authUser?.is_active);
    }
  }, [user, authUser]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFeedback("");
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
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
  setReceiverData(res.data.userinfo); // ✅ store the nested object
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

    // validate amount
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

      // Optimistically update local balance
      const newBalance = Math.max((form.credit_balance ?? 0) - amt, 0);
      const updated = { ...form, credit_balance: newBalance };
      setForm(updated);
      localStorage.setItem("user_data", JSON.stringify(updated));
      dispatch(getUserById());

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


  const imgSrc = form.profile_url
    ? `${import.meta.env.VITE_API_IMG_URL}${form.profile_url}?t=${Date.now()}`
    : "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  if (status === "loading" && !user) {
    return (
      <div className="text-center py-10 text-[var(--color-text-muted)]">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-10 text-red-500">
        Unable to load user profile.
      </div>
    );
  }

  return (
    <>
      <h2 className="text-2xl font-semibold text-[var(--color-text-main)]">
        Profile
      </h2>

      <div
        className="p-8 rounded-xl shadow-md border transition-colors duration-300 max-w-4xl mx-auto"
        style={{
          backgroundColor: "var(--color-bg-panel)",
          borderColor: "var(--color-border)",
          color: "var(--color-text-main)",
        }}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8 border-b pb-6">
          <img
            src={imgSrc}
            alt="User Avatar"
            className="w-28 h-28 rounded-full object-cover border-4"
            style={{ borderColor: "var(--color-primary)" }}
          />

          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-semibold text-[var(--color-primary)]">
              {form.first_name} {form.last_name}
            </h2>
            <p className="text-[var(--color-text-muted)] text-sm mt-1">
              {form.profession || "—"}
            </p>
            <p className="text-[var(--color-text-muted)] mt-2">
              {form.user_email}
            </p>

            <button
              onClick={() => setShowEditModal(true)}
              className="mt-3 text-xs px-3 py-1 rounded-full font-medium cursor-pointer border"
              style={{
                color: "var(--color-primary)",
                borderColor: "var(--color-primary)",
                background: "transparent",
              }}
            >
              Edit
            </button>
          </div>

          <div className="flex flex-col items-center md:items-end gap-2">
            <span
              className={`text-xs px-3 py-1 rounded-full font-medium ${
                isActive
                  ? "bg-green-500/20 text-green-400 border border-green-400/30"
                  : "bg-red-500/20 text-red-400 border border-red-400/30"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        {/* Details Grid (original design) */}
        <div className="grid md:grid-cols-2 gap-6">
          <div
            className="p-4 rounded-lg shadow-sm border"
            style={{ borderColor: "var(--color-border)" }}
          >
            <h4 className="text-sm font-semibold text-[var(--color-primary)] mb-2 uppercase tracking-wide">
              Account Details
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <strong>Joined:</strong>{" "}
                {form.created_at
                  ? new Date(form.created_at).toLocaleDateString()
                  : "—"}
              </li>
              <li>
                <strong>Credit Balance:</strong>{" "}
                <span className="text-[var(--color-primary)] font-semibold">
                  {form.credit_balance ?? 0} Credits
                </span>
              </li>
              {form?.free_trial == 1 && (
                <li>
                  <strong>Free Trial:</strong>{" "}
                  {form.free_trial ? "Active" : "Used"}
                </li>
              )}
            </ul>
          </div>

          <div
            className="p-4 rounded-lg shadow-sm border"
            style={{ borderColor: "var(--color-border)" }}
          >
            <h4 className="text-sm font-semibold text-[var(--color-primary)] mb-2 uppercase tracking-wide">
              Recent Activity
            </h4>
            <ul className="text-sm space-y-2">
              <li>🗓️ Joined “Mock Interview Practice” challenge</li>
              <li>💬 Completed a Technical Interview round</li>
              <li>⭐ Earned 25 new credits from community answers</li>
            </ul>
          </div>
        </div>

        {/* Additional Options */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {/* Share My Credit */}
          <div
            className="p-5 rounded-lg border shadow-sm transition-all duration-300 hover:shadow-md hover:border-[var(--color-primary)]"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-bg-panel)",
              color: "var(--color-text-main)",
            }}
          >
            <h4 className="text-sm font-semibold text-[var(--color-primary)] mb-3 uppercase tracking-wide flex items-center gap-2">
              💰 Share My Credit
            </h4>

            <p className="text-sm text-[var(--color-text-muted)] mb-4">
              You currently have{" "}
              <span className="text-[var(--color-primary)] font-semibold">
                {form.credit_balance ?? 0}
              </span>{" "}
              credits. Share credits with a friend.
            </p>

            <button
              onClick={() => setShowShareModal(true)}
              className="px-5 py-2 rounded-md text-white text-sm font-medium transition hover:opacity-90"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              Share My Credit
            </button>
          </div>

          {/* Change Password CTA */}
          <div
            className="p-5 rounded-lg border shadow-sm transition-all duration-300 hover:shadow-md hover:border-[var(--color-primary)]"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-bg-panel)",
              color: "var(--color-text-main)",
            }}
          >
            <h4 className="text-sm font-semibold text-[var(--color-primary)] mb-3 uppercase tracking-wide flex items-center gap-2">
              🔒 Security Settings
            </h4>

            <p className="text-sm text-[var(--color-text-muted)] mb-4">
              Keep your account secure by changing your password regularly.
            </p>

            <button
              onClick={() => setShowPasswordModal(true)}
              className="px-5 py-2 text-sm rounded-md font-medium transition hover:text-white hover:shadow-md cursor-pointer"
              style={{ backgroundColor: "var(--color-primary)", color: "#fff" }}
            >
              Change Password
            </button>

            <div className="mt-4 text-xs text-[var(--color-text-muted)]">
              <p>💡 Tip: Use letters, numbers, and special symbols.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-sm text-center text-[var(--color-text-muted)] border-t pt-4">
          <p>
            Member since{" "}
            <span className="text-[var(--color-primary)]">
              {form.created_at
                ? new Date(form.created_at).toLocaleDateString()
                : "Unknown"}
            </span>{" "}
            |{" "}
            <span className="opacity-70">
              Last updated:{" "}
              {form.updated_at
                ? new Date(form.updated_at).toLocaleDateString()
                : "—"}
            </span>
          </p>
        </div>

        {/* -------------------- Modals -------------------- */}

        {/* Edit Profile Modal */}
        {showEditModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm">
            <div
              className="rounded-xl shadow-xl p-8 w-full max-w-md relative border transition-all duration-300"
              style={{
                backgroundColor: "var(--color-bg-panel)",
                borderColor: "var(--color-border)",
                color: "var(--color-text-main)",
              }}
            >
              <button
                className="absolute top-3 right-3 text-[var(--color-text-muted)] hover:text-red-500"
                onClick={() => setShowEditModal(false)}
              >
                ✕
              </button>

              <h3 className="text-xl font-semibold text-center text-[var(--color-primary)] mb-6">
                Edit Profile
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="first_name"
                  value={form.first_name || ""}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="w-full px-4 py-2 rounded-md border bg-transparent focus:ring-2 focus:ring-[var(--color-primary)]"
                  style={{
                    borderColor: "var(--color-border)",
                    color: "var(--color-text-main)",
                  }}
                />
                <input
                  type="text"
                  name="last_name"
                  value={form.last_name || ""}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="w-full px-4 py-2 rounded-md border bg-transparent focus:ring-2 focus:ring-[var(--color-primary)]"
                  style={{
                    borderColor: "var(--color-border)",
                    color: "var(--color-text-main)",
                  }}
                />
                <input
                  type="text"
                  name="profession"
                  value={form.profession || ""}
                  onChange={handleChange}
                  placeholder="Profession"
                  className="w-full px-4 py-2 rounded-md border bg-transparent focus:ring-2 focus:ring-[var(--color-primary)]"
                  style={{
                    borderColor: "var(--color-border)",
                    color: "var(--color-text-main)",
                  }}
                />

                <div>
                  <label className="block text-sm mb-1 text-[var(--color-text-muted)]">
                    Profile Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full border rounded-md px-3 py-2 text-sm bg-transparent"
                    style={{
                      borderColor: "var(--color-border)",
                      color: "var(--color-text-main)",
                    }}
                  />
                </div>

                {feedback && (
                  <p
                    className={`text-sm text-center p-2 rounded-md ${
                      feedback.startsWith("✅")
                        ? "text-green-500 bg-green-100/10"
                        : "text-red-500 bg-red-100/10"
                    }`}
                  >
                    {feedback}
                  </p>
                )}

                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="px-6 py-2 rounded-md text-white font-medium transition"
                    style={{
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
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm">
            <div
              className="rounded-xl shadow-xl p-8 w-full max-w-md relative border transition-all duration-300"
              style={{
                backgroundColor: "var(--color-bg-panel)",
                borderColor: "var(--color-border)",
                color: "var(--color-text-main)",
              }}
            >
              <button
                className="absolute top-3 right-3 text-[var(--color-text-muted)] hover:text-red-500"
                onClick={() => setShowPasswordModal(false)}
              >
                ✕
              </button>

              <h3 className="text-xl font-semibold text-center text-[var(--color-primary)] mb-6">
                Change Password
              </h3>

              <form onSubmit={handlePasswordChange} className="space-y-4">
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
                  className="w-full px-4 py-2 rounded-md border bg-transparent focus:ring-2 focus:ring-[var(--color-primary)]"
                  style={{
                    borderColor: "var(--color-border)",
                    color: "var(--color-text-main)",
                  }}
                />
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
                  className="w-full px-4 py-2 rounded-md border bg-transparent focus:ring-2 focus:ring-[var(--color-primary)]"
                  style={{
                    borderColor: "var(--color-border)",
                    color: "var(--color-text-main)",
                  }}
                />
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
                  className="w-full px-4 py-2 rounded-md border bg-transparent focus:ring-2 focus:ring-[var(--color-primary)]"
                  style={{
                    borderColor: "var(--color-border)",
                    color: "var(--color-text-main)",
                  }}
                />

                {passwordMsg && (
                  <p
                    className={`text-sm text-center p-2 rounded-md ${
                      passwordMsg.startsWith("✅")
                        ? "text-green-500 bg-green-100/10"
                        : "text-red-500 bg-red-100/10"
                    }`}
                  >
                    {passwordMsg}
                  </p>
                )}

                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-md text-white font-medium transition"
                    style={{ backgroundColor: "var(--color-primary)" }}
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
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm">
            <div
              className="rounded-xl shadow-xl p-8 w-full max-w-md relative border transition-all duration-300"
              style={{
                backgroundColor: "var(--color-bg-panel)",
                borderColor: "var(--color-border)",
                color: "var(--color-text-main)",
              }}
            >
              <button
                onClick={resetShareState}
                className="absolute top-3 right-3 text-[var(--color-text-muted)] hover:text-red-500 transition"
              >
                ✕
              </button>

              <h3 className="text-xl font-semibold text-center text-[var(--color-primary)] mb-6">
                Share Credits
              </h3>

              {/* Step 1: Email */}
              {shareStep === 1 && (
                <form onSubmit={handleCheckUser} className="space-y-4">
                  <p className="text-sm text-[var(--color-text-muted)] text-center mb-2">
                    Enter the recipient's email to verify.
                  </p>
                  <input
                    type="email"
                    value={receiverEmail}
                    onChange={(e) => setReceiverEmail(e.target.value)}
                    placeholder="Receiver email"
                    required
                    className="w-full px-4 py-2 rounded-md border bg-transparent focus:ring-2 focus:ring-[var(--color-primary)]"
                    style={{
                      borderColor: "var(--color-border)",
                      color: "var(--color-text-main)",
                    }}
                  />
                  <button
                    type="submit"
                    disabled={shareLoading}
                    className="w-full py-2 rounded-md text-white font-medium transition"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  >
                    {shareLoading ? "Checking..." : "Next"}
                  </button>
                </form>
              )}

              {/* Step 2: Amount */}
              {shareStep === 2 && receiverData && (
                <form onSubmit={handleTransferCredit} className="space-y-4">
                  <p className="text-sm text-[var(--color-text-muted)] text-center mb-2">
                    Sending credit to{" "}
                    <strong className="text-[var(--color-primary)]">
                      {receiverData.user_email}
                    </strong>
                  </p>

                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Amount to send"
                    required
                    min="1"
                    className="w-full px-4 py-2 rounded-md border bg-transparent focus:ring-2 focus:ring-[var(--color-primary)]"
                    style={{
                      borderColor: "var(--color-border)",
                      color: "var(--color-text-main)",
                    }}
                  />

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      disabled={shareLoading}
                      className="flex-1 py-2 rounded-md text-white font-medium transition"
                      style={{ backgroundColor: "var(--color-primary)" }}
                    >
                      {shareLoading ? "Sending..." : "Send Credit"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShareStep(1)}
                      className="flex-1 py-2 rounded-md border text-sm hover:bg-[var(--color-border)] transition"
                      style={{
                        borderColor: "var(--color-border)",
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
                <div className="text-center space-y-4">
                  <p
                    className={`p-3 rounded-md ${
                      shareMsg.startsWith("✅")
                        ? "text-green-500 bg-green-100/10"
                        : "text-red-500 bg-red-100/10"
                    }`}
                  >
                    {shareMsg}
                  </p>
                  <button
                    onClick={resetShareState}
                    className="px-6 py-2 rounded-md text-white font-medium transition"
                    style={{ backgroundColor: "var(--color-primary)" }}
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
