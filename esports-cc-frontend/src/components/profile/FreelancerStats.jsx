import { motion } from "framer-motion";

export default function FreelancerStats() {
  const stats = {
    totalProjects: 42,
    totalEarnings: 156000,
    avgRating: 4.8,
    completionRate: 98
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-2xl shadow-md border border-gray-100"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Stats</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">{stats.totalProjects}</p>
          <p className="text-xs text-gray-500">Total Projects</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">₹{(stats.totalEarnings / 1000).toFixed(0)}k</p>
          <p className="text-xs text-gray-500">Total Earnings</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-yellow-600">{stats.avgRating} ⭐</p>
          <p className="text-xs text-gray-500">Avg Rating</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.completionRate}%</p>
          <p className="text-xs text-gray-500">Completion Rate</p>
        </div>
      </div>
    </motion.div>
  );
}
