import { NavbarSearch } from "../components/Navbar";
import { Button } from "@material-tailwind/react";
import Table from "../components/Table";
import { PlusIcon } from "@heroicons/react/16/solid";

import { PatientData } from "../components/test/PatientData";

const Table_head = Object.keys(PatientData[0]);

import "../assets/styles/patientPage.css";
import { Link } from "react-router-dom";

export default function Patient() {
  return (
    <div>
      <NavbarSearch />
      <div className="flex-col table patient-table">
        <div className="table-head">
          <Link to="/patients/add">
            <Button className="pateint-btn">
              <PlusIcon style={{ height: "18px" }} />
              Add Patient
            </Button>
          </Link>
          <h1 className="head-text">All Patients</h1>
        </div>
        <div className="table-body">
          <Table Table_head={Table_head} data={PatientData} />
        </div>
      </div>
    </div>
  );
}
