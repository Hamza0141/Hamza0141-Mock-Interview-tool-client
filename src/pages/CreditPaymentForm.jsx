import { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";

export function CreditPaymentForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!stripe || !elements) return; // still loading

    setIsSubmitting(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required", // keep user on your page unless 3DS needed
    });

    if (error) {
      console.error(error);
      setErrorMessage(error.message || "Payment failed. Please try again.");
      setIsSubmitting(false);
      return;
    }

    // At this point, Stripe has confirmed the payment.
    // Your webhook will add credits to the user balance.
    if (paymentIntent && paymentIntent.status === "succeeded") {
      setSuccessMessage("Payment successful! Credits will be added shortly.");
    } else {
      setSuccessMessage(
        `Payment status: ${
          paymentIntent?.status || "processing"
        }. Please refresh in a moment.`
      );
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
      <PaymentElement />

      <button
        type="submit"
        disabled={!stripe || isSubmitting}
        style={{
          marginTop: 16,
          padding: "10px 16px",
          borderRadius: 6,
          border: "none",
          background: "#4f46e5",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        {isSubmitting ? "Processing..." : "Pay now"}
      </button>

      {errorMessage && (
        <p style={{ color: "red", marginTop: 8 }}>{errorMessage}</p>
      )}

      {successMessage && (
        <p style={{ color: "green", marginTop: 8 }}>{successMessage}</p>
      )}
    </form>
  );
}
