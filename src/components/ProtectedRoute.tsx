import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication removed — always allow access
  return <>{children}</>;
};

export default ProtectedRoute;
