import React, { useRef, useState } from "react";
import { Eye, EyeClosed, Pencil } from "lucide-react";
import Breadcrumbs from "../../Components/Breadcrumbs";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import noProfile from "../../assets/images/noProfile.svg";

const AccoountSetting = () => {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [avatar, setAvatar] = useState(noProfile);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

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

      // Current password required
      if (name === "currentPassword") {
        if (!value) updated.currentPassword = "Current password is required";
        else delete updated.currentPassword;
      }

      // New password validations
      if (name === "newPassword") {
        if (!value) {
          updated.newPassword = "New password is required";
        } else if (value.length < 8) {
          updated.newPassword = "Password must be at least 8 characters";
        } else if (!/[A-Z]/.test(value)) {
          updated.newPassword =
            "Password must include at least one uppercase letter";
        } else if (!/[a-z]/.test(value)) {
          updated.newPassword =
            "Password must include at least one lowercase letter";
        } else if (!/\d/.test(value)) {
          updated.newPassword = "Password must include at least one number";
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
          updated.newPassword =
            "Password must include at least one special character";
        } else {
          delete updated.newPassword;
        }

        // Also update confirmPassword error live if confirmPassword exists
        if (form.confirmPassword && form.confirmPassword !== value) {
          updated.confirmPassword = "Passwords do not match";
        } else {
          delete updated.confirmPassword;
        }
      }

      // Confirm password validations
      if (name === "confirmPassword") {
        if (!value) {
          updated.confirmPassword = "Confirm password is required";
        } else if (value !== form.newPassword) {
          updated.confirmPassword = "Passwords do not match";
        } else {
          delete updated.confirmPassword;
        }
      }

      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (isEditingPassword) {
      if (!form.currentPassword)
        newErrors.currentPassword = "Current password is required";

      // Reuse new password validations (same rules)
      if (!form.newPassword) {
        newErrors.newPassword = "New password is required";
      } else if (form.newPassword.length < 8) {
        newErrors.newPassword = "Password must be at least 8 characters";
      } else if (!/[A-Z]/.test(form.newPassword)) {
        newErrors.newPassword =
          "Password must include at least one uppercase letter";
      } else if (!/[a-z]/.test(form.newPassword)) {
        newErrors.newPassword =
          "Password must include at least one lowercase letter";
      } else if (!/\d/.test(form.newPassword)) {
        newErrors.newPassword = "Password must include at least one number";
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.newPassword)) {
        newErrors.newPassword =
          "Password must include at least one special character";
      }

      if (!form.confirmPassword) {
        newErrors.confirmPassword = "Confirm password is required";
      } else if (form.confirmPassword !== form.newPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    // If all validations pass
    console.log("Change Password Payload:", form);

    Swal.fire({
      icon: "success",
      title: "Success",
      text: "Changes saved successfully!",
      confirmButtonColor: "#a99068",
    }).then(() => {
      navigate("/dashboard");
      if (isEditingPassword) {
        setIsEditingPassword(false);
        setForm((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
        setErrors({});
      }
    });
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
              {/* Current Password */}
              <div className="mb-3">
                <div className="image-wrapper">
                  <img src={avatar} alt="User Avatar" className="blog-image" />

                  {/* Edit Button */}
                  <div
                    className="image-action edit-icon"
                    onClick={() => fileRef.current.click()}
                  >
                    <Pencil size={16} />
                  </div>
                </div>

                <input
                  ref={fileRef}
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) setAvatar(URL.createObjectURL(file));
                  }}
                />
              </div>

              <div className="d-flex justify-content-between align-items-center ">
                <h5 className="mb-0">Change Password</h5>
                <button
                  type="button"
                  className="login-btn"
                  style={{ opacity: isEditingPassword ? 0.5 : 1 }}
                  disabled={isEditingPassword}
                  onClick={() => {
                    Swal.fire({
                      icon: "success",
                      title: "Edit Password",
                      text: "You can now change your password.",
                      confirmButtonColor: "#a99068",
                    });

                    setIsEditingPassword(true);
                  }}
                >
                  Edit Password
                </button>
              </div>

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
                    disabled={!isEditingPassword}
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
                    disabled={!isEditingPassword}
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
                    disabled={!isEditingPassword}
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
                <button type="submit" className="primary-button">
                  Save Changes
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
