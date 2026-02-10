import { Routes, Route } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import ProtectedRoute from "./ProtectedRoute";

/* Pages */
import Marketplace from "../pages/marketplace/Marketplace";
import FreelancerServices from "../pages/marketplace/FreelancerServices";
import ServiceDetails from "../pages/marketplace/ServiceDetails";
import ProjectWorkspace from "../pages/project/ProjectWorkspace";
import ProjectSetup from "../pages/project/ProjectSetup";
import MyProjects from "../pages/project/MyProjects";

import CreatorDashboard from "../pages/dashboard/creator/CreatorDashboard";
import FreelancerDashboard from "../pages/dashboard/freelancer/FreelancerDashboard";
import AdminDashboard from "../pages/dashboard/admin/AdminDashboard";

import CreatorProfile from "../pages/profile/CreatorProfile";
import FreelancerProfile from "../pages/profile/FreelancerProfile";
import AdminProfile from "../pages/profile/AdminProfile";
import EditProfile from "../pages/profile/EditProfile";
import EditService from "../pages/profile/EditService";
import AddService from "../pages/profile/AddService";
import PortfolioManager from "../pages/profile/PortfolioManager";
import KYCSubmission from "../pages/kyc/KYCSubmission";
import KYCReview from "../pages/kyc/KYCReview";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Marketplace */}
      <Route
        path="/marketplace"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Marketplace />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/freelancer/:id/services"
        element={
          <ProtectedRoute>
            <AppLayout>
              <FreelancerServices />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/service"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ServiceDetails />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Project */}
      <Route
        path="/project/setup"
        element={
          <ProtectedRoute role="CREATOR">
            <AppLayout>
              <ProjectSetup />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/project/:projectId"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ProjectWorkspace />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-projects"
        element={
          <ProtectedRoute>
            <AppLayout>
              <MyProjects />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Dashboards */}
      <Route
        path="/dashboard/creator"
        element={
          <ProtectedRoute role="CREATOR">
            <AppLayout>
              <CreatorDashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/freelancer"
        element={
          <ProtectedRoute>
            <AppLayout>
              <FreelancerDashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute role="ADMIN">
            <AppLayout>
              <AdminDashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Profiles */}
      <Route
        path="/profile/creator"
        element={
          <ProtectedRoute>
            <AppLayout>
              <CreatorProfile />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile/freelancer"
        element={
          <ProtectedRoute>
            <AppLayout>
              <FreelancerProfile />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile/admin"
        element={
          <ProtectedRoute role="ADMIN">
            <AppLayout>
              <AdminProfile />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile/edit"
        element={
          <ProtectedRoute>
            <AppLayout>
              <EditProfile />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile/add-service"
        element={
          <ProtectedRoute role="FREELANCER">
            <AppLayout>
              <AddService />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile/edit-service/:id"
        element={
          <ProtectedRoute role="FREELANCER">
            <AppLayout>
              <EditService />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile/portfolio"
        element={
          <ProtectedRoute>
            <AppLayout>
              <PortfolioManager />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/kyc/submit"
        element={
          <ProtectedRoute>
            <AppLayout>
              <KYCSubmission />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/kyc/review/:userId"
        element={
          <ProtectedRoute role="ADMIN">
            <AppLayout>
              <KYCReview />
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
