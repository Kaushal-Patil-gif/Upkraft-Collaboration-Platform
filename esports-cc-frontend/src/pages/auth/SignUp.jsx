import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { HiUser, HiMail, HiLockClosed, HiArrowLeft, HiUserGroup } from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";
import { registerUser, googleAuth, updateUserRole } from "../../services/authService";
import RoleSelectionModal from "../../components/auth/RoleSelectionModal";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [pendingGoogleUser, setPendingGoogleUser] = useState(null);

  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Set role 
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'creator') {
      setRole('CREATOR');
    } else if (roleParam === 'freelancer') {
      setRole('FREELANCER');
    }
  }, [searchParams]);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === "ADMIN" || user.role === 2) {
        navigate("/admin");
      } else if (user.role === "FREELANCER" || user.role === 1) {
        navigate("/dashboard/freelancer");
      } else {
        navigate("/dashboard/creator");
      }
    }
  }, [user, navigate]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: '414801256140-17mqrohp5c2h998drj104ial7qs30eju.apps.googleusercontent.com',
        callback: handleGoogleCallback
      });
      window.google.accounts.id.renderButton(
        document.getElementById('google-signup-btn'),
        { theme: 'outline', size: 'large', width: '100%', text: 'signup_with' }
      );
    };
    document.head.appendChild(script);
  }, []);

  const handleSignUp = async () => {
    try {
      setErrors({});
      setIsLoading(true);

      const user = await registerUser({
        name,
        email,
        password,
        confirmPassword,
        role,
      });

      login(user);

      if (user.role === "ADMIN" || user.role === 2) {
        navigate("/admin");
      } else if (user.role === "FREELANCER" || user.role === 1) {
        navigate("/dashboard/freelancer");
      } else {
        navigate("/dashboard/creator");
      }
    } catch (err) {
      console.log('Registration error details:', err.response?.data);
      if (err.response?.data?.data && typeof err.response.data.data === 'object') {
        // Handle field-specific errors from GlobalExceptionHandler
        // Backend returns: { success: false, message: "Validation failed", data: { fieldName: "error message" } }
        setErrors(err.response.data.data);
      } else {
        setErrors({ general: err.message || "Something went wrong. Please try again." });
      }
    } finally {
      setIsLoading(false);
    }
  };
 

  const handleGoogleCallback = async (response) => {
    try {
      setIsLoading(true);
      const user = await googleAuth(response.credential);
      
      // Check if this is a new Google user who hasn't selected their role
      if (!user.hasSelectedRole) {
        setPendingGoogleUser(user);
        setShowRoleModal(true);
      } else {
        login(user);
        navigateBasedOnRole(user);
      }
    } catch (err) {
      setErrors({ general: "Google sign-in failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleSelection = async (selectedRole) => {
    try {
      setIsLoading(true);
      const updatedUser = await updateUserRole(pendingGoogleUser.id, selectedRole);
      login(updatedUser);
      setShowRoleModal(false);
      navigateBasedOnRole(updatedUser);
    } catch (err) {
      setErrors({ general: "Failed to update role. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const navigateBasedOnRole = (user) => {
    if (user.role === "ADMIN" || user.role === 2) {
      navigate("/admin");
    } else if (user.role === "FREELANCER" || user.role === 1) {
      navigate("/dashboard/freelancer");
    } else {
      navigate("/dashboard/creator");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-2000"></div>
      </div>

      {/* Header with Back to Home */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/"
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium group"
        >
          <HiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
      </div>

      <div className="flex items-center justify-center min-h-screen px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Form */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-gray-200">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">U</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Upkraft
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Join Upkraft</h2>
              <p className="text-gray-600">
                Create your account and start collaborating
              </p>
            </div>

            {errors.general && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
              >
                {errors.general}
              </motion.div>
            )}

            {/* Name Field */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <HiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="off"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all bg-gray-50 focus:bg-white ${
                    errors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
                  }`}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <HiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="off"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all bg-gray-50 focus:bg-white ${
                    errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Role Selection */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                I want to join as
              </label>
              <div className="relative">
                <HiUserGroup className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all appearance-none ${
                    errors.role ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
                  }`}
                >
                  <option value="">Select your role</option>
                  <option value="CREATOR">Content Creator - I want to hire freelancers</option>
                  <option value="FREELANCER">Freelancer - I want to offer services</option>
                </select>
              </div>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  placeholder="Create a password (min. 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all bg-gray-50 focus:bg-white ${
                    errors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
                  }`}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all bg-gray-50 focus:bg-white ${
                    errors.confirmPassword ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
                  }`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Sign Up Button */}
            <motion.button
              type="button"
              onClick={handleSignUp}
              disabled={isLoading}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="relative overflow-hidden w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 group mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              <span className="relative z-10">
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating Account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </span>
            </motion.button>

            {/* Divider */}
            <div className="flex items-center mb-4">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-4 text-sm text-gray-500">or</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            {/* Google Sign-In Button */}
            <div id="google-signup-btn" className="mb-6"></div>

            {/* Footer */}
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <RoleSelectionModal
        isOpen={showRoleModal}
        onRoleSelect={handleRoleSelection}
        userName={pendingGoogleUser?.name}
      />
    </div>
  );
}
