import SimpleCard from "../components/MyCard";
import "../components/styles/mycard.css";
import Table from "../components/Table";
import { NavbarSearch } from "../components/Navbar";

import { data } from "../components/test/TableData";

const Table_head = Object.keys(data[0]);

export default function Dashboard() {
  return (
    <>
      <NavbarSearch />
      <div className="card">
        <SimpleCard title={"Total No Patients"} number={"200"} />
        <SimpleCard title={"No Appointments Today"} number={"10"} />
        <SimpleCard title={"Anything"} number={"000"} />
      </div>
      <div className="table">
        <div className="table-head">
          <h1>Appointments</h1>
        </div>
        <div className="table-body">
          <Table Table_head={Table_head} data={data} />
        </div>
      </div>
    </>
  );
}
