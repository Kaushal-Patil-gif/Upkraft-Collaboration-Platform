import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { HiMenu, HiX } from "react-icons/hi";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../common/Button";
import ThemeToggle from "../common/ThemeToggle";

export default function LandingNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getDashboardPath = () => {
    if (user?.role === 0 || user?.role === "CREATOR") return "/dashboard/creator";
    if (user?.role === 1 || user?.role === "FREELANCER") return "/dashboard/freelancer";
    if (user?.role === 2 || user?.role === "ADMIN") return "/admin";
    return "/";
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-[9999] bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Branding */}
          <Link
            to="/"
            className="flex items-center space-x-2 group"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-sm">EC</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              EsportsConnect
            </span>
          </Link>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/marketplace"
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
            >
              Explore
            </Link>

            {!user && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate("/login")}
              >
                Sign In
              </Button>
            )}

            {user && (
              <>
                <Link
                  to={getDashboardPath()}
                  className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
                >
                  Dashboard
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            )}
            
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isMenuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4 space-y-4"
            >
              <Link
                to="/marketplace"
                className="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Explore
              </Link>

              {!user && (
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    navigate("/login");
                    setIsMenuOpen(false);
                  }}
                >
                  Sign In
                </Button>
              )}

              {user && (
                <>
                  <Link
                    to={getDashboardPath()}
                    className="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                  >
                    Logout
                  </Button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
