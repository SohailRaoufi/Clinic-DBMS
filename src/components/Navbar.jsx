import React from "react";
import { Input, Button } from "@material-tailwind/react";

import "./styles/searchbar.css";

export function NavbarSearch({
  search,
  setSearch,
  name,
  searchPatient,
  btn = false,
}) {
  return (
    <div className="navsearch">
      <div>
        <Input
          color="teal"
          value={search}
          label={`Search ${name}`}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {btn && (
        <div>
          <Button onClick={() => searchPatient()}>Search</Button>
        </div>
      )}
    </div>
  );
}
