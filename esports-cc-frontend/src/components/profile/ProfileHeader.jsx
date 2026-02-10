import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProfileHeader({ name, role, isOwner = false }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-md p-8 mb-8"
    >
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
          {name.charAt(0).toUpperCase()}
        </div>
        
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{name}</h1>
          <div className="flex items-center gap-4 text-gray-600">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              {role}
            </span>
            <span>Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently joined'}</span>
          </div>
        </div>
        
        {isOwner && (
          <button
            onClick={() => navigate("/profile/edit")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
          >
            Edit Profile
          </button>
        )}
      </div>
    </motion.div>
  );
}
