import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import { updateService, getFreelancerServices } from "../../services/freelancerService";

export default function EditService() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const services = await getFreelancerServices();
        const serviceToEdit = services.find(s => s.id.toString() === id);
        if (serviceToEdit) {
          setService({
            title: serviceToEdit.title,
            description: serviceToEdit.description,
            price: serviceToEdit.price,
            deliveryTime: serviceToEdit.deliveryTime,
            category: serviceToEdit.category,
            active: serviceToEdit.active
          });
        } else {
          alert("Service not found");
          navigate("/profile/freelancer");
        }
      } catch (error) {
        alert("Failed to load service");
        navigate("/profile/freelancer");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchService();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateService(id, {
        title: service.title,
        description: service.description,
        price: parseFloat(service.price),
        deliveryTime: parseInt(service.deliveryTime),
        category: service.category,
        active: service.active
      });
      
      alert("Service updated successfully!");
      navigate("/profile/freelancer");
    } catch (error) {
      alert("Failed to update service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setService(prev => ({ ...prev, [field]: value }));
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl">
          <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading service...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Not Found</h2>
          <button
            onClick={() => navigate("/profile/freelancer")}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Edit Service</h1>
          <p className="text-gray-600">Update your service details and pricing</p>
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
                className="w-full px-4 py-3 border border-yellow-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white/80 backdrop-blur-sm"
                required
              />
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl">
              <label className="block text-sm font-medium text-purple-700 mb-2">
                Delivery Time (days)
              </label>
              <input
                type="number"
                value={service.deliveryTime}
                onChange={(e) => handleInputChange("deliveryTime", e.target.value)}
                className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/80 backdrop-blur-sm"
                required
              />
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
                  Saving...
                </>
              ) : (
                <>
                  ✏️ Save Changes
                </>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}