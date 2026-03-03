import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "../../Components/Breadcrumbs";
import Swal from "sweetalert2";
import { Editor } from "@tinymce/tinymce-react";
import { usePlanQuery, useUpdatePlanMutation } from "../../api/userApi";
import { useForm, Controller } from "react-hook-form";
import { LoadingComponent } from "../../Components/LoadingComponent";

const getEmbedUrl = (url) => {
  if (!url) return "";

  // youtu.be/VIDEO_ID
  if (url.includes("youtu.be/")) {
    return `https://www.youtube.com/embed/${url.split("youtu.be/")[1].split("?")[0]}`;
  }

  // youtube.com/watch?v=VIDEO_ID
  if (url.includes("watch?v=")) {
    return `https://www.youtube.com/embed/${url.split("watch?v=")[1].split("&")[0]}`;
  }

  // Already embed
  if (url.includes("/embed/")) {
    return url;
  }

  return "";
};
const Detail = ({ label, value }) => (
  <div className="col-md-6 mb-3">
    <label className="form-label fw-semibold">{label}</label>
    <input type="text" className="form-control bg-light" value={value || ""} />
  </div>
);
const ViewPlan = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const embedUrl = getEmbedUrl(videoUrl);
  const [titleError, setTitleError] = useState("");
  const [videoError, setVideoError] = useState("");
  const [content, setContent] = useState("");

  const {
    data: plan,
    error,
    isLoading,
  } = usePlanQuery({ id, includeDetails: true });
  const [updatePlan ,{}] = useUpdatePlanMutation();
  const [planFeatures, setPlanFeatures] = useState([]);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    getValues,
  } = useForm();
  useEffect(() => {
    setValue("planName", plan?.data.planName || "");
    setValue("annuallyPrice", plan?.data.prices?.annually || "");
    setValue("onePrice", plan?.data.prices?.oneTime || "");
    setValue("included", plan?.data.includedProperties || "");
    setValue("backgroundChecks", plan?.data.backgroundChecks || "");
    setValue("saveannually", plan?.data.saveannually || "");
    if (plan?.data?.features) {
      setPlanFeatures(plan.data.features);
    }
  }, [plan, navigate]);

  const handleSave = () => {
    let hasError = false;

    setTitleError("");
    setVideoError("");

    if (!title.trim()) {
      setTitleError("Title is required");
      hasError = true;
    }

    if (!getEmbedUrl(videoUrl)) {
      setVideoError("Please enter a valid YouTube link");
      hasError = true;
    }

    if (hasError) return;

    Swal.fire({
      title: "Success",
      text: "Vlog updated successfully",
      icon: "success",
      confirmButtonColor: "#a99068",
    }).then(() => navigate("/plans"));
  };
  const handleApproveConfirm = async () => {
    const values = getValues();

    try {
      await updatePlan({
        id,
        planName: values.planName,
        features: planFeatures,
        prices: {
          annually: values.annuallyPrice,
          oneTime: values.onePrice,
        },
        includedProperties: values.included,
        backgroundChecks: values.backgroundChecks,
        saveannually: values.saveannually,
      }).unwrap();

      Swal.fire({
        title: "Success",
        text: "Plan updated successfully",
        icon: "success",
        confirmButtonColor: "#a99068",
      });
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err?.data?.message,
        icon: "error",
        confirmButtonColor: "#a99068",
      });
    }
  };
  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <main className="app-content body-bg">
      <section className="container">
        <div className="title-heading mb-3">Edit Plan</div>
        <Breadcrumbs />
        <div className="custom-card bg-white p-4 mt-3 position-relative ">
          <h2 className="title text-black mb-4">Plan Details</h2>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Plan Name</label>
              <input
                type="text"
                className="form-control bg-light"
                {...register("planName", { required: "Plan name is required" })}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Annually Prices</label>
              <input
                type="text"
                className="form-control bg-light"
                {...register("annuallyPrice")}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">One Time Prices</label>
              <input
                type="text"
                className="form-control bg-light"
                {...register("onePrice")}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">
                Included Properties
              </label>
              <input
                type="text"
                className="form-control bg-light"
                {...register("included")}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">
                Background Checks
              </label>
              <input
                type="text"
                className="form-control bg-light"
                {...register("backgroundChecks")}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Save Annually</label>
              <input
                type="text"
                className="form-control bg-light"
                {...register("saveannually")}
              />
            </div>

            {planFeatures.map((feature, index) => (
              <div key={index} className="d-flex mb-2 gap-2">
                <input
                  type="text"
                  className="form-control"
                  value={feature}
                  onChange={(e) => {
                    const updated = [...planFeatures];
                    updated[index] = e.target.value;
                    setPlanFeatures(updated);
                  }}
                  placeholder={`Feature ${index + 1}`}
                />
                <button
                  className="btn-secondary "
                  onClick={() =>
                    setPlanFeatures(planFeatures.filter((_, i) => i !== index))
                  }
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              type="button"
              className="col-2 mb-3 btn-secondary mt-2 ms-3"
              onClick={() => setPlanFeatures([...planFeatures, ""])}
            >
              Add Feature
            </button>

            {/* Documents preview */}

            {/* Videos Preview */}
          </div>
          <div className="d-flex justify-content-center gap-3 mt-4">
            <button className="button-secondary" onClick={() => navigate(-1)}>
              Back
            </button>
            <button className="primary-button" onClick={handleApproveConfirm}>
              Save
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ViewPlan;
