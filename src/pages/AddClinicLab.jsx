import { Typography, Input, Button, Checkbox } from '@material-tailwind/react';
import { useState, useEffect, useMemo } from 'react';
import { post, put } from '../utils/ApiFetch';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

import '../assets/styles/dental-lab.css';
import AddTreatmentModal from '../components/Treatment';

export default function AddClinicLab({ isEditing = false }) {
  const navigate = useNavigate();
  const { state } = useLocation();
  const data = useMemo(() => state?.data || {}, [state]);

  const [formData, setFormData] = useState({
    name: '',
    teeths: '',
    day: '',
    to: '',
    phone_no: '',
    is_called: false,
    is_done: false,
  });

  const [teethGraph, setTeethGraph] = useState({});
  const [open, setOpen] = useState(false);
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const toggleTeethModal = () => {
    setOpen(!open);
  };

  const selectTeeth = (teeth) => {
    const toothState = teeth.target.id;
    setTeethGraph((prevTeethGraph) => ({
      ...prevTeethGraph,
      [toothState]: !prevTeethGraph[toothState],
    }));
  };

  const getTeethFromGraph = () => {
    return Object.keys(teethGraph)
      .filter((key) => teethGraph[key])
      .join(',');
  };

  const handleTeethSelection = () => {
    const selectedTeeth = getTeethFromGraph();
    setFormData((prevFormData) => ({
      ...prevFormData,
      teeths: selectedTeeth,
    }));
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isEditing ? `/api/lab/${data.id}/` : '/api/lab/';
    const method = isEditing ? put : post;

    const response = await method(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });

    if (response.success) {
      navigate('/dashboard/dental-lab/');
    } else {
      setFormError(
        isEditing
          ? 'Failed to update Dental Lab!'
          : 'Failed to create Dental Lab!'
      );
    }
  };

  useEffect(() => {
    if (isEditing && data) {
      setFormData({
        name: data.name || '',
        teeths: data.teeths || '',
        day: data.day || '',
        to: data.to || '',
        phone_no: data.phone_no || '',
        is_called: data.is_called || false,
        is_done: data.is_done || false,
      });
    }
  }, [data, isEditing]);

  return (
    <div className="dental-lab">
      <div>
        <Typography className="p-5 text-center" variant="h4">
          {isEditing ? 'Edit Dental Lab' : 'Add Dental Lab'}
        </Typography>
        <div className="form-appointment shadow-lg rounded-lg">
          <form onSubmit={handleSubmit}>
            <Typography>Name</Typography>
            <Input
              size="sm"
              name="name"
              label="Name"
              color="teal"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
            />

            <Typography>Teeths</Typography>
            <Input
              size="sm"
              name="teeths"
              label="Teeths"
              color="teal"
              type="text"
              required
              value={formData.teeths}
              onChange={handleChange}
            />
            <Button
              variant="outlined"
              color="teal"
              onClick={toggleTeethModal}
              className="mt-2"
            >
              Select Teeth
            </Button>

            <Typography>Day</Typography>
            <Input
              size="sm"
              name="day"
              label="Day"
              color="teal"
              type="date"
              required
              value={formData.day}
              onChange={handleChange}
            />

            <Typography>To</Typography>
            <Input
              size="sm"
              name="to"
              label="To"
              color="teal"
              type="date"
              required
              value={formData.to}
              onChange={handleChange}
            />

            <Typography>Phone Number</Typography>
            <Input
              size="sm"
              name="phone_no"
              label="Phone Number"
              color="teal"
              type="text"
              value={formData.phone_no}
              onChange={handleChange}
            />

            <Typography>Called</Typography>
            <Checkbox
              name="is_called"
              color="teal"
              checked={formData.is_called}
              onChange={handleChange}
              label="Is Called?"
            />

            <Typography>Done</Typography>
            <Checkbox
              name="is_done"
              color="teal"
              checked={formData.is_done}
              onChange={handleChange}
              label="Is Done?"
            />

            <br />
            {formError && <Typography color="red">{formError}</Typography>}
            <Button type="submit" variant="h1">
              {isEditing ? 'Update' : 'Add'}
            </Button>
          </form>
        </div>

        {open && (
          <AddTreatmentModal
            open={open}
            handleOpen={toggleTeethModal}
            teethGraph={teethGraph}
            updateTeethGraph={setTeethGraph}
            selectTeeth={selectTeeth}
            handleAddTreatment={handleTeethSelection}
            newTreatment={formData}
            selectedOps={formData.teeths}
            showOperations={false}
          />
        )}
      </div>
    </div>
  );
}

AddClinicLab.propTypes = {
  isEditing: PropTypes.bool,
};
