import { Typography, Input, Button, Textarea } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { post } from "../utils/ApiFetch";
import { useNavigate } from "react-router-dom";

import "../assets/styles/addappointment.css";
import { get } from "../utils/ApiFetch";

export default function AddTask() {
  const navigate = useNavigate();
  
  const [users,setUsers] = useState([]);
  const [formData, setFormData] = useState({
    task: "",
    staff:"",
    due: "",
    detail:""
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]:value,
    }));
    
  };
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
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await post("/api/appointment/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: {
        ...formData,
      },
    });

    if (response.success) {
      navigate("/dashboard/appointments/")
    } else {
      console.error("Failed to create appointment");
    }
  };

  return (
    <div className="add-appointmnet">
      <Typography className="p-5" variant="h4">
        Add Task
      </Typography>
      <div className="form-appointment shadow-lg rounded-lg">
        <form onSubmit={handleSubmit}>
          <Typography>Task Name</Typography>
          <Input
            size="sm"
            name="task"
            label="task"
            color="teal"
            type="text"
            required
            value={formData.patientName}
            onChange={handleChange}
          />
          

          <div>
          <Typography>Staff</Typography>
            <select
            onChange={handleChange}
            name="staff"
            value={formData.staff}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
            <option value="">Select</option>
            {users.map((user) => (
                <option key={user.id} value={user.username} >{user.username}</option>
            ))}
            </select>
        </div>
          <Typography>Due to</Typography>
          <Input
            size="sm"
            name="due"
            color="teal"
            type="date"
            required
            value={formData.due}
            onChange={handleChange}
          />
          <Typography>Task Detail</Typography>
          <Textarea onChange={handleChange} value={formData.detail} name="detail" label="Detail"/>
          

          <br />
          <Button type="submit" variant="h1">
            Add
          </Button>
        </form>
      </div>
    </div>
  );
}
