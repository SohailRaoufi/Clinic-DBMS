import { Typography, Input, Button, Textarea } from "@material-tailwind/react";
import React, { useState, useEffect } from "react";
import { post, put } from "../utils/ApiFetch";
import { useNavigate, useLocation } from "react-router-dom";

import "../assets/styles/addappointment.css";

export default function AddStaff({ isEditing = false }) {
  const navigate = useNavigate();
  const { state } = useLocation();
  const data = state?.data || [];

  const [formData, setFormData] = useState({
    name: "",
    payment: 0,
    note: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    console.log(formData);
    e.preventDefault();
    if (!isEditing) {
      const response = await post("/api/daily/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: {
          ...formData,
        },
      });

      if (response.success) {
        navigate("/dashboard/daily/");
      } else {
        console.error("Failed to create Daily!");
      }
    } else {
      const updateRespones = await put(`/api/daily/${data.id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },

        body: formData,
      });

      if (!updateRespones.success) {
        console.log(updateRespones.data);
        return;
      }

      navigate(`/dashboard/daily`);
    }
  };

  useEffect(() => {
    if (isEditing && data) {
      setFormData({
        name: data.name || "",
        payment: data.payment || "",
        note: data.note || "",
      });
    }
  }, [data]);

  return (
    <div className="add-appointmnet">
      <Typography className="p-5" variant="h4">
        {isEditing ? "Edit Daily" : "Add Daily"}
      </Typography>
      <div className="form-appointment shadow-lg rounded-lg">
        <form onSubmit={handleSubmit}>
          <Typography>Name</Typography>
          <Input
            size="sm"
            name="name"
            label="Name"
            color="teal"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
          />
          <Typography>Payment</Typography>
          <Input
            size="sm"
            name="payment"
            color="teal"
            type="number"
            required
            value={formData.payment}
            onChange={handleChange}
          />

          <Typography>Note</Typography>
          <Textarea
            size="sm"
            name="note"
            color="teal"
            value={formData.note}
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
