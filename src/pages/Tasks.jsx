import { NavbarSearch } from "../components/Navbar";
import { useState, useEffect } from "react";
import { get, del } from "../utils/ApiFetch";
import { Card, Typography, Button, Input } from "@material-tailwind/react";
import Mypagination from "../components/MyPagination";

import { Link } from "react-router-dom";
import "../assets/styles/tasks.css";

export default function Appointment() {
  const [tasks, setTasks] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [search, setSearch] = useState("");
  const [filteredTasks, setfilteredTasks] = useState([]);

  const headers = ["Status", "Staff", "Tasks", "Detail"];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTasks.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = async (id) => {
    const response = await del(`/api/appointment/${id}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.success) {
        setTasks((prev) => prev.filter((a) => a.id !== id));
        setfilteredTasks((prev) => prev.filter((a) => a.id !== id));
    } else {
      console.error("Could not delete the appointment");
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await get(`/api/appointment/?day=${date}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.success) {
        setTasks(response.data);
        setfilteredTasks(response.data);
      } else {
        console.error("Failed to fetch appointments");
      }
    };
    fetchTasks();
  }, [date]);

  useEffect(() => {
    if (search.trim() === "") {
        setfilteredTasks(tasks);
    } else {
      const filterd = tasks.filter((a) =>
        a.task.toLowerCase().includes(search.trim().toLowerCase())
      );

      setfilteredTasks(filterd);
    }
  }, [search, tasks]);

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };
  return (
    <div>
      <NavbarSearch
        name={"Appointment"}
        search={search}
        setSearch={setSearch}
      />
      <div className="flex-col table relative patient-table">
        <div className="table-head">
          <h1 className="head-text">All Tasks</h1>
          <div className="flex items-center">
            <Typography className="filter-task">
              Filter By Date:{" "}
              <Input value={date} onChange={handleDateChange} type="date" />
            </Typography>

            <Link to="/dashboard/tasks/add">
              <Button className="add-appointment">Add Task</Button>
            </Link>
          </div>
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
    </div>
  );
}
