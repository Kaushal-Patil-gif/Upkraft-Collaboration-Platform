import { Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import Landing from "./pages/landing/Landing";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Marketplace from "./pages/marketplace/Marketplace";
import FreelancerServices from "./pages/marketplace/FreelancerServices";
import ServiceDetails from "./pages/marketplace/ServiceDetails";
import ProjectWorkspace from "./pages/project/ProjectWorkspace";
import ProjectSetup from "./pages/project/ProjectSetup";
import CreatorDashboard from "./pages/dashboard/creator/CreatorDashboard";
import FreelancerDashboard from "./pages/dashboard/freelancer/FreelancerDashboard";
import AdminDashboard from "./pages/dashboard/admin/AdminDashboard";
import CreatorProfile from "./pages/profile/CreatorProfile";
import FreelancerProfile from "./pages/profile/FreelancerProfile";
import AdminProfile from "./pages/profile/AdminProfile";
import EditProfile from "./pages/profile/EditProfile";
import EditService from "./pages/profile/EditService";
import AddService from "./pages/profile/AddService";
import PortfolioManager from "./pages/profile/PortfolioManager";
import MyProjects from "./pages/project/MyProjects";
import KYCReview from "./pages/kyc/KYCReview";
import TwoFactorKYC from "./pages/kyc/TwoFactorKYC";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<SignUp />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<About />} />
      
      {/* Marketplace */}
      <Route path="/marketplace" element={<ProtectedRoute><AppLayout><Marketplace /></AppLayout></ProtectedRoute>} />
      <Route path="/freelancer/:id/services" element={<ProtectedRoute><AppLayout><FreelancerServices /></AppLayout></ProtectedRoute>} />
      <Route path="/service" element={<ProtectedRoute><AppLayout><ServiceDetails /></AppLayout></ProtectedRoute>} />
      
      {/* Project */}
      <Route path="/project/setup" element={<ProtectedRoute role="CREATOR"><AppLayout><ProjectSetup /></AppLayout></ProtectedRoute>} />
      <Route path="/project/:projectId" element={<ProtectedRoute><AppLayout><ProjectWorkspace /></AppLayout></ProtectedRoute>} />
      <Route path="/my-projects" element={<ProtectedRoute><AppLayout><MyProjects /></AppLayout></ProtectedRoute>} />
      
      {/* Dashboards */}
      <Route path="/dashboard/creator" element={<ProtectedRoute role="CREATOR"><AppLayout><CreatorDashboard /></AppLayout></ProtectedRoute>} />
      <Route path="/dashboard/freelancer" element={<ProtectedRoute role="FREELANCER"><AppLayout><FreelancerDashboard /></AppLayout></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute role="ADMIN"><AppLayout><AdminDashboard /></AppLayout></ProtectedRoute>} />
      
      {/* Profiles */}
      <Route path="/profile/creator" element={<ProtectedRoute><AppLayout><CreatorProfile /></AppLayout></ProtectedRoute>} />
      <Route path="/profile/freelancer" element={<ProtectedRoute><AppLayout><FreelancerProfile /></AppLayout></ProtectedRoute>} />
      <Route path="/profile/admin" element={<ProtectedRoute role="ADMIN"><AppLayout><AdminProfile /></AppLayout></ProtectedRoute>} />
      <Route path="/profile/edit" element={<ProtectedRoute><AppLayout><EditProfile /></AppLayout></ProtectedRoute>} />
      <Route path="/profile/add-service" element={<ProtectedRoute role="FREELANCER"><AppLayout><AddService /></AppLayout></ProtectedRoute>} />
      <Route path="/profile/edit-service/:id" element={<ProtectedRoute role="FREELANCER"><AppLayout><EditService /></AppLayout></ProtectedRoute>} />
      <Route path="/profile/portfolio" element={<ProtectedRoute><AppLayout><PortfolioManager /></AppLayout></ProtectedRoute>} />
      
      {/* KYC */}
      <Route path="/kyc/2fa" element={<ProtectedRoute><AppLayout><TwoFactorKYC /></AppLayout></ProtectedRoute>} />
      <Route path="/kyc/review/:userId" element={<ProtectedRoute role="ADMIN"><AppLayout><KYCReview /></AppLayout></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
