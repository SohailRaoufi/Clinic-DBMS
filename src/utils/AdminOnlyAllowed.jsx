import React from "react";
import StaffNotAllowed from "../pages/StaffNotAllowed";
import { Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AdminOnlyAllowed = () => {
  const IsAdmin = () => {
    const token = localStorage.getItem("token");

    try {
      const user = jwtDecode(token);
      return user.is_admin;
    } catch (error) {
      return false;
    }
  };

  return IsAdmin() ? <Outlet /> : <StaffNotAllowed />;
};

export default AdminOnlyAllowed;
