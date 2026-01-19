import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import loginLleft from "../../assets/images/login-left.png";
import logo from "../../assets/makeithappen-blue.png";
import { useResetPasswordMutation } from "../../api/authApi";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [resetPassword] = useResetPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setError("Both fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await resetPassword({
        token,
        password: newPassword,
      }).unwrap();

      Swal.fire({
        icon: "success",
        title: "Password Updated",
        text: "Your password has been updated successfully.",
        confirmButtonText: "Go to Login",
      }).then(() => navigate("/"));
    } catch (err) {
      setError(err?.data?.message || "Password reset failed");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="login-card p-5 w-100" style={{ maxWidth: "420px" }}>
        {/* Left Image */}
        <div className="col-md-5 d-none p-0 dark-bg">
          <div className="login-left">
            <img src={loginLleft} alt="login" />
          </div>
        </div>
        <div className="text-center mb-4">
          <img src={logo} alt="Logo" className="logo-login w-max" />
          <p className="my-3 login-title">Reset Password</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label input-label">New Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label input-label">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-danger small mb-2">{error}</p>}

          <div className="text-center mt-3">
            <button type="submit" className="login-btn">
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
