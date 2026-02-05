import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logos.png";
import showToast from "../../utils/showToast";
import { Eye, EyeClosed } from "lucide-react";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = React.useState({
    newPassword: "",
    confirmPassword: "",
  });

  const validatePassword = (value) => {
    if (!value) return "Password is required";

    if (value.length < 8) {
      return "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(value)) {
      return "Password must include at least one uppercase letter";
    } else if (!/[a-z]/.test(value)) {
      return "Password must include at least one lowercase letter";
    } else if (!/\d/.test(value)) {
      return "Password must include at least one number";
    } else if (!/[!@#$%^&*(),.?\":{}|<>]/.test(value)) {
      return "Password must include at least one special character";
    }

    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newPasswordError = validatePassword(newPassword);
    const confirmPasswordError = !confirmPassword
      ? "Confirm password is required"
      : confirmPassword !== newPassword
        ? "Passwords do not match"
        : "";

    setErrors({
      newPassword: newPasswordError,
      confirmPassword: confirmPasswordError,
    });

    if (newPasswordError || confirmPasswordError) return;

    // Mock successful update
    showToast("Your password has been updated successfully.", "success");

    navigate("/");
  };

  const toggleNewPassword = () => {
    setShowNewPassword((prev) => !prev);
  };

  const toggleConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="login-card p-4 w-100" style={{ maxWidth: "420px" }}>
        <div className="text-center mb-4">
          <img src={logo} alt="Logo" className="logo-login w-max" />
          <p className="my-3 login-title">Reset Password</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <div className="position-relative pass-input">
              <label className="form-label input-label">New Password</label>
              <input
                type={showNewPassword ? "text" : "password"}
                className="form-control pe-5"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    newPassword: validatePassword(e.target.value),
                    confirmPassword:
                      confirmPassword && e.target.value !== confirmPassword
                        ? "Passwords do not match"
                        : "",
                  }));
                }}
              />

              <span onClick={toggleNewPassword}>
                {showNewPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
              </span>
            </div>

            {errors.newPassword && (
              <div className="text-danger">{errors.newPassword}</div>
            )}
          </div>

          <div className="mb-3">
            <div className="position-relative pass-input">
              <label className="form-label input-label">Confirm Password</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="form-control pe-5"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    confirmPassword: !e.target.value
                      ? "Confirm password is required"
                      : e.target.value !== newPassword
                        ? "Passwords do not match"
                        : "",
                  }));
                }}
              />

              <span onClick={toggleConfirmPassword}>
                {showConfirmPassword ? (
                  <Eye size={20} />
                ) : (
                  <EyeClosed size={20} />
                )}
              </span>
            </div>

            {errors.confirmPassword && (
              <div className="text-danger">{errors.confirmPassword}</div>
            )}
          </div>

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
