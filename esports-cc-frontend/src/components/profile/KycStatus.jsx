import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function KycStatus({ status = "NOT_VERIFIED" }) {
  const navigate = useNavigate();
  const getStatusConfig = (status) => {
    switch (status) {
      case "UNVERIFIED":
      case "NOT_VERIFIED":
        return {
          color: "text-red-600",
          bgColor: "bg-red-100",
          icon: "⚠️",
          message: "Not Verified",
          description: "Start 2-factor verification"
        };
      case "LEVEL_1_EMAIL":
        return {
          color: "text-blue-600",
          bgColor: "bg-blue-100",
          icon: "📧",
          message: "Level 1 Verified",
          description: "Email verified - Upload document for Level 2"
        };
      case "LEVEL_2_DOCUMENT":
      case "VERIFIED":
        return {
          color: "text-green-600",
          bgColor: "bg-green-100",
          icon: "✓",
          message: "Fully Verified",
          description: "2-factor verification complete"
        };
      case "PENDING":
        return {
          color: "text-yellow-600",
          bgColor: "bg-yellow-100",
          icon: "⏳",
          message: "Verification Pending",
          description: "Documents under review"
        };
      case "REJECTED":
        return {
          color: "text-red-600",
          bgColor: "bg-red-100",
          icon: "✗",
          message: "Verification Failed",
          description: "Please resubmit documents"
        };
      default:
        return {
          color: "text-gray-600",
          bgColor: "bg-gray-100",
          icon: "?",
          message: "Unknown Status",
          description: "Contact support"
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white p-6 rounded-2xl shadow-md border border-gray-100"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">KYC Status</h3>
      <div className="text-center">
        <div className={`w-16 h-16 ${config.bgColor} rounded-full flex items-center justify-center mx-auto mb-3`}>
          <span className={`text-2xl ${config.color}`}>{config.icon}</span>
        </div>
        <p className={`font-bold ${config.color} mb-1`}>{config.message}</p>
        <p className="text-sm text-gray-600">{config.description}</p>
        
        {(status === "NOT_VERIFIED" || status === "UNVERIFIED") && (
          <button 
            onClick={() => navigate("/kyc/2fa")}
            className="mt-3 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
          >
            Start 2-Factor Verification
          </button>
        )}
        
        {status === "LEVEL_1_EMAIL" && (
          <button 
            onClick={() => navigate("/kyc/2fa")}
            className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
          >
            Complete Level 2 Verification
          </button>
        )}
        
        {status === "PENDING" && (
          <p className="mt-3 text-sm text-purple-600 font-medium">
            Under Review
          </p>
        )}
        
        {status === "REJECTED" && (
          <button 
            onClick={() => navigate("/kyc/2fa")}
            className="mt-3 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
          >
            Retry 2-Factor Verification
          </button>
        )}
      </div>
    </motion.div>
  );
}
