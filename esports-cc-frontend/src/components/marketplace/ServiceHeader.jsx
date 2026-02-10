import { motion } from "framer-motion";

export default function ServiceHeader({ title, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-12"
    >
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        {title}
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
        {subtitle}
      </p>
    </motion.div>
  );
}
