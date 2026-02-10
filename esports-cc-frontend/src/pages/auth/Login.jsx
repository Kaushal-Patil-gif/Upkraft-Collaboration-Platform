import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { HiEye, HiEyeOff, HiMail, HiLockClosed, HiArrowLeft } from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";
import { loginUser, googleAuth } from "../../services/authService";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();

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
    handleGoogleSignIn();
  }, []);

  const handleLogin = async () => {
    try {
      setErrors({});
      setIsLoading(true);
      const user = await loginUser(email, password);

      login(user);

      if (user.role === "ADMIN" || user.role === 2) {
        navigate("/admin");
      } else if (user.role === "FREELANCER" || user.role === 1) {
        navigate("/dashboard/freelancer");
      } else {
        navigate("/dashboard/creator");
      }
    } catch (err) {
      console.log('Login error details:', err);
      console.log('Error response:', err.response?.data);
      if (err.response?.data?.data && typeof err.response.data.data === 'object') {
        setErrors(err.response.data.data);
      } else if (err.response?.data?.message) {
        setErrors({ general: err.response.data.message });
      } else {
        setErrors({ general: err.message || "Invalid email or password" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    try {
      if (!window.google) {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.onload = () => {
          window.google.accounts.id.initialize({
            client_id: '414801256140-17mqrohp5c2h998drj104ial7qs30eju.apps.googleusercontent.com',
            callback: handleGoogleCallback,
            auto_select: false,
            cancel_on_tap_outside: false
          });
          window.google.accounts.id.renderButton(
            document.getElementById('google-signin-btn'),
            { theme: 'outline', size: 'large', text: 'signin_with' }
          );
        };
        script.onerror = () => {
          setErrors({ general: 'Failed to load Google Sign-In.' });
        };
        document.head.appendChild(script);
      } else {
        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-btn'),
          { theme: 'outline', size: 'large', text: 'signin_with' }
        );
      }
    } catch (error) {
      setErrors({ general: 'Google Sign-In failed. Please use email/password.' });
    }
  };

  const handleGoogleCallback = async (response) => {
    try {
      setIsLoading(true);
      const user = await googleAuth(response.credential);
      login(user);
      
      if (user.role === "ADMIN" || user.role === 2) {
        navigate("/admin");
      } else if (user.role === "FREELANCER" || user.role === 1) {
        navigate("/dashboard/freelancer");
      } else {
        navigate("/dashboard/creator");
      }
    } catch (err) {
      setErrors({ general: err.message || "Google sign-in failed. Please try again." });
    } finally {
      setIsLoading(false);
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

      <div className="flex items-center justify-center min-h-screen px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Form */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-gray-200">
            {/* Header Section */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">U</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Upkraft
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h2>
              <p className="text-gray-600">
                Sign in to your account to continue
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

            {/* Email*/}
            <div className="mb-6">
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
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all bg-gray-50 focus:bg-white ${
                    errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password*/}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all bg-gray-50 focus:bg-white ${
                    errors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Login Button */}
            <motion.button
              type="button"
              onClick={handleLogin}
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
                    Signing In...
                  </div>
                ) : (
                  "Sign In"
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
            <div id="google-signin-btn" className="mb-6"></div>

            {/* Footer */}
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                >
                  Create one here
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
