import { motion } from "framer-motion";
import {
  HiFilter,
  HiTag,
  HiCurrencyRupee,
  HiStar,
  HiCheckCircle,
} from "react-icons/hi";

export default function ServiceFilter({
  category,
  priceRange,
  rating,
  verification,
  onChange,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-200 mb-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
          <HiFilter className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Filter Services</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
              <HiTag className="w-3 h-3 text-blue-600" />
            </div>
            <label className="text-sm font-semibold text-blue-900">
              Category
            </label>
          </div>
          <select
            value={category}
            onChange={(e) => onChange("category", e.target.value)}
            className="w-full border border-blue-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white shadow-sm hover:shadow-md appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: "right 0.75rem center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "1.5em 1.5em",
            }}
          >
            <option value="ALL">All Categories</option>
            <option value="Video Editing">Video Editing</option>
            <option value="Graphic Design">Graphic Design</option>
            <option value="Content Writing">Content Writing</option>
            <option value="Animation">Animation</option>
          </select>
        </motion.div>

        {/* Price Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
              <HiCurrencyRupee className="w-3 h-3 text-green-600" />
            </div>
            <label className="text-sm font-semibold text-green-900">
              Price Range
            </label>
          </div>
          <select
            value={priceRange}
            onChange={(e) => onChange("price", e.target.value)}
            className="w-full border border-green-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white shadow-sm hover:shadow-md appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: "right 0.75rem center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "1.5em 1.5em",
            }}
          >
            <option value="ANY">Any Price</option>
            <option value="LOW">Below ₹1,000</option>
            <option value="MID">₹1,000 – ₹2,000</option>
            <option value="HIGH">Above ₹2,000</option>
          </select>
        </motion.div>

        {/* Rating Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-100"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-yellow-100 rounded-lg flex items-center justify-center">
              <HiStar className="w-3 h-3 text-yellow-600" />
            </div>
            <label className="text-sm font-semibold text-yellow-900">
              Minimum Rating
            </label>
          </div>
          <select
            value={rating}
            onChange={(e) => onChange("rating", e.target.value)}
            className="w-full border border-yellow-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all bg-white shadow-sm hover:shadow-md appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: "right 0.75rem center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "1.5em 1.5em",
            }}
          >
            <option value="ANY">All Ratings</option>
            <option value="NO_RATING">No Rating</option>
            <option value="1">1+ Stars</option>
            <option value="2">2+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="4">4+ Stars</option>
          </select>
        </motion.div>

        {/* Verification Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
              <HiCheckCircle className="w-3 h-3 text-purple-600" />
            </div>
            <label className="text-sm font-semibold text-purple-900">
              Verification
            </label>
          </div>
          <select
            value={verification}
            onChange={(e) => onChange("verification", e.target.value)}
            className="w-full border border-purple-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white shadow-sm hover:shadow-md appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: "right 0.75rem center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "1.5em 1.5em",
            }}
          >
            <option value="ALL">All Users</option>
            <option value="VERIFIED">Verified Only</option>
            <option value="EMAIL_VERIFIED">Email Verified</option>
            <option value="UNVERIFIED">Unverified Only</option>
          </select>
        </motion.div>
      </div>
    </motion.div>
  );
}
