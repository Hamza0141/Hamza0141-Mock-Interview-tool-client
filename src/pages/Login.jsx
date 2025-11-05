import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { loginUser } from "../features/auth/authSlice";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, status, error } = useAppSelector(
    (state) => state.auth
  );

  const [form, setForm] = useState({ user_email: "", user_password: "" });
  const [feedback, setFeedback] = useState({ type: "", text: "" });

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

  // ✅ Display backend error dynamically
  useEffect(() => {
    if (error && status === "failed") {
      setFeedback({
        type: "error",
        text: error || "Login failed. Please try again.",
      });
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

      // ✅ Force immediate redirect as fallback
      setTimeout(() => navigate("/dashboard"), 1000);
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
          Welcome Back 👋
        </h2>

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
        </form>

        <p className="text-center text-sm mt-4 text-[var(--color-text-muted)]">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-[var(--color-secondary)] hover:underline"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
