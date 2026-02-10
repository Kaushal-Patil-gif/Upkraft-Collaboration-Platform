import { useState } from "react";
import { motion } from "framer-motion";

const mockPortfolio = [
  { id: 1, title: "Gaming Montage - Valorant", type: "video", thumbnail: "/api/placeholder/300/200", views: 1200 },
  { id: 2, title: "Esports Team Logo", type: "image", thumbnail: "/api/placeholder/300/200", views: 850 },
  { id: 3, title: "Stream Overlay Design", type: "image", thumbnail: "/api/placeholder/300/200", views: 950 },
  { id: 4, title: "Highlight Reel - Apex", type: "video", thumbnail: "/api/placeholder/300/200", views: 2100 },
  { id: 5, title: "Thumbnail Pack", type: "image", thumbnail: "/api/placeholder/300/200", views: 1500 },
  { id: 6, title: "Intro Animation", type: "video", thumbnail: "/api/placeholder/300/200", views: 780 },
];

export default function PortfolioGallery() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [filter, setFilter] = useState("all");

  const filteredItems = mockPortfolio.filter(item => 
    filter === "all" || item.type === filter
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Portfolio</h3>
        <div className="flex gap-2">
          {[
            { id: "all", label: "All" },
            { id: "video", label: "Videos" },
            { id: "image", label: "Images" }
          ].map((filterOption) => (
            <button
              key={filterOption.id}
              onClick={() => setFilter(filterOption.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === filterOption.id
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-600"
              }`}
            >
              {filterOption.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group cursor-pointer"
            onClick={() => setSelectedItem(item)}
          >
            <div className="relative overflow-hidden rounded-xl bg-gray-200 aspect-video">
              <div className="w-full h-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                <span className="text-4xl">
                  {item.type === "video" ? "🎥" : "🎨"}
                </span>
              </div>
              
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                    <span className="text-xl">🔍</span>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-3 left-3">
                <span className={`px-2 py-1 rounded-md text-xs font-semibold text-white ${
                  item.type === "video" ? "bg-red-500" : "bg-blue-500"
                }`}>
                  {item.type === "video" ? "VIDEO" : "IMAGE"}
                </span>
              </div>
            </div>
            
            <div className="mt-3">
              <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
              <p className="text-sm text-gray-600">{item.views.toLocaleString()} views</p>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No {filter} items found</p>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all">
            Upload Your First {filter === "all" ? "Portfolio" : filter} Item
          </button>
        </div>
      )}

      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">{selectedItem.title}</h3>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="aspect-video bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mb-4">
                <span className="text-6xl">
                  {selectedItem.type === "video" ? "🎥" : "🎨"}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">{selectedItem.views.toLocaleString()} views</p>
                  <p className="text-sm text-gray-500">Type: {selectedItem.type}</p>
                </div>
                <div className="flex gap-3">
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all">
                    Edit
                  </button>
                  <button className="border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium transition-all">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
