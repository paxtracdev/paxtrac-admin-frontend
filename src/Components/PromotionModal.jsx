import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import businessImg1 from "../assets/images/businessImg1.png";
import folderOpen from "../assets/images/sidebar/folderOpen.png";
import CustomMultiSelect from "./CustomMultiSelect";
import CustomDropdown from "./CustomDropdown";
import { useCreatePromotionMutation } from "../Api/promotionApi";
import { useServicesQuery } from "../Api/serviceApi";
import Swal from "sweetalert2";

const initialForm = {
  title: "",
  service: "",
  banner: null,
  description: "",
  month: "",
  amount: "",
  agree: false,
};

export default function PromotionModal({ show, onClose }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [createPromotion] = useCreatePromotionMutation();
  const { data: servicesData, isLoading: servicesLoading } = useServicesQuery();
  const [errors, setErrors] = useState({});

  const handleCheckbox = (e) => {
    setForm((prev) => ({ ...prev, agree: e.target.checked }));
    setErrors((prev) => ({ ...prev, agree: "" }));
  };

  const serviceOptions =
    servicesData?.data?.map((s) => ({
      label: s.title?.en,
      value: s._id,
    })) || [];

  const validate = () => {
    let temp = {};

    if (!form.title?.trim()) temp.title = "Promotion title is required";

    if (!form.service || form.service.length === 0)
      temp.service = "Select at least one service";

    if (!form.discountType) temp.discountType = "Discount type is required";

    if (!form.discountValue) temp.discountValue = "Discount value is required";
    else if (isNaN(form.discountValue))
      temp.discountValue = "Enter a valid number";
    else if (form.discountValue <= 0)
      temp.discountValue = "Discount value must be greater than 0";

    if (!form.amount || isNaN(form.amount))
      temp.amount = "Bidding amount must be a number";
    else if (form.amount <= 0)
      temp.amount = "Bidding amount must be greater than 0";

    if (!form.agree) temp.agree = "Please accept the agreement";

    if (!form.month) temp.startDate = "Start date is required";
    if (!form.endDate) temp.endDate = "End date is required";

    if (form.month && form.endDate) {
      if (new Date(form.endDate) <= new Date(form.month))
        temp.endDate = "End date must be after start date";
    }

    if (!form.banner) temp.banner = "Banner image is required";

    setErrors(temp);

    return Object.keys(temp).length === 0; // no errors → valid
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];

      // File size limit check (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          banner: "File size must be less than 5 MB",
        }));
        return;
      }

      setErrors((prev) => ({ ...prev, banner: "" })); // clear old errors

      setForm({
        ...form,
        [name]: file,
      });
      return;
    }

    // For all other text/number inputs
    setForm({
      ...form,
      [name]: value,
    });
  };

  const next = () => {
    // STEP 1 VALIDATION
    if (step === 1) {
      const temp = {};

      if (!form.title?.trim()) temp.title = "Promotion title is required";
      if (!form.service || form.service.length === 0)
        temp.service = "Select at least one service";
      if (!form.discountType) temp.discountType = "Discount type is required";
      if (!form.discountValue)
        temp.discountValue = "Discount value is required";
      if (!form.banner) temp.banner = "Banner image is required";
      if (!form.description?.trim()) {
        temp.description = "Description is required";
      } else {
        const wordCount = form.description.trim().split(/\s+/).length;
        if (wordCount > 35) {
          temp.description = "Description must not exceed 35 words";
        }
      }
      if (!form.endDate) temp.endDate = "End date is required";

      setErrors(temp);

      if (Object.keys(temp).length > 0) return; // STOP MOVING FORWARD
    }

    // STEP 2 VALIDATION
    if (step === 2) {
      const temp = {};

      if (!form.amount || isNaN(form.amount) || form.amount <= 0)
        temp.amount = "Enter a valid bid amount";

      setErrors(temp);

      if (Object.keys(temp).length > 0) return; // STOP MOVING FORWARD
    }

    setStep(step + 1);
  };

  const back = () => setStep(step - 1);

  const handleSubmit = async () => {
    if (!validate()) {
      console.log("Validation failed", errors);
      return;
    }

    const fd = new FormData();

    fd.append("promotionTitle", form.title);
    fd.append("selectedServices", JSON.stringify(form.service)); // ARRAY OF IDs

    fd.append("discountType", form.discountType);
    fd.append("discountValue", form.discountValue); // remove later if not used

    fd.append("description", form.description);

    fd.append("startDate", new Date(form.month).toISOString());
    fd.append("endDate", new Date(form.endDate).toISOString());

    fd.append("file", form.banner); // banner image
    fd.append("biddingPrice", form.amount);

    try {
      const res = await createPromotion(fd).unwrap();
      console.log("Created Successfully:", res);
      Swal.fire({
        icon: "success",
        title: "Promotion Created Successfully!",
        text: "Your promotion bid has been submitted.",
        timer: 2000,
        showConfirmButton: false,
      });

      onClose();
      setForm(initialForm);
      setStep(1);
    } catch (error) {
      console.error("Create Banner Error:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to Create Promotion",
        text: error?.data?.message || "Something went wrong!",
      });
    }
  };

  // Auto calculate 1st day of next month
  const nextMonthStart = new Date();
  nextMonthStart.setMonth(nextMonthStart.getMonth() + 1);
  nextMonthStart.setDate(1);

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return "";

    const date = new Date(dateStr);

    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    if (show) {
      setForm((prev) => ({
        ...prev,
        month: nextMonthStart.toISOString().split("T")[0], // yyyy-mm-dd
      }));
    }
  }, [show]);

  const getServiceNames = () => {
    if (!form.service || form.service.length === 0) return "-";
    if (!serviceOptions.length) return "-";

    return form.service
      .map((id) => serviceOptions.find((s) => s.value === id)?.label)
      .filter(Boolean)
      .join(", ");
  };

  const capitalizeWords = (str = "") =>
    str
      .toLowerCase()
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  return (
    <Modal show={show} onHide={onClose} size="md" centered>
      <Modal.Body className="px-4">
        <div className="">
          <div className="promotion-modal-title">
            Create Promotion Bid – <span>Step {step} of 3</span>
          </div>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="promo-step">
            <p className="promotion-modal-desc">
              Submit your bid for a featured banner promotion spot
            </p>

            <div>
              <label className="form-label input-label">
                Promotion Title *
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter promotion title"
                name="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              {errors.title && <p className="text-danger">{errors.title}</p>}
            </div>

            <div>
              <label className="form-label input-label mt-3">
                Select Service *
              </label>
              <CustomMultiSelect
                options={serviceOptions}
                placeholder="Select Service"
                isLoading={servicesLoading}
                value={form.service || []}
                onChange={(vals) => setForm({ ...form, service: vals })}
              />
              {errors.service && (
                <p className="text-danger">{errors.service}</p>
              )}
            </div>

            <div className="row align-items-end">
              <div className="col-md-6">
                <label className="form-label input-label mt-3">
                  Discount Type*
                </label>
                <CustomDropdown
                  options={[
                    { label: "Percentage", value: "percentage" },
                    { label: "Fixed", value: "fixed" },
                  ]}
                  placeholder="Discount Type"
                  name="discountType"
                  value={form.discountType}
                  onChange={(val) => setForm({ ...form, discountType: val })}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label input-label    ">
                  Discount Value
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="discountValue"
                  placeholder="Enter Discount Value"
                  value={form.discountValue}
                  onChange={(e) =>
                    setForm({ ...form, discountValue: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="form-label input-label mt-3">
                Upload Banner (Recommended 1080x400) *
              </label>

              <div
                className="promo-upload-box"
                onClick={() => document.getElementById("bannerUpload").click()}
              >
                <img src={folderOpen} alt="upload" className="upload-icon" />
                <span className="upload-text ellipsis-text">
                  {form.banner ? form.banner.name : "Choose File to Upload"}
                </span>
              </div>

              <input
                type="file"
                id="bannerUpload"
                accept="image/*"
                name="banner"
                onChange={handleChange}
                style={{ display: "none" }}
              />
              {errors.banner && <p className="text-danger">{errors.banner}</p>}
            </div>

            <div>
              <div className="d-flex align-items-center justify-content-between">
                <label className="form-label input-label mt-3">
                  Short Description*
                </label>
                <p className="after-input mb-0 mt-2">35 Word</p>
              </div>
              <textarea
                className="form-control"
                name="description"
                value={form.description}
                placeholder="Describe your promotion in 35 words or less"
                rows={3}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
              {errors.description && (
                <p className="text-danger">{errors.description}</p>
              )}
            </div>

            <div className="row">
              <div className="col-md-6">
                <label className="form-label input-label mt-3">
                  Start Date
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={formatDisplayDate(form.month)}
                  disabled
                />
              </div>

              <div className="col-md-6">
                <label className="form-label input-label mt-3">
                  End Date *
                </label>
                <input
                  type="date"
                  className="form-control"
                  name="endDate"
                  min={form.month || ""}
                  max={
                    form.month
                      ? (() => {
                          const d = new Date(form.month);
                          const last = new Date(
                            d.getFullYear(),
                            d.getMonth() + 1,
                            0
                          );
                          return last.toISOString().split("T")[0];
                        })()
                      : ""
                  }
                  value={form.endDate || ""}
                  onChange={handleChange}
                />
                {errors.endDate && (
                  <p className="text-danger">{errors.endDate}</p>
                )}
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <button className="main-secondary-btn" onClick={onClose}>
                Cancel
              </button>
              <button className="modal-primary-btn" onClick={next}>
                Next
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div>
            <p className="promotion-modal-desc">
              Submit your bid for a featured banner promotion spot
            </p>

            <label className="form-label input-label    ">
              Bid Amount ($) *
            </label>
            <input
              type="number"
              className="form-control"
              name="amount"
              placeholder="Enter Bid Amount"
              value={form.amount}
              onChange={handleChange}
            />
            {errors.amount && <p className="text-danger">{errors.amount}</p>}
            <p className="after-input mt-2">
              Higher bids increase your chance of selection
            </p>

            <div className="promo-payment-info">
              <p>
                If not selected the full amount with be refunded automatically
                to your account with 3-5 business day
              </p>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <button className="main-secondary-btn" onClick={back}>
                Back
              </button>
              <button className="modal-primary-btn w-max" onClick={next}>
                Review & Submit
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 - REVIEW */}
        {step === 3 && (
          <div>
            <p className="promotion-modal-desc">
              Submit your bid for a featured banner promotion spot
            </p>

            <div className="promo-review-card">
              <h5 className="mb-3">Promotion Preview</h5>
              {/* Row 1 – Title + Bid Amount */}
              <div className="row mb-3 g-3">
                <div className="col-12 col-md-6">
                  <p className="promo-preview-label">Title*</p>
                  <div className="profile-name">
                    {form.title ? capitalizeWords(form.title) : "-"}
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <p className="promo-preview-label">Bid Amount*</p>
                  <div className="profile-name">${form.amount || "0"}</div>
                </div>
              </div>

              {/* Row 2 – Month + Service */}
              <div className="row mb-3 g-3">
                <div className="col-12 col-md-6">
                  <p className="promo-preview-label">Month*</p>
                  <div className="profile-name">
                    {form.month
                      ? new Date(form.month).toLocaleString("en-US", {
                          month: "short",
                          year: "numeric",
                        })
                      : "-"}
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <p className="promo-preview-label">Services*</p>
                  <div className="profile-name">{getServiceNames()}</div>
                </div>
              </div>

              {/* Description */}
              <div className="row mb-3">
                <div className="col-12">
                  <p className="promo-preview-label">Description*</p>
                  <div className="profile-name text-wrap">
                    {form.description || "-"}
                  </div>
                </div>
              </div>

              {/* Banner Preview */}
              <div className="banner-preview">
                <div className="banner-preview">
                  {form.banner ? (
                    <img
                      src={URL.createObjectURL(form.banner)}
                      alt="Banner Preview"
                      className=""
                    />
                  ) : (
                    <img src={businessImg1} alt="Banner Preview" className="" />
                  )}
                </div>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="form-check mt-3">
              <input
                type="checkbox"
                className="form-check-input"
                id="agree"
                checked={form.agree}
                onChange={handleCheckbox}
              />
              <label className="text-desc-common" htmlFor="agree">
                I understand this bid does not guarantee selection.
              </label>
              {errors.agree && <p className="text-danger">{errors.agree}</p>}
            </div>

            {/* Buttons */}
            <div className="d-flex justify-content-end gap-2 mt-4">
              <button className="main-secondary-btn" onClick={back}>
                Back
              </button>
              <button
                className="modal-primary-btn w-max"
                onClick={handleSubmit}
              >
                Review & Submit
              </button>
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}
