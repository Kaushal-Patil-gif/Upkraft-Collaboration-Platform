import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";
import { getFreelancerDashboard } from "../../../services/dashboardService";
import {
  HiFolder,
  HiPlay,
  HiCheckCircle,
  HiCurrencyRupee,
  HiRefresh,
  HiHome,
  HiPlus,
  HiEye,
} from "react-icons/hi";
import WalletBalance from "../../../components/wallet/WalletBalance";

export default function FreelancerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getFreelancerDashboard();
        setDashboardData(data);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 1 || user?.role === "FREELANCER") {
      fetchDashboard();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Failed to Load Dashboard
          </h2>
          <p className="text-gray-600 mb-6">Please try refreshing the page.</p>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10 flex items-center gap-2">
              <HiRefresh className="w-5 h-5" />
              Refresh
            </span>
          </motion.button>
        </div>
      </div>
    );
  }

  if (!user || (user.role !== 1 && user.role !== "FREELANCER")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Unauthorized Access
          </h2>
          <p className="text-gray-600 mb-6">
            You need to be a freelancer to access this dashboard.
          </p>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10 flex items-center gap-2">
              <HiHome className="w-5 h-5" />
              Go Home
            </span>
          </motion.button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Review":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "In Progress":
        return <HiPlay className="w-4 h-4" />;
      case "Completed":
        return <HiCheckCircle className="w-4 h-4" />;
      default:
        return <HiFolder className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-8 pt-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Freelancer Dashboard
              </h1>
              <p className="text-gray-600 text-lg">
                Manage your projects and grow your freelance business
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Welcome back,</p>
                <p className="text-lg font-semibold text-gray-900">
                  {user?.name || "Freelancer"}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {(user?.name || "F")[0].toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <motion.button
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/profile/add-service")}
              className="bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 text-left"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-3">
                <HiPlus className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Create Service
              </h3>
              <p className="text-sm text-gray-600">Add new service offering</p>
            </motion.button>

            <motion.button
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/my-projects")}
              className="bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 text-left"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-3">
                <HiFolder className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">My Projects</h3>
              <p className="text-sm text-gray-600">View all projects</p>
            </motion.button>

            <motion.button
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/profile/freelancer?tab=services")}
              className="bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 text-left"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-3">
                <HiEye className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">My Services</h3>
              <p className="text-sm text-gray-600">Manage your services</p>
            </motion.button>

            <motion.button
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/profile/freelancer?tab=payments")}
              className="bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 text-left"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-3">
                <HiCurrencyRupee className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Payment History
              </h3>
              <p className="text-sm text-gray-600">
                View earnings & transactions
              </p>
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">
                Total Earnings
              </p>
              <HiCurrencyRupee className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              ₹{(dashboardData?.stats?.totalSpent || 0).toLocaleString()}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">
                Active Projects
              </p>
              <HiPlay className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {dashboardData?.stats?.activeProjects || 0}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <HiCheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {dashboardData?.stats?.completedProjects || 0}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <span className="text-2xl">⭐</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {dashboardData?.stats?.rating || 0}
            </p>
          </motion.div>
        </motion.div>

        <div className="space-y-8">
          {/* Wallet Balance */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <WalletBalance />
          </motion.div>

          {/* Active Projects */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <HiPlay className="w-6 h-6 text-blue-600" />
              Active Projects
            </h2>

            <div className="space-y-4">
              {(dashboardData?.projects || []).filter(
                (p) => p.status !== "Completed" && p.status !== "COMPLETED",
              ).length > 0 ? (
                (dashboardData?.projects || [])
                  .filter(
                    (p) => p.status !== "Completed" && p.status !== "COMPLETED",
                  )
                  .map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      whileHover={{ y: -2, scale: 1.01 }}
                      className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 h-36 flex flex-col justify-between"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 flex-1 pr-3">
                          {project.title}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium min-w-fit text-center flex-shrink-0 flex items-center gap-1 ${getStatusColor(project.status)}`}
                        >
                          {getStatusIcon(project.status)}
                          {project.status}
                        </span>
                      </div>
                      <p className="text-base text-gray-700 mb-3 font-medium">
                        Client: {project.creator}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-bold text-purple-600 flex items-center gap-1">
                          <HiCurrencyRupee className="w-5 h-5" />
                          {(project.price || 0).toLocaleString()}
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigate(`/project/${project.id}`)}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-all text-sm min-w-fit hover:shadow-lg flex items-center gap-1"
                        >
                          <HiEye className="w-4 h-4" />
                          Open
                        </motion.button>
                      </div>
                    </motion.div>
                  ))
              ) : (
                <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg text-center border border-gray-200">
                  <HiFolder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4 text-lg font-medium">
                    No active projects
                  </p>
                  <p className="text-sm text-gray-400 mb-6">
                    Create services to start getting hired by creators
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/profile/add-service")}
                    className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10 flex items-center gap-2">
                      <HiPlus className="w-5 h-5" />
                      Create Service
                    </span>
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
