import { useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";

const mockUserData = {
  1: {
    name: "AceEditor",
    email: "ace@example.com",
    joinDate: "2024-01-10",
    documents: {
      idProof: "passport_ace.pdf",
      addressProof: "utility_bill_ace.pdf",
      bankStatement: "bank_statement_ace.pdf"
    }
  },
  2: {
    name: "ThumbPro",
    email: "thumb@example.com",
    joinDate: "2024-01-12",
    documents: {
      idProof: "license_thumb.jpg",
      addressProof: "lease_agreement_thumb.pdf",
      bankStatement: "bank_statement_thumb.pdf"
    }
  }
};

export default function KYCReview() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [decision, setDecision] = useState("");
  
  const userData = mockUserData[userId];

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">User Not Found</h2>
          <button
            onClick={() => navigate("/admin")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg text-white px-6 py-3 rounded-xl font-semibold transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleDecision = (action) => {
    setDecision(action);
    alert(`KYC ${action} for ${userData.name}`);
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Background Elements */}
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
          <button
            onClick={() => navigate("/admin")}
            className="text-purple-600 hover:text-purple-700 mb-4 flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            KYC Document Review 📋
          </h1>
          <p className="text-gray-600 text-lg">Review submitted documents for {userData.name}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">User Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-600">Name</p>
                <p className="text-gray-900">{userData.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Email</p>
                <p className="text-gray-900">{userData.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Application Date</p>
                <p className="text-gray-900">{new Date(userData.joinDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleDecision("approved")}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-semibold transition-all shadow-lg"
              >
                ✓ Approve KYC
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleDecision("rejected")}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl font-semibold transition-all shadow-lg"
              >
                ✗ Reject KYC
              </motion.button>
            </div>
          </motion.div>

          {/* Documents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Submitted Documents</h3>
            
            <div className="space-y-6">
              {/* ID Proof */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 p-6"
              >
                <h4 className="text-lg font-semibold text-gray-900 mb-3">ID Proof</h4>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600">📄</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{userData.documents.idProof}</p>
                      <p className="text-sm text-gray-500">Uploaded document</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all text-sm"
                  >
                    View
                  </motion.button>
                </div>
              </motion.div>

              {/* Address Proof */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 p-6"
              >
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Address Proof</h4>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600">🏠</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{userData.documents.addressProof}</p>
                      <p className="text-sm text-gray-500">Uploaded document</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all text-sm"
                  >
                    View
                  </motion.button>
                </div>
              </motion.div>

              {/* Bank Statement */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 p-6"
              >
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Bank Statement</h4>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-purple-600">🏦</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{userData.documents.bankStatement}</p>
                      <p className="text-sm text-gray-500">Uploaded document</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all text-sm"
                  >
                    View
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}