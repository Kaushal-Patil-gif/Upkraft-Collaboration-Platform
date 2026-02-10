import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { HiMail, HiDesktopComputer, HiLocationMarker, HiGlobeAlt, HiChatAlt, HiLightningBolt, HiUser } from "react-icons/hi";
import KycStatus from "../../components/profile/KycStatus";
import { getUserProfile } from "../../services/userService";
import { getCreatorDashboard } from "../../services/dashboardService";
import { getKycStatus } from "../../services/kycService";
import PaymentHistory from "../../components/wallet/PaymentHistory";

export default function CreatorProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [kycStatus, setKycStatus] = useState("UNVERIFIED");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let profile = null;
        try {
          profile = await getUserProfile();
        } catch (profileError) {
          console.error('Profile API failed:', profileError);
          setError(`Profile API Error: ${profileError.message}`);
        }
        
        let dashboard = null;
        try {
          dashboard = await getCreatorDashboard();
        } catch (dashboardError) {
          console.error('Dashboard API failed:', dashboardError);
        }
        
        let kyc = "UNVERIFIED";
        try {
          const response = await fetch("http://localhost:5011/api/kyc/status", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
          });
          if (response.ok) {
            const kycData = await response.json();
            kyc = kycData.verificationLevel || "UNVERIFIED";
          }
        } catch (kycError) {
          console.error('KYC API failed:', kycError);
        }
        
        setProfileData(profile);
        setDashboardData(dashboard);
        setKycStatus(kyc);
      } catch (error) {
        console.error('Failed to load profile data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    const tab = searchParams.get('tab');
    if (tab === 'payments') {
      setActiveTab('payments');
    }
    
    const handleFocus = () => {
      fetchData();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading profile...</p>
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </div>
      </div>
    );
  }

  if (error && !profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
                Creator Profile
              </h1>
              <p className="text-gray-600 text-lg">Manage your account and preferences</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Account Settings</p>
                <p className="text-lg font-semibold text-gray-900">{user?.name || 'Creator'}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">{(user?.name || 'C')[0].toUpperCase()}</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 p-2"
          >
            <div className="flex space-x-2">
              {[
                { id: "profile", label: "Profile" },
                { id: "payments", label: "Payment History" }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "text-gray-600 hover:text-purple-600 hover:bg-gray-50"
                  }`}
                >
                  {tab.label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {activeTab === "profile" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-2 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/profile/edit')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
                  >
                    Edit Profile
                  </motion.button>
                </div>
                {profileData ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <HiMail className="w-4 h-4 text-blue-600" />
                        </div>
                        <h3 className="text-sm font-semibold text-blue-900">Email Address</h3>
                      </div>
                      <p className="text-gray-900 font-medium">{profileData.email}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <HiDesktopComputer className="w-4 h-4 text-green-600" />
                        </div>
                        <h3 className="text-sm font-semibold text-green-900">Channel Name</h3>
                      </div>
                      <p className="text-gray-900 font-medium">{profileData.channelName || 'Not set'}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <HiLocationMarker className="w-4 h-4 text-purple-600" />
                        </div>
                        <h3 className="text-sm font-semibold text-purple-900">Location</h3>
                      </div>
                      <p className="text-gray-900 font-medium">{profileData.location || 'Not set'}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl border border-orange-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                          <HiGlobeAlt className="w-4 h-4 text-orange-600" />
                        </div>
                        <h3 className="text-sm font-semibold text-orange-900">Website</h3>
                      </div>
                      {profileData.website ? (
                        <a 
                          href={profileData.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 font-medium underline break-all"
                        >
                          {profileData.website}
                        </a>
                      ) : (
                        <p className="text-gray-900 font-medium">Not set</p>
                      )}
                    </div>
                    
                    <div className="md:col-span-2 bg-gradient-to-br from-gray-50 to-slate-50 p-4 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <HiChatAlt className="w-4 h-4 text-gray-600" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900">Bio</h3>
                      </div>
                      <p className="text-gray-900 font-medium whitespace-pre-wrap break-words">{profileData.bio || 'Not set'}</p>
                    </div>
                    
                    <div className="md:col-span-2 bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-xl border border-indigo-100">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <HiLightningBolt className="w-4 h-4 text-indigo-600" />
                        </div>
                        <h3 className="text-sm font-semibold text-indigo-900">Skills</h3>
                      </div>
                      {profileData.skills ? (
                        <div className="flex flex-wrap gap-2">
                          {profileData.skills.split(',').map((skill, index) => (
                            <span 
                              key={index}
                              className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
                            >
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-900 font-medium">Not set</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <HiUser className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-lg font-medium mb-2">Unable to load profile data</p>
                    <p className="text-sm text-gray-400 mb-4">Email: {user?.email || 'Not available'}</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => window.location.reload()}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-all"
                    >
                      Retry
                    </motion.button>
                  </div>
                )}
              </motion.div>

              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 p-4"
                >
                  <KycStatus status={kycStatus} />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 p-4"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Account Info</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Account Status</span>
                      <span className="font-semibold text-purple-600">Creator</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Member Since</span>
                      <span className="font-semibold text-blue-600">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          {activeTab === "payments" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Payment History</h3>
              <PaymentHistory />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}