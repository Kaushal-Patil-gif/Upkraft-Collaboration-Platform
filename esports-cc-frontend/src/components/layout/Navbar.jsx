import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { HiMenu, HiX, HiUser, HiSearch, HiChevronDown } from "react-icons/hi";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setIsProfileOpen(false);
    };
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-dropdown')) {
        setIsProfileOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getDashboardPath = () => {
    if (user.role === 0 || user.role === "CREATOR") return "/dashboard/creator";
    if (user.role === 1 || user.role === "FREELANCER") return "/dashboard/freelancer";
    if (user.role === 2 || user.role === "ADMIN") return "/admin";
    return "/";
  };

  const getProfilePath = () => {
    if (user.role === 1 || user.role === "FREELANCER") return "/profile/freelancer";
    if (user.role === 2 || user.role === "ADMIN") return "/profile/admin";
    return "/profile/creator";
  };

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 w-full backdrop-blur-md border-b z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 border-gray-200 shadow-lg' : 'bg-white/90 border-gray-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-lg">U</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Upkraft
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="hidden lg:flex items-center space-x-8"
          >
            <Link to="/marketplace" className="text-gray-700 hover:text-blue-600 font-medium transition-colors hover:scale-105 transform">
              Services
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors hover:scale-105 transform">
              About Us
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors hover:scale-105 transform">
              Contact Us
            </Link>
          </motion.div>

          {/* Desktop Actions */}
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="hidden md:flex items-center space-x-4"
          >
            {!user ? (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/login"
                    className="border-2 border-blue-600 text-blue-600 px-6 py-2 rounded-full font-medium hover:bg-blue-50 transition-all"
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all"
                  >
                    Sign Up
                  </Link>
                </motion.div>
              </>
            ) : (
              <>
                <Link
                  to={getDashboardPath()}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors hover:scale-105 transform"
                >
                  Dashboard
                </Link>
                
                {/* User Avatar Dropdown */}
                <div className="relative profile-dropdown">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <HiUser className="w-5 h-5 text-white" />
                    </div>
                    <HiChevronDown className="w-4 h-4 text-gray-600" />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2"
                      >
                        <Link to={getProfilePath()} onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Profile</Link>
                        <Link to={getDashboardPath()} onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Dashboard</Link>
                        <hr className="my-2" />
                        <button 
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
                        >
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-blue-600 rounded-lg"
          >
            {isMenuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-gray-200 py-4 space-y-4"
            >
              <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                <Link to="/marketplace" className="block text-gray-700 hover:text-blue-600 font-medium">Services</Link>
              </motion.div>
              <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                <Link to="/about" className="block text-gray-700 hover:text-blue-600 font-medium">About Us</Link>
              </motion.div>
              <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                <Link to="/contact" className="block text-gray-700 hover:text-blue-600 font-medium">Contact Us</Link>
              </motion.div>
              
              {!user ? (
                <>
                  <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                    <Link to="/login" className="block w-full text-center py-2 border-2 border-blue-600 text-blue-600 rounded-full font-medium hover:bg-blue-50 transition-all">Login</Link>
                  </motion.div>
                  <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
                    <Link to="/register" className="block w-full text-center py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium">Sign Up</Link>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                    <Link to={getDashboardPath()} onClick={() => setIsMenuOpen(false)} className="block text-gray-700 hover:text-blue-600 font-medium">Dashboard</Link>
                  </motion.div>
                  <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
                    <Link to={getProfilePath()} onClick={() => setIsMenuOpen(false)} className="block text-gray-700 hover:text-blue-600 font-medium">Profile</Link>
                  </motion.div>
                  <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.7 }}>
                    <button onClick={handleLogout} className="block w-full text-left text-gray-700 hover:text-blue-600 font-medium">Logout</button>
                  </motion.div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}

export default Navbar;
