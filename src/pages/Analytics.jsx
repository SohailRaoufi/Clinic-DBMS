import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Select,
  Option,
  Input,
  Button,
  Spinner,
} from "@material-tailwind/react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

import { get } from "../utils/ApiFetch";

const AnalyticsPage = () => {
  const [analyticsType, setAnalyticsType] = useState("day");
  const [data, setData] = useState("");
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setAnalyticsData(null);
    setData("");
  }, [analyticsType]);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await get(
        `/api/analytics/?type=${analyticsType}&data=${data}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.success) {
        throw new Error("Network response was not ok");
      }
      const result = await response.data;
      setAnalyticsData(result);
    } catch (err) {
      setError(err.message || "An error occurred");
    }
    setLoading(false);
  };

  const renderChart = () => {
    if (!analyticsData) return null;

    let labels, values;
    if (analyticsType === "day" && analyticsData.payments) {
      labels = analyticsData.payments.map((p) => p.name);
      values = analyticsData.payments.map((p) => p.payment);
    } else if (analyticsType === "month" && analyticsData.daily_payments) {
      console.log(analyticsData);
      labels = Object.keys(analyticsData.daily_payments);
      values = Object.values(analyticsData.daily_payments);
    } else if (analyticsType === "year" && analyticsData.monthly_payments) {
      labels = Object.keys(analyticsData.monthly_payments);
      values = Object.values(analyticsData.monthly_payments);
    } else {
      return null;
    }

    const chartData = {
      labels,
      datasets: [
        {
          label: "Payments",
          data: values,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
      ],
    };

    return <Bar data={chartData} />;
  };

  return (
    <div
      style={{ marginTop: "2rem" }}
      className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8"
    >
      <Card className="w-full max-w-4xl mx-auto">
        <CardBody className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Analytics Type"
              value={analyticsType}
              onChange={(value) => setAnalyticsType(value)}
            >
              <Option value="day">Day</Option>
              <Option value="month">Month</Option>
              <Option value="year">Year</Option>
            </Select>
            <Input
              type={
                analyticsType === "day"
                  ? "date"
                  : analyticsType === "month"
                  ? "month"
                  : "number"
              }
              label="Date"
              value={data}
              onChange={(e) => setData(e.target.value)}
            />
            <Button
              onClick={fetchAnalytics}
              disabled={loading}
              className="h-10"
            >
              {loading ? <Spinner /> : "Fetch Analytics"}
            </Button>
          </div>

          {error && <Typography color="red">{error}</Typography>}

          {analyticsData && (
            <div
              className="mt-4 h-48 sm:h-64"
              style={{ height: "50rem", width: "60rem" }}
            >
              <Typography variant="h6" color="blue-gray" className="mb-2">
                {analyticsType === "day"
                  ? `Analytics for ${analyticsData.date}`
                  : analyticsType === "month"
                  ? `Analytics for ${analyticsData.month}`
                  : `Analytics for ${analyticsData.year}`}
              </Typography>
              <Typography color="blue-gray" className="mb-4">
                Total Payment: Af {analyticsData.total.toFixed(2)}
              </Typography>
              <div className="h-64 sm:h-96">{renderChart()}</div>
              {analyticsType === "day" && analyticsData.payments && (
                <div className="mt-4">
                  <Typography variant="h6" color="blue-gray" className="mb-2">
                    Payment Details
                  </Typography>
                  <ul className="list-disc pl-5">
                    {analyticsData.payments.map((payment, index) => (
                      <li key={index}>
                        {payment.name}: Af {payment.payment.toFixed(2)} (
                        {payment.source})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
