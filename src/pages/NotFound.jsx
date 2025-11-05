import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div
      className="flex flex-col items-center justify-center h-full text-center transition-colors duration-300"
      style={{
        backgroundColor: "var(--color-bg-body)",
        color: "var(--color-text-main)",
      }}
    >
      <h1 className="text-6xl font-bold text-[var(--color-danger)] mb-4">
        404
      </h1>
      <p className="text-lg text-[var(--color-text-muted)] mb-6">
        Oops! Page not found.
      </p>
      <Link
        to="/dashboard"
        className="px-5 py-2 rounded-md font-medium transition"
        style={{
          backgroundColor: "var(--color-primary)",
          color: "#fff",
        }}
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
