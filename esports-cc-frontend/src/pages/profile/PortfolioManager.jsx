import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


const mockPortfolioItems = [
  { id: 1, title: "Gaming Montage - Valorant", type: "video", status: "published", views: 1200, likes: 89 },
  { id: 2, title: "Esports Team Logo", type: "image", status: "published", views: 850, likes: 67 },
  { id: 3, title: "Stream Overlay Design", type: "image", status: "draft", views: 0, likes: 0 },
];

export default function PortfolioManager() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [portfolioItems, setPortfolioItems] = useState(mockPortfolioItems);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: "",
    description: "",
    type: "image",
    tags: ""
  });

  if (!user || user.role !== "FREELANCER") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">Portfolio management is only available to freelancers.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const handleUpload = () => {
    const newItem = {
      id: Date.now(),
      ...uploadData,
      status: "published",
      views: 0,
      likes: 0
    };
    setPortfolioItems(prev => [newItem, ...prev]);
    setUploadData({ title: "", description: "", type: "image", tags: "" });
    setShowUploadModal(false);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this portfolio item?")) {
      setPortfolioItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "published": return "bg-green-100 text-green-800";
      case "draft": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate("/profile/freelancer")}
              className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors font-medium group"
            >
              ←
              Back to Profile
            </button>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Portfolio Manager</h1>
              <p className="text-gray-600">Showcase your best work and attract more clients</p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="mt-4 md:mt-0 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              ➕ Upload New Item
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">{portfolioItems.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                📷
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{portfolioItems.reduce((sum, item) => sum + item.views, 0).toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                👁️
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Likes</p>
                <p className="text-2xl font-bold text-gray-900">{portfolioItems.reduce((sum, item) => sum + item.likes, 0)}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-red-100 to-red-200 rounded-xl flex items-center justify-center">
                ❤️
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-bold text-gray-900">{portfolioItems.filter(item => item.status === "published").length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                ✅
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 p-8"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Your Portfolio Items</h3>
          
          {portfolioItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                📷
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">No portfolio items yet</h4>
              <p className="text-gray-600 mb-6">Upload your first portfolio item to showcase your work</p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Upload Your First Item
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {portfolioItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center justify-between p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-all bg-gradient-to-r from-white to-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                      {item.type === "video" ? (
                        <span className="text-2xl">🎥</span>
                      ) : (
                        <span className="text-2xl">📷</span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          👁️
                          {item.views.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          ❤️
                          {item.likes}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-1">
                      ✏️ Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-1"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/90 backdrop-blur-md rounded-2xl max-w-2xl w-full p-8 shadow-2xl border border-gray-200"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Upload Portfolio Item</h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                >
                ✖
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl">
                  <label className="block text-sm font-medium text-blue-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={uploadData.title}
                    onChange={(e) => setUploadData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 backdrop-blur-sm"
                    placeholder="Enter a descriptive title"
                  />
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl">
                  <label className="block text-sm font-medium text-green-700 mb-2">Type</label>
                  <select
                    value={uploadData.type}
                    onChange={(e) => setUploadData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-4 py-3 border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white/80 backdrop-blur-sm"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl">
                  <label className="block text-sm font-medium text-purple-700 mb-2">Description</label>
                  <textarea
                    value={uploadData.description}
                    onChange={(e) => setUploadData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/80 backdrop-blur-sm"
                    placeholder="Describe your work..."
                  />
                </div>
                
                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-xl">
                  <label className="block text-sm font-medium text-yellow-700 mb-2">Tags</label>
                  <input
                    type="text"
                    value={uploadData.tags}
                    onChange={(e) => setUploadData(prev => ({ ...prev, tags: e.target.value }))}
                    className="w-full px-4 py-3 border border-yellow-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white/80 backdrop-blur-sm"
                    placeholder="gaming, montage, editing (comma separated)"
                  />
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gradient-to-r from-gray-50 to-gray-100">
                  📷
                  <p className="text-gray-600 mb-2">Drag and drop your file here</p>
                  <p className="text-sm text-gray-500">or click to browse</p>
                  <button className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
                    Choose File
                  </button>
                </div>
              </div>
              
              <div className="flex gap-4 mt-8">
                <button
                  onClick={handleUpload}
                  disabled={!uploadData.title}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:shadow-none"
                >
                  Upload Item
                </button>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}