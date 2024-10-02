import { NavbarSimple } from "../components/sidebar";
import { Outlet } from "react-router-dom";

import "../assets/styles/root.css";
export default function Root() {
  return (
    <>
      <div className="flex relative flex-1 h-screen">
        <div className="h-screen fixed">
          <NavbarSimple />
        </div>
        <div className="content w-screen">
          <Outlet />
        </div>
      </div>
    </>
  );
}
