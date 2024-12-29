import { Button, Typography, Input, Checkbox } from '@material-tailwind/react';
import { TrashIcon } from '@heroicons/react/24/outline';

import { useState, useEffect, useMemo } from 'react';
import { post, put } from '../utils/ApiFetch';
import { useNavigate, useLocation } from 'react-router-dom';

import json from '../utils/DataObjects.json';
import AddTreatmentModal from '../components/Treatment';

import PropTypes from 'prop-types';

import '../assets/styles/addpatient.css';
export default function AddPatient({ isEditing = false }) {
  const location = useLocation();
  const data = useMemo(() => location.state?.data || {}, [location.state]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState(null);

  const navigate = useNavigate();

  const handleOpen = () => setOpen(!open);
  const [oldTreatments] = useState(data.treatments || []);
  const [treatments, setTreatments] = useState([]);
  const [newTreatment, setNewTreatment] = useState({
    type_of_treatment: '',
    teeths: '',
    amount: '0',
    amount_paid: '0',
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
      setError(
        'Please Ensure you have Choosen the Treatement and added the Correct Amount!'
      );
    } else {
      setError('');
      setTreatments([...treatments, new_treatment]);
      setNewTreatment({
        type_of_treatment: '',
        teeths: '',
        amount: '0',
        amount_paid: '0',
      });
      setSelectedOps([]);
      updateTeethGraph(teethStateGraph);
      setOpen(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const [formData, setFormData] = useState({
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

  const text_fields = ['name', 'last_name', 'addr', 'job', 'phone_no'];
  const checkbox_fields = [
    'hiv',
    'hcv',
    'hbs',
    'pregnancy',
    'diabetes',
    'reflux_esophagitis',
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
    if (isEditing) {
      const response = await put(`/api/patient/${data.data.id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: response_data,
      });
      if (!response.success) {
        setFormError(response.data);

        return;
      }
      if (treatments.length > 0) {
        const treat_response_data = {
          treatments: {
            ...treatments,
          },
        };
        const newResponse = await post(
          `/api/patient/${data.data.id}/treatments/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: treat_response_data,
          }
        );

        if (!newResponse.success) {
          setFormError(newResponse.data);

          return;
        }
      }
    } else {
      const response = await post('/api/patient/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: response_data,
      });
      if (!response.success) {
        setFormError(response.data);

        return;
      }
    }

    navigate('/dashboard/patients');
  };

  // Detele Treatment
  const handleDeteleTreatment = (index) => {
    setTreatments((prev) => prev.filter((_, i) => i != index));
  };

  useEffect(() => {
    if (isEditing) {
      setFormData(data.data);
    }
  }, [isEditing, data]);

  return (
    <div className="h-screen">
      <div className="h-10 p-5">
        <Typography variant="h4" color="blue-gray">
          {isEditing ? 'Edit Patient' : 'Add Patient'}
        </Typography>
        {formError && (
          <Typography color="red">
            {Object.keys(formError).map((key) => {
              return formError[key];
            })}
          </Typography>
        )}
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
                      onChange={handleChange}
                      color="teal"
                      type="text"
                      label={field}
                      name={field}
                      key={field}
                      value={formData[field]}
                      required
                    />
                  </div>
                ))}

                <div>
                  <Typography>Age</Typography>
                  <Input
                    onChange={handleChange}
                    name="age"
                    color="teal"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.age}
                    required
                  />
                </div>
                <div>
                  <Typography>X-Ray</Typography>
                  <Input
                    onChange={handleChange}
                    name="xray"
                    color="teal"
                    type="text"
                    value={formData.xray}
                    required
                  />
                </div>
                <div>
                  <Typography>Gender</Typography>
                  <select
                    onChange={handleChange}
                    name="gender"
                    value={formData.gender}
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
                    onChange={handleChange}
                    value={formData.martial_status}
                    name="martial_status"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                  </select>
                </div>
                <div></div>

                {checkbox_fields.map((field, index) => (
                  <div key={index + 1}>
                    <Checkbox
                      onChange={handleChange}
                      label={field.toUpperCase()}
                      name={field}
                      checked={formData[field]}
                    />
                  </div>
                ))}

                <div className="column-span-2">
                  <Typography>Notes</Typography>
                  <textarea
                    onChange={handleChange}
                    placeholder="Notes"
                    value={formData.notes}
                    name="notes"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div className="column-span-2">
                  <Button type="submit">
                    {isEditing ? 'Update' : 'Submit'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="form-add-treatment text-center pt-5">
          <Typography
            variant="h5"
            color="blue-gray"
            style={{ marginBottom: '1rem' }}
          >
            Treatments
          </Typography>
          <Button onClick={handleOpen}>Add Treatment</Button>

          <div>
            {oldTreatments.length > 0 && (
              <Typography>Old Treatments</Typography>
            )}
            {oldTreatments.length > 0 &&
              oldTreatments.map((treatment, index) => (
                <li key={index} className="mb-2 p-2 bg-white rounded shadow">
                  <p>
                    <strong>Name:</strong> {treatment.type_of_treatment}
                  </p>
                  <p>
                    <strong>Amount:</strong> {treatment.amount}
                  </p>
                </li>
              ))}
          </div>

          <div>
            {treatments.length > 0 && <Typography>New Treatments</Typography>}
            {treatments.length > 0 ? (
              treatments.map((treatment, index) => (
                <li key={index} className="mb-2 p-2 bg-white rounded shadow">
                  <p>
                    <strong>Name:</strong> {treatment.type_of_treatment}
                  </p>
                  <p>
                    <strong>Amount:</strong> {treatment.amount}
                  </p>
                  <p>
                    <TrashIcon
                      className=" cursor-pointer"
                      onClick={() => handleDeteleTreatment(index)}
                      style={{ height: '20px' }}
                    />
                  </p>
                </li>
              ))
            ) : (
              <p style={{ marginTop: '10rem' }}>No New Treatments!</p>
            )}
          </div>

          <AddTreatmentModal
            open={open}
            handleOpen={handleOpen}
            newTreatment={newTreatment}
            setNewTreatment={setNewTreatment}
            selectedOps={selectedOps}
            setSelectedOps={setSelectedOps}
            teethGraph={teethGraph}
            updateTeethGraph={updateTeethGraph}
            selectTeeth={selectTeeth}
            handleAddTreatment={handleAddTreatment}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}

AddPatient.propTypes = {
  isEditing: PropTypes.bool,
};
