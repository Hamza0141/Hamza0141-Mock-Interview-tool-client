import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { registerUser, verifyEmail } from "../features/auth/authSlice";

export default function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error, message } = useAppSelector((state) => state.auth);

  const [form, setForm] = useState({
    user_email: "",
    first_name: "",
    last_name: "",
    user_password: "",
  });
  const [otp, setOtp] = useState("");
  const [showVerify, setShowVerify] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", text: "" });

  // Move to verify step after registration
  useEffect(() => {
    if (status === "succeeded") {
      setShowVerify(true);
      setFeedback({
        type: "success",
        text: "Account created! Check your email for the OTP code.",
      });
    }
  }, [status]);

  // Redirect after verification
  useEffect(() => {
    if (status === "verified") {
      setFeedback({
        type: "success",
        text: "Email verified successfully! Redirecting...",
      });
      setTimeout(() => navigate("/dashboard"), 1500);
    }
  }, [status, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFeedback({ type: "", text: "" });
  };

  const isStrongPassword = (pw) =>
    pw.length >= 8 && /[A-Z]/.test(pw) && /\d/.test(pw);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!isStrongPassword(form.user_password)) {
      setFeedback({
        type: "error",
        text: "Password must have at least 8 characters, 1 uppercase letter, and 1 number.",
      });
      return;
    }
    const action = await dispatch(registerUser(form));
    if (registerUser.rejected.match(action)) {
      setFeedback({ type: "error", text: action.payload });
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const email = form.user_email;
    const payload = { user_email: email, otp };

    console.log("📤 Sending verification:", payload);

    const action = await dispatch(verifyEmail(payload));
    if (verifyEmail.rejected.match(action)) {
      setFeedback({
        type: "error",
        text: action.payload || "Verification failed. Try again.",
      });
    }
  };

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
          {showVerify ? "Verify Your Email" : "Create Account"}
        </h2>

        {!showVerify ? (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                name="first_name"
                placeholder="First name"
                required
                value={form.first_name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md border focus:ring-2 focus:ring-[var(--color-primary)]"
              />
              <input
                type="text"
                name="last_name"
                placeholder="Last name"
                required
                value={form.last_name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md border focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>

            <input
              type="email"
              name="user_email"
              placeholder="Email"
              required
              value={form.user_email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border focus:ring-2 focus:ring-[var(--color-primary)]"
            />

            <input
              type="password"
              name="user_password"
              placeholder="Password"
              required
              value={form.user_password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border focus:ring-2 focus:ring-[var(--color-primary)]"
            />

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
              className="w-full py-2 font-medium rounded-md transition"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "#fff",
                opacity: status === "loading" ? 0.7 : 1,
              }}
            >
              {status === "loading" ? "Creating..." : "Register"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <p className="text-sm text-center text-[var(--color-text-muted)]">
              Enter the OTP sent to <strong>{form.user_email}</strong>
            </p>

            <input
              type="text"
              placeholder="6-digit OTP"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 rounded-md border focus:ring-2 focus:ring-[var(--color-primary)]"
            />

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
              className="w-full py-2 font-medium rounded-md transition"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "#fff",
                opacity: status === "verifying" ? 0.7 : 1,
              }}
            >
              {status === "verifying" ? "Verifying..." : "Verify Email"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
