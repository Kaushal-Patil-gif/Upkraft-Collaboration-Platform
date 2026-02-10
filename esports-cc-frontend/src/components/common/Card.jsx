import { motion } from "framer-motion";
import PriceTag from "../marketplace/PriceTag";

export default function Card({
  title,
  description,
  price,
  onAction,
  actionLabel = "View Details →",
  image,
  badge,
  className = "",
}) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`card p-6 group cursor-pointer ${className}`}
      onClick={onAction}
    >
      {image && (
        <div className="mb-4 overflow-hidden rounded-lg">
          <img 
            src={image} 
            alt={title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      {badge && (
        <div className="mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200">
            {badge}
          </span>
        </div>
      )}

      <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
        {title}
      </h3>

      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
        {description}
      </p>

      <div className="flex justify-between items-center mt-auto">
        {price && <PriceTag price={price} />}
        
        <button className="text-sm text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300 transition-colors group-hover:translate-x-1 transform duration-200">
          {actionLabel}
        </button>
      </div>
    </motion.div>
  );
}
