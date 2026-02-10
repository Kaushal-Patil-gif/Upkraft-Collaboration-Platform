import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { HiMail, HiDesktopComputer, HiLocationMarker, HiGlobeAlt, HiChatAlt, HiLightningBolt, HiUser, HiArrowLeft } from "react-icons/hi";
import { getUserProfile, updateUserProfile } from "../../services/userService";

export default function EditProfile() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    professionalName: "",
    channelName: "",
    bio: "",
    location: "",
    website: "",
    skills: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getUserProfile();
        
        setProfile({
          name: profileData.name || "",
          email: profileData.email || "",
          professionalName: profileData.professionalName || "",
          channelName: profileData.channelName || "",
          bio: profileData.bio || "",
          location: profileData.location || "",
          website: profileData.website || "",
          skills: profileData.skills || ""
        });
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    
    console.log('Submitting profile:', profile);
    console.log('User role:', user?.role);
    
    try {
      const result = await updateUserProfile(profile);
      
      updateUser({
        name: result.name,
        email: result.email
      });
      
      const profilePath = (user?.role === 1 || user?.role === "FREELANCER") ? "/profile/freelancer" : 
                          (user?.role === 2 || user?.role === "ADMIN") ? "/profile/admin" : "/profile/creator";
      navigate(profilePath);
    } catch (error) {
      console.error('Failed to update profile:', error);
      
      if (error.message.includes('400')) {
        try {
          const errorText = error.message.split(' - ')[1];
          const decodedText = errorText.replace(/&quot;/g, '"');
          const errorData = JSON.parse(decodedText);
          const validationErrors = errorData.data;
          
          const fieldErrors = {};
          if (validationErrors.name) fieldErrors.name = validationErrors.name;
          if (validationErrors.bio) fieldErrors.bio = validationErrors.bio;
          if (validationErrors.website) fieldErrors.website = validationErrors.website;
          
          setErrors(fieldErrors);
        } catch {
          setErrors({ general: 'Please check your input and try again.' });
        }
      } else {
        setErrors({ general: 'Failed to update profile. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading profile...</p>
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

      <div className="relative max-w-4xl mx-auto px-6 py-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              const profilePath = (user?.role === 1 || user?.role === "FREELANCER") ? "/profile/freelancer" : 
                                 (user?.role === 2 || user?.role === "ADMIN") ? "/profile/admin" : "/profile/creator";
              navigate(profilePath);
            }}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-4 transition-colors"
          >
            <HiArrowLeft className="w-4 h-4" />
            Back to Profile
          </motion.button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Edit Profile
          </h1>
          <p className="text-gray-600 text-lg">Update your profile information</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-100"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <HiUser className="w-4 h-4 text-blue-600" />
                </div>
                <label className="text-sm font-semibold text-blue-900">
                  Full Name *
                </label>
              </div>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white ${
                  errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
                placeholder="Your full name"
              />
              {errors.name && (
                <p className="text-xs text-red-600 mt-1">{errors.name}</p>
              )}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <HiMail className="w-4 h-4 text-green-600" />
                </div>
                <label className="text-sm font-semibold text-green-900">
                  Email Address *
                </label>
              </div>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={user?.role !== 2 && user?.role !== "ADMIN"}
                className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  user?.role !== 2 && user?.role !== "ADMIN" ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                }`}
              />
            </motion.div>
            
            {(user?.role === 0 || user?.role === "CREATOR") && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <HiDesktopComputer className="w-4 h-4 text-purple-600" />
                  </div>
                  <label className="text-sm font-semibold text-purple-900">
                    Channel Name
                  </label>
                </div>
                <input
                  type="text"
                  value={profile.channelName}
                  onChange={(e) => handleInputChange("channelName", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  placeholder="Your channel name (optional)"
                />
              </motion.div>
            )}
            
            {(user?.role === 1 || user?.role === "FREELANCER") && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <HiDesktopComputer className="w-4 h-4 text-purple-600" />
                  </div>
                  <label className="text-sm font-semibold text-purple-900">
                    Professional Name
                  </label>
                </div>
                <input
                  type="text"
                  value={profile.professionalName}
                  onChange={(e) => handleInputChange("professionalName", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  placeholder="Your professional/business name (optional)"
                />
              </motion.div>
            )}
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl border border-orange-100"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <HiLocationMarker className="w-4 h-4 text-orange-600" />
                </div>
                <label className="text-sm font-semibold text-orange-900">
                  Location
                </label>
              </div>
              <input
                type="text"
                value={profile.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                placeholder="City, Country"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-teal-50 to-cyan-50 p-4 rounded-xl border border-teal-100"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                  <HiGlobeAlt className="w-4 h-4 text-teal-600" />
                </div>
                <label className="text-sm font-semibold text-teal-900">
                  Website/Portfolio
                </label>
              </div>
              <input
                type="text"
                value={profile.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white ${
                  errors.website ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
                placeholder="https://your-portfolio.com"
              />
              {errors.website && (
                <p className="text-xs text-red-600 mt-1">{errors.website}</p>
              )}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="md:col-span-2 bg-gradient-to-br from-gray-50 to-slate-50 p-4 rounded-xl border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <HiChatAlt className="w-4 h-4 text-gray-600" />
                </div>
                <label className="text-sm font-semibold text-gray-900">
                  Bio
                </label>
              </div>
              <textarea
                value={profile.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                rows={4}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white resize-none ${
                  errors.bio ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
                placeholder="Tell us about yourself...&#10;You can use multiple lines here."
                style={{ whiteSpace: 'pre-wrap' }}
              />
              {errors.bio && (
                <p className="text-xs text-red-600 mt-1">{errors.bio}</p>
              )}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="md:col-span-2 bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-xl border border-indigo-100"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <HiLightningBolt className="w-4 h-4 text-indigo-600" />
                </div>
                <label className="text-sm font-semibold text-indigo-900">
                  Skills (comma separated)
                </label>
              </div>
              <input
                type="text"
                value={profile.skills}
                onChange={(e) => handleInputChange("skills", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                placeholder="Video Editing, Graphic Design, Animation"
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex justify-end gap-4 mt-8"
          >
            {errors.general && (
              <div className="flex-1">
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                  {errors.general}
                </p>
              </div>
            )}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                const profilePath = (user?.role === 1 || user?.role === "FREELANCER") ? "/profile/freelancer" : 
                                   (user?.role === 2 || user?.role === "ADMIN") ? "/profile/admin" : "/profile/creator";
                navigate(profilePath);
              }}
              className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg text-white rounded-xl font-medium transition-all disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </motion.button>
          </motion.div>
        </motion.form>
      </div>
    </div>
  );
}