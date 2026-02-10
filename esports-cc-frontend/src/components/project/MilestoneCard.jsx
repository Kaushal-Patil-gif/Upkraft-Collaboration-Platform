export default function MilestoneCard({ isCreator }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow">
      <h3 className="font-semibold mb-3">Milestones</h3>

      <ul className="text-sm text-slate-600 mb-3">
        <li>✔ Initial Draft</li>
        <li>⏳ Final Delivery</li>
      </ul>

      {isCreator && (
        <button className="px-4 py-2 bg-indigo-600 text-white rounded">
          Add Milestone
        </button>
      )}
    </div>
  );
}
