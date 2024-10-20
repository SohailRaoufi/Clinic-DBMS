import { Typography, Input, Button } from "@material-tailwind/react";
import React, { useState, useEffect } from "react";
import { post, put } from "../utils/ApiFetch";
import { useNavigate, useLocation } from "react-router-dom";

import "../assets/styles/addappointment.css";

export default function AddStaff({ isEditing = false }) {
  const navigate = useNavigate();
  const { state } = useLocation();
  const data = state?.data || [];

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    console.log("here");
    console.log(formData)
    e.preventDefault();
    if (!isEditing) {
      const response = await post("/api/staff/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: {
          ...formData,
        },
      });

      if (response.success) {
        navigate("/dashboard/staff/");
      } else {
        console.error("Failed to create staff");
      }
    } else {
      const updateRespones = await put(`/api/staff/${data.id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },

        body: formData,
      });

      if (!updateRespones.success) {
        console.log(updateRespones.data);
        return;
      }

      navigate(`/dashboard/staff`);
    }
  };

  useEffect(() => {
      if (isEditing && data) {
      setFormData({
        username: data.username || "",
        email: data.email || "",
        password: data.password || "",
      });
    }
  }, [data]);

  return (
    <div className="add-appointmnet">
      <Typography className="p-5" variant="h4">
        {isEditing ? "Edit Staff" : "Add Staff"}
      </Typography>
      <div className="form-appointment shadow-lg rounded-lg">
        <form onSubmit={handleSubmit}>
          <Typography>Username</Typography>
          <Input
            size="sm"
            name="username"
            label="Username"
            color="teal"
            type="text"
            required
            value={formData.username}
            onChange={handleChange}
          />
          <Typography>Email</Typography>
          <Input
            size="sm"
            name="email"
            color="teal"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
          />

          <Typography>Password</Typography>
          <Input
            size="sm"
            name="password"
            color="teal"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
          />

          <br />
          <Button type="submit" variant="h1">
            {isEditing ? "Update" : "Add"}
          </Button>
        </form>
      </div>
    </div>
  );
}
