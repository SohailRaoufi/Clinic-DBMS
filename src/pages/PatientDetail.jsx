import { useState } from "react";
import { useLocation } from "react-router-dom";

import "../assets/styles/patientdetail.css";
import { Button } from "@material-tailwind/react";
import { PlusIcon } from "@heroicons/react/24/outline";
export default function PatientDetail() {
  let { state } = useLocation();
  console.log(state);

  const [patient] = useState({
    name: "John",
    last_name: "Doe",
    addr: "123 Main St, City, Country",
    job: "Software Engineer",
    age: 35,
    phone_no: "+1234567890",
    gender: "Male",
    martial_status: "Married",
    HIV: true,
    HCV: true,
    HBS: false,
    pregnancy: false,
    diabetes: true,
    reflux: false,
    notes: "No special notes.",
  });

  const [appointments] = useState([
    { date: "2024-10-10", time: "10:00 AM", reason: "Routine Checkup" },
    { date: "2024-10-15", time: "02:00 PM", reason: "Follow-up" },
  ]);

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
      </div>
    </div>
  );
}
