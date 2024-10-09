import { Typography, Button } from "@material-tailwind/react";

export default function Settings() {
  return (
    <div className="p-5 h-screen">
      <Typography variant="h4">Settings</Typography>
      <div style={{ marginTop: "5rem" }}>
        <Typography className="flex gap-4 items-center">
          Back Up Data: <Button>Backup</Button>
        </Typography>
      </div>
    </div>
  );
}
