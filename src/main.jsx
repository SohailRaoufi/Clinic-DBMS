import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@material-tailwind/react";

import Root from "./routes/root";
import Page404 from "./pages/404";
import Dashboard from "./pages/Dashboard";
import Patient from "./pages/Patient";
import AddPatient from "./pages/AddPatient";
import Appointment from "./pages/Appointment";
import PatientDetail from "./pages/PatientDetail";
import AddAppointment from "./pages/AddAppointmnet";
import Staff from "./pages/Staff";
import AddStaff from "./pages/AddStaff";
import StaffDetail from "./pages/StaffDetail";

import Auth from "./pages/Auth";
import PrivateRoute from "./utils/PrivateRouter";

import "./index.css";

if (!localStorage.getItem("HOST")) {
  localStorage.setItem("HOST", "http://localhost:8000");
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Auth />,
    errorElement: <Page404 />,
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        path: "/dashboard",
        element: <Root />,
        errorElement: <Page404 />,
        children: [
          {
            path: "/dashboard",
            element: <Dashboard />,
          },
          {
            path: "/dashboard/patients",
            element: <Patient />,
          },
          {
            path: "/dashboard/patients/add",
            element: <AddPatient />,
          },
          {
            path: "/dashboard/patients/edit/:id",
            element: <AddPatient isEditing={true} />,
          },
          {
            path: "/dashboard/patients/:id",
            element: <PatientDetail />,
          },
          {
            path: "/dashboard/appointments",
            element: <Appointment />,
          },
          {
            path: "/dashboard/appointment/add",
            element: <AddAppointment />,
          },
          {
            path: "/dashboard/staff",
            element: <Staff />,
          },
          {
            path: "/dashboard/staff/add",
            element: <AddStaff />,
          },
          {
            path: "/dashboard/staff/:id",
            element: <StaffDetail />,
          },
          {
            path: "/dashboard/staff/edit/:id",
            element: <AddStaff isEditing={true} />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
);
