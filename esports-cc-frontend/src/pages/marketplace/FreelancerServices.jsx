import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ServiceCard from "../../components/marketplace/ServiceCard";
import { useAuth } from "../../context/AuthContext";

const freelancerServices = [
  {
    id: 1,
    title: "Gaming Montage Editing",
    freelancer: "AceEditor",
    rating: 4.9,
    price: 1800,
    boosted: true,
  },
  {
    id: 2,
    title: "YouTube Shorts Editing",
    freelancer: "AceEditor",
    rating: 4.7,
    price: 1000,
  },
];

export default function FreelancerServices() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleHire = (service) => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "CREATOR") {
      alert("Only content creators can hire services.");
      return;
    }

    const projectId = Date.now();

    navigate(`/project/${projectId}`, {
      state: {
        service,
        freelancer: service.freelancer,
      },
    });
  };

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
            AceEditor's Services
          </h1>
          <p className="text-gray-600 text-lg">
            Professional esports editing services
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {freelancerServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <ServiceCard
                service={service}
                onView={() => handleHire(service)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
