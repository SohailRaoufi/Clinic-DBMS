import { NavbarSearch } from "../components/Navbar";
import { Button } from "@material-tailwind/react";
import Table from "../components/Table";
import { PlusIcon } from "@heroicons/react/16/solid";

import { data } from "../components/test/TableData";

const Table_head = Object.keys(data[0]);

import "../components/styles/table.css";
import { Link } from "react-router-dom";

export default function Appointment() {
  return (
    <div>
      <NavbarSearch />
      <div className="flex-col table patient-table">
        <div className="table-head">
          <h1 className="head-text">All Appointments</h1>
        </div>
        <div className="table-body">
          <Table Table_head={Table_head} data={data} />
        </div>
      </div>
    </div>
  );
}
