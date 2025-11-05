export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-[var(--color-text-main)]">
        Dashboard
      </h2>

      {/* Overview cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Total Traffic",
            value: "30,825",
            change: "+25.36%",
            color: "text-[var(--color-success)]",
          },
          {
            title: "New Customers",
            value: "2,850",
            change: "+9.87%",
            color: "text-[var(--color-success)]",
          },
          {
            title: "Sales",
            value: "529",
            change: "-12.36%",
            color: "text-[var(--color-danger)]",
          },
          {
            title: "Performance",
            value: "28.50%",
            change: "+9.87%",
            color: "text-[var(--color-success)]",
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className="rounded-xl shadow-sm p-5 border transition-colors duration-300"
            style={{
              backgroundColor: "var(--color-bg-panel)",
              borderColor: "var(--color-border)",
              color: "var(--color-text-main)",
            }}
          >
            <p className="text-sm text-[var(--color-text-muted)]">
              {card.title}
            </p>
            <h3 className="text-2xl font-semibold">{card.value}</h3>
            <p className={`text-xs font-medium ${card.color}`}>
              {card.change} Since last month
            </p>
          </div>
        ))}
      </div>

      {/* Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className="rounded-xl shadow-sm p-5 border"
          style={{
            backgroundColor: "var(--color-bg-panel)",
            borderColor: "var(--color-border)",
          }}
        >
          <h4 className="font-medium mb-2 text-[var(--color-text-main)]">
            Sale Revenue
          </h4>
          <div className="h-60 flex items-center justify-center text-[var(--color-text-muted)] italic">
            (Revenue chart placeholder)
          </div>
        </div>

        <div
          className="rounded-xl shadow-sm p-5 border"
          style={{
            backgroundColor: "var(--color-bg-panel)",
            borderColor: "var(--color-border)",
          }}
        >
          <h4 className="font-medium mb-2 text-[var(--color-text-main)]">
            Source of Revenue Generated
          </h4>
          <div className="h-60 flex items-center justify-center text-[var(--color-text-muted)] italic">
            (Pie chart placeholder)
          </div>
        </div>
      </div>
    </div>
  );
}
