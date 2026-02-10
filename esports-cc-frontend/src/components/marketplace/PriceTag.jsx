import { HiCurrencyRupee } from "react-icons/hi";

export default function PriceTag({ price, size = "md", showLabel = true }) {
  const sizes = {
    sm: {
      price: "text-lg",
      label: "text-xs",
      icon: "w-4 h-4",
    },
    md: {
      price: "text-2xl",
      label: "text-sm",
      icon: "w-5 h-5",
    },
    lg: {
      price: "text-3xl",
      label: "text-base",
      icon: "w-6 h-6",
    },
  };

  return (
    <div className="text-left">
      <div className="flex items-center space-x-1">
        <HiCurrencyRupee
          className={`${sizes[size].icon} text-primary-600 dark:text-primary-400`}
        />
        <p
          className={`${sizes[size].price} font-bold text-gray-900 dark:text-gray-100`}
        >
          {typeof price === "number" ? price.toLocaleString() : price}
        </p>
      </div>
      {showLabel && (
        <p className={`${sizes[size].label} text-gray-500 dark:text-gray-400`}>
          starting price
        </p>
      )}
    </div>
  );
}
