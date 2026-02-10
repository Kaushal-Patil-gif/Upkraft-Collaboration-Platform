import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  HiArrowLeft,
  HiLocationMarker,
  HiGlobeAlt,
  HiClock,
  HiCurrencyRupee,
  HiLightningBolt,
  HiStar,
} from "react-icons/hi";
import PriceTag from "../../components/marketplace/PriceTag";
import { useAuth } from "../../context/AuthContext";
import { getServiceReviews } from "../../services/reviewService";

export default function ServiceDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const service = state?.service;

  useEffect(() => {
    if (service?.id) {
      fetchReviews();
    }
  }, [service]);

  const fetchReviews = async () => {
    try {
      const data = await getServiceReviews(service.id);
      setReviews(data.reviews);
      setAverageRating(data.averageRating);
      setReviewCount(data.reviewCount);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <HiStar
        key={i}
        className={`w-4 h-4 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
      />
    ));
  };

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Service Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The service you're looking for doesn't exist.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/marketplace")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg text-white px-6 py-3 rounded-xl font-semibold transition-all"
          >
            Back to Marketplace
          </motion.button>
        </div>
      </div>
    );
  }

  const handleBuyService = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== 0 && user.role !== "CREATOR") {
      alert("Only creators can hire freelancers.");
      return;
    }

    navigate("/project/setup", { state: { service } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-6 py-8 pt-24">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/marketplace")}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors mb-8 font-medium"
        >
          <HiArrowLeft className="w-4 h-4" />
          Back to Services
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-gray-200"
        >
          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-8">
            <div className="mb-6 md:mb-0">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                {service.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                <span>Category: {service.category}</span>
                <span>•</span>
                <span>Delivery: {service.deliveryTime} days</span>
                <span>•</span>
                <span
                  className={service.active ? "text-green-600" : "text-red-600"}
                >
                  {service.active ? "Active" : "Inactive"}
                </span>
              </div>
              {!loading && (
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {renderStars(Math.round(averageRating))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {averageRating.toFixed(1)} ({reviewCount} reviews)
                  </span>
                </div>
              )}
            </div>
            <PriceTag price={service.price} />
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              About This Service
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {service.description ||
                "Professional service tailored for your needs."}
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-6 rounded-2xl mb-8 border border-gray-100">
            <div className="flex items-start gap-6 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                {(service.freelancerName || "F")[0].toUpperCase()}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {service.freelancerProfessionalName || service.freelancerName}
                </h3>
                {service.freelancerBio && (
                  <p className="text-gray-600 mb-3">{service.freelancerBio}</p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                  {service.freelancerLocation && (
                    <div className="flex items-center gap-2">
                      <HiLocationMarker className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-500">Location:</span>
                      <span className="font-medium text-gray-900">
                        {service.freelancerLocation}
                      </span>
                    </div>
                  )}
                  {service.freelancerWebsite && (
                    <div className="flex items-center gap-2">
                      <HiGlobeAlt className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-500">Website:</span>
                      <a
                        href={service.freelancerWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-purple-600 hover:text-purple-700"
                      >
                        {service.freelancerWebsite}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <HiClock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-500">Delivery:</span>
                    <span className="font-medium text-gray-900">
                      {service.deliveryTime} Days
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiCurrencyRupee className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-500">Price:</span>
                    <span className="font-medium text-gray-900">
                      ₹{service.price}
                    </span>
                  </div>
                </div>
                {service.freelancerSkills && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <HiLightningBolt className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-500 text-sm">Skills:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {service.freelancerSkills
                        .split(",")
                        .map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
                          >
                            {skill.trim()}
                          </span>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Service Photos */}
          {(service.photo1Url || service.photo2Url || service.photo3Url) && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Service Gallery
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {service.photo1Url && (
                  <div className="w-full h-48 bg-gray-100 rounded-xl overflow-hidden">
                    <img
                      src={service.photo1Url}
                      alt="Service photo 1"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                {service.photo2Url && (
                  <div className="w-full h-48 bg-gray-100 rounded-xl overflow-hidden">
                    <img
                      src={service.photo2Url}
                      alt="Service photo 2"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                {service.photo3Url && (
                  <div className="w-full h-48 bg-gray-100 rounded-xl overflow-hidden">
                    <img
                      src={service.photo3Url}
                      alt="Service photo 3"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBuyService}
            className="w-full py-4 rounded-2xl text-white text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg transition-all mb-8"
          >
            Hire Now - ₹{service.price.toLocaleString()}
          </motion.button>

          {/* Reviews Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Reviews ({reviewCount})
            </h3>
            {loading ? (
              <div className="text-center py-4">
                <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            ) : reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {review.userName}
                        </span>
                        <div className="flex">{renderStars(review.rating)}</div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No reviews yet</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
