import { Typography, Button } from "@material-tailwind/react";
import { get } from "../utils/ApiFetch";
import { useState } from "react";

export default function Settings() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const handleBackup = async () => {
    setLoading(true);
    const response = await get(`/api/backup/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setLoading(false);
    console.log(response.data);
    if (!response.success) {
      setMsg(response.data.detail);
      return;
    }
    setMsg(response.data.detail);
  };
  return (
    <div className="p-5 h-screen">
      <Typography variant="h4">Settings</Typography>
      <div style={{ marginTop: "5rem" }}>
        <Typography className="flex gap-4 items-center">
          Back Up Data: <Button onClick={handleBackup}>Backup</Button>
        </Typography>
      </div>
      <div>
        {loading && <Typography variant="h5">Processing....</Typography>}
        {msg && <Typography>{msg}</Typography>}
      </div>
    </div>
  );
}
