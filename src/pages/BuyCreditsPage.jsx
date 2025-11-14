import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "../stripe/stripeConfig";
import { fetchCreditSummary, createPaymentIntent } from "../api/creditApi";
import { CreditPaymentForm } from "../components/CreditPaymentForm"; // adjust path

export default function BuyCreditsPage({ profileId }) {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [selectedPackId, setSelectedPackId] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [creatingIntent, setCreatingIntent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchCreditSummary(profileId);
        if (data.success) {
          setSummary(data.data);
        } else {
          setError(data.message || "Failed to load credit summary");
        }
      } catch (err) {
        console.error("fetchCreditSummary error:", err);
        setError("Failed to load credit summary");
      } finally {
        setLoading(false);
      }
    }
    if (profileId) {
      load();
    } else {
      setError("Missing profileId");
      setLoading(false);
    }
  }, [profileId]);

  const handleCreateIntent = async () => {
    if (!selectedPackId) {
      setError("Please select a credit pack");
      return;
    }
    setError("");
    setCreatingIntent(true);
    try {
      const res = await createPaymentIntent({
        profile_id: profileId,
        pack_id: selectedPackId,
      });

      if (!res.success) {
        setError(res.message || "Failed to create payment intent");
      } else {
        setClientSecret(res.clientSecret);
      }
    } catch (err) {
      console.error("createPaymentIntent error:", err);
      setError("Error creating payment intent");
    } finally {
      setCreatingIntent(false);
    }
  };

  if (loading) return <div>Loading your credits...</div>;

  if (!summary) {
    return (
      <div style={{ padding: 16, color: "red" }}>
        Could not load credit info. {error && <span>Details: {error}</span>}
      </div>
    );
  }

  const options =
    clientSecret && stripePromise
      ? {
          clientSecret,
          appearance: {
            theme: "stripe",
          },
        }
      : null;

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 16 }}>
      <h2>Buy Credits</h2>

      <p>
        Current balance: <strong>{summary.credit_balance}</strong> credits
        {summary.free_trial ? " (Free trial available)" : ""}
      </p>

      <h3>Choose a credit pack</h3>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginBottom: 16,
        }}
      >
        {summary.credit_packs?.map((pack) => (
          <label
            key={pack.id}
            style={{
              border:
                selectedPackId === pack.id
                  ? "2px solid #4f46e5"
                  : "1px solid #ddd",
              borderRadius: 8,
              padding: 12,
              cursor: "pointer",
            }}
          >
            <input
              type="radio"
              name="creditPack"
              value={pack.id}
              checked={selectedPackId === pack.id}
              onChange={() => setSelectedPackId(pack.id)}
              style={{ marginRight: 8 }}
            />
            <strong>{pack.name}</strong> — {pack.credits} credits — $
            {(pack.price_cents / 100).toFixed(2)}
          </label>
        ))}
      </div>

      {!clientSecret && (
        <button onClick={handleCreateIntent} disabled={creatingIntent}>
          {creatingIntent ? "Preparing payment..." : "Continue to payment"}
        </button>
      )}

      {error && <p style={{ color: "red", marginTop: 8 }}>{error}</p>}

      {clientSecret && !stripePromise && (
        <p style={{ color: "red", marginTop: 8 }}>
          Stripe is not configured correctly (missing publishable key).
        </p>
      )}

      {clientSecret && stripePromise && options && (
        <>
          <h3 style={{ marginTop: 24 }}>Payment details</h3>
          <Elements stripe={stripePromise} options={options}>
            <CreditPaymentForm />
          </Elements>
        </>
      )}
    </div>
  );
}
