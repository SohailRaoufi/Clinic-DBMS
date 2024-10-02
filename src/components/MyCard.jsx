import { Card, CardBody, Typography } from "@material-tailwind/react";

export default function SimpleCard({ title, number }) {
  return (
    <div className="w-1/4">
      <Card className="mt-2 w-96">
        <CardBody>
          <Typography variant="h5" color="blue-gray" className="mb-2 mr-5">
            {title}
          </Typography>
          <Typography>{number}</Typography>
        </CardBody>
      </Card>
    </div>
  );
}
