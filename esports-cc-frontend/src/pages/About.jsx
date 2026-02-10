import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { HiUsers, HiLightBulb, HiShieldCheck, HiTrendingUp } from "react-icons/hi";
import { FaLinkedin } from "react-icons/fa";

export default function About() {
  const features = [
    {
      icon: HiUsers,
      title: "Connect Talent",
      description: "Bridge the gap between content creators and skilled freelancers in the esports industry."
    },
    {
      icon: HiLightBulb,
      title: "Innovation First",
      description: "Cutting-edge platform designed specifically for the gaming and esports community."
    },
    {
      icon: HiShieldCheck,
      title: "Secure & Trusted",
      description: "Advanced security measures and verification systems to protect all users."
    },
    {
      icon: HiTrendingUp,
      title: "Growth Focused",
      description: "Helping creators and freelancers grow their careers in the esports ecosystem."
    }
  ];

  const team = [
    {
      name: "Chaitali Barhate",
      role: "Project Associate",
      description: "Developed S3 cloud storage integration, creator and freelancer dashboards, and comprehensive profile management systems for this project.",
      image: "/images/team/Chaitali.jpeg",
      linkedin: "https://www.linkedin.com/in/chaitali-barhate/"
    },
    {
      name: "Kaushal Patil",
      role: "Project Lead",
      description: "Implemented JWT authentication, role-based authorization systems, and handled project integration and merging for this platform.",
      image: "/images/team/Kaushal.jpeg",
      linkedin: "https://www.linkedin.com/in/kaushalpatil3391/"
    },
    {
      name: "Rachana Khadse",
      role: "Project Associate",
      description: "Built KYC verification systems, admin dashboard with user deactivation and KYC approval features for this project.",
      image: "/images/team/Rachana.jpeg",
      linkedin: "https://www.linkedin.com/in/rachana-khadse-063762201/"
    },
    {
      name: "Rahul Pawar",
      role: "Project Associate",
      description: "Developed payment processing, escrow management, and payment history pages for this platform.",
      image: "/images/team/Rahul.jpeg",
      linkedin: "https://www.linkedin.com/in/rahul-pawar-dev/"
    },
    {
      name: "Rugvedi Wankhede",
      role: "Project Associate",
      description: "Implemented WebSocket real-time chat, contact us functionality, and Gmail notification systems for this project.",
      image: "/images/team/Rugvedi.jpeg",
      linkedin: "https://www.linkedin.com/in/rugvedi-wankhede/"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>
      
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
          >
            About <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Upkraft</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Empowering the esports community by connecting content creators with talented freelancers. 
            We're building the future of gaming collaboration.
          </motion.p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="relative py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-gray-200"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-600 mb-6">
                At Upkraft, we believe that great content is born from great collaboration. Our platform 
                connects content creators with skilled freelancers who understand the gaming world, 
                creating opportunities for both to thrive in the rapidly growing esports industry.
              </p>
              <p className="text-gray-600">
                Whether you're a content creator looking for video editors, graphic designers, or social 
                media managers, or a freelancer seeking exciting projects in gaming, Upkraft is your 
                gateway to success.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Why Choose Upkraft?</h3>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Specialized in gaming & esports</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Verified freelancers & creators</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Secure payment system</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>24/7 community support</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Offer</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform is designed with the unique needs of the gaming community in mind.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="relative py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Passionate tech enthusiasts working to revolutionize the esports industry.
            </p>
          </motion.div>

          <div className="space-y-8">
            {/* First Row - 3 cards */}
            <div className="flex justify-center gap-8">
              {team.slice(0, 3).map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow flex flex-col w-80"
                >
                  <div className="w-64 h-64 mx-auto mb-4 rounded-2xl overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <span className="text-2xl font-bold text-white hidden">{member.name.charAt(0)}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <p className="text-blue-600 font-medium">{member.role}</p>
                    <a 
                      href={member.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-6 h-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
                    >
                      <FaLinkedin className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </motion.div>
              ))}
            </div>
            
            {/* Second Row - 2 cards */}
            <div className="flex justify-center gap-8">
              {team.slice(3, 5).map((member, index) => (
                <motion.div
                  key={index + 3}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow flex flex-col w-80"
                >
                  <div className="w-64 h-64 mx-auto mb-4 rounded-2xl overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <span className="text-2xl font-bold text-white hidden">{member.name.charAt(0)}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <p className="text-blue-600 font-medium">{member.role}</p>
                    <a 
                      href={member.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-6 h-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
                    >
                      <FaLinkedin className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl opacity-90 mb-6">
              Join thousands of creators and freelancers already using Upkraft to build amazing projects.
            </p>
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Join Upkraft Today
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}