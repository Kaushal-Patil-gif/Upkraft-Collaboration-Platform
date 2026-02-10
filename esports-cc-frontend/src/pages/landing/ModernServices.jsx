import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiCode, HiPencilAlt, HiSpeakerphone, HiPhotograph, HiVideoCamera, HiTranslate, HiMusicNote, HiChartBar } from 'react-icons/hi';

export default function ModernServices() {
  const categories = [
    { icon: HiVideoCamera, name: 'Video Editing', color: 'from-indigo-500 to-purple-500', filter: 'Video Editing' },
    { icon: HiPencilAlt, name: 'Graphic Design', color: 'from-purple-500 to-pink-500', filter: 'Graphic Design' },
    { icon: HiCode, name: 'Content Writing', color: 'from-blue-500 to-cyan-500', filter: 'Content Writing' },
    { icon: HiPhotograph, name: 'Animation', color: 'from-orange-500 to-red-500', filter: 'Animation' }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Browse by <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Category</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover talented freelancers across all industries and skill sets
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {categories.map((category, index) => (
            <Link key={category.name} to={`/marketplace?category=${category.filter}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border border-gray-100"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center mb-4 mx-auto`}>
                  <category.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 text-center">{category.name}</h3>
              </motion.div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link to="/marketplace">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all transform"
            >
              Explore All Categories
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
}