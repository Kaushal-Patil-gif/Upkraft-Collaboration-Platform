import { motion } from "framer-motion";
import {
  HiClock,
  HiCheckCircle,
  HiCurrencyRupee,
  HiChat,
} from "react-icons/hi";

export default function RecentActivity({ dashboardData }) {
  if (!dashboardData) return null;

  // Mock recent activities - in real app, this would come from API
  const activities = [
    {
      id: 1,
      type: "payment",
      title: "Payment released for Video Editing Project",
      time: "2 hours ago",
      icon: HiCurrencyRupee,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      id: 2,
      type: "milestone",
      title: "Milestone completed in Thumbnail Design",
      time: "5 hours ago",
      icon: HiCheckCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      id: 3,
      type: "message",
      title: "New message from freelancer",
      time: "1 day ago",
      icon: HiChat,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      id: 4,
      type: "project",
      title: "New project started with Alex",
      time: "2 days ago",
      icon: HiClock,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 p-6"
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div
              className={`w-10 h-10 ${activity.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}
            >
              <activity.icon className={`w-5 h-5 ${activity.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {activity.title}
              </p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-4 text-sm text-purple-600 hover:text-purple-700 font-medium"
      >
        View All Activity
      </motion.button>
    </motion.div>
  );
}
