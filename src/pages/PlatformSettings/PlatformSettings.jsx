import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../Components/Breadcrumbs";
import CustomDropdown from "../../Components/CustomDropdown";
import Swal from "sweetalert2";

const PlatformSettings = () => {
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    platformName: "Paxtrac",
    timezone: "asia_kolkata",
    language: "en",
    preRegistrationAmount: 250,
    promoCode: "",
    backgroundCheckAmount: 0,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" })); // Clear error on change
  };

  const validate = () => {
    const newErrors = {};

    if (!settings.platformName.trim()) {
      newErrors.platformName = "Platform name is required";
    }

    if (
      settings.preRegistrationAmount === "" ||
      settings.preRegistrationAmount < 0
    ) {
      newErrors.preRegistrationAmount =
        "Pre-registration amount must be 0 or more";
    }

    if (settings.promoCode && settings.promoCode.length > 20) {
      newErrors.promoCode = "Promo code must be 20 characters or less";
    }

    if (
      settings.backgroundCheckAmount === "" ||
      settings.backgroundCheckAmount < 0
    ) {
      newErrors.backgroundCheckAmount =
        "Background check amount must be 0 or more";
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

        <div className="custom-card bg-white p-4 mt-3">
          {/* PLATFORM SETTINGS */}
          <div className="row">
            <div className="col-md-6 mb-4">
              <label className="form-label fw-semibold">Platform Name</label>
              <input
                className="form-control"
                placeholder="Enter platform name"
                value={settings.platformName}
                onChange={(e) => handleChange("platformName", e.target.value)}
                readOnly
                disabled
              />
              {errors.platformName && (
                <div className="text-danger">{errors.platformName}</div>
              )}
            </div>

            <div className="col-md-6 mb-4">
              <label className="form-label fw-semibold">
                Pre-registration Amount
              </label>
              <input
                type="number"
                min="0"
                className="form-control"
                placeholder="Enter pre-registration amount (USD)"
                value={settings.preRegistrationAmount}
                onChange={(e) =>
                  handleChange("preRegistrationAmount", Number(e.target.value))
                }
              />
              {errors.preRegistrationAmount && (
                <div className="text-danger">
                  {errors.preRegistrationAmount}
                </div>
              )}
            </div>

            <div className="col-md-6 mb-4">
              <label className="form-label fw-semibold">Promo Code</label>
              <input
                className="form-control"
                placeholder="Enter promo code (optional)"
                value={settings.promoCode}
                onChange={(e) =>
                  handleChange("promoCode", e.target.value.toUpperCase())
                }
              />
              {errors.promoCode && (
                <div className="text-danger">{errors.promoCode}</div>
              )}
            </div>

            <div className="col-md-6 mb-4">
              <label className="form-label fw-semibold">
                Background Check Amount
              </label>
              <input
                type="number"
                min="0"
                className="form-control"
                placeholder="Enter background check amount (USD)"
                value={settings.backgroundCheckAmount}
                onChange={(e) =>
                  handleChange("backgroundCheckAmount", Number(e.target.value))
                }
              />
              {errors.backgroundCheckAmount && (
                <div className="text-danger">
                  {errors.backgroundCheckAmount}
                </div>
              )}
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
