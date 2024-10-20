import { useState, useEffect } from "react";
import { get, patch } from "../utils/ApiFetch";
import { Card, Typography,Input, Checkbox } from "@material-tailwind/react";
import Mypagination from "../components/MyPagination";

import "../assets/styles/Mytasks.css";

export default function Task() {
  const [tasks, setTasks] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [filteredTasks, setfilteredTasks] = useState([]);

//   const [status, setStatus] = useState(null);
  
  const headers = ["Status", "Assigned By", "Task","Due To", "Detail"];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTasks.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);


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
  const handleChange = async (id,status) => {

    const updatedStatus = !status;
    
    const data = {
        status:updatedStatus
    }
    
    const response = await patch(`/api/tasks/${id}/`, {
        headers:{
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body:data
    });

    if (!response.success){
        console.error("Not Updated!")
        return;
    }else{
        const data = response.data;
        console.log(data);
        setTasks(data);
        return;
    }
    
  }


  const handleDateChange = (e) => {
    setDate(e.target.value);
  };
  return (
    <div>
      <div className="flex-col table relative patient-table">
        <div className="table-head">
          <h1 className="head-text">All Tasks</h1>
          <div className="flex items-center">
            <Typography className="filter-mytask">
              Filter By Date:{" "}
              <Input value={date} onChange={handleDateChange} type="date" />
            </Typography>

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
                    
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((task, index) => (
                    <tr key={task.id} className="even:bg-blue-gray-50/50">
                        <td key={index + 1} className="p-4">
                        <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                        >
                            <Checkbox checked={task.status} value={task.status} name="status" onClick={ () => handleChange(task.id,task.status)} />
                        </Typography>
                        </td>
                        <td key={index + 1} className="p-4">
                        <Typography
                            variant="small"
                            color="blue-gray"
                            className={`font-normal ${task.status ? 'line-through' : ''}`} // Add line-through class if status is true
                        >
                            {task.assigned_by_name}
                        </Typography>
                    </td>
                    <td key={index + 1} className="p-4">
                        <Typography
                            variant="small"
                            color="blue-gray"
                            className={`font-normal ${task.status ? 'line-through' : ''}`} // Add line-through class if status is true
                        >
                            {task.title}
                        </Typography>
                    </td>
                    <td key={index + 1} className="p-4">
                        <Typography
                            variant="small"
                            color="blue-gray"
                            className={`font-normal ${task.status ? 'line-through' : ''}`} // Add line-through class if status is true
                        >
                            {task.due_to}
                        </Typography>
                    </td>
                    <td key={index + 1} className="p-4">
                        <Typography
                            variant="small"
                            color="blue-gray"
                            className={`font-normal ${task.status ? 'line-through' : ''}`} // Add line-through class if status is true
                        >
                            {task.description !== "" ? task.description : "N/A"}
                        </Typography>
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
