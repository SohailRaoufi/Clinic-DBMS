import SimpleCard from "../components/MyCard";
import "../components/styles/mycard.css";
import "../assets/styles/dashboard.css";
import { NavbarSearch } from "../components/Navbar";

import { Button, Input, Typography, Card } from "@material-tailwind/react";
import Mypagination from "../components/MyPagination";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { get, del } from "../utils/ApiFetch";

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const headers = ["Day", "Time", "Patient"];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = appointments.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(appointments.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = async (id) => {
    const response = await del(`/api/appointment/${id}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.success) {
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    } else {
      console.error("Could not delete the appointment");
    }
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      const response = await get(`/api/appointment/?day=${date}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.success) {
        setAppointments(response.data);
      } else {
        console.error("Failed to fetch appointments");
      }
    };
    fetchAppointments();
  }, [date]);

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

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
            <Input value={date} onChange={handleDateChange} type="date" />
          </Typography>
          <Link to="/dashboard/appointment/add">
            <Button className=" !absolute top-0 right-0">
              Add Appointment
            </Button>
          </Link>
        </div>
        <div className="table-body">
          <div className="tab">
            <Card className="table-body h-full w-full overflow-scroll">
              <table className="w-full min-w-max table-auto text-left">
                <thead>
                  <tr>
                    {headers
                      .filter((head) => head != "id")
                      .map((head) => (
                        <th
                          key={head}
                          className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                        >
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal leading-none opacity-70"
                          >
                            {head}
                          </Typography>
                        </th>
                      ))}
                    <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal leading-none opacity-70"
                      >
                        Action
                      </Typography>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((patient, index) => (
                    <tr key={patient.id} className="even:bg-blue-gray-50/50">
                      {Object.keys(patient)
                        .filter((key) => key !== "id")
                        .map((key) => (
                          <td key={key} className="p-4">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {patient[key]}
                            </Typography>
                          </td>
                        ))}
                      <td className="">
                        <Button
                          variant="text"
                          size="sm"
                          className="font-medium"
                          onClick={(e) => handleDelete(patient.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
            <div className="table-pag">
              <Mypagination
                totalPages={totalPages}
                currentPage={currentPage}
                paginate={paginate}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
