import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validatePasswords = () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    } else if (password.length < 6) {
      setError("Password should be at least 6 characters long.");
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validatePasswords()) {
      setLoading(true);

      try {
        const response = await fetch("http://localhost:5000/api/auth/reset-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        });

        const data = await response.json();

        if (response.ok) {
          setMessage("Password reset successful! Redirecting to login...");
          setTimeout(() => navigate("/login"), 2000);
        } else {
          setError(data.msg || "Something went wrong. Please try again.");
        }
      } catch (error) {
        setError("Error: Unable to connect to the server. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="reset-password-container" style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="password">New Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm New Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="form-control"
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}
        {loading && <p>Loading...</p>}
        <button type="submit" className="btn btn-primary" style={{ marginTop: "10px" }} disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
