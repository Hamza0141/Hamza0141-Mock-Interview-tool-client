import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { registerUser, verifyEmail } from "../features/auth/authSlice";
import { Brain, ShieldCheck, Sparkles } from "lucide-react";
import axiosClient from "../api/axiosClient";

export default function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status } = useAppSelector((state) => state.auth);

  const [form, setForm] = useState({
    user_email: "",
    first_name: "",
    last_name: "",
    user_password: "",
  });
  const [otp, setOtp] = useState("");
  const [showVerify, setShowVerify] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", text: "" });

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsError, setTermsError] = useState(false);

  // resend OTP state (local only, no Redux)
  const [resendCooldown, setResendCooldown] = useState(0); // seconds
  const [resendLoading, setResendLoading] = useState(false);

  // Move to verify step after registration success
  useEffect(() => {
    if (status === "succeeded") {
      setShowVerify(true);
      setFeedback({
        type: "success",
        text: "Account created! Check your email for the OTP code.",
      });
      // optional: short cooldown when first sending
      setResendCooldown(30);
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

  // Cooldown timer for resend button
  useEffect(() => {
    if (!resendCooldown) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFeedback({ type: "", text: "" });
  };

  const isStrongPassword = (pw) =>
    pw.length >= 8 && /[A-Z]/.test(pw) && /\d/.test(pw);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!acceptedTerms) {
      setTermsError(true);
      setFeedback({
        type: "error",
        text: "Please accept the Terms & Conditions to continue.",
      });
      return;
    }

    if (!isStrongPassword(form.user_password)) {
      setFeedback({
        type: "error",
        text: "Password must have at least 8 characters, 1 uppercase letter, and 1 number.",
      });
      return;
    }

    const action = await dispatch(registerUser(form));
    if (registerUser.rejected.match(action)) {
      setFeedback({
        type: "error",
        text: action.payload || "Registration failed. Try again.",
      });
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const payload = { user_email: form.user_email, otp };

    const action = await dispatch(verifyEmail(payload));
    if (verifyEmail.rejected.match(action)) {
      setFeedback({
        type: "error",
        text: action.payload || "Verification failed. Try again.",
      });
    }
  };

  const handleResendOtp = async () => {
    if (!form.user_email) {
      setFeedback({
        type: "error",
        text: "Please enter your email before requesting a new OTP.",
      });
      return;
    }
    if (resendCooldown > 0 || resendLoading) return;

    setFeedback({ type: "", text: "" });
    setResendLoading(true);

    try {
      const res = await axiosClient.post("/user/sendOTP", {
        user_email: form.user_email,
      });

      // Adjust to your backend response shape
      if (res.data?.success) {
        setFeedback({
          type: "success",
          text: res.data.message || "A new OTP has been sent to your email.",
        });
        setResendCooldown(60); // 60s before they can resend again
      } else {
        setFeedback({
          type: "error",
          text:
            res.data?.message ||
            "Could not resend OTP. Please try again in a moment.",
        });
      }
    } catch (err) {
      console.error("Resend OTP error:", err);
      setFeedback({
        type: "error",
        text: "Something went wrong while resending the OTP.",
      });
    } finally {
      setResendLoading(false);
    }
  };

  const isRegisterStep = !showVerify;

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: "100vh",
        backgroundColor: "#05051E",
        transition: "background-color 0.3s ease",
      }}
    >
      <div className="container" style={{ maxWidth: "1080px" }}>
        <div className="row justify-content-center">
          <div className="col-12 col-xl-10">
            <div
              className="card border-0 shadow-lg overflow-hidden"
              style={{
                backgroundColor: "var(--color-bg-panel)",
                borderRadius: "1.4rem",
                borderColor: "var(--color-border)",
              }}
            >
              <div className="row g-0">
                {/* ================= LEFT BRAND PANEL ================= */}
                <div
                  className="col-md-5 d-none d-md-flex flex-column justify-content-between p-4"
                  style={{
                    background:
                      "linear-gradient(145deg, var(--color-primary), #4b6cb7)",
                    color: "#fff",
                    minHeight: "100%",
                  }}
                >
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <div
                        className="d-flex align-items-center justify-content-center rounded-circle"
                        style={{
                          width: "2.6rem",
                          height: "2.6rem",
                          backgroundColor: "rgba(0,0,0,0.25)",
                        }}
                      >
                        <Brain size={22} />
                      </div>
                      <div>
                        <h2 className="h5 mb-0 fw-semibold">SelfMock</h2>
                        <div className="small mb-0 opacity-75">
                          AI Interview & Speech Coach
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h3 className="h6 fw-semibold mb-3 d-flex align-items-center gap-2">
                        <Sparkles size={16} /> Level up your practice
                      </h3>
                      <ul className="list-unstyled small mb-0 opacity-90">
                        <li className="mb-2">• Realistic mock interviews</li>
                        <li className="mb-2">
                          • AI-powered public speaking feedback
                        </li>
                        <li className="mb-2">
                          • Understand your strengths & growth areas
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 small opacity-80">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <ShieldCheck size={16} />
                      <span>Secure by design</span>
                    </div>
                    <div className="mb-0">
                      Your data stays private and protected.
                    </div>
                  </div>
                </div>

                {/* ================= RIGHT FORM PANEL ================= */}
                <div className="col-12 col-md-7">
                  <div className="p-4 p-md-5 h-100 d-flex flex-column">
                    {/* Step indicator + top right link */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span
                        className="badge rounded-pill"
                        style={{
                          backgroundColor: "rgba(130,49,211,0.12)",
                          color: "var(--color-primary)",
                          fontSize: "0.7rem",
                        }}
                      >
                        {isRegisterStep
                          ? "Step 1 of 2 • Create account"
                          : "Step 2 of 2 • Verify email"}
                      </span>

                      <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="btn btn-link p-0 small"
                        style={{ color: "var(--color-secondary)" }}
                      >
                        Already have an account?
                      </button>
                    </div>

                    {/* Form header */}
                    <h2
                      className="h4 fw-semibold mb-1"
                      style={{ color: "var(--color-text-main)" }}
                    >
                      {isRegisterStep
                        ? "Create your account"
                        : "Verify your email"}
                    </h2>

                    <p
                      className="small mb-4"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {isRegisterStep
                        ? "Sign up to start practicing interviews and public speaking with AI-powered coaching."
                        : `We’ve sent a 6-digit code to ${form.user_email}. Enter it to verify your account.`}
                    </p>

                    {/* FEEDBACK ALERT */}
                    {feedback.text && (
                      <div
                        className={`alert py-2 small ${
                          feedback.type === "error"
                            ? "alert-danger"
                            : "alert-success"
                        }`}
                        style={{ fontSize: "0.82rem" }}
                      >
                        {feedback.text}
                      </div>
                    )}

                    {/* ================== REGISTER FORM ================== */}
                    {!showVerify ? (
                      <form onSubmit={handleRegister} className="mt-3">
                        {/* FIRST + LAST NAME */}
                        <div className="row g-3">
                          <div className="col-12 col-sm-6">
                            <label className="form-label fw-semibold small mb-1">
                              First name
                            </label>
                            <input
                              type="text"
                              name="first_name"
                              required
                              value={form.first_name}
                              onChange={handleChange}
                              className="form-control form-control-sm shadow-sm"
                              style={{
                                backgroundColor: "var(--color-bg-panel)",
                                color: "var(--color-text-main)",
                                borderColor: "var(--color-border)",
                                padding: "0.55rem 0.75rem",
                                borderRadius: "0.85rem",
                              }}
                              placeholder="First Name"
                            />
                          </div>

                          <div className="col-12 col-sm-6">
                            <label className="form-label fw-semibold small mb-1">
                              Last name
                            </label>
                            <input
                              type="text"
                              name="last_name"
                              required
                              value={form.last_name}
                              onChange={handleChange}
                              className="form-control form-control-sm shadow-sm"
                              style={{
                                backgroundColor: "var(--color-bg-panel)",
                                color: "var(--color-text-main)",
                                borderColor: "var(--color-border)",
                                padding: "0.55rem 0.75rem",
                                borderRadius: "0.85rem",
                              }}
                              placeholder="Last Name"
                            />
                          </div>
                        </div>

                        {/* EMAIL */}
                        <div className="mt-3">
                          <label className="form-label fw-semibold small mb-1">
                            Email address
                          </label>
                          <input
                            type="email"
                            name="user_email"
                            required
                            value={form.user_email}
                            onChange={handleChange}
                            className="form-control form-control-sm shadow-sm"
                            style={{
                              backgroundColor: "var(--color-bg-panel)",
                              color: "var(--color-text-main)",
                              borderColor: "var(--color-border)",
                              padding: "0.55rem 0.75rem",
                              borderRadius: "0.85rem",
                            }}
                            placeholder="you@example.com"
                          />
                        </div>

                        {/* PASSWORD */}
                        <div className="mt-3">
                          <label className="form-label fw-semibold small mb-1">
                            Password
                          </label>
                          <input
                            type="password"
                            name="user_password"
                            required
                            value={form.user_password}
                            onChange={handleChange}
                            className="form-control form-control-sm shadow-sm"
                            style={{
                              backgroundColor: "var(--color-bg-panel)",
                              color: "var(--color-text-main)",
                              borderColor: "var(--color-border)",
                              padding: "0.55rem 0.75rem",
                              borderRadius: "0.85rem",
                            }}
                            placeholder="At least 8 characters, 1 uppercase, 1 number"
                          />
                          <small
                            className="form-text"
                            style={{ color: "var(--color-text-muted)" }}
                          >
                            Use a strong password to keep your account secure.
                          </small>
                        </div>

                        {/* TERMS & CONDITIONS */}
                        <div className="mt-3">
                          <div className="form-check small d-flex align-items-start gap-2">
                            <input
                              id="terms"
                              type="checkbox"
                              className={`form-check-input mt-1 ${
                                termsError ? "is-invalid" : ""
                              }`}
                              checked={acceptedTerms}
                              onChange={(e) => {
                                setAcceptedTerms(e.target.checked);
                                if (e.target.checked) setTermsError(false);
                              }}
                            />
                            <label
                              htmlFor="terms"
                              className={`form-check-label ${
                                termsError ? "text-danger" : ""
                              }`}
                              style={{
                                fontSize: "0.8rem",
                                color: "var(--color-primary)",
                                lineHeight: 1.35,
                              }}
                            >
                              I agree to the{" "}
                              <button
                                type="button"
                                onClick={() => navigate("/terms")}
                                className="btn btn-link p-0 align-baseline"
                                style={{
                                  fontSize: "0.8rem",
                                  color: "var(--color-primary)",
                                  textDecoration: "underline",
                                }}
                              >
                                Terms &amp; Conditions
                              </button>{" "}
                              and{" "}
                              <button
                                type="button"
                                onClick={() => navigate("/privacy")}
                                className="btn btn-link p-0 align-baseline"
                                style={{
                                  fontSize: "0.8rem",
                                  color: "var(--color-primary)",
                                  textDecoration: "underline",
                                }}
                              >
                                Privacy Policy
                              </button>
                              .
                            </label>
                          </div>
                        </div>

                        {/* SUBMIT BUTTON */}
                        <button
                          type="submit"
                          className="btn w-100 mt-4 py-2 fw-semibold shadow-sm"
                          style={{
                            backgroundColor: "var(--color-primary)",
                            color: "#fff",
                            opacity: status === "loading" ? 0.7 : 1,
                            borderRadius: "0.45rem",
                          }}
                        >
                          {status === "loading"
                            ? "Creating account..."
                            : "Create account"}
                        </button>
                      </form>
                    ) : (
                      /* ================== VERIFY FORM ================== */
                      <form onSubmit={handleVerify} className="mt-3">
                        <label className="form-label small mb-1">
                          6-digit verification code
                        </label>

                        <input
                          type="text"
                          required
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="form-control form-control-sm text-center shadow-sm"
                          style={{
                            backgroundColor: "var(--color-bg-panel)",
                            color: "var(--color-text-main)",
                            borderColor: "var(--color-border)",
                            letterSpacing: "0.25em",
                            borderRadius: "0.85rem",
                          }}
                          placeholder="••••••"
                        />

                        {/* RESEND OTP */}
                        <div className="d-flex justify-content-between align-items-center mt-2 small">
                          <span style={{ color: "var(--color-text-muted)" }}>
                            Didn&apos;t receive a code?
                          </span>
                          <button
                            type="button"
                            onClick={handleResendOtp}
                            disabled={resendCooldown > 0 || resendLoading}
                            className="btn btn-link p-0 align-baseline"
                            style={{
                              fontSize: "0.8rem",
                              color: "var(--color-primary)",
                            }}
                          >
                            {resendLoading
                              ? "Sending..."
                              : resendCooldown > 0
                              ? `Resend in ${resendCooldown}s`
                              : "Resend OTP"}
                          </button>
                        </div>

                        <button
                          type="submit"
                          className="btn w-100 mt-4 py-2 fw-semibold shadow-sm"
                          style={{
                            backgroundColor: "var(--color-primary)",
                            color: "#fff",
                            opacity: status === "verifying" ? 0.7 : 1,
                          }}
                        >
                          {status === "verifying"
                            ? "Verifying..."
                            : "Verify email"}
                        </button>

                        <p
                          className="text-center small mt-3 mb-0"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          Entered the wrong email?{" "}
                          <button
                            type="button"
                            onClick={() => {
                              setShowVerify(false);
                              setFeedback({ type: "", text: "" });
                            }}
                            className="btn btn-link p-0 align-baseline"
                            style={{ color: "var(--color-secondary)" }}
                          >
                            Go back
                          </button>
                        </p>
                      </form>
                    )}

                    {/* Mobile bottom link */}
                    {isRegisterStep && (
                      <p
                        className="text-center small mt-4 mb-0 d-md-none"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={() => navigate("/login")}
                          className="btn btn-link p-0 align-baseline"
                          style={{
                            fontSize: "0.85rem",
                            color: "var(--color-secondary)",
                          }}
                        >
                          Login
                        </button>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
