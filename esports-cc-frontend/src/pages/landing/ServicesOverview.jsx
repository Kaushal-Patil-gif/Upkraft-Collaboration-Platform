import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Card from "../../components/common/Card";
import { useAuth } from "../../context/AuthContext";

const services = [
  {
    id: 1,
    title: "YouTube SEO (Gaming)",
    description: "Optimize gaming videos for better reach, discoverability, and channel growth.",
    price: "1,000",
  },
  {
    id: 2,
    title: "Thumbnail Design",
    description: "High-CTR thumbnails designed specifically for esports and gaming content.",
    price: "500",
  },
  {
    id: 3,
    title: "Video Editing",
    description: "Professional editing for gameplay, highlights, montages, and streams.",
    price: "2,000",
  },
  {
    id: 4,
    title: "Logo Creation",
    description: "Custom logos for gaming channels, esports teams, and creators.",
    price: "1,500",
  },
];

export default function ServicesOverview() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleViewDetails = (service) => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "CREATOR") {
      navigate("/marketplace");
      return;
    }

    navigate(`/marketplace?service=${service.id}`);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Popular Services for 
            <span className="text-purple-600"> Esports Creators</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover top-rated freelancers ready to elevate your gaming content
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-2"
        >
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card
                title={service.title}
                description={service.description}
                price={service.price}
                onAction={() => handleViewDetails(service)}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <button
            onClick={() => navigate("/marketplace")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
          >
            View All Services
          </button>
        </motion.div>
      </div>
    </section>
  );
}
