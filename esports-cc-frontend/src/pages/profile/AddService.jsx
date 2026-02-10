import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { createService } from "../../services/freelancerService";

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

export default function AddService() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [modal, setModal] = useState({ isOpen: false, title: "", message: "", type: "success" });
  const [service, setService] = useState({
    title: "",
    description: "",
    price: "",
    deliveryTime: "",
    category: "Video Editing",
    active: true,
    photo1: null,
    photo2: null,
    photo3: null
  });

  const showModal = (title, message, type = "success") => {
    setModal({ isOpen: true, title, message, type });
  };

  const closeModal = () => {
    setModal({ isOpen: false, title: "", message: "", type: "success" });
    if (modal.type === "success") {
      navigate("/profile/freelancer");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('title', service.title);
      formData.append('description', service.description);
      formData.append('price', parseFloat(service.price));
      formData.append('deliveryTime', parseInt(service.deliveryTime));
      formData.append('category', service.category);
      formData.append('active', service.active);
      
      if (service.photo1) formData.append('photo1', service.photo1);
      if (service.photo2) formData.append('photo2', service.photo2);
      if (service.photo3) formData.append('photo3', service.photo3);
      
      await createService(formData);
      
      showModal("Success!", "Service created successfully!", "success");
    } catch (error) {
      showModal("Error", "Failed to create service. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    if (field === 'price' && parseFloat(value) < 0) {
      setErrors(prev => ({ ...prev, price: 'Price cannot be negative' }));
      return;
    }
    if (field === 'deliveryTime' && parseInt(value) < 0) {
      setErrors(prev => ({ ...prev, deliveryTime: 'Delivery time cannot be negative' }));
      return;
    }
    
    setService(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 pt-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate("/profile/freelancer")}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-6 group"
          >
            ←
            Back to Profile
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Add New Service</h1>
          <p className="text-gray-600">Create a new service offering</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-gray-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl">
              <label className="block text-sm font-medium text-blue-700 mb-2">
                Service Title
              </label>
              <input
                type="text"
                value={service.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 backdrop-blur-sm"
                placeholder="e.g. Gaming Video Editing"
                required
              />
            </div>

            <div className="md:col-span-2 bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl">
              <label className="block text-sm font-medium text-green-700 mb-2">
                Description
              </label>
              <textarea
                value={service.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white/80 backdrop-blur-sm resize-none"
                placeholder="Describe your service in detail...&#10;You can use multiple lines here."
                style={{ whiteSpace: 'pre-wrap' }}
                required
              />
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-xl">
              <label className="block text-sm font-medium text-yellow-700 mb-2">
                Price (₹)
              </label>
              <input
                type="number"
                value={service.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                min="1"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white/80 backdrop-blur-sm ${
                  errors.price ? 'border-red-300' : 'border-yellow-200'
                }`}
                placeholder="1500"
                required
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price}</p>
              )}
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl">
              <label className="block text-sm font-medium text-purple-700 mb-2">
                Delivery Time (days)
              </label>
              <input
                type="number"
                value={service.deliveryTime}
                onChange={(e) => handleInputChange("deliveryTime", e.target.value)}
                min="1"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/80 backdrop-blur-sm ${
                  errors.deliveryTime ? 'border-red-300' : 'border-purple-200'
                }`}
                placeholder="3"
                required
              />
              {errors.deliveryTime && (
                <p className="mt-1 text-sm text-red-600">{errors.deliveryTime}</p>
              )}
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-6 rounded-xl">
              <label className="block text-sm font-medium text-indigo-700 mb-2">
                Category
              </label>
              <select
                value={service.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="w-full px-4 py-3 border border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/80 backdrop-blur-sm"
              >
                <option value="Video Editing">Video Editing</option>
                <option value="Graphic Design">Graphic Design</option>
                <option value="Animation">Animation</option>
                <option value="Content Writing">Content Writing</option>
              </select>
            </div>

            <div className="bg-gradient-to-r from-pink-50 to-pink-100 p-6 rounded-xl">
              <label className="block text-sm font-medium text-pink-700 mb-2">
                Status
              </label>
              <select
                value={service.active ? "active" : "inactive"}
                onChange={(e) => handleInputChange("active", e.target.value === "active")}
                className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white/80 backdrop-blur-sm"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              📷
              Service Photos (Max 5MB each)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((num) => (
                <div key={num} className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file && file.size > 5 * 1024 * 1024) {
                        showModal("File Too Large", "File size must be less than 5MB", "error");
                        e.target.value = '';
                        return;
                      }
                      handleInputChange(`photo${num}`, file);
                    }}
                    className="hidden"
                    id={`photo${num}`}
                  />
                  <label htmlFor={`photo${num}`} className="cursor-pointer">
                    {service[`photo${num}`] ? (
                      <div>
                        <img
                          src={URL.createObjectURL(service[`photo${num}`])}
                          alt={`Preview ${num}`}
                          className="w-full h-32 object-cover rounded-lg mb-2"
                        />
                        <p className="text-sm text-gray-600">{service[`photo${num}`].name}</p>
                      </div>
                    ) : (
                      <div>
                        <div className="text-4xl text-gray-400 mb-2">📷</div>
                        <p className="text-sm text-gray-600">Click to upload photo {num}</p>
                        <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP (Max 5MB)</p>
                      </div>
                    )}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={() => navigate("/profile/freelancer")}
              className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all backdrop-blur-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-medium transition-all disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
            >
              {loading ? (
                <>
                  Creating...
                </>
              ) : (
                <>
                  + Create Service
                </>
              )}
            </button>
          </div>
        </motion.form>
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