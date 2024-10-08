import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  PowerIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { jwtDecode } from "jwt-decode";

import "./styles/sidebar.css";

import { LogOut } from "../utils/Logout";
import { useNavigate } from "react-router-dom";

export function NavbarSimple() {
  const [open, setOpen] = React.useState(0);

  const user = jwtDecode(localStorage.getItem("token"));

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  const navigate = useNavigate();
  const handleLogOut = () => {
    LogOut();
    navigate("/");
  };
  return (
    <Card className="relative side h-screen shadow-lg p-4">
      <div className="mb-2 p-4">
        <Typography variant="h5" color="blue-gray">
          Dental Clinic
        </Typography>
      </div>
      <List>
        <Accordion open={open === 1}>
          <Link to="/dashboard">
            <ListItem className="p-0" selected={open === 1}>
              <AccordionHeader
                onClick={() => handleOpen(1)}
                className="border-b-0 p-3"
              >
                <ListItemPrefix>
                  <PresentationChartBarIcon className="h-5 w-5" />
                </ListItemPrefix>
                <Typography color="blue-gray" className="mr-auto font-normal">
                  Dashboard
                </Typography>
              </AccordionHeader>
            </ListItem>
          </Link>
        </Accordion>
        <Accordion open={open === 2}>
          <Link to="/dashboard/patients">
            <ListItem className="p-0" selected={open === 2}>
              <AccordionHeader
                onClick={() => handleOpen(2)}
                className="border-b-0 p-3"
              >
                <ListItemPrefix>
                  <ShoppingBagIcon className="h-5 w-5" />
                </ListItemPrefix>
                <Typography color="blue-gray" className="mr-auto font-normal">
                  Patient
                </Typography>
              </AccordionHeader>
            </ListItem>
          </Link>
        </Accordion>
        <Accordion open={open === 3}>
          <Link to="/dashboard/appointments">
            <ListItem className="p-0" selected={open === 3}>
              <AccordionHeader
                onClick={() => handleOpen(3)}
                className="border-b-0 p-3"
              >
                <ListItemPrefix>
                  <ClockIcon className="h-5 w-5" />
                </ListItemPrefix>
                <Typography color="blue-gray" className="mr-auto font-normal">
                  Appointment
                </Typography>
              </AccordionHeader>
            </ListItem>
          </Link>
        </Accordion>
        <Accordion open={open === 4}>
          <Link to="/dashboard/chat">
            <ListItem className="p-0" selected={open === 4}>
              <AccordionHeader
                onClick={() => handleOpen(4)}
                className="border-b-0 p-3"
              >
                <ListItemPrefix>
                  <ChatBubbleLeftRightIcon className="h-5 w-5" />
                </ListItemPrefix>
                <Typography color="blue-gray" className="mr-auto font-normal">
                  Chat
                </Typography>
              </AccordionHeader>
            </ListItem>
          </Link>
        </Accordion>
        {user.is_admin && (
          <Accordion open={open === 5}>
            <Link to="/dashboard/staff">
              <ListItem className="p-0" selected={open === 5}>
                <AccordionHeader
                  selected={open === 5}
                  className="border-b-0 p-3"
                >
                  <ListItemPrefix>
                    <UsersIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  <Typography color="blue-gray" className="mr-auto font-normal">
                    Staff
                  </Typography>
                </AccordionHeader>
              </ListItem>
            </Link>
          </Accordion>
        )}

        <div>
          {user.is_admin && (
            <>
              <hr className="my-2 border-blue-gray-50" />
              <ListItem>
                <ListItemPrefix>
                  <UserCircleIcon className="h-5 w-5" />
                </ListItemPrefix>
                Profile
              </ListItem>
              <ListItem>
                <ListItemPrefix>
                  <Cog6ToothIcon className="h-5 w-5" />
                </ListItemPrefix>
                Settings
              </ListItem>
            </>
          )}
          <div className="user-box">
            <Typography variant="h5" className="ml-3">
              {localStorage.getItem("user")[0].toUpperCase() +
                localStorage.getItem("user").substring(1)}
            </Typography>
            <hr className="my-2 border-blue-gray-50" />
            <ListItem onClick={handleLogOut}>
              <ListItemPrefix>
                <PowerIcon className="h-5 w-5" />
              </ListItemPrefix>
              Log Out
            </ListItem>
          </div>
        </div>
      </List>
    </Card>
  );
}
