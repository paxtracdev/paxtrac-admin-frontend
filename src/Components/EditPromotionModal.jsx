import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import businessImg1 from "../assets/images/businessImg1.png";
import folderOpen from "../assets/images/sidebar/folderOpen.png";
import CustomMultiSelect from "./CustomMultiSelect";
import CustomDropdown from "./CustomDropdown";
import { useServicesQuery } from "../Api/serviceApi";
import {
  useGetPromotionByIdQuery,
  useUpdatePromotionMutation,
} from "../Api/promotionApi";
import Swal from "sweetalert2";
import { LoadingComponent } from "./LoadingComponent";

const emptyForm = {
  title: "",
  service: [], // array of selected service IDs
  banner: null, // File when replaced
  bannerPreviewUrl: "", // local preview or existing url
  description: "",
  month: "", // start date (yyyy-mm-dd)
  endDate: "",
  amount: "",
  discountType: "",
  discountValue: "",
  agree: false,
};

export default function EditPromotionModal({ show, onClose, promotionId }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const { data: servicesData, isLoading: servicesLoading } = useServicesQuery();
  const { data: promoData, isLoading: promoLoading } = useGetPromotionByIdQuery(
    promotionId,
    { skip: !promotionId || !show }
  );
  const [updatePromotion, { isLoading: updating }] =
    useUpdatePromotionMutation();

  const serviceOptions =
    servicesData?.data?.map((s) => ({ label: s.title?.en, value: s._id })) || [];

  // Helper: format yyyy-mm-dd for inputs
  const toIsoDate = (d) => {
    if (!d) return "";
    const date = new Date(d);
    if (Number.isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  };

  const handleCheckbox = (e) => {
    setForm((prev) => ({ ...prev, agree: e.target.checked }));
    setErrors((prev) => ({ ...prev, agree: "" }));
  };

  const capitalizeWords = (str = "") =>
  str
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");


  // Prefill form when promotion data loads
  useEffect(() => {
    if (promoData?.data && show) {
      const p = promoData.data;
      setForm({
        title: capitalizeWords(p.promotionTitle || ""),
        service: (p.selectedServices || []).map((s) => s._id || s._id), // ensure IDs
        banner: null, // keep null until user replaces; existing displayed via bannerPreviewUrl
        bannerPreviewUrl: p.bannerImage?.url || "",
        bannerFileName: p.bannerImage?.fileName || "",
        description: p.description || "",
        month: toIsoDate(p.startDate), // yyyy-mm-dd
        endDate: toIsoDate(p.endDate),
        amount: p.biddingPrice ?? "",
        discountType: p.discountType || "",
        discountValue: p.discountValue ?? "",
      });
      setErrors({});
      setStep(1);
    }

    if (!show) {
      // on modal hide, clear states
      setForm(emptyForm);
      setErrors({});
      setStep(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [promoData, show, promotionId]);

  // Validations (used for full submit)
  const validateAll = () => {
    const temp = {};
    if (!form.title?.trim()) temp.title = "Promotion title is required";
    if (!form.service || form.service.length === 0)
      temp.service = "Select at least one service";
    if (!form.discountType) temp.discountType = "Discount type is required";
    if (!form.discountValue && form.discountValue !== 0)
      temp.discountValue = "Discount value is required";
    else if (isNaN(form.discountValue))
      temp.discountValue = "Enter a valid number";
    else if (Number(form.discountValue) <= 0)
      temp.discountValue = "Discount value must be greater than 0";
    if (!form.amount && form.amount !== 0)
      temp.amount = "Bidding amount is required";
    else if (isNaN(form.amount)) temp.amount = "Enter a valid number";
    else if (Number(form.amount) <= 0)
      temp.amount = "Bidding amount must be greater than 0";
    if (!form.month) temp.startDate = "Start date is required";
    if (!form.endDate) temp.endDate = "End date is required";
    if (form.month && form.endDate) {
      if (new Date(form.endDate) <= new Date(form.month))
        temp.endDate = "End date must be after start date";
    }
    // banner is optional for edit (unless you want required) — here we keep it optional (only when missing entirely show message)
    if (!form.bannerPreviewUrl && !form.banner)
      temp.banner = "Banner image is required";
    if (!form.agree) temp.agree = "Please accept the agreement";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // Step-specific validations when clicking Next
  const handleNext = () => {
    if (step === 1) {
      const temp = {};
      if (!form.title?.trim()) temp.title = "Promotion title is required";
      if (!form.service || form.service.length === 0)
        temp.service = "Select at least one service";
      if (!form.discountType) temp.discountType = "Discount type is required";
      if (!form.discountValue && form.discountValue !== 0)
        temp.discountValue = "Discount value is required";
      if (!form.description?.trim())
        temp.description = "Description is required";
      if (!form.endDate) temp.endDate = "End date is required";
      if (form.month && form.endDate) {
        if (new Date(form.endDate) <= new Date(form.month))
          temp.endDate = "End date must be after start date";
      }
      // Banner optional to replace; if there's neither existing preview nor chosen file, show error
      if (!form.bannerPreviewUrl && !form.banner)
        temp.banner = "Banner image is required";

      setErrors(temp);
      if (Object.keys(temp).length > 0) return;
    }

    if (step === 2) {
      const temp = {};
      if (!form.amount && form.amount !== 0)
        temp.amount = "Enter a valid bid amount";
      else if (isNaN(form.amount) || Number(form.amount) <= 0)
        temp.amount = "Enter a valid bid amount";
      setErrors(temp);
      if (Object.keys(temp).length > 0) return;
    }

    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setErrors({});
    setStep((s) => Math.max(1, s - 1));
  };

  // handleChange supports file inputs and normal inputs
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          banner: "File size must be less than 5 MB",
        }));
        return;
      }
      // create objectURL for preview
      const previewUrl = URL.createObjectURL(file);
      setForm((prev) => ({
        ...prev,
        [name]: file,
        bannerPreviewUrl: previewUrl,
      }));
      setErrors((prev) => ({ ...prev, banner: "" }));
      return;
    }

    // For non-file inputs
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // For custom dropdowns/selects that return value(s) directly (not event)
  const handleDropdownChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Submit update
  const handleSubmit = async () => {
    if (!validateAll()) {
      console.log("Validation failed", errors);
      return;
    }

    const fd = new FormData();
    fd.append("promotionTitle", form.title);
    fd.append("selectedServices", JSON.stringify(form.service));
    fd.append("discountType", form.discountType);
    fd.append("discountValue", form.discountValue);
    fd.append("startDate", new Date(form.month).toISOString());
    fd.append("endDate", new Date(form.endDate).toISOString());
    // If user selected a new banner file, append it; otherwise do not append so backend keeps existing
    if (form.banner instanceof File) {
      fd.append("file", form.banner);
    }
    fd.append("biddingPrice", form.amount);
    fd.append("description", form.description || "");

    try {
      await updatePromotion({ id: promotionId, formData: fd }).unwrap();
      Swal.fire({
        icon: "success",
        title: "Promotion Updated!",
        text: "Promotion has been updated successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
      onClose();
      setForm(emptyForm);
      setStep(1);
    } catch (err) {
      console.error("Update error:", err);
      Swal.fire({
        icon: "error",
        title: "Update failed",
        text: err?.data?.message || "Something went wrong",
      });
    }
  };

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Get service names to show in preview similar to create modal
  const getServiceNames = () => {
    if (!form.service || form.service.length === 0) return "-";
    if (!serviceOptions.length) return "-";
    return form.service
      .map((id) => serviceOptions.find((s) => s.value === id)?.label)
      .filter(Boolean)
      .join(", ");
  };

  // If still loading promotion, show nothing (or a loader)
  if (!promotionId || promoLoading) {
    return (
      <Modal show={show} onHide={onClose} size="md" centered>
        <Modal.Body className="px-4">
          <LoadingComponent isLoading={promoLoading} fullScreen />
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <Modal show={show} onHide={onClose} size="md" centered>
      <Modal.Body className="px-4">
        <div>
          <div className="promotion-modal-title">
            Edit Promotion – <span>Step {step} of 3</span>
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
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, title: e.target.value }))
                }
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
                onChange={(vals) =>
                  setForm((prev) => ({ ...prev, service: vals }))
                }
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
                  onChange={(val) => handleDropdownChange("discountType", val)}
                />
                {errors.discountType && (
                  <p className="text-danger">{errors.discountType}</p>
                )}
              </div>

              <div className="col-md-6">
                <label className="form-label input-label">Discount Value</label>
                <input
                  type="number"
                  className="form-control"
                  name="discountValue"
                  placeholder="Enter Discount Value"
                  value={form.discountValue}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      discountValue: e.target.value,
                    }))
                  }
                />
                {errors.discountValue && (
                  <p className="text-danger">{errors.discountValue}</p>
                )}
              </div>
            </div>

            <div>
              <label className="form-label input-label mt-3">
                Upload Banner (Recommended 1080x400) *
              </label>

              <div
                className="promo-upload-box"
                onClick={() =>
                  document.getElementById("bannerUploadEdit").click()
                }
              >
                <img src={folderOpen} alt="upload" className="upload-icon" />
                <span className="upload-text ellipsis-text">
                  {form.banner
                    ? form.banner.name
                    : form.bannerPreviewUrl
                    ? form.bannerFileName || "Current Banner"
                    : "Choose File to Upload"}
                </span>
              </div>

              <input
                type="file"
                id="bannerUploadEdit"
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
                  setForm((prev) => ({ ...prev, description: e.target.value }))
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
              <button className="modal-primary-btn" onClick={handleNext}>
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

            <label className="form-label input-label">Bid Amount ($) *</label>
            <input
              type="number"
              className="form-control"
              name="amount"
              placeholder="Enter Bid Amount"
              value={form.amount}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, amount: e.target.value }))
              }
            />
            {errors.amount && <p className="text-danger">{errors.amount}</p>}
            <p className="after-input mt-2">
              Higher bids increase your chance of selection
            </p>

            <div className="promo-payment-info">
              <p>
                If not selected the full amount will be refunded automatically
                to your account within 3-5 business days
              </p>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <button className="main-secondary-btn" onClick={handleBack}>
                Back
              </button>
              <button className="modal-primary-btn w-max" onClick={handleNext}>
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

              <div className="row mb-3 g-3">
                <div className="col-12 col-md-6">
                  <p className="promo-preview-label">Title*</p>
                  <div className="profile-name">{form.title || "-"}</div>
                </div>

                <div className="col-12 col-md-6">
                  <p className="promo-preview-label">Bid Amount*</p>
                  <div className="profile-name">${form.amount || "0"}</div>
                </div>
              </div>

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
                {form.bannerPreviewUrl ? (
                  <img
                    src={form.bannerPreviewUrl}
                    alt="Banner Preview"
                    className=""
                  />
                ) : (
                  <img src={businessImg1} alt="Banner Preview" className="" />
                )}
              </div>
            </div>

            <div className="form-check mt-3">
              <input
                type="checkbox"
                className="form-check-input"
                id="agreeEdit"
                checked={form.agree}
                onChange={handleCheckbox}
              />
              <label className="text-desc-common" htmlFor="agreeEdit">
                I understand this bid does not guarantee selection.
              </label>
              {errors.agree && <p className="text-danger">{errors.agree}</p>}
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <button className="main-secondary-btn" onClick={handleBack}>
                Back
              </button>
              <button
                className="modal-primary-btn w-max"
                onClick={handleSubmit}
                disabled={updating}
              >
                {updating ? "Updating..." : "Review & Submit"}
              </button>
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}
