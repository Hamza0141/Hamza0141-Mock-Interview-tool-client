// src/pages/BuyCreditsPage.jsx
import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "../stripe/stripeConfig";
import { fetchCreditPacks, createPaymentIntent } from "../api/creditApi";
import { CreditPaymentForm } from "../components/CreditPaymentForm";

export default function BuyCreditsPage({ profileId }) {
  const [loading, setLoading] = useState(true);
  const [packs, setPacks] = useState([]);
  const [selectedPackId, setSelectedPackId] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [creatingIntent, setCreatingIntent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");

        const raw = await fetchCreditPacks();

        let list = [];
        // Backend sends plain array: [ {...}, {...} ]
        if (Array.isArray(raw)) {
          list = raw;
        }
        // Or { success, data: [ ... ] }
        else if (raw && Array.isArray(raw.data)) {
          list = raw.data;
        }

        setPacks(list);
      } catch (err) {
        console.error("fetchCreditPacks error:", err);
        setError("Failed to load credit packs");
        setPacks([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const handleSelectPack = (packId) => {
    setSelectedPackId(packId);
    setClientSecret(null);
    setError("");
  };

  const handleCreateIntent = async () => {
    if (!selectedPackId) {
      setError("Please select a credit pack.");
      return;
    }
    if (!profileId) {
      setError("Missing profile ID.");
      return;
    }

    setError("");
    setCreatingIntent(true);

    try {
      const res = await createPaymentIntent({
        profile_id: profileId,
        pack_id: selectedPackId,
      });

      if (!res || res.success === false) {
        setError(res?.message || "Failed to create payment intent");
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

  const stripeOptions =
    clientSecret && stripePromise
      ? {
          clientSecret,
          appearance: { theme: "stripe" },
        }
      : null;

  const selectedPack = packs.find((p) => p.id === selectedPackId) || null;

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-xl-7">
          {/* Header */}
          <div className="mb-4">
            <h1 className="h3 mb-2">Buy Credits</h1>
            <p className="text-muted mb-0">
              Choose a credit pack and complete your purchase securely with
              Stripe.
            </p>
          </div>

          {/* Main card */}
          <div className="card shadow-sm">
            <div className="card-body">
              {/* Packs header */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h6 mb-0">Available credit packs</h2>
                {selectedPack && (
                  <span className="badge rounded-pill text-bg-light border">
                    Selected: {selectedPack.credits} credits
                  </span>
                )}
              </div>

              {/* Packs list */}
              {loading ? (
                <div className="py-3 text-muted small">
                  Loading credit packs...
                </div>
              ) : packs.length === 0 ? (
                <p className="text-muted small mb-3">
                  No credit packs are currently available.
                </p>
              ) : (
                <ul className="list-group mb-3">
                  {packs.map((pack) => {
                    const isSelected = selectedPackId === pack.id;
                    return (
                      <li
                        key={pack.id}
                        className="list-group-item p-0 border-0"
                      >
                        <button
                          type="button"
                          onClick={() => handleSelectPack(pack.id)}
                          className={
                            "w-100 text-start btn btn-sm d-flex justify-content-between align-items-center px-3 py-3 mb-2 " +
                            (isSelected
                              ? "btn-outline-primary border-2"
                              : "btn-light border")
                          }
                        >
                          <div>
                            <div className="fw-semibold">{pack.name}</div>
                            <div className="small text-muted">
                              {pack.credits} credits · $
                              {(pack.price_cents / 100).toFixed(2)}
                            </div>
                          </div>
                          <div className="text-end">
                            <div className="fw-semibold">
                              ${(pack.price_cents / 100).toFixed(2)}
                            </div>
                            {isSelected && (
                              <span className="badge bg-primary mt-1">
                                Selected
                              </span>
                            )}
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}

              {/* Error */}
              {error && (
                <div
                  className="alert alert-danger py-2 small mb-3"
                  role="alert"
                >
                  {error}
                </div>
              )}

              {/* CTA button */}
              {!clientSecret && (
                <button
                  type="button"
                  onClick={handleCreateIntent}
                  disabled={creatingIntent || !selectedPackId}
                  className="btn btn-primary w-100"
                >
                  {creatingIntent
                    ? "Preparing payment..."
                    : selectedPack
                    ? `Pay $${(selectedPack.price_cents / 100).toFixed(2)}`
                    : "Continue to payment"}
                </button>
              )}

              {/* Stripe config warning */}
              {clientSecret && !stripePromise && (
                <div
                  className="alert alert-danger mt-3 py-2 small"
                  role="alert"
                >
                  Stripe is not configured correctly (missing publishable key).
                </div>
              )}

              {/* Payment form */}
              {clientSecret && stripePromise && stripeOptions && (
                <div className="mt-4 pt-3 border-top">
                  {selectedPack && (
                    <div className="mb-2 small">
                      <div className="fw-semibold">You&apos;re buying</div>
                      <div className="text-muted">
                        {selectedPack.name} · {selectedPack.credits} credits · $
                        {(selectedPack.price_cents / 100).toFixed(2)}
                      </div>
                    </div>
                  )}

                  <h3 className="h6 mb-2">Payment details</h3>

                  <Elements stripe={stripePromise} options={stripeOptions}>
                    <CreditPaymentForm />
                  </Elements>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
