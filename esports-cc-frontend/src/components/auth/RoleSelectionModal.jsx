import { useState } from "react";
import { motion } from "framer-motion";
import { HiUserGroup, HiUser, HiBriefcase } from "react-icons/hi";

export default function RoleSelectionModal({ isOpen, onRoleSelect, userName }) {
  const [selectedRole, setSelectedRole] = useState("");

  const handleSubmit = () => {
    if (selectedRole) {
      onRoleSelect(selectedRole);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <HiUserGroup className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome, {userName}!</h2>
          <p className="text-gray-600">Choose how you'd like to use Upkraft</p>
        </div>

        <div className="space-y-4 mb-6">
          <div
            onClick={() => setSelectedRole("CREATOR")}
            className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
              selectedRole === "CREATOR"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center space-x-3">
              <HiUser className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Content Creator</h3>
                <p className="text-sm text-gray-600">I want to hire freelancers</p>
              </div>
            </div>
          </div>

          <div
            onClick={() => setSelectedRole("FREELANCER")}
            className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
              selectedRole === "FREELANCER"
                ? "border-purple-500 bg-purple-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center space-x-3">
              <HiBriefcase className="w-6 h-6 text-purple-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Freelancer</h3>
                <p className="text-sm text-gray-600">I want to offer services</p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!selectedRole}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
        >
          Continue
        </button>
      </motion.div>
    </div>
  );
}