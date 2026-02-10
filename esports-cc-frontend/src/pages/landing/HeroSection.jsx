import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const images = [
  "/assets/landing/hero1.jpg",
  "/assets/landing/hero2.jpg",
  "/assets/landing/hero3.jpg"
];

function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="px-6 md:px-12 lg:px-20 pt-32 pb-20">
      <div className="relative h-[80vh] rounded-3xl overflow-hidden shadow-2xl">
        {/* Background Images */}
        <div className="absolute inset-0">
          <AnimatePresence>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${images[currentIndex]})` }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/70 via-black/50 to-purple-800/60" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center h-full max-w-4xl mx-auto text-center text-white px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="inline-block bg-purple-600/20 backdrop-blur-sm border border-purple-400/30 rounded-full px-6 py-2 text-sm font-medium text-purple-200 mb-8">
              🎮 The Future of Esports Collaboration
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          >
            Hire Elite Esports
            <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Freelancers
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Connect with verified professionals for video editing, thumbnail design, 
            YouTube SEO, and more. Grow your gaming content with expert talent.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center gap-4 mb-12"
          >
            <Link
              to="/marketplace"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
            >
              Explore Services
            </Link>
            <Link
              to="/register"
              className="border-2 border-white/30 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105"
            >
              Join Community
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="grid grid-cols-3 gap-8 pt-8 border-t border-white/20"
          >
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold mb-1">500+</div>
              <div className="text-purple-200 text-sm">Freelancers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold mb-1">1K+</div>
              <div className="text-purple-200 text-sm">Projects Done</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold mb-1">24/7</div>
              <div className="text-purple-200 text-sm">Support</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
