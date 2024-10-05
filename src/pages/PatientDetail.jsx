import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

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
import { PlusIcon } from "@heroicons/react/24/outline";

import data from "../components/test/LogsData";
import Table from "../components/Table";

import { get } from "../utils/ApiFetch";

export default function PatientDetail() {
  const { state } = useLocation();

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
  }); // Initialize as null for loading state
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  // useEffect hook to fetch patient data from the server
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        // Assuming you get a patient ID from the state or params
        const patientId = state?.patient.id || "default-id"; // Replace with actual logic for fetching ID

        // Fetch data from the server using the native fetch API
        const response = await get(`/api/patient/${patientId}`, {
          Headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json(); // Parse the JSON response
        setPatient(data); // Update the patient state with the fetched data
        setLoading(false); // Set loading to false after the data is fetched
      } catch (err) {
        console.error("Failed to fetch patient data:", err);
        setError("Failed to fetch patient data");
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [state?.patientId]); // Depend on patientId or any necessary state

  // Check if loading or error states
  if (loading) return <p>Loading patient data...</p>;
  if (error) return <p>{error}</p>;

  // Table head is derived from patient data once it's available
  const Table_head = patient ? Object.keys(patient) : [];
  return (
    <div className="container mx-auto p-8">
      {/* Patient Details Section */}
      <div className="box1 bg-whit p-6 mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Patient {state.patient.id} Details
        </h2>

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
              <Tab key="payment" value="payment">
                Payment
              </Tab>
            </TabsHeader>
            <TabsBody>
              <TabPanel key="logs" value="logs">
                <Table Table_head={Table_head} data={data} action={false} />
              </TabPanel>
              <TabPanel key="treatment" value="treatment">
                <Table Table_head={Table_head} data={data} action={false} />
              </TabPanel>
              <TabPanel key="payment" value="payment">
                <Card className="mt-10 h-full w-full overflow-scroll">
                  <table className="w-full min-w-max table-auto">
                    <thead>
                      <tr>
                        <th>Treatment</th>
                        <th>Amount</th>
                        <th>Reminaing</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody className=" text-center">
                      <tr>
                        <td>Extraction</td>
                        <td>2000</td>
                        <td>2000</td>
                        <td className="p-4">
                          <Link
                            to={`/dashboard/patient/${state.patient.id}/pay`}
                          >
                            <Button>Pay</Button>
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <td>Extraction</td>
                        <td>2000</td>
                        <td>2000</td>
                        <td className="p-4">
                          <Link
                            to={`/dashboard/patient/${state.patient.id}/pay`}
                          >
                            <Button>Pay</Button>
                          </Link>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Card>
              </TabPanel>
            </TabsBody>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
