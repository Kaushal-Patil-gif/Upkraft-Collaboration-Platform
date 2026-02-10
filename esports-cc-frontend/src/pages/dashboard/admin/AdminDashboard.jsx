import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { HiShieldCheck, HiUsers, HiDocumentText, HiCurrencyDollar, HiChartBar, HiPencil, HiX, HiRefresh, HiHome, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { getPendingKyc, reviewKyc, getAdminStats, getAllUsers, deactivateUser, activateUser, updateUser } from "../../../services/adminService";

// Modal Components
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
              type === "success" ? "text-green-500" : "text-red-500"
            }`}>
              {type === "success" ? "✅" : "❌"}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 mb-6">{message}</p>
            <button
              onClick={onClose}
              className={`px-6 py-2 rounded-xl font-medium transition-all ${
                type === "success" 
                  ? "bg-green-600 hover:bg-green-700 text-white" 
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

const PromptModal = ({ isOpen, onClose, onConfirm, title, message, placeholder = "", required = false }) => {
  const [inputValue, setInputValue] = useState("");

  const handleConfirm = () => {
    if (required && !inputValue.trim()) return;
    onConfirm(inputValue);
    setInputValue("");
  };

  const handleClose = () => {
    setInputValue("");
    onClose();
  };

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
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-4">{message}</p>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
          />
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
            >
              Confirm
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
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
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
            >
              Confirm
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const KYCStatusModal = ({ isOpen, onClose, user, onUpdate }) => {
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    if (user) {
      setSelectedStatus(user.kycStatus || "UNVERIFIED");
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5011/api/admin/users/${user.id}/kyc-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ kycStatus: selectedStatus })
      });
      
      if (response.ok) {
        onUpdate(user.id, selectedStatus);
        onClose();
      } else {
        throw new Error('Failed to update KYC status');
      }
    } catch (error) {
      console.error('Failed to update KYC status:', error);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl p-6 max-w-md mx-4 shadow-2xl"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">Update KYC Status</h3>
          <p className="text-gray-600 mb-4">User: {user.name}</p>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">KYC Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="UNVERIFIED">Unverified</option>
              <option value="LEVEL_1_EMAIL">Email Verified</option>
              <option value="LEVEL_2_DOCUMENT">Document Verified</option>
            </select>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
            >
              Update
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const DocumentModal = ({ isOpen, onClose, user }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      fetchUserDocuments();
    }
  }, [isOpen, user]);

  const fetchUserDocuments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5011/api/admin/users/${user.id}/documents`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl p-6 max-w-2xl mx-4 shadow-2xl max-h-[80vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">User Documents</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>
          
          <p className="text-gray-600 mb-6">User: {user.name} ({user.email})</p>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading documents...</p>
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-8">
              <HiDocumentText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No documents found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((doc, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{doc.documentType}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      doc.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      doc.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Uploaded: {new Date(doc.uploadedAt).toLocaleString()}
                  </p>
                  <button
                    onClick={() => window.open(doc.documentUrl, '_blank')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    View Document
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pendingKYC, setPendingKYC] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeProjects: 0,
    pendingKyc: 0,
    platformUptime: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userPage, setUserPage] = useState(1);
  const [kycPage, setKycPage] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', password: '' });
  const [validationErrors, setValidationErrors] = useState({});
  const [modal, setModal] = useState({ isOpen: false, title: "", message: "", type: "success" });
  const [promptModal, setPromptModal] = useState({ isOpen: false, title: "", message: "", placeholder: "", required: false, onConfirm: null });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: "", message: "", onConfirm: null });
  const [kycStatusModal, setKycStatusModal] = useState({ isOpen: false, user: null });
  const [documentModal, setDocumentModal] = useState({ isOpen: false, user: null });
  const usersPerPage = 5;
  const kycPerPage = 5;

  const showModal = (title, message, type = "success") => {
    setModal({ isOpen: true, title, message, type });
  };

  const closeModal = () => {
    setModal({ isOpen: false, title: "", message: "", type: "success" });
  };

  const showPrompt = (title, message, placeholder = "", required = false) => {
    return new Promise((resolve) => {
      setPromptModal({
        isOpen: true,
        title,
        message,
        placeholder,
        required,
        onConfirm: (value) => {
          setPromptModal({ isOpen: false, title: "", message: "", placeholder: "", required: false, onConfirm: null });
          resolve(value);
        }
      });
    });
  };

  const showConfirm = (title, message) => {
    return new Promise((resolve) => {
      setConfirmModal({
        isOpen: true,
        title,
        message,
        onConfirm: () => {
          setConfirmModal({ isOpen: false, title: "", message: "", onConfirm: null });
          resolve(true);
        }
      });
    });
  };

  const closePrompt = () => {
    setPromptModal({ isOpen: false, title: "", message: "", placeholder: "", required: false, onConfirm: null });
  };

  const closeConfirm = () => {
    setConfirmModal({ isOpen: false, title: "", message: "", onConfirm: null });
  };

  const handleKYCStatusUpdate = async (userId, newStatus) => {
    await refreshData(); // Refresh all data
    showModal("Success", "KYC status updated successfully", "success");
  };

  const openKYCStatusModal = (user) => {
    setKycStatusModal({ isOpen: true, user });
  };

  const closeKYCStatusModal = () => {
    setKycStatusModal({ isOpen: false, user: null });
  };

  const openDocumentModal = (user) => {
    setDocumentModal({ isOpen: true, user });
  };

  const closeDocumentModal = () => {
    setDocumentModal({ isOpen: false, user: null });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kycData, statsData, usersData] = await Promise.all([
          getPendingKyc(),
          getAdminStats(),
          getAllUsers()
        ]);
        setPendingKYC(kycData);
        setStats(statsData);
        setUsers(usersData);
        setFilteredUsers(usersData);
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user && (user.role === "ADMIN" || user.role === 2 || user.role === "Admin")) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user || !(user.role === "ADMIN" || user.role === 2 || user.role === "Admin")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Unauthorized Access</h2>
          <p className="text-gray-600 mb-6">You need admin privileges to access this dashboard.</p>
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

  const refreshData = async () => {
    try {
      const [kycData, statsData, usersData] = await Promise.all([
        getPendingKyc(),
        getAdminStats(),
        getAllUsers()
      ]);
      setPendingKYC(kycData);
      setStats(statsData);
      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (error) {
      console.error('Failed to refresh data:', error);
    }
  };

  const handleKYCAction = async (userId, action) => {
    try {
      let remarks = "";
      if (action === "approve") {
        remarks = await showPrompt("Approval Remarks", "Enter approval remarks (optional):", "Approved by admin") || "";
      } else if (action === "reject") {
        remarks = await showPrompt("Rejection Reason", "Enter rejection reason:", "Please provide reason", true);
        if (!remarks) return;
      }
      
      await reviewKyc(userId, action, remarks);
      await refreshData(); // Refresh all data
      showModal("Success", `KYC ${action}d successfully`, "success");
    } catch (error) {
      console.error(`Failed to ${action} KYC:`, error);
      setError(`Failed to ${action} KYC: ${error.message}`);
    }
  };

  const totalUserPages = Math.ceil(filteredUsers.length / usersPerPage);
  const totalKycPages = Math.ceil(pendingKYC.length / kycPerPage);
  const currentUsers = filteredUsers.slice((userPage - 1) * usersPerPage, userPage * usersPerPage);
  const currentKyc = pendingKYC.slice((kycPage - 1) * kycPerPage, kycPage * kycPerPage);

  const handleToggleUserStatus = async (userId, isActive) => {
    const action = isActive ? 'deactivate' : 'activate';
    const confirmed = await showConfirm(
      `${action.charAt(0).toUpperCase() + action.slice(1)} User`,
      `Are you sure you want to ${action} this user?`
    );
    
    if (confirmed) {
      try {
        if (isActive) {
          await deactivateUser(userId);
        } else {
          await activateUser(userId);
        }
        await refreshData(); // Refresh all data
        showModal("Success", `User ${action}d successfully`, "success");
      } catch (error) {
        showModal("Error", `Failed to ${action} user: ` + error.message, "error");
      }
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setEditForm({ name: user.name, email: user.email, password: '' });
    setValidationErrors({});
  };

  const handleUpdateUser = async () => {
    try {
      setValidationErrors({});
      // Filter out empty password
      const updateData = { ...editForm };
      if (!updateData.password || updateData.password.trim() === '') {
        delete updateData.password;
      }
      await updateUser(editingUser.id, updateData);
      await refreshData(); // Refresh all data
      setEditingUser(null);
      showModal("Success", "User updated successfully", "success");
    } catch (error) {
      console.log('Update error:', error); // Debug log
      console.log('Validation errors:', error.validationErrors); // Debug log
      if (error.validationErrors) {
        setValidationErrors(error.validationErrors);
      } else {
        showModal("Error", "Failed to update user: " + error.message, "error");
      }
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
                Admin Dashboard
              </h1>
              <p className="text-gray-600 text-lg">Manage platform operations and user verifications</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Administrator</p>
                <p className="text-lg font-semibold text-gray-900">{user?.name || 'Admin'}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                <HiShieldCheck className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8"
        >
          <motion.div 
            whileHover={{ y: -4, scale: 1.02 }}
            className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <HiUsers className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -4, scale: 1.02 }}
            className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">Active Projects</p>
              <HiChartBar className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.activeProjects}</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -4, scale: 1.02 }}
            className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">Pending KYC</p>
              <HiDocumentText className="w-6 h-6 text-yellow-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.pendingKyc}</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -4, scale: 1.02 }}
            className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">Project Value</p>
              <HiCurrencyDollar className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">₹{stats.totalProjectValue?.toLocaleString() || 0}</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -4, scale: 1.02 }}
            className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">Platform Revenue</p>
              <HiCurrencyDollar className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600">₹{stats.platformRevenue?.toLocaleString() || 0}</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -4, scale: 1.02 }}
            className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">Freelancer Earnings</p>
              <HiCurrencyDollar className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-600">₹{stats.freelancerEarnings?.toLocaleString() || 0}</p>
          </motion.div>
        </motion.div>

        {/* User Management */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <HiUsers className="w-6 h-6 text-blue-600" />
              User Management
            </h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search users by name, email, or role..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  const filtered = users.filter(user => 
                    user.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
                    user.email.toLowerCase().includes(e.target.value.toLowerCase()) ||
                    user.role.toLowerCase().includes(e.target.value.toLowerCase())
                  );
                  setFilteredUsers(filtered);
                }}
                className="w-80 pl-4 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 backdrop-blur-sm"
              />
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            <div className="max-h-80 overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">KYC Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{u.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          u.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                          u.role === 'FREELANCER' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            u.kycStatus === 'LEVEL_2_DOCUMENT' ? 'bg-green-100 text-green-800' :
                            u.kycStatus === 'LEVEL_1_EMAIL' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {u.kycStatus === 'LEVEL_2_DOCUMENT' ? 'VERIFIED' :
                             u.kycStatus === 'LEVEL_1_EMAIL' ? 'EMAIL VERIFIED' :
                             'UNVERIFIED'}
                          </span>
                          <button
                            onClick={() => openKYCStatusModal(u)}
                            className="text-blue-600 hover:text-blue-800 text-xs underline"
                          >
                            Change
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          u.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {u.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {u.role === 'ADMIN' ? (
                          <span className="text-gray-400 text-sm">Protected</span>
                        ) : (
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleEditUser(u)}
                              className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50 transition-all"
                            >
                              <HiPencil className="w-4 h-4" />
                              Edit
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => openDocumentModal(u)}
                              className="text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1 px-2 py-1 rounded hover:bg-purple-50 transition-all"
                            >
                              <HiDocumentText className="w-4 h-4" />
                              Docs
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleToggleUserStatus(u.id, u.active)}
                              className={`font-medium flex items-center gap-1 px-2 py-1 rounded transition-all ${
                                u.active ? 'text-red-600 hover:text-red-800 hover:bg-red-50' : 'text-green-600 hover:text-green-800 hover:bg-green-50'
                              }`}
                            >
                              {u.active ? 'Deactivate' : 'Activate'}
                            </motion.button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* User Pagination */}
            {totalUserPages > 1 && (
              <div className="flex items-center justify-between px-6 py-3 bg-gray-50/80 backdrop-blur-sm border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Showing {((userPage - 1) * usersPerPage) + 1} to {Math.min(userPage * usersPerPage, filteredUsers.length)} of {filteredUsers.length} users
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setUserPage(prev => Math.max(prev - 1, 1))}
                    disabled={userPage === 1}
                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                      userPage === 1 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
                    }`}
                  >
                    <HiChevronLeft className="w-4 h-4" />
                    Previous
                  </motion.button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalUserPages }, (_, i) => i + 1).map(page => (
                      <motion.button
                        key={page}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setUserPage(page)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                          page === userPage
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                        }`}
                      >
                        {page}
                      </motion.button>
                    ))}
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setUserPage(prev => Math.min(prev + 1, totalUserPages))}
                    disabled={userPage === totalUserPages}
                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                      userPage === totalUserPages 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
                    }`}
                  >
                    Next
                    <HiChevronRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* KYC Verification */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <HiDocumentText className="w-6 h-6 text-purple-600" />
            KYC Verification
          </h2>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg">
                <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg">
                <p className="text-red-600 mb-4">Error: {error}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 mx-auto"
                >
                  <HiRefresh className="w-4 h-4" />
                  Retry
                </motion.button>
              </div>
            ) : (
              <>
                {currentKyc.map((user, index) => (
                  <motion.div
                    key={user.userId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ y: -2, scale: 1.01 }}
                    className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{user.userName}</h3>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                        {user.status}
                      </span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">{user.userEmail}</p>
                      <p className="text-sm text-gray-600">Document: {user.documentType}</p>
                      <p className="text-sm text-gray-600">Uploaded: {new Date(user.uploadedAt).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.open(user.documentUrl, '_blank')}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg font-medium transition-all text-sm shadow-lg hover:shadow-xl"
                      >
                        View Document
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleKYCAction(user.userId, "approve")}
                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2 rounded-lg font-medium transition-all text-sm shadow-lg hover:shadow-xl"
                      >
                        Approve
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleKYCAction(user.userId, "reject")}
                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg font-medium transition-all text-sm shadow-lg hover:shadow-xl"
                      >
                        Reject
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
                {pendingKYC.length === 0 && (
                  <div className="text-center py-12 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg">
                    <HiDocumentText className="w-16 h-16 text-green-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg mb-2">All caught up!</p>
                    <p className="text-gray-400">No pending KYC verifications.</p>
                  </div>
                )}
                
                {/* KYC Pagination */}
                {totalKycPages > 1 && (
                  <div className="flex items-center justify-between mt-6 px-6 py-3 bg-purple-50/80 backdrop-blur-sm rounded-xl">
                    <div className="text-sm text-gray-600">
                      Showing {((kycPage - 1) * kycPerPage) + 1} to {Math.min(kycPage * kycPerPage, pendingKYC.length)} of {pendingKYC.length} KYC requests
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setKycPage(prev => Math.max(prev - 1, 1))}
                        disabled={kycPage === 1}
                        className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                          kycPage === 1 
                            ? 'text-gray-400 cursor-not-allowed' 
                            : 'text-purple-600 hover:text-purple-800 hover:bg-purple-50'
                        }`}
                      >
                        <HiChevronLeft className="w-4 h-4" />
                        Previous
                      </motion.button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalKycPages }, (_, i) => i + 1).map(page => (
                          <motion.button
                            key={page}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setKycPage(page)}
                            className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                              page === kycPage
                                ? 'bg-purple-600 text-white shadow-lg'
                                : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                            }`}
                          >
                            {page}
                          </motion.button>
                        ))}
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setKycPage(prev => Math.min(prev + 1, totalKycPages))}
                        disabled={kycPage === totalKycPages}
                        className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                          kycPage === totalKycPages 
                            ? 'text-gray-400 cursor-not-allowed' 
                            : 'text-purple-600 hover:text-purple-800 hover:bg-purple-50'
                        }`}
                      >
                        Next
                        <HiChevronRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>

        {/* Edit User Modal */}
        {editingUser && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl max-w-md w-full border border-gray-200"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Edit User</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setEditingUser(null)}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                >
                  <HiX className="w-5 h-5" />
                </motion.button>
              </div>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl">
                  <label className="block text-sm font-medium text-blue-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 bg-white/80 backdrop-blur-sm ${
                      validationErrors.name ? 'border-red-300 focus:ring-red-500' : 'border-blue-200 focus:ring-blue-500'
                    }`}
                  />
                  {validationErrors.name && (
                    <p className="text-red-600 text-sm mt-1">{validationErrors.name}</p>
                  )}
                </div>
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl">
                  <label className="block text-sm font-medium text-green-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 bg-white/80 backdrop-blur-sm ${
                      validationErrors.email ? 'border-red-300 focus:ring-red-500' : 'border-green-200 focus:ring-green-500'
                    }`}
                  />
                  {validationErrors.email && (
                    <p className="text-red-600 text-sm mt-1">{validationErrors.email}</p>
                  )}
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl">
                  <label className="block text-sm font-medium text-purple-700 mb-1">New Password (optional)</label>
                  <input
                    type="password"
                    value={editForm.password}
                    onChange={(e) => setEditForm(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Leave blank to keep current password"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 bg-white/80 backdrop-blur-sm ${
                      validationErrors.password ? 'border-red-300 focus:ring-red-500' : 'border-purple-200 focus:ring-purple-500'
                    }`}
                  />
                  {validationErrors.password && (
                    <p className="text-red-600 text-sm mt-1">{validationErrors.password}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setEditingUser(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleUpdateUser}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Update
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
        
        <Modal
          isOpen={modal.isOpen}
          onClose={closeModal}
          title={modal.title}
          message={modal.message}
          type={modal.type}
        />
        
        <PromptModal
          isOpen={promptModal.isOpen}
          onClose={closePrompt}
          onConfirm={promptModal.onConfirm}
          title={promptModal.title}
          message={promptModal.message}
          placeholder={promptModal.placeholder}
          required={promptModal.required}
        />
        
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          onClose={closeConfirm}
          onConfirm={confirmModal.onConfirm}
          title={confirmModal.title}
          message={confirmModal.message}
        />
        
        <KYCStatusModal
          isOpen={kycStatusModal.isOpen}
          onClose={closeKYCStatusModal}
          user={kycStatusModal.user}
          onUpdate={handleKYCStatusUpdate}
        />
        
        <DocumentModal
          isOpen={documentModal.isOpen}
          onClose={closeDocumentModal}
          user={documentModal.user}
        />
      </div>
    </div>
  );
}