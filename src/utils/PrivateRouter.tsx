import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = () => {
  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const decodedToken = jwtDecode(token)?.exp;
      if (!decodedToken) {
        return false;
      }
      const currentTime = Date.now() / 1000;
      return decodedToken > currentTime;
    } catch (error) {
      return false;
    }
  };

  return isAuthenticated() ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
