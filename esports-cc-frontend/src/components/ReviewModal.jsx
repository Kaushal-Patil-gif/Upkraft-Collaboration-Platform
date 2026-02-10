import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function ReviewModal({
  isOpen,
  onClose,
  onSubmit,
  serviceName,
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setRating(0);
      setComment("");
      setWordCount(0);
    }
  }, [isOpen]);

  const handleCommentChange = (e) => {
    const text = e.target.value;
    const words = text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);

    if (words.length <= 300) {
      setComment(text);
      setWordCount(words.length);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a rating before submitting.");
      return;
    }
    onSubmit({ rating, comment });
    setRating(0);
    setComment("");
    setWordCount(0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-6 w-full max-w-md mx-4"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Review Freelancer: {serviceName}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl transition-colors ${
                    star <= rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comment (Max 300 words)
            </label>
            <textarea
              value={comment}
              onChange={handleCommentChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows="4"
              placeholder="Share your experience working with this freelancer..."
              required
            />
            <div className="flex justify-between items-center mt-1">
              <span
                className={`text-xs ${
                  wordCount > 280 ? "text-red-500" : "text-gray-500"
                }`}
              >
                {wordCount}/300 words
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-xl font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl font-medium"
            >
              Submit Review
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
