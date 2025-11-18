// src/pages/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { loginUser } from "../features/auth/authSlice";
import axiosClient from "../api/axiosClient";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, status, error } = useAppSelector(
    (state) => state.auth
  );

  const [form, setForm] = useState({ user_email: "", user_password: "" });
  const [feedback, setFeedback] = useState({ type: "", text: "" });

  // extra UI modes: "login" | "verifyEmail" | "resetPassword"
  const [mode, setMode] = useState("login");

  // email verification flow
  const [verifyOtp, setVerifyOtp] = useState("");
  const [verifyStatus, setVerifyStatus] = useState("idle"); // idle | loading
  const [verifyMsg, setVerifyMsg] = useState("");
  const [canResendVerify, setCanResendVerify] = useState(true);

  // password reset flow
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [resetPassword2, setResetPassword2] = useState("");
  const [resetStatus, setResetStatus] = useState("idle");
  const [resetMsg, setResetMsg] = useState("");
  const [resetStep, setResetStep] = useState(1); // 1 = send code, 2 = enter otp & new pwd
  const [canResendReset, setCanResendReset] = useState(true);

  // ✅ Redirect immediately when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setFeedback({
        type: "success",
        text: "Login successful! Redirecting...",
      });

      const timer = setTimeout(() => navigate("/dashboard"), 1000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, navigate]);

  // ✅ Display backend error dynamically + detect "verify your account"
  useEffect(() => {
    if (error && status === "failed") {
      setFeedback({
        type: "error",
        text: error || "Login failed. Please try again.",
      });

      if (typeof error === "string" && error.toLowerCase().includes("verify")) {
        setMode("verifyEmail");
      }
    }
  }, [error, status]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (feedback.text) setFeedback({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: "", text: "" });

    const action = await dispatch(loginUser(form));

    if (loginUser.rejected.match(action)) {
      setFeedback({
        type: "error",
        text: action.payload || "Login failed. Please try again.",
      });
    }

    if (loginUser.fulfilled.match(action)) {
      setFeedback({
        type: "success",
        text: "Login successful! Redirecting...",
      });
      setTimeout(() => navigate("/dashboard"), 1000);
    }
  };

  // ===== Email activation helpers =====
  const handleSendActivationOtp = async () => {
    setVerifyMsg("");
    if (!form.user_email) {
      setVerifyMsg("⚠️ Please enter your email in the login form first.");
      return;
    }

    if (!canResendVerify) return;

    try {
      setVerifyStatus("loading");
      setCanResendVerify(false);

      const res = await axiosClient.post("/user/sendOTP", {
        user_email: form.user_email,
      });

      setVerifyMsg(res.data?.message || "✅ Verification code sent.");
      // simple cooldown
      setTimeout(() => setCanResendVerify(true), 30000);
    } catch (err) {
      setVerifyMsg(
        err?.response?.data?.message ||
          err.message ||
          "❌ Failed to send verification code."
      );
    } finally {
      setVerifyStatus("idle");
    }
  };

  const handleVerifyActivationCode = async (e) => {
    e.preventDefault();
    setVerifyMsg("");

    if (!form.user_email || !verifyOtp.trim()) {
      setVerifyMsg("⚠️ Email and code are required.");
      return;
    }

    try {
      setVerifyStatus("loading");

      const res = await axiosClient.post("/user/verify-otp", {
        user_email: form.user_email,
        otp: verifyOtp.trim(),
      });

      setVerifyMsg(
        res.data?.message || "✅ Email verified! You can log in now."
      );
      setVerifyOtp("");

      // After short delay, go back to login mode
      setTimeout(() => {
        setMode("login");
        setFeedback({
          type: "success",
          text: "Email verified. Please login with your credentials.",
        });
        setVerifyMsg("");
      }, 1500);
    } catch (err) {
      setVerifyMsg(
        err?.response?.data?.message ||
          err.message ||
          "❌ Verification failed. Please check your code."
      );
    } finally {
      setVerifyStatus("idle");
    }
  };

  // ===== Password reset helpers =====
  const startResetFlow = () => {
    setMode("resetPassword");
    setResetMsg("");
    setResetStatus("idle");
    setResetStep(1);
    setResetEmail(form.user_email || "");
  };

  const handleSendResetOtp = async () => {
    setResetMsg("");
    if (!resetEmail) {
      setResetMsg("⚠️ Please enter your email.");
      return;
    }
    if (!canResendReset) return;

    try {
      setResetStatus("loading");
      setCanResendReset(false);

      const res = await axiosClient.post("/user/sendresetotp", {
        user_email: resetEmail,
      });

      setResetMsg(res.data?.message || "✅ Reset code sent to your email.");
      setResetStep(2);

      setTimeout(() => setCanResendReset(true), 30000);
    } catch (err) {
      setResetMsg(
        err?.response?.data?.message ||
          err.message ||
          "❌ Failed to send reset code."
      );
    } finally {
      setResetStatus("idle");
    }
  };

  const handleSubmitResetPassword = async (e) => {
    e.preventDefault();
    setResetMsg("");

    if (!resetEmail || !resetOtp || !resetPassword || !resetPassword2) {
      setResetMsg("⚠️ Please fill in all fields.");
      return;
    }

    if (resetPassword !== resetPassword2) {
      setResetMsg("❌ Passwords do not match.");
      return;
    }

    try {
      setResetStatus("loading");

      // Body shape can be adjusted to match your backend
      const res = await axiosClient.post("/user/reset-password", {
        user_email: resetEmail,
        otp: resetOtp.trim(),
        new_password: resetPassword,
        confirm_password: resetPassword2,
      });

      setResetMsg(res.data?.message || "✅ Password reset successfully.");

      // After success, go back to login
      setTimeout(() => {
        setMode("login");
        setFeedback({
          type: "success",
          text: "Password reset. Please login with your new password.",
        });
        setResetMsg("");
      }, 1500);
    } catch (err) {
      setResetMsg(
        err?.response?.data?.message ||
          err.message ||
          "❌ Failed to reset password."
      );
    } finally {
      setResetStatus("idle");
    }
  };

  // ===== Render =====
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-body)] transition-colors duration-300">
      <div
        className="w-full max-w-md p-8 rounded-xl shadow-md border"
        style={{
          backgroundColor: "var(--color-bg-panel)",
          borderColor: "var(--color-border)",
          color: "var(--color-text-main)",
        }}
      >
        <h2 className="text-2xl font-semibold text-center mb-6 text-[var(--color-primary)]">
          {mode === "login"
            ? "Welcome Back 👋"
            : mode === "verifyEmail"
            ? "Verify Your Email"
            : "Reset Your Password"}
        </h2>

        {/* ==== LOGIN FORM ==== */}
        {mode === "login" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1 text-[var(--color-text-main)]">
                Email Address
              </label>
              <input
                type="email"
                name="user_email"
                required
                value={form.user_email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                style={{
                  backgroundColor: "var(--color-bg-body)",
                  borderColor: "var(--color-border)",
                  color: "var(--color-text-main)",
                }}
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-[var(--color-text-main)]">
                Password
              </label>
              <input
                type="password"
                name="user_password"
                required
                value={form.user_password}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                style={{
                  backgroundColor: "var(--color-bg-body)",
                  borderColor: "var(--color-border)",
                  color: "var(--color-text-main)",
                }}
              />
              <button
                type="button"
                onClick={startResetFlow}
                className="mt-1 text-xs text-[var(--color-secondary)] hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {feedback.text && (
              <p
                className={`text-sm mt-2 p-2 rounded-md text-center ${
                  feedback.type === "error"
                    ? "text-red-500 bg-red-100/10"
                    : "text-green-500 bg-green-100/10"
                }`}
              >
                {feedback.text}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-2 font-medium rounded-md transition"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "#fff",
                opacity: status === "loading" ? 0.7 : 1,
              }}
            >
              {status === "loading" ? "Signing in..." : "Login"}
            </button>

            {/* Show "verify your email" hint if message suggests it */}
            {feedback.type === "error" &&
              feedback.text.toLowerCase().includes("verify") && (
                <div className="mt-3 text-center text-xs text-[var(--color-text-muted)]">
                  Your account isn&apos;t verified.{" "}
                  <button
                    type="button"
                    onClick={() => setMode("verifyEmail")}
                    className="text-[var(--color-secondary)] hover:underline"
                  >
                    Verify your email
                  </button>
                </div>
              )}
          </form>
        )}

        {/* ==== EMAIL VERIFICATION MODE ==== */}
        {mode === "verifyEmail" && (
          <div className="space-y-4">
            <p className="text-xs text-[var(--color-text-muted)] mb-2">
              We&apos;ll send a 6-digit code to{" "}
              <strong>{form.user_email || "your email"}</strong>. Enter it below
              to activate your account.
            </p>

            <button
              type="button"
              onClick={handleSendActivationOtp}
              disabled={verifyStatus === "loading" || !canResendVerify}
              className="w-full py-2 font-medium rounded-md mb-2 transition bg-[var(--color-primary)] text-white disabled:opacity-60"
            >
              {verifyStatus === "loading"
                ? "Sending code..."
                : canResendVerify
                ? "Send verification code"
                : "Please wait..."}
            </button>

            <form onSubmit={handleVerifyActivationCode} className="space-y-3">
              <div>
                <label className="block text-sm mb-1 text-[var(--color-text-main)]">
                  Verification Code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={verifyOtp}
                  onChange={(e) => setVerifyOtp(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  style={{
                    backgroundColor: "var(--color-bg-body)",
                    borderColor: "var(--color-border)",
                    color: "var(--color-text-main)",
                  }}
                  placeholder="Enter the 6-digit code"
                />
              </div>

              {verifyMsg && (
                <p
                  className={`text-sm p-2 rounded-md text-center ${
                    verifyMsg.startsWith("✅")
                      ? "text-green-500 bg-green-100/10"
                      : verifyMsg.startsWith("⚠️")
                      ? "text-yellow-500 bg-yellow-100/10"
                      : "text-red-500 bg-red-100/10"
                  }`}
                >
                  {verifyMsg}
                </p>
              )}

              <div className="flex justify-between items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-[var(--color-text-muted)] hover:underline"
                >
                  ← Back to login
                </button>
                <button
                  type="submit"
                  disabled={verifyStatus === "loading"}
                  className="px-4 py-2 rounded-md bg-[var(--color-primary)] text-white font-medium disabled:opacity-60"
                >
                  {verifyStatus === "loading" ? "Verifying..." : "Verify email"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ==== RESET PASSWORD MODE ==== */}
        {mode === "resetPassword" && (
          <div className="space-y-4">
            {resetStep === 1 && (
              <>
                <p className="text-xs text-[var(--color-text-muted)] mb-2">
                  Enter the email associated with your account and we&apos;ll
                  send you a reset code.
                </p>
                <div>
                  <label className="block text-sm mb-1 text-[var(--color-text-main)]">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    style={{
                      backgroundColor: "var(--color-bg-body)",
                      borderColor: "var(--color-border)",
                      color: "var(--color-text-main)",
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendResetOtp}
                  disabled={resetStatus === "loading" || !canResendReset}
                  className="w-full py-2 font-medium rounded-md transition bg-[var(--color-primary)] text-white disabled:opacity-60"
                >
                  {resetStatus === "loading"
                    ? "Sending code..."
                    : canResendReset
                    ? "Send reset code"
                    : "Please wait..."}
                </button>
              </>
            )}

            {resetStep === 2 && (
              <form onSubmit={handleSubmitResetPassword} className="space-y-3">
                <div>
                  <label className="block text-sm mb-1 text-[var(--color-text-main)]">
                    Reset Code
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={resetOtp}
                    onChange={(e) => setResetOtp(e.target.value)}
                    className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    style={{
                      backgroundColor: "var(--color-bg-body)",
                      borderColor: "var(--color-border)",
                      color: "var(--color-text-main)",
                    }}
                    placeholder="Enter the code sent to your email"
                  />
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <div>
                    <label className="block text-sm mb-1 text-[var(--color-text-main)]">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={resetPassword}
                      onChange={(e) => setResetPassword(e.target.value)}
                      className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      style={{
                        backgroundColor: "var(--color-bg-body)",
                        borderColor: "var(--color-border)",
                        color: "var(--color-text-main)",
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-[var(--color-text-main)]">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={resetPassword2}
                      onChange={(e) => setResetPassword2(e.target.value)}
                      className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      style={{
                        backgroundColor: "var(--color-bg-body)",
                        borderColor: "var(--color-border)",
                        color: "var(--color-text-main)",
                      }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setResetStep(1);
                      setResetMsg("");
                    }}
                    className="text-[var(--color-text-muted)] hover:underline"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={resetStatus === "loading"}
                    className="px-4 py-2 rounded-md bg-[var(--color-primary)] text-white font-medium disabled:opacity-60"
                  >
                    {resetStatus === "loading"
                      ? "Resetting..."
                      : "Reset password"}
                  </button>
                </div>
              </form>
            )}

            {resetMsg && (
              <p
                className={`text-sm mt-2 p-2 rounded-md text-center ${
                  resetMsg.startsWith("✅")
                    ? "text-green-500 bg-green-100/10"
                    : resetMsg.startsWith("⚠️")
                    ? "text-yellow-500 bg-yellow-100/10"
                    : "text-red-500 bg-red-100/10"
                }`}
              >
                {resetMsg}
              </p>
            )}

            <button
              type="button"
              onClick={() => setMode("login")}
              className="mt-3 text-xs text-[var(--color-text-muted)] hover:underline"
            >
              ← Back to login
            </button>
          </div>
        )}

        {/* Footer: link to register */}
        {mode === "login" && (
          <p className="text-center text-sm mt-4 text-[var(--color-text-muted)]">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-[var(--color-secondary)] hover:underline"
            >
              Sign up
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
