import SimpleCard from "../components/MyCard";
import "../components/styles/mycard.css";
import "../assets/styles/dashboard.css";
import Table from "../components/Table";
import { NavbarSearch } from "../components/Navbar";

import { data } from "../components/test/AppointmentData";
import { Button, Input, Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Table_head = Object.keys(data[0]);

export default function Dashboard() {
  const date = new Date().toJSON().slice(0, 10);
  const [filterDate, setFilterDate] = useState(date);

  const handleChange = (e) => setFilterDate(e.target.value);

  const filteredData = data.filter((item) => {
    return !filterDate || item.date == filterDate;
  });

  return (
    <>
      <NavbarSearch />
      <div className="card">
        <SimpleCard title={"Total No Patients"} number={"200"} />
        <SimpleCard title={"No Appointments Today"} number={"10"} />
        <SimpleCard title={"Anything"} number={"000"} />
      </div>
      <div className="table">
        <div className="relative table-head">
          <h1>Appointments</h1>
          <Typography className="filter">
            Filter By Date:{" "}
            <Input value={filterDate} onChange={handleChange} type="date" />
          </Typography>
          <Link to="/appointment/add">
            <Button className=" !absolute top-0 right-0">
              Add Appointment
            </Button>
          </Link>
        </div>
        <div className="table-body">
          <Table Table_head={Table_head} data={filteredData} />
        </div>
      </div>
    </>
  );
}
