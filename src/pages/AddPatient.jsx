import {
  Button,
  Typography,
  Card,
  Input,
  Checkbox,
  Option,
  Select,
  Dialog,
  Textarea,
  IconButton,
  DialogBody,
  DialogHeader,
  DialogFooter,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

import { useState } from "react";

import OperationOptionsTable from "../components/Chart";
import ToothChart from "../components/ToothChart";
import json from "../utils/DataObjects.json";

import "../assets/styles/addpatient.css";
export default function AddPatient() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);

  const [treatments, setTreatments] = useState([]);
  const [newTreatment, setNewTreatment] = useState({
    name: "",
    teeths: "",
    amount: "0",
    amount_paid: "0",
  });

  const [selectedOps, setSelectedOps] = useState([]);

  const teethStateGraph = json.TeethStateGraph;
  //  the state of the teeth graph
  const [teethGraph, updateTeethGraph] = useState(teethStateGraph);

  const selectTeeth = (teeth) => {
    // taking the id of the target tooth
    let toothState = teeth.target.id;
    // setting the state of the tooth to it's opposite
    updateTeethGraph({ ...teethGraph, [toothState]: !teethGraph[toothState] });
    // setNewTreatment((item) => )
  };

  const get_teeths_from_graph = (teeths) => {
    return Object.keys(teeths)
      .filter((key) => teeths[key] === true)
      .join(",");
  };
  const handleAddTreatment = () => {
    const new_treatment = {
      ...newTreatment,
      teeths: get_teeths_from_graph(teethGraph),
      name: selectedOps[0],
    };

    setTreatments([...treatments, new_treatment]);
    setNewTreatment({ name: "", teeths: "", amount: "0", amount_paid: "0" });
    setSelectedOps([]);
    updateTeethGraph(teethStateGraph);
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    console.error(name);
    console.error(value);
    console.error(type);
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? value : value,
    });
  };

  const [formData, setFormData] = useState({
    name: "",
    last_name: "",
    addr: "",
    job: "",
    age: 0,
    phone_no: "",
    gender: "",
    martial_status: "",
    HIV: false,
    HCV: false,
    HBS: false,
    pregnancy: false,
    diabetes: false,
    reflux: false,
    notes: "",
  });

  const text_fields = ["name", "last_name", "address", "job", "phone"];
  const checkbox_fields = [
    "hiv",
    "hcv",
    "hbs",
    "pregnancy",
    "diabaetes",
    "reflux",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const treats = {};
    treatments.forEach((a, index) => {
      treats[index] = a; // Assign each treatment to the `treats` object with the index as key
    });
    const response_data = {
      ...formData,
      treatments: {
        ...treats,
      },
    };
    const response = await post("/api/patient/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: response_data,
    });

    if (!response.success) {
      console.log(response_data);
      return;
    }

    navigate("/home");
  };

  return (
    <div className="h-screen">
      <div className="h-10 p-5">
        <Typography variant="h4" color="blue-gray">
          Add Patient
        </Typography>
      </div>
      <div className="form">
        <div className="form-body">
          <div className="form-content">
            <form
              onSubmit={handleSubmit}
              className=" mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
            >
              <div className="form-body grid-cols-2">
                {text_fields.map((field) => (
                  <div key={field}>
                    <Typography>
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </Typography>
                    <Input
                      color="teal"
                      type="text"
                      label={field}
                      name={field}
                      key={field}
                      required
                    />
                  </div>
                ))}

                <div>
                  <Typography>Age</Typography>
                  <Input
                    color="teal"
                    type="number"
                    min="0"
                    max="100"
                    required
                  />
                </div>
                <div>
                  <Typography>Gender</Typography>
                  <select
                    name="gender"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <Typography>Marital Status</Typography>
                  <select
                    name="martial_status"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                  </select>
                </div>

                {checkbox_fields.map((field) => (
                  <div>
                    <Checkbox label={field.toUpperCase()} />
                  </div>
                ))}

                <div className="column-span-2">
                  <Typography>Notes</Typography>
                  <textarea
                    placeholder="Notes"
                    name="observation"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div className="column-span-2">
                  <Button type="submit">Submit</Button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="form-add-treatment text-center pt-5">
          <Typography
            variant="h5"
            color="blue-gray"
            style={{ marginBottom: "1rem" }}
          >
            Treatments
          </Typography>
          <Button onClick={handleOpen}>Add Treatment</Button>

          <div>
            {treatments.length > 0 ? (
              treatments.map((treatment, index) => (
                <li key={index} className="mb-2 p-2 bg-white rounded shadow">
                  <p>
                    <strong>Name:</strong> {treatment.name}
                  </p>
                  <p>
                    <strong>Amount:</strong> {treatment.amount}
                  </p>
                </li>
              ))
            ) : (
              <p style={{ marginTop: "10rem" }}>No Treatments!</p>
            )}
          </div>

          <Dialog
            size="md"
            open={open}
            handler={handleOpen}
            className="dialog p-4"
          >
            <DialogHeader className="relative m-0 block">
              <IconButton
                size="sm"
                variant="text"
                className="xicon !absolute right-3.5 top-3.5"
                onClick={handleOpen}
              >
                <XMarkIcon className="h-4 w-4 stroke-2" />
              </IconButton>
              <Typography variant="h4" color="blue-gray">
                Add Treatment
              </Typography>
            </DialogHeader>
            <DialogBody className="space-y-4 pb-6">
              <div className="flex">
                <div className="grow xlmax-w-lg">
                  <OperationOptionsTable
                    chartStyle={{
                      head: "!mx-2 ",
                    }}
                    disabled={false}
                    selectedOps={selectedOps}
                    setSelectedOps={setSelectedOps}
                  />
                </div>
                <span className="border-r border-gray-400 h-64 lg:hidden" />
                {/* Tooth chart SVG */}
                <div className="lg:bg-slate-800 lg:rounded xl:max-w-sm ">
                  <h1 className="text-white p-2 font-semibold text-center capitalize">
                    Hightlight the Teeth needing treatment{" "}
                  </h1>
                  <ToothChart
                    teethStyle={"md:!w-56 lg:!w-64 "}
                    teethIsSelected={teethGraph}
                    selectTeethFunction={selectTeeth}
                  />
                </div>
              </div>

              <div className="mt-4 mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Total Amount
                </label>
                <input
                  type="number"
                  name="treatmentDosage"
                  value={newTreatment.amount}
                  onChange={(e) =>
                    setNewTreatment({
                      ...newTreatment,
                      amount: e.target.value,
                    })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <label className="block text-sm font-medium text-gray-700">
                  Amount Paid
                </label>
                <input
                  type="number"
                  name="treatmentDosage"
                  value={newTreatment.amount_paid}
                  onChange={(e) =>
                    setNewTreatment({
                      ...newTreatment,
                      amount_paid: e.target.value,
                    })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </DialogBody>
            <DialogFooter>
              <Button className="ml-auto" onClick={handleAddTreatment}>
                Save
              </Button>
            </DialogFooter>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
