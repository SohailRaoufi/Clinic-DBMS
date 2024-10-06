import { Typography, Input, Button } from "@material-tailwind/react";
import React, { useState } from "react";
import { post } from "../utils/ApiFetch";
import { useNavigate } from "react-router-dom";

import "../assets/styles/addappointment.css";

export default function AddAppointment() {
  const navigate = useNavigate();
  

  const [formData, setFormData] = useState({
    patient: "",
    day: new Date().toISOString().split("T")[0],
    time: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

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
        Add Appointment
      </Typography>
      <div className="form-appointment shadow-lg rounded-lg">
        <form onSubmit={handleSubmit}>
          <Typography>Patient Name</Typography>
          <Input
            size="sm"
            name="patient"
            label="patient"
            color="teal"
            type="text"
            required
            value={formData.patientName}
            onChange={handleChange}
          />
          <Typography>Day</Typography>
          <Input
            size="sm"
            name="day"
            color="teal"
            type="date"
            required
            value={formData.day}
            onChange={handleChange}
          />

          <Typography>Time</Typography>
          <Input
            size="sm"
            name="time"
            color="teal"
            type="time"
            required
            value={formData.time}
            onChange={handleChange}
          />

          <br />
          <Button type="submit" variant="h1">
            Add
          </Button>
        </form>
      </div>
    </div>
  );
}
