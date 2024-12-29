import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import usePagination from '../components/usePagination';
import Mypagination from '../components/MyPagination';
import AddTreatmentModal from '../components/Treatment';
import json from '../utils/DataObjects.json';

import Share from '../components/Share';

import '../assets/styles/patientdetail.css';
import {
  Button,
  Card,
  Typography,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from '@material-tailwind/react';

import { PencilIcon, TrashIcon, ShareIcon } from '@heroicons/react/24/outline';

import { get, del, put, post } from '../utils/ApiFetch';

export default function PatientDetail() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [logs, setLogs] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [data, setData] = useState([]);
  const [patient, setPatient] = useState({
    name: '',
    last_name: '',
    addr: '',
    job: '',
    age: 0,
    phone_no: '',
    gender: '',
    xray: '',
    martial_status: '',
    hiv: false,
    hcv: false,
    hbs: false,
    pregnancy: false,
    diabetes: false,
    reflux_esophagitis: false,
    notes: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState('');

  const [newTreatment, setNewTreatment] = useState({
    type_of_treatment: '',
    teeths: '',
    amount: '0',
    paid: '0',
  });
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(!open);

  const [selectedOps, setSelectedOps] = useState([]);

  const teethStateGraph = json.TeethStateGraph;
  //  the state of the teeth graph
  const [teethGraph, updateTeethGraph] = useState(teethStateGraph);

  // Share Modal
  const [openShare, setOpenShare] = useState(false);
  const handleOpenShare = () => setOpenShare(!openShare);

  useEffect(() => {
    const fetchPatientData = async () => {
      const patientId = state.id;

      const response = await get(`/api/patient/${patientId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.success) {
        setError('Failed to fetch patient data');
        setLoading(false);
        return;
      }

      const data = await response.data;
      setTreatments(data.treatments);
      setLogs(data.logs);
      setData(data);
      // const updatedData = Object.keys(data.data).reduce((acc, key) => {
      //   acc[key] =
      //     data.data[key] == null || data.data[key] == ""
      //       ? "N/A"
      //       : data.data[key];
      //   return acc;
      // }, {});

      setPatient(data.data);
      setLoading(false);
    };

    fetchPatientData();
  }, [state?.id]);

  // Delete
  const handleDelete = async () => {
    const patientId = state.id;

    const response = await del(`/api/patient/${patientId}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.success) {
      return <div>{response.data}</div>;
    }
    navigate('/dashboard/patients');
  };
  // Pagination Part
  const {
    currentItems: logsItems,
    totalPages,
    currentPage,
    paginate,
  } = usePagination(logs);

  const {
    // eslint-disable-next-line no-unused-vars
    currentItems: treatmentItems,
    totalPages: totalPagesTreatment,
    currentPage: currentPageTreatment,
    paginate: paginateTreatment,
  } = usePagination(treatments);

  // Check if loading or error states
  if (loading) return <p>Loading patient data...</p>;
  if (error) return <p>{error}</p>;

  const Table_head_logs = ['Message'];
  const Table_head_treatment = [
    'Type of Treatment',
    'Amount',
    'Remaining Amount',
    'Teeths',
    'Action',
  ];

  // Hanlde Treatment Update:
  const selectTeeth = (teeth) => {
    // taking the id of the target tooth
    let toothState = teeth.target.id;
    // setting the state of the tooth to it's opposite
    updateTeethGraph({ ...teethGraph, [toothState]: !teethGraph[toothState] });
    // setNewTreatment((item) => )
  };

  const handleOpen = (treatment = null) => {
    if (treatment) {
      // Populate modal with selected treatment data
      setNewTreatment(treatment);
      setSelectedOps([treatment.type_of_treatment]);
      updateTeethGraph((prevTeethGraph) => {
        const updatedGraph = { ...prevTeethGraph };
        const selectedTeeths = treatment.teeths.split(',').filter(Boolean);
        selectedTeeths.forEach((toothId) => {
          updatedGraph[toothId] = true;
        });
        return updatedGraph;
      });
    }
    setOpen(!open); // Open the modal
  };
  const get_teeths_from_graph = (teeths) => {
    return Object.keys(teeths)
      .filter((key) => teeths[key] === true)
      .join(',');
  };
  const handleAddTreatment = () => {
    const new_treatment = {
      ...newTreatment,
      teeths: get_teeths_from_graph(teethGraph),
      type_of_treatment: selectedOps[0],
    };

    if (
      new_treatment.amount === '0' ||
      Math.sign(new_treatment.amount) == -1 ||
      new_treatment.name === ''
    ) {
      setFormError(
        'Please Ensure you have Choosen the Treatement and added the Correct Amount!'
      );
    } else {
      setFormError('');

      handleUpdate(new_treatment);
      const updatedTreatments = treatments.map((val) => {
        if (val.id === new_treatment.id) {
          if (!new_treatment.paid) {
            new_treatment.paid = '0';
          }
          if (!(parseFloat(new_treatment.paid) > parseFloat(new_treatment.real_amount))){
              const newAmount = new_treatment.real_amount - new_treatment.paid;
              new_treatment.real_amount = newAmount;
          }else{
              alert("Invalid Amount ");
          }
          setFormError('');
          return new_treatment;
        }
        return val;
      });
      setTreatments(updatedTreatments);

      setOpen(false);
    }
  };

  const handleUpdate = async (new_treatment) => {
    if (parseFloat(new_treatment.paid) > parseFloat(new_treatment.real_amount)){
      return;
    }
    const newResponse = await put(`/api/treatment/${new_treatment.id}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: new_treatment,
    });

    if (!newResponse.success) {
      return;
    }

    if (new_treatment.paid != '' && new_treatment.paid != '0') {
      const PayResponse = await post(
        `/api/treatment/${new_treatment.id}/pay/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: { paid: new_treatment.paid },
        }
      );

      if (!PayResponse.success) {
        setFormError(PayResponse.data['wrong amount']);
        setOpen(true);

        return;
      }
      setFormError('');
    }
  };

  return (
    <div className="container mx-auto p-8">
      {/* Patient Details Section */}
      <div className="box1 bg-whit p-6 mb-12">
        <div className="flex items-center  gap-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Patient {state?.id} Details
          </h2>
          <Link
            to={`/dashboard/patients/edit/${state?.id}`}
            state={{ data: data }}
          >
            <PencilIcon style={{ height: '20px' }} />
          </Link>
          <Link onClick={handleDelete}>
            <TrashIcon style={{ height: '20px' }} />
          </Link>

          <ShareIcon
            className="cursor-pointer"
            onClick={handleOpenShare}
            style={{ height: '20px' }}
          />
        </div>

        {openShare && (
          <Share handleOpen={handleOpenShare} open={openShare} id={state?.id} />
        )}

        <div className="pateint-grid gap-x-8 gap-y-6">
          {/* Name */}
          <div>
            <p className="text-sm text-gray-500">First Name</p>
            <p className="text-lg font-medium text-gray-900">{patient.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Last Name</p>
            <p className="text-lg font-medium text-gray-900">
              {patient.last_name}
            </p>
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">Address</p>
            <p className="text-lg font-medium text-gray-900">{patient.addr}</p>
          </div>

          {/* Job */}
          <div>
            <p className="text-sm text-gray-500">Job</p>
            <p className="text-lg font-medium text-gray-900">{patient.job}</p>
          </div>

          {/* Age */}
          <div>
            <p className="text-sm text-gray-500">Age</p>
            <p className="text-lg font-medium text-gray-900">{patient.age}</p>
          </div>

          {/* Phone */}
          <div>
            <p className="text-sm text-gray-500">Phone Number</p>
            <p className="text-lg font-medium text-gray-900">
              {patient.phone_no}
            </p>
          </div>

          {/* Gender */}
          <div>
            <p className="text-sm text-gray-500">Gender</p>
            <p className="text-lg font-medium text-gray-900">
              {patient.gender}
            </p>
          </div>

          {/* Martial Status */}
          <div>
            <p className="text-sm text-gray-500">Marital Status</p>
            <p className="text-lg font-medium text-gray-900">
              {patient.martial_status}
            </p>
          </div>

          {/* Medical Conditions */}
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">Medical Conditions</p>
            <ul className="list-disc pl-5 mt-1 text-lg text-gray-900">
              {patient.hiv && <li>HIV</li>}
              {patient.hcv && <li>HCV</li>}
              {patient.hbs && <li>HBS</li>}
              {patient.pregnancy && <li>Pregnancy</li>}
              {patient.diabetes && <li>Diabetes</li>}
              {patient.reflux_esophagitis && <li>Reflux</li>}
              {!patient.hiv &&
                !patient.hcv &&
                !patient.hbs &&
                !patient.pregnancy &&
                !patient.diabetes &&
                !patient.reflux_esophagitis && (
                  <li>No major medical conditions</li>
                )}
            </ul>
          </div>
          {/* X-Ray */}
          <div>
            <p className="text-sm text-gray-500">X-Ray</p>
            <p className="text-lg font-medium text-gray-900">{patient.xray}</p>
          </div>

          {/* Notes */}
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">Notes</p>
            <p className="text-lg font-medium text-gray-900">{patient.notes}</p>
          </div>
        </div>

        <div className="tab">
          <Tabs value="logs">
            <TabsHeader>
              <Tab key="logs" value="logs">
                Logs
              </Tab>
              <Tab key="treatment" value="treatment">
                Treatment
              </Tab>
            </TabsHeader>
            <TabsBody>
              <TabPanel key="logs" value="logs">
                <div className="tab">
                  <Card className="table-body h-full w-full overflow-scroll">
                    <table className="w-full min-w-max table-auto text-left">
                      <thead>
                        <tr>
                          {Table_head_logs.filter((head) => head != 'id').map(
                            (head) => (
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
                            )
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {logsItems.map((log, index) => (
                          <tr
                            key={index + 1}
                            className="even:bg-blue-gray-50/50"
                          >
                            <td className="p-4">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {log.msg}
                              </Typography>
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
              </TabPanel>
              <TabPanel key="treatment" value="treatment">
                <div className="tab">
                  <Card className="table-body h-full w-full overflow-scroll">
                    <table className="w-full min-w-max table-auto text-left">
                      <thead>
                        <tr>
                          {Table_head_treatment.filter(
                            (head) => head != 'id'
                          ).map((head) => (
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
                        </tr>
                      </thead>
                      <tbody>
                        {treatments.map((treat, index) => (
                          <tr
                            key={index + 1}
                            className="even:bg-blue-gray-50/50"
                          >
                            <td className="p-4">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {treat.type_of_treatment}
                              </Typography>
                            </td>
                            <td className="p-4">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {treat.amount}
                              </Typography>
                            </td>
                            <td className="p-4">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {treat.real_amount}
                              </Typography>
                            </td>
                            <td className="p-4">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {treat.teeths}
                              </Typography>
                            </td>
                            <td className="p-4">
                              <Button onClick={() => handleOpen(treat)}>
                                Edit
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Card>
                  <div className="table-pag">
                    <Mypagination
                      totalPages={totalPagesTreatment}
                      currentPage={currentPageTreatment}
                      paginate={paginateTreatment}
                    />
                  </div>
                  <AddTreatmentModal
                    mode={'edit'}
                    open={open}
                    handleOpen={handleClose}
                    newTreatment={newTreatment}
                    setNewTreatment={setNewTreatment}
                    selectedOps={selectedOps}
                    setSelectedOps={setSelectedOps}
                    teethGraph={teethGraph}
                    updateTeethGraph={updateTeethGraph}
                    selectTeeth={selectTeeth}
                    handleAddTreatment={handleAddTreatment}
                    error={formError}
                  />
                </div>
              </TabPanel>
            </TabsBody>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
