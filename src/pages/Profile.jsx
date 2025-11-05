export default function Profile() {
  return (
    <div
      className="p-6 rounded-xl shadow-sm border transition-colors duration-300"
      style={{
        backgroundColor: "var(--color-bg-panel)",
        borderColor: "var(--color-border)",
        color: "var(--color-text-main)",
      }}
    >
      <h2 className="text-2xl font-semibold mb-4 text-[var(--color-primary)]">
        User Profile
      </h2>
      <p className="text-[var(--color-text-muted)]">
        This is your profile page. Customize user info here.
      </p>
    </div>
  );
}
