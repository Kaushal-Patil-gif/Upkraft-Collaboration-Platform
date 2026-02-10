import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const faqs = [
  {
    question: "What is Upkraft?",
    answer: "Upkraft is a dedicated platform where gaming content creators can hire verified freelancers such as video editors, thumbnail designers, logo designers, and YouTube SEO experts.",
  },
  {
    question: "Who can join this platform?",
    answer: "Both content creators and freelancers can join. Creators hire talent, while freelancers sell their gaming-related services.",
  },
  {
    question: "Is joining the platform free?",
    answer: "Yes, registration is completely free for both creators and freelancers.",
  },
  {
    question: "How does payment work?",
    answer: "We use a secure milestone-based payment system with escrow wallet protection. Payments are held safely in escrow and released to freelancers only when milestones are completed and approved by the creator. This ensures both parties are protected throughout the project.",
  },
  {
    question: "Can I communicate outside the platform?",
    answer: "No. All communication happens inside the platform to ensure safety, transparency, and project tracking.",
  },
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const toggleFAQ = (index) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  const handleGetStarted = () => {
    if (!user) {
      navigate("/register");
      return;
    }

    if (user.role === "FREELANCER") {
      navigate("/dashboard/freelancer");
    } else {
      navigate("/marketplace");
    }
  };

  return (
    <>
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 to-purple-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Level Up Your Content?
            </h2>
            <p className="text-xl text-purple-100 mb-8 leading-relaxed">
              Join thousands of creators and freelancers in the gaming ecosystem
            </p>
            <button
              onClick={handleGetStarted}
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Get Started Today
            </button>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked <span className="text-purple-600">Questions</span>
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about our platform
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center px-6 py-5 text-left font-semibold text-gray-900 hover:bg-gray-50 focus:outline-none transition-colors"
                >
                  <span className="text-lg">{faq.question}</span>
                  <span className="text-purple-600 text-2xl font-bold ml-4">
                    {activeIndex === index ? "−" : "+"}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {activeIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5">
                        <p className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
