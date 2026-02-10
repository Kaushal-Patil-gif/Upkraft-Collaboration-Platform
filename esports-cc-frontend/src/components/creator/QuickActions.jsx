import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { HiSearch, HiPlus, HiFolder, HiCurrencyRupee } from "react-icons/hi";

export default function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Browse & Create",
      description: "Find freelancers & create projects",
      icon: HiSearch,
      color: "from-blue-500 to-blue-600",
      onClick: () => navigate("/marketplace"),
    },
    {
      title: "My Projects",
      description: "View all projects",
      icon: HiFolder,
      color: "from-purple-500 to-purple-600",
      onClick: () => navigate("/my-projects"),
    },
    {
      title: "Payment History",
      description: "Track expenses",
      icon: HiCurrencyRupee,
      color: "from-orange-500 to-orange-600",
      onClick: () => navigate("/profile/creator?tab=payments"),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {actions.map((action, index) => (
        <motion.button
          key={action.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={action.onClick}
          className="bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 text-left"
        >
          <div
            className={`w-10 h-10 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mb-3`}
          >
            <action.icon className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
          <p className="text-sm text-gray-600">{action.description}</p>
        </motion.button>
      ))}
    </div>
  );
}
