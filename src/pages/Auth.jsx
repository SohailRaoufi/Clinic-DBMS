import { Typography, Input, Button } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/auth.css";
import { post } from "../utils/ApiFetch";

export default function Auth() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const loginUser = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const response = await post("/api/auth/", {
      body: {
        username: username,
        password: password,
      },
    });

    if (!response.success) {
      setError(response.data?.detail);
      setLoading(false);
      return;
    }
    if (response.data?.token) {
      localStorage.setItem("token", response.data.token); // Store JWT
      navigate("/dashboard"); // Redirect to home or dashboard after login
    }
    setLoading(false);
  };
  return (
    <div className="box">
      <div className="auth shadow-lg rounded-lg">
        <div className="header">
          <Typography variant="h3">Sign In</Typography>
          {error && <Typography color="red">{error}</Typography>}
        </div>
        <div className="body">
          <form onSubmit={loginUser} method="POST">
            <Typography>Username</Typography>
            <Input
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              name="username"
              label="username"
              required
            />
            <Typography>Password</Typography>
            <Input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              name="password"
              label="password"
              required
            />
            <Button type="submit">Sign In</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
