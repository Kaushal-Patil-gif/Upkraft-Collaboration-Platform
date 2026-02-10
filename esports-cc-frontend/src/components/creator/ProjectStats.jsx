import { motion } from "framer-motion";
import { HiTrendingUp, HiClock, HiStar, HiCurrencyRupee } from "react-icons/hi";

export default function ProjectStats({ dashboardData }) {
  if (!dashboardData) return null;

  const avgProjectValue =
    dashboardData.stats.totalProjects > 0
      ? dashboardData.stats.totalSpent / dashboardData.stats.totalProjects
      : 0;

  const completionRate =
    dashboardData.stats.totalProjects > 0
      ? (dashboardData.stats.completedProjects /
          dashboardData.stats.totalProjects) *
        100
      : 0;

  const stats = [
    {
      title: "Avg Project Value",
      value: `₹${avgProjectValue.toLocaleString()}`,
      icon: HiCurrencyRupee,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Completion Rate",
      value: `${completionRate.toFixed(1)}%`,
      icon: HiTrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Projects",
      value: dashboardData.stats.activeProjects,
      icon: HiClock,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 p-6 mb-8"
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6">Your Performance</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="text-center"
          >
            <div
              className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-2`}
            >
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.title}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
