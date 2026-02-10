import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const communityCards = [
  {
    role: "FREELANCER",
    title: "Video Editor",
    image: "/assets/community/editor.jpg",
    description: "Edit gameplay videos, highlights, montages, and gaming content professionally.",
  },
  {
    role: "FREELANCER",
    title: "Graphic Designer",
    image: "/assets/community/designer.jpg",
    description: "Design high-CTR thumbnails and graphics that help gaming videos stand out.",
  },
  {
    role: "FREELANCER",
    title: "Content Writer",
    image: "/assets/community/consultant.jpg",
    description: "Create engaging content and copy for gaming channels and websites.",
  },
  {
    role: "FREELANCER",
    title: "Animator",
    image: "/assets/community/marketer.jpg",
    description: "Create stunning animations and motion graphics for gaming content.",
  },
  {
    role: "CREATOR",
    title: "Content Creator",
    image: "/assets/community/developer.jpg",
    description: "Hire verified freelancers and grow your gaming content professionally.",
  },
];

export default function Community() {
  const [selectedCard, setSelectedCard] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleAction = () => {
    if (!selectedCard) return;

    if (!user) {
      navigate("/register");
      setSelectedCard(null);
      return;
    }

    if (user.role === "FREELANCER" || user.role === 1) {
      navigate("/dashboard/freelancer");
    } else if (user.role === "CREATOR" || user.role === 0) {
      navigate("/marketplace");
    }

    setSelectedCard(null);
  };

  return (
    <>
      {/* Community Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Join the <span className="text-purple-600">Community</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Whether you're a creator or freelancer, find your place in our thriving ecosystem
            </p>
          </motion.div>

          {/* Community Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
          >
            {communityCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                onClick={() => setSelectedCard(card)}
                className="relative group h-48 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-all"
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-semibold text-sm mb-1">{card.title}</h3>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How it <span className="text-purple-600">Works</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Choose a Service",
                description: "Select from verified gaming freelancers offering specialized services in your category."
              },
              {
                step: "02",
                title: "Collaborate Securely",
                description: "Chat, share files, and track progress inside a project workspace."
              },
              {
                step: "03",
                title: "Milestone-Based Payment",
                description: "Pay securely through milestone-based payments with escrow wallet protection. Funds are released as work is completed and approved."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCard(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl"
            >
              <h3 className="text-2xl font-bold mb-4 text-gray-900">
                {selectedCard.title}
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {selectedCard.description}
              </p>
              <button
                onClick={handleAction}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                {selectedCard.role === "FREELANCER" ? "Start Selling" : "Hire Freelancers"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
