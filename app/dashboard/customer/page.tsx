"use client";

const complaints = [
  { id: "#2026-0089", title: "Login not working on mobile", status: "New", date: "23 Mar" },
  { id: "#2026-0071", title: "Payment deducted but order not placed", status: "In Progress", date: "20 Mar" },
  { id: "#2026-0055", title: "Account verification email not received", status: "Resolved", date: "15 Mar" },
  { id: "#2026-0042", title: "Wrong product delivered", status: "Resolved", date: "10 Mar" },
];

const badgeStyles: Record<string, { background: string; color: string }> = {
  New: { background: "#dbeafe", color: "#1e40af" },
  "In Progress": { background: "#fef9c3", color: "#854d0e" },
  Resolved: { background: "#dcfce7", color: "#166534" },
};

export default function CustomerDashboard() {
  return (
    <div style={{ padding: "24px", maxWidth: 960, width: "100%", margin: "0 auto" }}>

      {/* Welcome Card */}
      <div style={{
        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
        borderRadius: 14,
        padding: "20px 24px",
        marginBottom: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 500, color: "#fff", marginBottom: 4 }}>
            Hello, Mayank! 👋
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }}>
            Track your complaints and stay updated on their progress.
          </div>
        </div>
        <button style={{
          background: "rgba(255,255,255,0.2)",
          border: "0.5px solid rgba(255,255,255,0.35)",
          color: "#fff",
          padding: "9px 18px",
          borderRadius: 8,
          fontSize: 13,
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}>
          + New Complaint
        </button>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, minmax(0,1fr))",
        gap: 12,
        marginBottom: 24,
      }}>
        {[
          { label: "Total", value: 12, bar: "linear-gradient(90deg, #6366f1, #8b5cf6)" },
          { label: "Pending", value: 4, bar: "linear-gradient(90deg, #f59e0b, #ef4444)" },
          { label: "In Progress", value: 3, bar: "linear-gradient(90deg, #06b6d4, #3b82f6)" },
          { label: "Resolved", value: 5, bar: "linear-gradient(90deg, #10b981, #06b6d4)" },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: "#ffffff",
            borderRadius: 12,
            border: "0.5px solid rgba(0,0,0,0.08)",
            padding: 16,
          }}>
            <div style={{
              fontSize: 11,
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: 8,
            }}>
              {stat.label}
            </div>
            <div style={{ fontSize: 28, fontWeight: 500, color: "#0f172a", lineHeight: 1 }}>
              {stat.value}
            </div>
            <div style={{ height: 3, borderRadius: 2, marginTop: 10, background: stat.bar }} />
          </div>
        ))}
      </div>

      {/* Recent Complaints */}
      <div style={{ fontSize: 13, fontWeight: 500, color: "#0f172a", marginBottom: 12 }}>
        Recent Complaints
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {complaints.map((c) => (
          <div key={c.id} style={{
            background: "#ffffff",
            border: "0.5px solid rgba(0,0,0,0.08)",
            borderRadius: 10,
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}>
            <span style={{
              fontSize: 11,
              color: "#64748b",
              fontFamily: "monospace",
              minWidth: 90,
            }}>
              {c.id}
            </span>
            <span style={{ fontSize: 13, color: "#0f172a", flex: 1 }}>
              {c.title}
            </span>
            <span style={{
              fontSize: 11,
              padding: "3px 10px",
              borderRadius: 20,
              fontWeight: 500,
              ...badgeStyles[c.status],
            }}>
              {c.status}
            </span>
            <span style={{ fontSize: 11, color: "#64748b", minWidth: 50, textAlign: "right" }}>
              {c.date}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}