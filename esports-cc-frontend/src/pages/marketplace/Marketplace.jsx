import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import ServiceCard from "../../components/marketplace/ServiceCard";
import ServiceFilter from "../../components/marketplace/ServiceFilter";
import ServiceHeader from "../../components/marketplace/ServiceHeader";
import { useAuth } from "../../context/AuthContext";
import { getServices } from "../../services/marketplaceService";
import { HiSearch } from "react-icons/hi";

export default function Marketplace() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "ALL",
    price: "ANY",
    rating: "ANY",
    verification: "ALL",
  });

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setFilters((prev) => ({ ...prev, category: categoryParam }));
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        console.log("Services data:", data);
        console.log("First service active status:", data[0]?.active);
        setServices(data);
      } catch (error) {
        console.error("Failed to load services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleViewService = (service) => {
    navigate("/service", { state: { service } });
  };

  // Apply filters and search
  const filteredServices = services.filter((s) => {
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        s.title.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        s.category.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Category filter
    if (filters.category !== "ALL" && s.category !== filters.category)
      return false;

    // Rating filter
    if (filters.rating === "NO_RATING") {
      if (s.averageRating && s.averageRating > 0) return false;
    } else if (filters.rating !== "ANY") {
      if (!s.averageRating || s.averageRating < Number(filters.rating))
        return false;
    }

    // Verification filter
    if (filters.verification === "VERIFIED") {
      if (s.verificationLevel !== "LEVEL_2_DOCUMENT") return false;
    } else if (filters.verification === "EMAIL_VERIFIED") {
      if (s.verificationLevel !== "LEVEL_1_EMAIL") return false;
    } else if (filters.verification === "UNVERIFIED") {
      if (s.verificationLevel !== "UNVERIFIED") return false;
    }

    // Price filter
    if (filters.price === "LOW" && s.price >= 1000) return false;
    if (filters.price === "MID" && (s.price < 1000 || s.price > 2000))
      return false;
    if (filters.price === "HIGH" && s.price <= 2000) return false;

    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-8 pt-24">
          <ServiceHeader
            title="Explore Esports Services"
            subtitle="Hire verified editors, designers & SEO experts for your gaming content"
          />
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading services...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Explore Services
          </h1>
          <p className="text-gray-600 text-lg">
            Hire verified editors, designers & SEO experts for your gaming
            content
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 p-6 mb-6"
        >
          <div className="relative max-w-md mx-auto">
            <HiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search services by title, description, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 p-6 mb-8"
        >
          <ServiceFilter
            category={filters.category}
            priceRange={filters.price}
            rating={filters.rating}
            verification={filters.verification}
            onChange={handleFilterChange}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid gap-6 mt-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filteredServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <ServiceCard
                service={service}
                onView={() => handleViewService(service)}
              />
            </motion.div>
          ))}
        </motion.div>

        {filteredServices.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200"
          >
            <p className="text-gray-500 text-lg mb-4">
              {searchQuery.trim()
                ? `No services found for "${searchQuery}"`
                : "No services match your filters."}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setFilters({
                  category: "ALL",
                  price: "ANY",
                  rating: "ANY",
                  verification: "ALL",
                });
                setSearchQuery("");
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
            >
              Clear All Filters
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
