// src/components/AdminRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user } = useAuth();
  
  // Assuming you determine admin by user email or a custom claim
  const isAdmin = user && user.email === "admin@example.com"; // change accordingly

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  return children;
}
