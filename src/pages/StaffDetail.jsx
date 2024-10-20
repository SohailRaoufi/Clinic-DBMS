import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

import { get, del } from "../utils/ApiFetch";
import { Typography } from "@material-tailwind/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function StaffDetail() {
  const { state } = useLocation();
  const [staff, setStaff] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getStaffDetail = async () => {
      const response = await get(`/api/staff/${state.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.success) {
        console.error(response.data);
        return;
      }

      setStaff(response.data);
    };

    getStaffDetail();
  }, [state?.id]);

  const handleDelete = async () => {
    const staffId = state.id;
    const response = await del(`/api/staff/${staffId}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.success) {
      console.error(response.data);
      return;
    }
    navigate("/dashboard/staff");
  };

  return (
    <div className="p-5">
      <Typography variant="h2" className="flex gap-4 items-center">
        Staff {state?.id} Detail
        <Link to={`/dashboard/staff/edit/${state?.id}`} state={{ data: staff }}>
          <PencilIcon style={{ height: "22px" }} />
        </Link>
        <Link onClick={handleDelete}>
          <TrashIcon style={{ height: "22px" }} />
        </Link>
      </Typography>
      <div>
        <Typography variant="h4">Name</Typography>
        <Typography>{staff.username}</Typography>
      </div>
      <div>
        <Typography variant="h4">Email</Typography>
        <Typography>{staff.email}</Typography>
      </div>
    </div>
  );
}
