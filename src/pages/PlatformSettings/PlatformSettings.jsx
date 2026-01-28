import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../Components/Breadcrumbs";
import { Pencil } from "lucide-react";
import Swal from "sweetalert2";
import CustomDropdown from "../../Components/CustomDropdown";
import defaultLogo from "../../assets/paxtracFavicon.svg";

const PlatformSettings = () => {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [logo, setLogo] = useState(defaultLogo);

  const [settings, setSettings] = useState({
    platformName: "My Platform",
    timezone: "asia_kolkata",
    language: "en",
    currency: "INR",
    commission: 10,
    sessionTimeout: 30,
    enable2FA: true,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" })); // Clear error on change
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!settings.platformName.trim()) {
      newErrors.platformName = "Platform name is required";
    }
    if (!settings.commission || settings.commission < 0) {
      newErrors.commission = "Commission must be a positive number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    Swal.fire({
      title: "Saved",
      text: "Platform settings updated successfully",
      icon: "success",
      confirmButtonColor: "#a99068",
    }).then(() => {
      navigate("/dashboard"); // Redirect to dashboard
    });
  };

  const handleCancel = () => {
    navigate(-1); // Go back
  };

  return (
    <main className="app-content body-bg">
      <section className="container">
        <div className="title-heading mb-2">Platform Settings</div>
        <p className="title-sub-heading">
          Customize branding, localization, payments, and security
        </p>

        <Breadcrumbs />

        {/* SINGLE CARD */}
        <div className="custom-card bg-white p-4 mt-3">
          {/* BRANDING */}
          {/* <h5 className="fw-semibold mb-4">Branding</h5> */}
          <div className="row align-items-center mb-4">
            <div className="col-md-12 text-start">
              <div className="position-relative w-max mb-3">
                <div
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "1px solid #a99068",
                  }}
                >
                  <img
                    src={logo}
                    alt="Platform Logo"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>

                <div
                  onClick={() => fileRef.current.click()}
                  style={{
                    position: "absolute",
                    bottom: 6,
                    right: 6,
                    background: "#a99068",
                    borderRadius: "50%",
                    padding: 6,
                    cursor: "pointer",
                    height: 30,
                    width: 30,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Pencil size={14} color="#fff" />
                </div>
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleLogoChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Platform Name</label>
              <input
                className="form-control "
                placeholder="Enter platform name"
                value={settings.platformName}
                onChange={(e) => handleChange("platformName", e.target.value)}
              />
              {errors.platformName && (
                <div className="text-danger">{errors.platformName}</div>
              )}
            </div>
          </div>

          {/* LOCALIZATION */}
          <div className="row mb-4">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Timezone</label>
              <CustomDropdown
                placeholder="Select timezone"
                value={settings.timezone}
                onChange={(val) => handleChange("timezone", val)}
                options={[
                  { label: "Asia / Kolkata", value: "asia_kolkata" },
                  { label: "UTC", value: "utc" },
                  { label: "Asia / Singapore", value: "asia_singapore" },
                ]}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Language</label>
              <CustomDropdown
                placeholder="Select language"
                value={settings.language}
                onChange={(val) => handleChange("language", val)}
                options={[
                  { label: "English", value: "en" },
                  { label: "Hindi", value: "hi" },
                  { label: "French", value: "fr" },
                ]}
              />
            </div>
          </div> 

          {/* ACTIONS */}
          <div className="d-flex gap-3 mt-4">
            <button className="button-secondary" onClick={handleCancel}>
              Cancel
            </button>
            <button className="primary-button" onClick={handleSave}>
              Save Changes
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PlatformSettings;
