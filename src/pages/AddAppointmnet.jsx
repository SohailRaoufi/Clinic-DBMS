import { Typography, Input, Button } from "@material-tailwind/react";

import "../assets/styles/addappointment.css";

export default function AddAppointment() {
  return (
    <div className="add-appointmnet">
      <Typography className="p-5" variant="h4">
        Add Appointment
      </Typography>
      <div className="form-appointment shadow-lg rounded-lg">
        <form>
          <Typography>Patient Name</Typography>
          <Input
            size="sm"
            name="patient"
            label="patient name"
            color="teal"
            type="text"
            required
          />
          <Typography>Day</Typography>
          <Input size="sm" name="day" color="teal" type="date" required />

          <Typography>Time</Typography>
          <Input size="sm" name="day" color="teal" type="time" required />
          <br />
          <Button variant="h1">Add</Button>
        </form>
      </div>
    </div>
  );
}
