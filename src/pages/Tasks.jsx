import { NavbarSearch } from "../components/Navbar";
import { useState, useEffect } from "react";
import { get, del } from "../utils/ApiFetch";
import { Card, Typography, Button, Input } from "@material-tailwind/react";
import Mypagination from "../components/MyPagination";

import { Link } from "react-router-dom";
import "../assets/styles/tasks.css";

export default function Task() {
  const [tasks, setTasks] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [users, setUsers] = useState([]);
  const [filterUser, setFilterUser] = useState("all")

  const [filteredTasks, setfilteredTasks] = useState([]);
  
  const headers = ["Status", "Staff", "Task","Due To", "Detail"];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTasks.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = async (id) => {
    const response = await del(`/api/tasks/${id}/`, {
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
      const response = await get(`/api/tasks/?date=${date}`, {
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
    const fetchUsers = async () => {
        try {
          const response = await get("api/chats/", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          if (!response.success) {
            throw new Error("Network response was not ok");
          }
          const data = await response.data;
          setUsers(data);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };

      fetchUsers();
}, [])



useEffect(() => {
  const handleStaffChange = () => {
    if(filterUser === "all"){
        setfilteredTasks(tasks);
    }else{
        const filterd = tasks.filter((t) => t.assigned_to === Number(filterUser));
        console.log(filterd);
        
        setfilteredTasks(filterd);
    }
    
 }
 handleStaffChange();
}, [filterUser, tasks])


  const handleDateChange = (e) => {
    setDate(e.target.value);
  };
  return (
    <div>
      <div className="flex-col table relative patient-table">
        <div className="table-head">
          <h1 className="head-text">All Tasks</h1>
          <div className="flex items-center">
          
          <div className="users">
          <Typography>Filter By Staff: </Typography>
            <select
            onChange={(e) => setFilterUser(e.target.value)}
            name="assigned_to"
            required
            className="mt-1px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
            <option value="all">All</option>
            {users.map((user) => (
                <option key={user.id} value={user.id} >{user.username}</option>
            ))}
            </select>
            </div>
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
                  {currentItems.map((task, index) => (
                    <tr key={index + 1} className="even:bg-blue-gray-50/50">
                        <td key={index + 1} className="p-4">
                        <Typography
                            variant="small"
                            color={task.status ? "green" : "orange"}
                            className="font-normal"

                        >
                            {task.status ? "Done" : "Pending"}
                        </Typography>
                        </td>
                        <td key={index + 1} className="p-4">
                        <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                        >
                            {task.assigned_to_name}
                        </Typography>
                        </td>
                        <td key={index + 1} className="p-4">
                        <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                        >
                            {task.title}
                        </Typography>
                        </td>
                        <td key={index + 1} className="p-4">
                        <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                        >
                            {task.due_to}
                        </Typography>
                        </td>
                        <td key={index + 1} className="p-4">
                        <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                        >
                            {task.description !== "" ? task.description : "N/A"}
                        </Typography>
                        </td>
                        
                      <td className="">
                        <Button
                          variant="text"
                          size="sm"
                          className="font-medium"
                          onClick={(e) => handleDelete(task.id)}
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
