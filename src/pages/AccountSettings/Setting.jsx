import React, { useRef, useState } from "react";
import { Eye, EyeClosed, Pencil } from "lucide-react";
import Breadcrumbs from "../../Components/Breadcrumbs";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import noProfile from "../../assets/images/noProfile.svg";
import { useUpdatePasswordMutation } from "../../api/authApi";

const AccoountSetting = () => {
  const navigate = useNavigate();
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();

  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const toggle = (key) => setShow((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => {
      const updated = { ...prev };

      if (name === "currentPassword") {
        if (!value) updated.currentPassword = "Current password is required";
        else delete updated.currentPassword;
      }

      if (name === "newPassword") {
        if (!value) updated.newPassword = "New password is required";
        else if (value.length < 8)
          updated.newPassword = "Password must be at least 8 characters";
        else if (!/[A-Z]/.test(value))
          updated.newPassword =
            "Password must include at least one uppercase letter";
        else if (!/[a-z]/.test(value))
          updated.newPassword =
            "Password must include at least one lowercase letter";
        else if (!/\d/.test(value))
          updated.newPassword = "Password must include at least one number";
        else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value))
          updated.newPassword =
            "Password must include at least one special character";
        else delete updated.newPassword;

        // Update confirm password live
        if (form.confirmPassword && form.confirmPassword !== value) {
          updated.confirmPassword = "Passwords do not match";
        } else {
          delete updated.confirmPassword;
        }
      }

      if (name === "confirmPassword") {
        if (!value) updated.confirmPassword = "Confirm password is required";
        else if (value !== form.newPassword)
          updated.confirmPassword = "Passwords do not match";
        else delete updated.confirmPassword;
      }

      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!form.currentPassword)
      newErrors.currentPassword = "Current password is required";

    if (!form.newPassword) newErrors.newPassword = "New password is required";
    else if (form.newPassword.length < 8)
      newErrors.newPassword = "Password must be at least 8 characters";
    else if (!/[A-Z]/.test(form.newPassword))
      newErrors.newPassword =
        "Password must include at least one uppercase letter";
    else if (!/[a-z]/.test(form.newPassword))
      newErrors.newPassword =
        "Password must include at least one lowercase letter";
    else if (!/\d/.test(form.newPassword))
      newErrors.newPassword = "Password must include at least one number";
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.newPassword))
      newErrors.newPassword =
        "Password must include at least one special character";

    if (!form.confirmPassword)
      newErrors.confirmPassword = "Confirm password is required";
    else if (form.confirmPassword !== form.newPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Call API
    try {
      const result = await updatePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      }).unwrap();

      if (result.status) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: result.message || "Password changed successfully",
          confirmButtonColor: "#a99068",
        }).then(() => {
          setForm({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
          setErrors({});
        });
      } else {
        Swal.fire(
          "Error",
          result.message || "Failed to update password",
          "error",
        );
      }
    } catch (err) {
      Swal.fire("Error", err?.data?.message || "Something went wrong", "error");
    }
  };

  return (
    <main className="app-content body-bg">
      <section className="container">
        <div className="title-heading mb-2">Account Settings</div>
        <p className="title-sub-heading">Change your admin password</p>

        <Breadcrumbs />
        <div className="custom-card bg-white p-4">
          <form onSubmit={handleSubmit}>
            <div className="row ">
              <div className="mb-3 col-md-6">
                <div className="position-relative pass-input">
                  <label className="form-label input-label">
                    Current Password
                  </label>
                  <input
                    type={show.current ? "text" : "password"}
                    className="form-control pe-5"
                    name="currentPassword"
                    placeholder="Enter current password"
                    value={form.currentPassword}
                    onChange={handleChange}
                  />
                  <span onClick={() => toggle("current")}>
                    {show.current ? <Eye size={20} /> : <EyeClosed size={20} />}
                  </span>
                </div>
                {errors.currentPassword && (
                  <div className="text-danger">{errors.currentPassword}</div>
                )}
              </div>

              {/* New Password */}
              <div className="mb-3 col-md-6">
                <div className="position-relative pass-input">
                  <label className="form-label input-label">New Password</label>
                  <input
                    type={show.new ? "text" : "password"}
                    className="form-control pe-5"
                    name="newPassword"
                    placeholder="Enter new password"
                    value={form.newPassword}
                    onChange={handleChange}
                  />
                  <span onClick={() => toggle("new")}>
                    {show.new ? <Eye size={20} /> : <EyeClosed size={20} />}
                  </span>
                </div>
                {errors.newPassword && (
                  <div className="text-danger">{errors.newPassword}</div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="mb-3 col-md-6">
                <div className="position-relative pass-input">
                  <label className="form-label input-label">
                    Confirm New Password
                  </label>
                  <input
                    type={show.confirm ? "text" : "password"}
                    className="form-control pe-5"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                  />
                  <span onClick={() => toggle("confirm")}>
                    {show.confirm ? <Eye size={20} /> : <EyeClosed size={20} />}
                  </span>
                </div>
                {errors.confirmPassword && (
                  <div className="text-danger">{errors.confirmPassword}</div>
                )}
              </div>

              {/* Action */}
              <div className="mt-2">
                <button
                  type="submit"
                  className="primary-button"
                  isabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
};

export default AccoountSetting;
