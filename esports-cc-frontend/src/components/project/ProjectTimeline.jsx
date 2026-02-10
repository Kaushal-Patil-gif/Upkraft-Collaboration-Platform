export default function ProjectTimeline() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow">
      <h3 className="font-semibold mb-3">Project Timeline</h3>

      <ul className="text-sm text-slate-600 space-y-1">
        <li>✔ Project Created</li>
        <li>✔ Payment Pending</li>
        <li>⏳ Work in Progress</li>
        <li>⏳ Delivery</li>
      </ul>
    </div>
  );
}
