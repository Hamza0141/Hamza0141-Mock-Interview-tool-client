// src/components/CreditPaymentForm.jsx
import { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { useAppDispatch } from "../app/hooks";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { fetchTransactionStatus } from "../api/creditApi";
import { fetchNotifications } from "../features/notifications/notificationsSlice";
import { getUserById } from "../features/user/userSlice";

export function CreditPaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
   const dispatch = useAppDispatch(); 

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [stage, setStage] = useState("form"); // "form" | "result"
  const [paymentStatus, setPaymentStatus] = useState(null); // Stripe status
  const [transactionStatus, setTransactionStatus] = useState(null); // DB status

  const waitForTransactionCompletion = async (paymentIntentId) => {
    const timeoutMs = 20000; // 20s max
    const intervalMs = 2000; // every 2s
    const start = Date.now();

    while (Date.now() - start < timeoutMs) {
      try {
        const res = await fetchTransactionStatus(paymentIntentId);

        if (res.success && res.status) {
          setTransactionStatus(res.status);

          if (res.status === "completed") {
            dispatch(getUserById());
            dispatch(fetchNotifications());
            return "completed";
          }

          if (res.status === "failed") {
            return "failed";
          }
        }
      } catch (err) {
        console.error("fetchTransactionStatus error:", err);
        // we can choose to break or keep trying; here we keep trying
      }

      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }

    return "timeout"; // didn't get a final answer in time
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setPaymentStatus(null);
    setTransactionStatus(null);

    if (!stripe || !elements) return;

    setIsSubmitting(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      console.error("confirmPayment error:", error);
      setErrorMessage(error.message || "Payment failed. Please try again.");
      setIsSubmitting(false);
      setStage("result");
      return;
    }

    const status = paymentIntent?.status || "processing";
    setPaymentStatus(status);

    if (status !== "succeeded") {
      setSuccessMessage(
        `Payment status: ${status}. This may take a moment to finalize.`
      );
      setIsSubmitting(false);
      setStage("result");
      return;
    }

    // ✅ Payment succeeded on Stripe side – now confirm with our DB
    setSuccessMessage(
      "Payment confirmed with Stripe. Finalizing your credits..."
    );

    const piId = paymentIntent.id;

    const txResult = await waitForTransactionCompletion(piId);

    if (txResult === "completed") {
      setSuccessMessage(
        "🎉 Payment successful! Your credits have been added to your balance."
      );
    } else if (txResult === "failed") {
      setErrorMessage(
        "Payment was captured but the transaction failed on our side. Please contact support."
      );
    } else if (txResult === "timeout") {
      setSuccessMessage(
        "Payment is confirmed, but we're still syncing your credits. Please refresh your credits page in a moment."
      );
    }

    setIsSubmitting(false);
    setStage("result");
  };

  const handleRetry = () => {
    setErrorMessage("");
    setSuccessMessage("");
    setPaymentStatus(null);
    setTransactionStatus(null);
    setStage("form");
  };
console.log(transactionStatus, paymentStatus);
  const resultTitle = (() => {
    if (errorMessage) return "Payment not completed";

    if (transactionStatus === "completed") return "Credits added";

    if (paymentStatus === "succeeded" && !transactionStatus) {
      return "Payment successful, finalizing credits";
    }

    if (
      paymentStatus === "processing" ||
      paymentStatus === "requires_action" ||
      paymentStatus === "requires_confirmation"
    ) {
      return "Payment is still processing";
    }

    if (paymentStatus) {
      return `Payment status: ${paymentStatus}`;
    }

    return "Payment result";
  })();

  return (
    <div
      className="position-relative p-4 rounded-4"
      style={{
        backgroundColor: "var(--color-bg-body)",
        border: "1px solid var(--color-border)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
      }}
    >
      {/* FORM */}
      {stage === "form" && (
        <div style={{ position: "relative" }}>
          {isSubmitting && (
            <div
              className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center"
              style={{
                background:
                  "linear-gradient(145deg, rgba(5,5,30,0.96), rgba(15,23,42,0.96))",
                zIndex: 10,
                borderRadius: "1rem",
              }}
            >
              <div className="position-relative d-inline-block mb-3">
                <div
                  className="rounded-circle"
                  style={{
                    width: "4.5rem",
                    height: "4.5rem",
                    background:
                      "radial-gradient(circle at center, rgba(130,49,211,0.4), transparent 60%)",
                    position: "absolute",
                    top: "-0.75rem",
                    left: "-0.75rem",
                    zIndex: 0,
                  }}
                />
                <div
                  className="spinner-border"
                  role="status"
                  style={{
                    width: "3rem",
                    height: "3rem",
                    borderWidth: "0.2rem",
                    borderColor: "var(--color-primary)",
                    borderRightColor: "transparent",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <span className="visually-hidden">Processing...</span>
                </div>
              </div>

              <h6 className="fw-semibold mb-1" style={{ color: "#fff" }}>
                Processing your payment
              </h6>
              <p className="small mb-0" style={{ color: "#e5e7eb" }}>
                Please wait while we securely confirm your payment and credits.
              </p>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            style={{ opacity: isSubmitting ? 0.35 : 1 }}
          >
            
              <PaymentElement />
            

            <button
              type="submit"
              disabled={!stripe || isSubmitting}
              className="w-100 btn py-2 fw-semibold"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-primary), #4b6cb7)",
                color: "#fff",
                borderRadius: "0.7rem",
                opacity: isSubmitting ? 0.7 : 1,
              }}
            >
              {isSubmitting ? "Processing..." : "Pay Now"}
            </button>
          </form>
        </div>
      )}

      {/* RESULT */}
      {stage === "result" && (
        <div className="text-center py-4">
          <div className="mb-3">
            {errorMessage ? (
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle"
                style={{
                  width: "3.5rem",
                  height: "3.5rem",
                  backgroundColor: "rgba(239,68,68,0.12)",
                }}
              >
                <AlertCircle size={28} style={{ color: "rgb(239,68,68)" }} />
              </div>
            ) : transactionStatus === "completed" ? (
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle"
                style={{
                  width: "3.5rem",
                  height: "3.5rem",
                  backgroundColor: "rgba(34,197,94,0.12)",
                }}
              >
                <CheckCircle2 size={28} style={{ color: "rgb(34,197,94)" }} />
              </div>
            ) : (
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle"
                style={{
                  width: "3.5rem",
                  height: "3.5rem",
                  backgroundColor: "rgba(59,130,246,0.12)",
                }}
              >
                <Loader2 size={26} className="spin" />
              </div>
            )}
          </div>

          <h6
            className="fw-semibold mb-2"
            style={{ color: "var(--color-text-main)" }}
          >
            {resultTitle}
          </h6>

          {errorMessage && (
            <p
              className="small mb-3"
              style={{ color: "var(--color-text-muted)" }}
            >
              {errorMessage}
            </p>
          )}

          {successMessage && (
            <p
              className="small mb-3"
              style={{ color: "var(--color-text-muted)" }}
            >
              {successMessage}
            </p>
          )}

          {errorMessage && (
            <button
              type="button"
              onClick={handleRetry}
              className="btn btn-outline-light btn-sm px-3"
              style={{
                borderColor: "var(--color-primary)",
                color: "var(--color-primary)",
              }}
            >
              Try again
            </button>
          )}
        </div>
      )}
    </div>
  );
}
