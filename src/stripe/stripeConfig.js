import { loadStripe } from "@stripe/stripe-js";

const pk = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
if (!pk) {
  // This will show clearly in dev tools if env is missing
  console.error("❌ VITE_STRIPE_PUBLISHABLE_KEY is NOT set!");
}

export const stripePromise = pk ? loadStripe(pk) : null;