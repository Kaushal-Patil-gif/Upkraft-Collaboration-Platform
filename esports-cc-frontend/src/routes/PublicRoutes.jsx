import { Routes, Route } from "react-router-dom";
import Landing from "../pages/landing/Landing";
import Login from "../pages/auth/Login";
import SignUp from "../pages/auth/SignUp";

export default function PublicRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<SignUp />} />
    </Routes>
  );
}
