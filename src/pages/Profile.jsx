export default function Profile() {
  const user = {
    first_name: "jone",
    last_name: "doe",
    email: "jone@example.com",
    role: "Full Stack Developer",
    joined: "Jan 12, 2024",
    location: "Kansas City, MO",
    credit_balance: 20,
    is_verified: true,
  };

  return (
    <div
      className="p-8 rounded-xl shadow-md border transition-colors duration-300 max-w-4xl mx-auto"
      style={{
        backgroundColor: "var(--color-bg-panel)",
        borderColor: "var(--color-border)",
        color: "var(--color-text-main)",
      }}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-8 border-b pb-6">
        <img
          src="https://i.pravatar.cc/120?img=12"
          alt="User Avatar"
          className="w-28 h-28 rounded-full object-cover border-4"
          style={{ borderColor: "var(--color-primary)" }}
        />

        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-semibold text-[var(--color-primary)]">
            {user.first_name} {user.last_name}
          </h2>
          <p className="text-[var(--color-text-muted)] text-sm mt-1">
            {user.role}
          </p>
          <p className="text-[var(--color-text-muted)] mt-2">{user.email}</p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-2">
          <span
            className={`text-xs px-3 py-1 rounded-full font-medium ${
              user.is_verified
                ? "bg-green-500/20 text-green-400 border border-green-400/30"
                : "bg-red-500/20 text-red-400 border border-red-400/30"
            }`}
          >
            {user.is_verified ? "Verified" : "Unverified"}
          </span>

          <button
            className="mt-3 px-4 py-2 text-sm rounded-md font-medium hover:opacity-90 transition"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "#fff",
            }}
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <div
          className="p-4 rounded-lg shadow-sm border"
          style={{ borderColor: "var(--color-border)" }}
        >
          <h4 className="text-sm font-semibold text-[var(--color-primary)] mb-2 uppercase tracking-wide">
            Account Details
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <strong>Joined:</strong> {user.joined}
            </li>
            <li>
              <strong>Location:</strong> {user.location}
            </li>
            <li>
              <strong>Credit Balance:</strong>{" "}
              <span className="text-[var(--color-primary)] font-semibold">
                {user.credit_balance} Credits
              </span>
            </li>
          </ul>
        </div>

        <div
          className="p-4 rounded-lg shadow-sm border"
          style={{ borderColor: "var(--color-border)" }}
        >
          <h4 className="text-sm font-semibold text-[var(--color-primary)] mb-2 uppercase tracking-wide">
            Recent Activity
          </h4>
          <ul className="text-sm space-y-2">
            <li>🗓️ Joined “Mock Interview Practice” challenge</li>
            <li>💬 Completed a Technical Interview round</li>
            <li>⭐ Earned 25 new credits from community answers</li>
          </ul>
        </div>
      </div>

      {/* Footer Section */}
      <div className="mt-8 text-sm text-center text-[var(--color-text-muted)] border-t pt-4">
        <p>
          Member since{" "}
          <span className="text-[var(--color-primary)]">{user.joined}</span> |{" "}
          <span className="opacity-70">Last updated: Oct 2025</span>
        </p>
      </div>
    </div>
  );
}
