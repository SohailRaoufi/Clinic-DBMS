import { Typography, Input, Button } from '@material-tailwind/react';
import { useState } from 'react';
import { post } from '../utils/ApiFetch';
import { useNavigate } from 'react-router-dom';
import JalaliDateInput from '../components/jalaliDate';

import '../assets/styles/addappointment.css';

export default function AddAppointment() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [jalaliDate, setJalaliDate] = useState(() => {
    const today = new Date(date);
    const persianDate = new Intl.DateTimeFormat('fa-AF', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(today);

    // Convert Persian digits to English and format
    const persianToEnglish = persianDate.replace(/[۰-۹]/g, (d) =>
      '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)
    );
    return persianToEnglish.split('/').join('/');
  });

  const [formData, setFormData] = useState({
    patient: '',
    day: date,
    time: '',
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleDateChange = (dateObject) => {
    // Ensure dateObject is a valid DatePicker value
    if (dateObject && dateObject.format) {
      // Add one day to account for timezone offset
      const date = dateObject.toDate();
      date.setDate(date.getDate() + 1);
      const gregorianDate = date.toISOString().split('T')[0];
      setDate(gregorianDate);
      setJalaliDate(dateObject.format('YYYY/MM/DD'));

      // Update formData with the new date
      setFormData((prevState) => ({
        ...prevState,
        day: gregorianDate,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    const response = await post('/api/appointment/', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: {
        ...formData,
      },
    });

    if (response.success) {
      navigate('/dashboard/appointments/');
    } else {
      setError(response.data['Failed']);
      console.error(response.data);
    }
  };

  return (
    <div className="add-appointmnet">
      <Typography className="p-5" variant="h4">
        Add Appointment
      </Typography>
      <div className="form-appointment shadow-lg rounded-lg">
        <Typography className=" text-red-500">
          {error != '' ? error : ''}
        </Typography>
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
          <JalaliDateInput
            width={'17.4rem'}
            onChange={handleDateChange}
            value={jalaliDate}
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
