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

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Page404 />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/patients",
        element: <Patient />,
      },
      {
        path: "/patients/add",
        element: <AddPatient />,
      },
      {
        path: "/patients/:id",
        element: <PatientDetail />,
      },
      {
        path: "/appointments",
        element: <Appointment />,
      },
      {
        path: "/appointment/add",
        element: <AddAppointment />,
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
