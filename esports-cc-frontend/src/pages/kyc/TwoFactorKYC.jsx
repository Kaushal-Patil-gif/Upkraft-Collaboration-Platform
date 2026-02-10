import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Simple Modal Component
const Modal = ({ isOpen, onClose, title, message, type = "success" }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl p-6 max-w-md mx-4 shadow-2xl"
        >
          <div className="text-center">
            <div className={`text-4xl mb-4 ${
              type === "success" ? "text-green-500" : type === "info" ? "text-blue-500" : "text-red-500"
            }`}>
              {type === "success" ? "✅" : type === "info" ? "ℹ️" : "❌"}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 mb-6">{message}</p>
            <button
              onClick={onClose}
              className={`px-6 py-2 rounded-xl font-medium transition-all ${
                type === "success" 
                  ? "bg-green-600 hover:bg-green-700 text-white" 
                  : type === "info"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
            >
              OK
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default function TwoFactorKYC() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [kycStatus, setKycStatus] = useState(null);
  const [document, setDocument] = useState(null);
  const [documentType, setDocumentType] = useState("ID");
  const [modal, setModal] = useState({ isOpen: false, title: "", message: "", type: "success" });

  const showModal = (title, message, type = "success") => {
    setModal({ isOpen: true, title, message, type });
  };

  const closeModal = () => {
    setModal({ isOpen: false, title: "", message: "", type: "success" });
  };

  useEffect(() => {
    fetchKycStatus();
  }, []);

  const fetchKycStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5011/api/kyc/status", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const status = await response.json();
        setKycStatus(status);
        
        if (status.verificationLevel === "LEVEL_1_EMAIL") {
          setStep(2);
        } else if (status.verificationLevel === "LEVEL_2_DOCUMENT") {
          if (user.role === 0) {
            navigate("/profile/creator");
          } else if (user.role === 1) {
            navigate("/profile/freelancer");
          } else {
            navigate("/profile/creator");
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch KYC status:", error);
    }
  };

  const sendOTP = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        showModal("Authentication Required", "Please log in first", "error");
        navigate("/login");
        return;
      }
      
      const response = await fetch("http://localhost:5011/api/kyc/send-otp", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        showModal("OTP Sent", "OTP sent to your email!", "success");
      } else {
        const errorData = await response.json();
        showModal("Error", "Failed to send OTP: " + errorData.error, "error");
      }
    } catch (error) {
      showModal("Error", "Failed to send OTP", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5011/api/kyc/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ otp })
      });
      
      if (response.ok) {
        const result = await response.json();
        showModal("Success", result.message, "success");
        setStep(2);
        fetchKycStatus();
      } else {
        const error = await response.json();
        showModal("Error", error.error || "Invalid OTP", "error");
      }
    } catch (error) {
      showModal("Error", "OTP verification failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const uploadDocument = async () => {
    if (!document) {
      showModal("Document Required", "Please select a document", "error");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", document);
      formData.append("documentType", documentType);

      const response = await fetch("http://localhost:5011/api/kyc/upload-document", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      
      if (response.ok) {
        showModal("Success", "Document uploaded successfully! Please wait for admin review.", "success");
        fetchKycStatus();
      } else {
        const error = await response.json();
        showModal("Error", error.error || "Document upload failed", "error");
      }
    } catch (error) {
      showModal("Error", "Document upload failed", "error");
    } finally {
      setIsLoading(false);
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

      <div className="relative max-w-2xl mx-auto px-6 py-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            2-Factor KYC Verification 🔐
          </h1>
          <p className="text-gray-600 text-lg">Complete two-step verification to secure your account</p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-center mb-8"
        >
          <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold ${
            step >= 1 ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' : 'bg-gray-300 text-gray-600'
          }`}>
            1
          </div>
          <div className={`w-16 h-2 rounded-full ${step >= 2 ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-300'}`}></div>
          <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold ${
            step >= 2 ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' : 'bg-gray-300 text-gray-600'
          }`}>
            2
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 p-8"
        >
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Step 1: Email Verification
              </h2>
              <p className="text-gray-600 mb-6">
                We'll send a 6-digit OTP to your registered email: {user.email}
              </p>
              
              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={sendOTP}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50 transition-all"
                >
                  {isLoading ? "Sending..." : "Send OTP"}
                </motion.button>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter 6-digit OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    maxLength={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={verifyOTP}
                  disabled={isLoading || otp.length !== 6}
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50 transition-all shadow-lg"
                >
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </motion.button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Step 2: Document Upload
              </h2>
              
              {kycStatus?.documentStatus === "PENDING" ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-yellow-600">⏳</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Document Under Review</h3>
                  <p className="text-gray-600 mb-4">
                    Your document has been submitted and is currently being reviewed by our admin team.
                  </p>
                  <p className="text-sm text-gray-500">
                    You will be notified once the review is complete. Please wait for admin approval.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(user.role === 0 ? "/profile/creator" : "/profile/freelancer")}
                    className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg text-white px-6 py-3 rounded-xl font-semibold transition-all"
                  >
                    Go to Profile
                  </motion.button>
                </div>
              ) : kycStatus?.documentStatus === "REJECTED" ? (
                <div>
                  <div className="text-center py-4 mb-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl text-red-600">✗</span>
                    </div>
                    <h3 className="text-lg font-semibold text-red-900 mb-2">Document Rejected</h3>
                    <p className="text-red-600 mb-4">
                      Your document was rejected. Please upload a new document.
                    </p>
                  </div>
                  
                  <p className="text-gray-600 mb-6">
                    Upload a government-issued ID for verification
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Document Type
                      </label>
                      <select
                        value={documentType}
                        onChange={(e) => setDocumentType(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="ID">National ID</option>
                        <option value="PASSPORT">Passport</option>
                        <option value="DRIVER_LICENSE">Driver's License</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Document
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => setDocument(e.target.files[0])}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={uploadDocument}
                      disabled={isLoading || !document}
                      className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50 transition-all shadow-lg"
                    >
                      {isLoading ? "Uploading..." : "Resubmit Document"}
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-6">
                    Upload a government-issued ID for final verification
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Document Type
                      </label>
                      <select
                        value={documentType}
                        onChange={(e) => setDocumentType(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="ID">National ID</option>
                        <option value="PASSPORT">Passport</option>
                        <option value="DRIVER_LICENSE">Driver's License</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Document
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => setDocument(e.target.files[0])}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={uploadDocument}
                      disabled={isLoading || !document}
                      className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50 transition-all shadow-lg"
                    >
                      {isLoading ? "Uploading..." : "Complete Verification"}
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {kycStatus && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 bg-blue-50/80 backdrop-blur-md border border-blue-200 rounded-xl p-4"
          >
            <h3 className="font-semibold text-blue-900 mb-2">Current Status</h3>
            <div className="text-sm text-blue-700">
              <p>Verification Level: <span className="font-medium">{kycStatus.verificationLevel}</span></p>
              <p>Email Verified: <span className="font-medium">{kycStatus.emailVerified ? "Yes" : "No"}</span></p>
              <p>Document Uploaded: <span className="font-medium">{kycStatus.documentUploaded ? "Yes" : "No"}</span></p>
              {kycStatus.documentStatus && (
                <p>Document Status: <span className="font-medium">{kycStatus.documentStatus}</span></p>
              )}
            </div>
          </motion.div>
        )}
      </div>
      
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />
    </div>
  );
}