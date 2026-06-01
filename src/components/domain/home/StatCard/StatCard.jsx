export function StatCard({ completed, high, label, pending, value }) {
  return (
    <div className="stat">
      <strong>{value}</strong>
      <span>{label}</span>
      <small>{pending} pending</small>
      <small>{high} high priority</small>
      <small>{completed} completed</small>
    </div>
  );
}
