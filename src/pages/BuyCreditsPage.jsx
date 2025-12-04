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
        if (Array.isArray(raw)) {
          list = raw;
        } else if (raw && Array.isArray(raw.data)) {
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
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(130,49,211,0.18), transparent 55%)",
        backgroundColor: "var(--color-bg-body)", // 🔁 dynamic/theme-based
        transition: "background-color 0.3s ease",
      }}
    >
      <div className="container py-5">
        <div className="row justify-content-center mb-4">
          <div className="col-lg-8 col-xl-7 text-center">
            <span
              className="badge rounded-pill mb-2"
              style={{
                backgroundColor: "rgba(130,49,211,0.1)",
                color: "var(--color-primary)",
                fontSize: "0.7rem",
              }}
            >
              Practice With AI · Credits
            </span>
            <h1
              className="h3 fw-semibold mb-2"
              style={{ color: "var(--color-text-main)" }}
            >
              Power up your practice sessions
            </h1>
            <p
              className="mb-0 small"
              style={{ color: "var(--color-text-muted)" }}
            >
              Choose a credit pack to unlock AI-powered mock interviews and
              public speaking practice.
            </p>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-9 col-xl-8">
            <div
              className="card border-0 shadow-lg"
              style={{
                backgroundColor: "var(--color-bg-panel)",
                borderRadius: "1.25rem",
                border: "1px solid var(--color-border)",
              }}
            >
              <div className="card-body p-4 p-md-5">
                {/* Top summary / selected pack */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-2">
                  <div>
                    <h2
                      className="h6 mb-1 text-uppercase"
                      style={{
                        letterSpacing: "0.08em",
                        color: "var(--color-text-main)",
                      }}
                    >
                      Credit packs
                    </h2>
                    <p
                      className="small mb-0"
                      style={{
                        color: "var(--color-text-muted)",
                      }}
                    >
                      Pick the pack that matches how often you want to practice.
                    </p>
                  </div>
                  {selectedPack && (
                    <div
                      className="px-3 py-2 rounded-3 d-inline-flex flex-column align-items-start"
                      style={{
                        border: "1px solid rgba(130,49,211,0.4)",
                        background:
                          "linear-gradient(135deg, rgba(130,49,211,0.08), rgba(75,108,183,0.08))",
                        fontSize: "0.8rem",
                      }}
                    >
                      <span
                        className="text-uppercase fw-semibold mb-1"
                        style={{
                          fontSize: "0.7rem",
                          color: "var(--color-primary)",
                          letterSpacing: "0.1em",
                        }}
                      >
                        Selected pack
                      </span>
                      <span
                        className="fw-semibold"
                        style={{
                          
                          color: "var(--color-primary)",
                          
                        }}
                      >
                        {selectedPack.credits} credits · $
                        {(selectedPack.price_cents / 100).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Packs grid */}
                {loading ? (
                  <div className="py-3 text-muted small">
                    Loading credit packs...
                  </div>
                ) : packs.length === 0 ? (
                  <p className="text-muted small mb-3">
                    No credit packs are currently available.
                  </p>
                ) : (
                  <div className="row g-3 mb-3">
                    {packs.map((pack, index) => {
                      const isSelected = selectedPackId === pack.id;
                      const isRecommended = index === 1; // middle pack "best value" vibe

                      return (
                        <div key={pack.id} className="col-12 col-md-6">
                          <button
                            type="button"
                            onClick={() => handleSelectPack(pack.id)}
                            className="w-100 text-start btn p-0 border-0"
                            style={{ boxShadow: "none" }}
                          >
                            <div
                              className="h-100 p-3 rounded-3 position-relative"
                              style={{
                                border: isSelected
                                  ? "2px solid var(--color-primary)"
                                  : "1px solid var(--color-border)",
                                background: isSelected
                                  ? "linear-gradient(135deg, rgba(130,49,211,0.16), rgba(75,108,183,0.10))"
                                  : "rgba(0,0,0,0.08)",
                                transform: isSelected
                                  ? "translateY(-2px)"
                                  : "translateY(0)",
                                transition:
                                  "all 0.18s ease, border-color 0.18s ease",
                              }}
                            >
                              {/* Recommended / selected tags */}
                              {isRecommended && (
                                <span
                                  className="badge rounded-pill position-absolute"
                                  style={{
                                    top: "0.6rem",
                                    right: "0.7rem",
                                    backgroundColor: "rgba(250,204,21,0.16)", // yellow-ish
                                    color: "#facc15",
                                    fontSize: "0.65rem",
                                  }}
                                >
                                  Best for regular practice
                                </span>
                              )}
                              {isSelected && !isRecommended && (
                                <span
                                  className="badge rounded-pill position-absolute"
                                  style={{
                                    top: "0.6rem",
                                    right: "0.7rem",
                                    backgroundColor: "rgba(130,49,211,0.16)",
                                    color: "var(--color-primary)",
                                    fontSize: "0.65rem",
                                  }}
                                >
                                  Selected
                                </span>
                              )}

                              <div className="mb-2">
                                <div
                                  className="fw-semibold"
                                  style={{
                                    color: "var(--color-text-main)",
                                    fontSize: "0.98rem",
                                  }}
                                >
                                  {pack.name}
                                </div>
                                <div
                                  className="small"
                                  style={{
                                    color: "var(--color-text-muted)",
                                  }}
                                >
                                  {pack.credits} credits · Ideal for{" "}
                                  {pack.credits <= 3
                                    ? "quick prep"
                                    : pack.credits <= 8
                                    ? "focused weekly practice"
                                    : "deep multi-week prep"}
                                </div>
                              </div>

                              <div className="d-flex justify-content-between align-items-end mt-2">
                                <div>
                                  <div
                                    className="fw-bold"
                                    style={{
                                      fontSize: "1.05rem",
                                      color: "var(--color-primary)",
                                    }}
                                  >
                                    ${(pack.price_cents / 100).toFixed(2)}
                                  </div>
                                  {/* <div
                                    className="small"
                                    style={{
                                      color: "var(--color-text-muted)",
                                    }}
                                  >
                                    ~
                                    {(
                                      pack.price_cents /
                                      100 /
                                      pack.credits
                                    ).toFixed(2)}{" "}
                                    per session
                                  </div> */}
                                </div>

                                <div className="text-end">
                                  <span
                                    className="badge rounded-pill"
                                    style={{
                                      backgroundColor: "rgba(0,0,0,0.25)",
                                      color: "var(--color-text-main)",
                                      fontSize: "0.7rem",
                                    }}
                                  >
                                    AI practice credits
                                  </span>
                                </div>
                              </div>
                            </div>
                          </button>
                        </div>
                      );
                    })}
                  </div>
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
                    className="btn w-100 mt-2"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--color-primary), #4b6cb7)",
                      color: "#fff",
                      opacity: creatingIntent || !selectedPackId ? 0.7 : 1,
                    }}
                  >
                    {creatingIntent
                      ? "Preparing payment..."
                      : selectedPack
                      ? `Pay $${(selectedPack.price_cents / 100).toFixed(
                          2
                        )} & continue`
                      : "Select a pack to continue"}
                  </button>
                )}

                {/* Stripe config warning */}
                {clientSecret && !stripePromise && (
                  <div
                    className="alert alert-danger mt-3 py-2 small"
                    role="alert"
                  >
                    Stripe is not configured correctly (missing publishable
                    key).
                  </div>
                )}

                {/* Payment form */}
                {clientSecret && stripePromise && stripeOptions && (
                  <div
                    className="mt-4 pt-3 border-top"
                    style={{
                      color: "var(--color-text-main)",
                    }}
                  >
                    {selectedPack && (
                      <div className="mb-2 small">
                        <div className="fw-semibold">You&apos;re buying</div>
                        <div style={{ fontSize: "0.9rem" }}>
                          {selectedPack.name} · {selectedPack.credits} credits ·
                          ${(selectedPack.price_cents / 100).toFixed(2)}
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
    </div>
  );
}
