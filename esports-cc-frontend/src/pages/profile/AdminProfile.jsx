import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HiShieldCheck, HiCog, HiUsers, HiChartBar, HiDocumentText } from "react-icons/hi";

export default function AdminProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Administrator Profile
              </h1>
              <p className="text-gray-600 text-lg">Manage your administrator account and platform settings</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">System Administrator</p>
                <p className="text-lg font-semibold text-gray-900">{user?.name || 'Admin'}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                <HiShieldCheck className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-red-100 to-red-200 rounded-xl flex items-center justify-center">
                  <HiShieldCheck className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Administrator Settings</h3>
                  <p className="text-gray-600">Manage your administrator account and preferences</p>
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/profile/edit")}
                className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center gap-2">
                  <HiCog className="w-5 h-5" />
                  Edit Profile
                </span>
              </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div 
                whileHover={{ y: -2, scale: 1.02 }}
                className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <HiUsers className="w-5 h-5 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-blue-900">User Management</h4>
                </div>
                <p className="text-sm text-blue-700">Full access to user accounts, roles, and permissions across the platform</p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -2, scale: 1.02 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <HiShieldCheck className="w-5 h-5 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-green-900">Security Level</h4>
                </div>
                <p className="text-sm text-green-700">Maximum security clearance with all administrative privileges and system controls</p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -2, scale: 1.02 }}
                className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <HiCog className="w-5 h-5 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-purple-900">Platform Control</h4>
                </div>
                <p className="text-sm text-purple-700">Complete control over platform settings, configurations, and operational parameters</p>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 p-8"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-100">
                  <label className="text-sm font-semibold text-blue-900 mb-2 block">Full Name</label>
                  <p className="text-gray-800 font-medium">{user?.name || 'Administrator'}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
                  <label className="text-sm font-semibold text-green-900 mb-2 block">Email Address</label>
                  <p className="text-gray-800 font-medium">{user?.email || 'admin@upkraft.com'}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
                  <label className="text-sm font-semibold text-purple-900 mb-2 block">Role</label>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800">
                    <HiShieldCheck className="w-4 h-4 mr-1" />
                    System Administrator
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl border border-orange-100">
                  <label className="text-sm font-semibold text-orange-900 mb-2 block">Account Status</label>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-xl border border-indigo-100">
                  <label className="text-sm font-semibold text-indigo-900 mb-2 block">Last Login</label>
                  <p className="text-gray-800 font-medium">{new Date().toLocaleDateString()}</p>
                </div>
                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-4 rounded-xl border border-teal-100">
                  <label className="text-sm font-semibold text-teal-900 mb-2 block">Permissions</label>
                  <p className="text-gray-800 font-medium">Full Administrative Access</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}