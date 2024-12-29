import { NavbarSearch } from '../components/Navbar';
import { Button, Card, Typography } from '@material-tailwind/react';
import { PlusIcon } from '@heroicons/react/16/solid';
import { useState, useEffect } from 'react';

import { get } from '../utils/ApiFetch';

import '../assets/styles/patientPage.css';
import { Link } from 'react-router-dom';
import Mypagination from '../components/MyPagination';

export default function Staff() {
  const [staff, setStaff] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [search, setSearch] = useState('');
  const [filteredStaff, setfilteredStaff] = useState([]);

  // Calculate the indexes for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStaff.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate total pages
  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);

  // Function to change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    const get_data = async () => {
      const response = await get('/api/staff/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.success) {
        return;
      }

      const data = response?.data;
      if (!data || !data.results) {
        return;
      }
      setStaff(data.results);
      setfilteredStaff(data.results);
    };

    get_data();
  }, []);
  useEffect(() => {
    if (search.trim() === '') {
      setfilteredStaff(staff);
    } else {
      const filterd = staff.filter((a) =>
        a.username.toLowerCase().includes(search.trim().toLowerCase())
      );

      setfilteredStaff(filterd);
    }
  }, [search, staff]);

  return (
    <div>
      <NavbarSearch name={'Staff'} search={search} setSearch={setSearch} />
      <div className="flex-col table patient-table">
        <div className="table-head">
          <Link to="/dashboard/staff/add">
            <Button className="patient-btn">
              <PlusIcon style={{ height: '18px' }} />
              Add Staff
            </Button>
          </Link>
          <h1 className="head-text">All Staff</h1>
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
                        Action
                      </Typography>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((staff) => (
                    <tr key={staff.id} className="even:bg-blue-gray-50/50">
                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {staff.username}
                        </Typography>
                      </td>

                      <td>
                        <Link
                          to={`/dashboard/staff/${staff.id}`}
                          state={{ id: staff.id }}
                        >
                          <Button
                            variant="text"
                            size="sm"
                            className="font-medium"
                          >
                            Detail
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
