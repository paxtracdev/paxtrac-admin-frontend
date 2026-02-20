import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../Components/Breadcrumbs";
import CustomDropdown from "../../Components/CustomDropdown";
import Swal from "sweetalert2";
import { useGetSettingsQuery, useSettingsMutation } from "../../api/userApi";
import { LoadingComponent } from "../../Components/LoadingComponent";
import NoData from "../../Components/NoData";

const PlatformSettings = () => {
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    platformName: "Paxtrac",
    preRegistrationAmount: 0,
    backgroundCheckAmount: 0,
  });

  const [errors, setErrors] = useState({});
  const [setting, { isLoading }] = useSettingsMutation();
  const { data, isLoading: isFetching } = useGetSettingsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" })); // Clear error on change
  };

  useEffect(() => {
    if (data?.data) {
      setSettings((prev) => ({
        ...prev,
        preRegistrationAmount: data.data.preregistration ?? 0,
        backgroundCheckAmount: data.data.backgroundcheck ?? 0,
      }));
    }
  }, [data]);

  const validate = () => {
    const newErrors = {};

    if (
      settings.preRegistrationAmount === "" ||
      settings.preRegistrationAmount < 0
    ) {
      newErrors.preRegistrationAmount =
        "Pre-registration amount must be 0 or more";
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

  const handleSave = async () => {
    if (!validate()) return;

    await setting({
      preregistration: settings.preRegistrationAmount,
      backgroundcheck: settings.backgroundCheckAmount,
    }).unwrap();

    Swal.fire({
      title: "Saved",
      text: "Platform settings updated successfully",
      icon: "success",
      confirmButtonColor: "#a99068",
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
          {isFetching ? (
            <LoadingComponent isLoading fullScreen />
          ) : !data?.data ? (
            <NoData text="No details found" />
          ) : (
            <>
              {/* PLATFORM SETTINGS */}
              <div className="row">
                <div className="col-md-6 mb-4">
                  <label className="form-label fw-semibold">
                    Platform Name
                  </label>
                  <input
                    className="form-control"
                    placeholder="Enter platform name"
                    value={settings.platformName}
                    onChange={(e) =>
                      handleChange("platformName", e.target.value)
                    }
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
                      handleChange(
                        "preRegistrationAmount",
                        Number(e.target.value),
                      )
                    }
                  />
                  {errors.preRegistrationAmount && (
                    <div className="text-danger">
                      {errors.preRegistrationAmount}
                    </div>
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
                      handleChange(
                        "backgroundCheckAmount",
                        Number(e.target.value),
                      )
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
                <button
                  className="primary-button"
                  onClick={handleSave}
                  disabled={isLoading || isFetching}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default PlatformSettings;
