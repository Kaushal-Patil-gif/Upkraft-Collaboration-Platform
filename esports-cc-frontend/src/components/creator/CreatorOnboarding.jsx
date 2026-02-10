import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiX, HiArrowRight, HiArrowLeft, HiCheckCircle } from "react-icons/hi";

export default function CreatorOnboarding({ isOpen, onClose, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Upkraft! 🎮",
      description: "Your platform for hiring top esports freelancers",
      content:
        "Connect with skilled video editors, thumbnail designers, and SEO experts to grow your gaming content.",
      image: "🚀",
    },
    {
      title: "Browse the Marketplace 🛒",
      description: "Find the perfect freelancer for your needs",
      content:
        "Use filters to find freelancers by category, price range, and ratings. View portfolios and reviews before hiring.",
      image: "🔍",
    },
    {
      title: "Create Projects & Milestones 📋",
      description: "Structure your work with clear milestones",
      content:
        "Set up projects with detailed requirements and break them into milestones for better tracking and payments.",
      image: "✅",
    },
    {
      title: "Secure Payments & Chat 💬",
      description: "Safe payments with built-in communication",
      content:
        "Your payments are held in escrow until work is completed. Chat with freelancers and share files securely.",
      image: "🔒",
    },
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <HiX className="w-6 h-6" />
          </button>

          <div className="text-center mb-6">
            <div className="text-6xl mb-4">{steps[currentStep].image}</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {steps[currentStep].title}
            </h2>
            <p className="text-purple-600 font-medium mb-4">
              {steps[currentStep].description}
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              {steps[currentStep].content}
            </p>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep ? "bg-purple-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <HiArrowLeft className="w-4 h-4" />
              Back
            </button>

            <span className="text-sm text-gray-500">
              {currentStep + 1} of {steps.length}
            </span>

            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  <HiCheckCircle className="w-4 h-4" />
                  Get Started
                </>
              ) : (
                <>
                  Next
                  <HiArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
