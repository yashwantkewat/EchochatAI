import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate hook

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Clear error and display loading state
    setError("");
    setMessage("");
    setLoading(true);

    try {
      // Send request to backend API
      const response = await fetch("http://localhost:5000/api/auth/forget-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("If the email exists, a password reset link has been sent to your email.");
        // After showing the success message, navigate to ResetPassword page
        setTimeout(() => {
          navigate("/reset-password"); // Navigate to ResetPassword component
        }, 2000);  // Optional: add a delay to let the message display for a while
      } else {
        setError(data.msg || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setError("Error: Could not connect to the server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forget-password-container min-h-screen  flex items-center justify-center" >
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-96" >
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800" >Forgot Password</h2>

        <div className="form-group">
          <label htmlFor="email">Enter your email address:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="form-control"
            required
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}
        {loading && <p>Loading...</p>}

        <button type="submit" className="btn btn-primary" style={{ marginTop: "10px" }} disabled={loading}>
          {loading ? "Sending..." : "Send reset link"}
        </button>
      </form>
    </div>
  );
};

export default ForgetPassword;
