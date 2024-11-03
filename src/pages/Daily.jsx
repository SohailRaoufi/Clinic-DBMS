import { Button, Card, Typography, Input } from '@material-tailwind/react';
import { PlusIcon } from '@heroicons/react/16/solid';
import { useState, useEffect } from 'react';

import { get, del } from '../utils/ApiFetch';

import '../assets/styles/patientPage.css';

import { Link } from 'react-router-dom';
import Mypagination from '../components/MyPagination';

export default function Staff() {
  const [daily, setDaily] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [itemsPerPage] = useState(10);

  // Calculate the indexes for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = daily.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate total pages
  const totalPages = Math.ceil(daily.length / itemsPerPage);

  // Function to change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    const get_data = async () => {
      const response = await get(`/api/daily/?day=${date}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.success) {
        console.log(response.data);
        return;
      }

      const data = response?.data;
      if (!data) {
        console.log(`Unexpected data format: ${data}`);
        return;
      }

      setDaily(data);
    };

    get_data();
  }, [date]);

  const handleDelete = async (id) => {
    const response = await del(`/api/daily/${id}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (response.success) {
      setDaily((prev) => prev.filter((a) => a.id !== id));
    } else {
      console.error('Could not delete the daily');
    }
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  return (
    <div>
      <div className="flex-col table patient-table">
        <div className="table-head">
          <Typography
            style={{ marginTop: '0.3rem', marginRight: '1rem' }}
            className="filter"
          >
            Filter By Date:{' '}
            <Input value={date} onChange={handleDateChange} type="date" />
          </Typography>
          <Link to="/dashboard/daily/add">
            <Button className="patient-btn">
              <PlusIcon style={{ height: '18px' }} />
              Add Daily Patient
            </Button>
          </Link>

          <h1 className="head-text">Daily Patients</h1>
        </div>
        <div className="table-body">
          <div className="tab">
            <Card className="table-body h-full w-full overflow-scroll">
              <table className="w-full min-w-max table-auto text-left">
                <thead>
                  <tr>
                    <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal leading-none opacity-70"
                      >
                        Name
                      </Typography>
                    </th>

                    <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal leading-none opacity-70"
                      >
                        Payment
                      </Typography>
                    </th>
                    <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal leading-none opacity-70"
                      >
                        Day
                      </Typography>
                    </th>
                    <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal leading-none opacity-70"
                      >
                        Note
                      </Typography>
                    </th>
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
                  {currentItems.map((daily) => (
                    <tr key={daily.id} className="even:bg-blue-gray-50/50">
                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {daily.name}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {daily.payment}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                          style={{ direction: 'rtl' }}
                        >
                          {daily.day}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {daily.note}
                        </Typography>
                      </td>

                      <td>
                        <Button
                          variant="text"
                          size="sm"
                          className="font-medium"
                          onClick={() => handleDelete(daily.id)}
                        >
                          Delete
                        </Button>

                        <Link
                          to={`/dashboard/daily/edit/${daily.id}`}
                          state={{ data: daily }}
                        >
                          <Button
                            variant="text"
                            size="sm"
                            className="font-medium"
                          >
                            Edit
                          </Button>
                        </Link>
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
