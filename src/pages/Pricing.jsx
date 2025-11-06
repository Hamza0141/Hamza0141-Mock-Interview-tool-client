export default function Pricing() {
  const plans = [
    { id: 1, credits: 1, price: 1.99, popular: false },
    { id: 2, credits: 3, price: 4.99, popular: true },
    { id: 3, credits: 5, price: 7.99, popular: false },
  ];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start pt-8 px-6 md:px-12"
      style={{
        backgroundColor: "var(--color-bg-body)",
        color: "var(--color-text-main)",
      }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-2">
          Choose Your Credit Plan
        </h1>
        <p className="text-[var(--color-text-muted)] max-w-md mx-auto">
          Purchase credits to unlock interview sessions and AI-powered features.
        </p>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative flex flex-col items-center justify-between p-6 rounded-xl shadow-md border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
              plan.popular
                ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]"
                : "border-[var(--color-border)]"
            }`}
            style={{
              backgroundColor: "var(--color-bg-panel)",
            }}
          >
            {plan.popular && (
              <span className="absolute top-3 right-3 text-xs px-3 py-1 rounded-full bg-[var(--color-primary)] text-white font-semibold">
                Most Popular
              </span>
            )}

            <div className="text-center">
              <h2 className="text-2xl font-semibold text-[var(--color-primary)] mb-2">
                {plan.credits} Credit{plan.credits > 1 ? "s" : ""}
              </h2>
              <p className="text-4xl font-bold mb-2">${plan.price}</p>
              <p className="text-[var(--color-text-muted)] text-sm">
                {plan.credits > 1
                  ? `${plan.credits} interview sessions`
                  : "1 interview session"}
              </p>
            </div>

            <button
              className="mt-6 w-full py-2 font-medium rounded-md transition hover:opacity-90"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "#fff",
              }}
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="text-center mt-10 text-sm text-[var(--color-text-muted)]">
        <p>All purchases are securely processed. Credits never expire.</p>
      </div>
    </div>
  );
}
