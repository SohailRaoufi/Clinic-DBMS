import { NavbarSearch } from '../components/Navbar';
import { Button, Card, Typography } from '@material-tailwind/react';
import { PlusIcon } from '@heroicons/react/16/solid';
import { useState, useEffect } from 'react';

import { get } from '../utils/ApiFetch';

import '../assets/styles/patientPage.css';
import { Link } from 'react-router-dom';
import Mypagination from '../components/MyPagination';

export default function Patient() {
  const [patients, setPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [countP, setCountP] = useState(0);
  const [hasNext, setHasNext] = useState(null);
  const [hasPrev, setHasPrev] = useState(null);

  const [search, setSearch] = useState('');
  const [filteredPateint, setfilteredPatient] = useState([]);
  const currentItems = filteredPateint;

  // Calculate total pages
  const totalPages = Math.ceil(countP / 20);

  // Function to change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    const get_data = async () => {
      const response = await get('/api/patient/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.success) {
        console.log(response.data);
        console.log(response.status);
        return;
      }

      const data = response?.data;
      if (!data || !data.results) {
        console.log(`Unexpected data format: ${data}`);
        return;
      }

      setCountP(data.count);
      setHasNext(data.next);
      setHasPrev(data.previous);
      setPatients(data.results);
      setfilteredPatient(data.results);
    };

    get_data();
  }, []);

  const nextPage = async () => {
    const response = await get(hasNext, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.success) {
      console.log(response.data);
      console.log(response.status);
      return;
    }

    const data = response?.data;
    if (!data || !data.results) {
      console.log(`Unexpected data format: ${data}`);
      return;
    }
    setHasNext(data.next);
    setHasPrev(data.previous);
    setPatients(data.results);
  };

  const PrevPage = async () => {
    const response = await get(hasPrev, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.success) {
      console.log(response.data);
      console.log(response.status);
      return;
    }

    const data = response?.data;
    if (!data || !data.results) {
      console.log(`Unexpected data format: ${data}`);
      return;
    }
    setHasNext(data.next);
    setHasPrev(data.previous);
    setPatients(data.results);
  };

  useEffect(() => {
    if (search.trim() === '') {
      setfilteredPatient(patients);
    }
  }, [search, patients]);

  const searchPatient = async () => {
    if (search.trim() !== '') {
      const phoneRegex = /^\d+$/;
      let type = '';
      if (phoneRegex.test(search)) {
        type = 'number';
      } else {
        type = 'name';
      }

      const response = await get(
        `/api/patient/search/?type=${type}&data=${search}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (!response.success) {
        console.log(response.data);
        console.log(response.status);
        return;
      }

      const data = response?.data;
      if (!data || !data.results) {
        console.log(`Unexpected data format: ${data}`);
        return;
      }
      setCountP(data.count);
      setHasNext(data.next);
      setHasPrev(data.previous);
      setfilteredPatient(data.results);
    }
  };
  return (
    <div>
      <NavbarSearch
        name={'Patient'}
        search={search}
        setSearch={setSearch}
        searchPatient={searchPatient}
        btn={true}
      />
      <div className="flex-col table patient-table">
        <div className="table-head">
          <Link to="/dashboard/patients/add">
            <Button className="patient-btn">
              <PlusIcon style={{ height: '18px' }} />
              Add Patient
            </Button>
          </Link>
          <h1 className="head-text">All Patients</h1>
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
                        Age
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
                  {currentItems.map((patient) => (
                    <tr key={patient.id} className="even:bg-blue-gray-50/50">
                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {`${patient.name} ${patient.last_name}`}
                        </Typography>
                      </td>
                      <td>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {patient.age}
                        </Typography>
                      </td>
                      <td>
                        <Link
                          to={`/dashboard/patients/${patient.id}`}
                          state={{ id: patient.id }}
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
                hasNext={nextPage}
                hasPrev={PrevPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
