import '../components/styles/mycard.css';
import '../assets/styles/dashboard.css';
import { NavbarSearch } from '../components/Navbar';
import JalaliDateInput from '../components/jalaliDate';

import { Button, Typography, Card } from '@material-tailwind/react';
import Mypagination from '../components/MyPagination';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { get, del } from '../utils/ApiFetch';

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [jalaliDate, setJalaliDate] = useState(() => {
    const today = new Date(date);
    const persianDate = new Intl.DateTimeFormat('fa-AF', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      calendar: 'persian',
    }).format(today);

    // Convert Persian digits to English and format
    const persianToEnglish = persianDate.replace(/[۰-۹]/g, (d) =>
      '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)
    );
    return persianToEnglish.split('/').join('/');
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [filteredAppointment, setfilteredAppointment] = useState([]);

  const headers = ['Time', 'Day', 'Patient'];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAppointment.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredAppointment.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = async (id) => {
    const response = await del(`/api/appointment/${id}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (response.success) {
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    } else {
      console.error('Could not delete the appointment');
    }
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      const response = await get(`/api/appointment/?day=${date}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.success) {
        response.data = response.data.map((appointment) => {
          const dateFormatter = new Intl.DateTimeFormat('fa-AF', {
            month: 'long',
            year: 'numeric',
            day: 'numeric',
          });

          const appointmentDate = new Date(appointment.day);
          const [{ value: month }, , { value: day }, , { value: year }] =
            dateFormatter.formatToParts(appointmentDate);

          const afghanDate = `${month} ${day}  ${year}`;

          return {
            ...appointment,
            day: afghanDate,
          };
        });
        setAppointments(response.data);
        setfilteredAppointment(response.data);
      } else {
        console.error('Failed to fetch appointments');
      }
    };
    fetchAppointments();
  }, [date]);

  useEffect(() => {
    if (search.trim() === '') {
      setfilteredAppointment(appointments);
    } else {
      const filterd = appointments.filter((a) =>
        a.patient.toLowerCase().includes(search.trim().toLowerCase())
      );

      setfilteredAppointment(filterd);
    }
  }, [search, appointments]);

  const handleDateChange = (dateObject) => {
    // Ensure dateObject is a valid DatePicker value
    if (dateObject && dateObject.format) {
      // Add one day to account for timezone offset
      const date = dateObject.toDate();
      date.setDate(date.getDate() + 1);
      const gregorianDate = date.toISOString().split('T')[0];
      setDate(gregorianDate);

      setJalaliDate(dateObject.format('YYYY/MM/DD')); // Update displayed Jalali date if needed
    }
  };

  return (
    <>
      <NavbarSearch
        name={'Appointment'}
        search={search}
        setSearch={setSearch}
      />

      <div className="table">
        <div className="relative table-head">
          <h1>Appointments</h1>
          <Typography className="filter-dash">
            Filter By Date:{' '}
            <JalaliDateInput
              onChange={handleDateChange}
              width={'13rem'}
              value={jalaliDate}
            />
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
                      .filter((head) => head != 'id')
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
                  {currentItems.map((patient) => (
                    <tr key={patient.id} className="even:bg-blue-gray-50/50">
                      {Object.keys(patient)
                        .filter((key) => key !== 'id')
                        .map((key) => (
                          <td key={key} className="p-4">
                            {key === 'day' ? (
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                                style={{ direction: 'rtl' }}
                              >
                                {patient[key]}
                              </Typography>
                            ) : (
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {patient[key]}
                              </Typography>
                            )}
                          </td>
                        ))}
                      <td className="">
                        <Button
                          variant="text"
                          size="sm"
                          className="font-medium"
                          onClick={() => handleDelete(patient.id)}
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
