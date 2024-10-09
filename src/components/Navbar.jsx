import React from "react";
import { Input, Button } from "@material-tailwind/react";

import "./styles/searchbar.css";

export function NavbarSearch() {
  return (
    <div className="navsearch">
      <div>
        <Input color="teal" label="Search Patient" />
      </div>
    </div>
  );
}
