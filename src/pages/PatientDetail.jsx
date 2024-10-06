import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import usePagination from "../components/usePagination";
import Mypagination from "../components/MyPagination";

import "../assets/styles/patientdetail.css";
import {
  Button,
  Card,
  Typography,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";

import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

import { get, del } from "../utils/ApiFetch";

export default function PatientDetail() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [logs, setLogs] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [data, setData] = useState([]);
  const [patient, setPatient] = useState({
    name: "",
    last_name: "",
    addr: "",
    job: "",
    age: 0,
    phone_no: "",
    gender: "",
    martial_status: "",
    HIV: null,
    HCV: null,
    HBS: null,
    pregnancy: null,
    diabetes: null,
    reflux: null,
    notes: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      const patientId = state.id;

      const response = await get(`/api/patient/${patientId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.success) {
        console.log(response.data);
        setError("Failed to fetch patient data");
        setLoading(false);
        return;
      }

      const data = await response.data;
      setTreatments(data.treatments);
      setLogs(data.logs);
      setData(data);
      const updatedData = Object.keys(data.data).reduce((acc, key) => {
        acc[key] =
          data.data[key] == null || data.data[key] == ""
            ? "N/A"
            : data.data[key];
        return acc;
      }, {});
      setPatient(updatedData);
      setLoading(false);
    };

    fetchPatientData();
  }, [state.id]);

  // Delete
  const handleDelete = async () => {
    const patientId = state.id;

    const response = await del(`/api/patient/${patientId}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!response.success) {
      return <div>{response.data}</div>;
    }
    navigate("/dashboard/patients");
  };
  // Pagination Part
  const {
    currentItems: logsItems,
    totalPages,
    currentPage,
    paginate,
  } = usePagination(logs);

  const {
    currentItems: treatmentItems,
    totalPages: totalPagesTreatment,
    currentPage: currentPageTreatment,
    paginate: paginateTreatment,
  } = usePagination(treatments);

  // Check if loading or error states
  if (loading) return <p>Loading patient data...</p>;
  if (error) return <p>{error}</p>;

  console.log(treatments);
  const Table_head_logs = ["Message"];
  const Table_head_treatment = [
    "Type of Treatment",
    "Amount",
    "Teeths",
    "Action",
  ];
  return (
    <div className="container mx-auto p-8">
      {/* Patient Details Section */}
      <div className="box1 bg-whit p-6 mb-12">
        <div className="flex items-center  gap-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Patient {state.id} Details
          </h2>
          <Link
            to={`/dashboard/patients/edit/${state.id}`}
            state={{ data: data }}
          >
            <PencilIcon style={{ height: "20px" }} />
          </Link>
          <Link onClick={handleDelete}>
            <TrashIcon style={{ height: "20px" }} />
          </Link>
        </div>

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
              {patient.HIV && <li>HIV</li>}
              {patient.HCV && <li>HCV</li>}
              {patient.HBS && <li>HBS</li>}
              {patient.pregnancy && <li>Pregnancy</li>}
              {patient.diabetes && <li>Diabetes</li>}
              {patient.reflux && <li>Reflux</li>}
              {!patient.HIV &&
                !patient.HCV &&
                !patient.HBS &&
                !patient.pregnancy &&
                !patient.diabetes &&
                !patient.reflux && <li>No major medical conditions</li>}
            </ul>
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
                          {Table_head_logs.filter((head) => head != "id").map(
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
                            (head) => head != "id"
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
                                {treat.teeths}
                              </Typography>
                            </td>
                            <td className="p-4">
                              <Button>Pay</Button>
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
                </div>
              </TabPanel>
            </TabsBody>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
