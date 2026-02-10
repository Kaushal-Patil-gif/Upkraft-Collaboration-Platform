import { motion } from "framer-motion";
import {
  HiClock,
  HiStar,
  HiUser,
  HiEye,
  HiCheckCircle,
  HiExclamationCircle,
} from "react-icons/hi";

export default function ServiceCard({ service, onView }) {
  console.log(
    "ServiceCard - service.active:",
    service.active,
    typeof service.active,
  );

  const getServiceImage = () => {
    if (service.photo1Url) return service.photo1Url;
    if (service.photo2Url) return service.photo2Url;
    if (service.photo3Url) return service.photo3Url;
    return null;
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <HiStar
        key={i}
        className={`w-3 h-3 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
      />
    ));
  };

  const getVerificationBadge = () => {
    const level = service.verificationLevel;
    console.log("Verification level:", level); // Debug log
    if (level === "LEVEL_2_DOCUMENT") {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
          <HiCheckCircle className="w-3 h-3 mr-1" />
          Verified
        </span>
      );
    } else if (level === "LEVEL_1_EMAIL") {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
          <HiExclamationCircle className="w-3 h-3 mr-1" />
          Email Verified
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
        <HiExclamationCircle className="w-3 h-3 mr-1" />
        Unverified
      </span>
    );
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300"
      onClick={onView}
    >
      {/* Service Image */}
      {getServiceImage() ? (
        <div className="h-48 bg-gray-100 overflow-hidden relative">
          <img
            src={getServiceImage()}
            alt={service.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
          <div className="text-6xl font-bold text-gray-300 relative z-10">
            {service.title?.charAt(0) || "S"}
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Category and Status */}
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200">
            {service.category}
          </span>

          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
              service.active
                ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200"
                : "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-600 border-gray-200"
            }`}
          >
            {service.active ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-lg font-bold text-gray-900 mb-3 leading-tight group-hover:text-purple-600 transition-colors line-clamp-2">
          {service.title}
        </h2>

        {/* Freelancer Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <HiUser className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">
              {service.freelancerName || "Unknown"}
            </span>
          </div>
          {getVerificationBadge()}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          {service.averageRating && service.averageRating > 0 ? (
            <>
              <div className="flex">
                {renderStars(Math.round(service.averageRating))}
              </div>
              <span className="text-sm text-gray-600 font-medium">
                {service.averageRating.toFixed(1)}
              </span>
            </>
          ) : (
            <span className="text-sm text-gray-500 font-medium">No Rating</span>
          )}
        </div>

        {/* Price and Delivery */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ₹{service.price.toLocaleString()}
            </p>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <HiClock className="w-3 h-3 mr-1" />
              <span>{service.deliveryTime} days delivery</span>
            </div>
          </div>
        </div>

        {/* View Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold transition-all hover:shadow-lg flex items-center justify-center gap-2"
          onClick={(e) => {
            e.stopPropagation();
            onView();
          }}
        >
          <HiEye className="w-4 h-4" />
          View Details
        </motion.button>
      </div>
    </motion.div>
  );
}
