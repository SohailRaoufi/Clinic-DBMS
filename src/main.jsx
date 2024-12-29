import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@material-tailwind/react';

import Root from './routes/root';
import Page404 from './pages/404';
import Dashboard from './pages/Dashboard';
import Patient from './pages/Patient';
import AddPatient from './pages/AddPatient';
import Appointment from './pages/Appointment';
import PatientDetail from './pages/PatientDetail';
import AddAppointment from './pages/AddAppointmnet';
import Staff from './pages/Staff';
import AddStaff from './pages/AddStaff';
import StaffDetail from './pages/StaffDetail';
import Chat from './pages/Chat';
import ChatUser from './pages/ChatUser';
import Settings from './pages/Settings';
import Daily from './pages/Daily';
import AddDaily from './pages/AddDaily';
import Auth from './pages/Auth';
import PrivateRoute from './utils/PrivateRouter';
import Analytics from './pages/Analytics';
import Tasks from './pages/Tasks';
import AddTask from './pages/AddTask';
import MyTasks from './pages/MyTasks';

import './index.css';
import RoleBasedGuard from './utils/RoleBasedGuard';
import { UserRole } from './common/enums/user-role';
if (!localStorage.getItem('HOST')) {
  localStorage.setItem('HOST', 'http://localhost:8000');
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Auth />,
    errorElement: <Page404 />,
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        path: '/dashboard',
        element: <Root />,
        errorElement: <Page404 />,
        children: [
          {
            path: '/dashboard',
            element: <Dashboard />,
            errorElement: <Page404 />,
          },
          {
            path: '/dashboard/appointments',
            element: <Appointment />,
          },
          {
            path: '/dashboard/appointment/add',
            element: <AddAppointment />,
          },
          {
            path: '/dashboard/chat',
            element: <Chat />,
          },
          {
            path: '/dashboard/chat/:id',
            element: <ChatUser />,
          },
          {
            element: (
              <RoleBasedGuard allowedRoles={[UserRole.Staff, UserRole.Admin]} />
            ),
            children: [
              {
                path: '/dashboard/patients',
                element: <Patient />,
              },
              {
                path: '/dashboard/patients/add',
                element: <AddPatient />,
              },
              {
                path: '/dashboard/patients/edit/:id',
                element: <AddPatient isEditing={true} />,
              },
              {
                path: '/dashboard/patients/:id',
                element: <PatientDetail />,
              },
              {
                path: '/dashboard/daily',
                element: <Daily />,
              },
              {
                path: '/dashboard/daily/add',
                element: <AddDaily />,
              },
              {
                path: '/dashboard/daily/edit/:id',
                element: <AddDaily isEditing={true} />,
              },
            ],
          },

          {
            element: (
              <RoleBasedGuard
                allowedRoles={[UserRole.Staff, UserRole.Doctor]}
              />
            ),
            children: [
              {
                path: '/dashboard/mytasks',
                element: <MyTasks />,
              },
            ],
          },
          {
            element: <RoleBasedGuard allowedRoles={[UserRole.Admin]} />,
            children: [
              {
                path: '/dashboard/tasks',
                element: <Tasks />,
              },
              {
                path: '/dashboard/tasks/add',
                element: <AddTask />,
              },

              {
                path: '/dashboard/staff',
                element: <Staff />,
              },
              {
                path: '/dashboard/staff/add',
                element: <AddStaff />,
              },
              {
                path: '/dashboard/staff/:id',
                element: <StaffDetail />,
              },
              {
                path: '/dashboard/staff/edit/:id',
                element: <AddStaff isEditing={true} />,
              },
              {
                path: '/dashboard/analytics',
                element: <Analytics />,
              },
              {
                path: '/dashboard/settings',
                element: <Settings />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
);
