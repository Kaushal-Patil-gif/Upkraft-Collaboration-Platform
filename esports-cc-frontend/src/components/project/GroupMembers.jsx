export default function GroupMembers({ creator, freelancer }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow">
      <h3 className="font-semibold mb-3">Project Members</h3>

      <p className="text-sm text-slate-600">
        👤 Creator: {creator}
      </p>

      <p className="text-sm text-slate-600 mt-1">
        🎮 Freelancer: {freelancer}
      </p>
    </div>
  );
}
