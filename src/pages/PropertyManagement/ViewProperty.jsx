import React, { useRef, useEffect, useState } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import Breadcrumbs from "../../Components/Breadcrumbs";
import Swal from "sweetalert2";
import { LoadingComponent } from "../../Components/LoadingComponent";

import LightGallery from "lightgallery/react";
// Plugins if needed (optional)
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";

// styles (make sure to import once in your app)
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-zoom.css";
import { CirclePlay, File, Play } from "lucide-react";
import {
  usePropertyByIdQuery,
  useApprovePropertyMutation,
  useRejectPropertyMutation,
  useEditPropertyMutation,
} from "../../api/propertyApi";
const IMAGE_BASE_URL = import.meta.env.VITE_BASE_URL;

const getFileUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${IMAGE_BASE_URL}/${path}`;
};

const ViewListing = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { id: listingId } = useParams();

  const [activeVideo, setActiveVideo] = useState(null);
  const lightGalleryRef = useRef(null);

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approveDateTime, setApproveDateTime] = useState("");

  const [approveError, setApproveError] = useState("");

  const { data, isLoading, isError } = usePropertyByIdQuery(listingId, {
    skip: !listingId,
  });

  const [approveProperty] = useApprovePropertyMutation();
  const [rejectProperty] = useRejectPropertyMutation();
  const [editProperty, { isLoading: isUpdating }] = useEditPropertyMutation();

  // 🔒 STATIC DATA (NO API)
  const listing = data?.data;

  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (listing) {
      const formatCompensation = (comp) => {
        if (!comp || !comp.type || comp.type === "None") return "None";
        return `${comp.type} (${comp.unit || ""}${comp.amount ?? 0})`;
      };

      setFormData({
        ...listing,
        contractStartDate: listing.contractStartDate
          ? listing.contractStartDate.split("T")[0]
          : "",
        methodOfPayment: listing.methodOfPayment?.join(", ") || "",
        listOfServices: listing.listOfServices?.join(", ") || "",
        allowInspection: listing.allowInspection ? "Yes" : "No",
        // Flattening complex compensation for Manager listings
        pmCompensation: formatCompensation(
          listing.propertyManagementCompensation,
        ),
        ntCompensation: formatCompensation(listing.newTenantCompensation),
        lrCompensation: formatCompensation(listing.leaseRenewalCompensation),
      });
    }
  }, [listing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "currentGrossMonthlyRent") {
      const numVal = Number(value);
      if (isNaN(numVal) || numVal <= 0) {
        setErrors((prev) => ({
          ...prev,
          currentGrossMonthlyRent:
            "Current gross monthly rent must be greater than 0",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          currentGrossMonthlyRent: "",
        }));
      }
    }
  };

  if (isLoading) return <LoadingComponent isLoading fullScreen />;

  const handleApprove = () => {
    setApproveDateTime("");
    setApproveError("");
    setShowApproveModal(true);
  };

  const handleApproveConfirm = async () => {
    if (!approveDateTime) {
      setApproveError("Date & time is required");
      return;
    }

    const formattedStartDate = (dateTimeStr) => {
      const d = new Date(dateTimeStr);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      const hours = String(d.getHours()).padStart(2, "0");
      const minutes = String(d.getMinutes()).padStart(2, "0");
      const seconds = String(d.getSeconds()).padStart(2, "0");

      return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
    };

    try {
      setShowApproveModal(false);

      // 1. Build and validate payload from edited fields
      const payload = buildSavePayload();

      // 2. Call editProperty first to update the data in the database
      await editProperty({
        propertyId: listingId,
        payload,
      }).unwrap();

      // 3. Once updated successfully, call approveProperty to approve the listing
      await approveProperty({
        listingId,
        startDate: formattedStartDate(approveDateTime),
      }).unwrap();

      Swal.fire({
        title: "Approved",
        text: "Property has been updated and approved successfully",
        icon: "success",
        confirmButtonColor: "#a99068",
      }).then(() => {
        navigate("/listing-management");
      });
    } catch (err) {
      const errorMsg = err.message || err?.data?.message || "Failed to approve property";
      
      // If it's not our local validation error, show the error alert
      if (!err.message) {
        Swal.fire({
          title: "Error",
          text: errorMsg,
          icon: "error",
          confirmButtonColor: "#a99068",
        });
      }
    }
  };

  const handleReject = async () => {
    const result = await Swal.fire({
      title: "Reject Property?",
      text: "Are you sure you want to reject this property?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e83f3f",
      cancelButtonColor: "#a99068",
      confirmButtonText: "Yes, reject",
    });

    try {
      await rejectProperty(listingId).unwrap();

      Swal.fire({
        title: "Rejected",
        text: "Property has been rejected",
        icon: "success",
        confirmButtonColor: "#a99068",
      }).then(() => {
        navigate("/listing-management");
      });
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err?.data?.message || "Failed to reject property",
        icon: "error",
        confirmButtonColor: "#a99068",
      });
    }
  };

  const handleInspectionChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedInspections = (prev.inspections || []).map((insp, idx) => {
        if (idx === index) {
          return { ...insp, [field]: value };
        }
        return insp;
      });
      return { ...prev, inspections: updatedInspections };
    });
  };

  const handleAddInspectionSlot = () => {
    setFormData((prev) => ({
      ...prev,
      inspections: [
        ...(prev.inspections || []),
        { inspectionDate: "", startTime: "", endTime: "" },
      ],
    }));
  };

  const handleRemoveInspectionSlot = (index) => {
    setFormData((prev) => ({
      ...prev,
      inspections: (prev.inspections || []).filter((_, idx) => idx !== index),
    }));
  };

  const buildSavePayload = () => {
    // Validate currentGrossMonthlyRent
    const rentVal = Number(formData.currentGrossMonthlyRent);
    if (isNaN(rentVal) || rentVal <= 0) {
      setErrors((prev) => ({
        ...prev,
        currentGrossMonthlyRent: "Current gross monthly rent must be greater than 0",
      }));
      Swal.fire({
        title: "Validation Error",
        text: "Please correct the errors in the form before saving.",
        icon: "warning",
        confirmButtonColor: "#a99068",
      });
      throw new Error("Validation Error: Current gross monthly rent must be greater than 0");
    }

    // Helper function to safely parse compensation back to object format
    const parseCompensation = (val) => {
      if (!val || val.trim().toLowerCase() === "none" || val.trim() === "") {
        return { type: "", amount: null };
      }

      const match = val.match(/^([^(]+)\(([^)]+)\)$/);
      if (match) {
        const type = match[1].trim();
        const inner = match[2].trim();
        const unitMatch = inner.match(/^([^0-9.-]*)([0-9.-]+)$/);
        if (unitMatch) {
          return {
            type,
            unit: unitMatch[1] || "",
            amount: parseFloat(unitMatch[2]) || null,
          };
        }
        return { type, amount: parseFloat(inner) || null, unit: "" };
      }
      return { type: val.trim(), amount: null };
    };

    // Helper to safely parse comma separated strings back to arrays
    const parseCommaSeparated = (val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val;
      return val
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    };

    // 1. Start with copy of formData
    const payload = { ...formData };

    // 2. Map and cast standard common fields
    payload.methodOfPayment = parseCommaSeparated(formData.methodOfPayment);
    payload.listOfServices = parseCommaSeparated(formData.listOfServices);
    payload.allowInspection =
      formData.allowInspection === "Yes" || formData.allowInspection === true;

    // Process and format inspection slots
    if (payload.allowInspection) {
      payload.inspections = (payload.inspections || []).map((insp) => {
        let dateStr = insp.inspectionDate;
        if (dateStr && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
          dateStr = new Date(dateStr).toISOString();
        }
        return {
          ...insp,
          inspectionDate: dateStr || null,
          startTime: insp.startTime || "",
          endTime: insp.endTime || "",
        };
      });
    } else {
      payload.inspections = [];
    }

    // Convert numeric fields safely
    const numericKeys = [
      "amount",
      "target",
      "bid",
      "percent",
      "dueDiligenceDays",
      "bidDurationDays",
      "totalResidentialUnits",
      "vacantResidentialUnits",
      "commercialSquareFeet",
      "currentGrossMonthlyRent",
      "completionTimeframeDays",
    ];

    numericKeys.forEach((key) => {
      if (payload[key] !== undefined && payload[key] !== "") {
        payload[key] = Number(payload[key]);
      }
    });

    // Ensure bidDurationDays is a valid positive integer (> 0) to satisfy backend validation
    payload.bidDurationDays = Number(payload.bidDurationDays) || 1;

    // 3. Conditional adjustments based on listing type (Vendor vs Manager)
    if (payload.isvendorListing) {
      // Vendor Listing Specific Fields
      if (
        payload.compensationAmount !== undefined &&
        payload.compensationAmount !== ""
      ) {
        payload.compensationAmount = Number(payload.compensationAmount);
      }
      if (
        payload.upfrontPercentage !== undefined &&
        payload.upfrontPercentage !== ""
      ) {
        payload.upfrontPercentage = Number(payload.upfrontPercentage);
      }

      // Parse Vendor's leaseRenewalCompensation
      payload.leaseRenewalCompensation = parseCompensation(
        formData.lrCompensation,
      );

      // Exclude Manager Specific Fields
      delete payload.propertyManagementCompensation;
      delete payload.newTenantCompensation;
      delete payload.propertyManagementExperienceRequirement;
      delete payload.propertyManagementSoftwareRequirement;
    } else if (payload.ismanagerListing) {
      // Manager Listing Specific Fields
      if (
        payload.propertyManagementExperienceRequirement !== undefined &&
        payload.propertyManagementExperienceRequirement !== ""
      ) {
        payload.propertyManagementExperienceRequirement = Number(
          payload.propertyManagementExperienceRequirement,
        );
      }

      // Parse Manager's compensation fields
      payload.propertyManagementCompensation = parseCompensation(
        formData.pmCompensation,
      );
      payload.newTenantCompensation = parseCompensation(
        formData.ntCompensation,
      );
      payload.leaseRenewalCompensation = parseCompensation(
        formData.lrCompensation,
      );

      // Exclude Vendor Specific Fields
      delete payload.compensationAmount;
      delete payload.upfrontPercentage;
      delete payload.paymentDescription;
      delete payload.connectiontoProperty;
    }

    // 4. Delete local UI flat representation keys
    delete payload.pmCompensation;
    delete payload.ntCompensation;
    delete payload.lrCompensation;

    return payload;
  };

  const handleSaveChanges = async () => {
    try {
      const payload = buildSavePayload();

      await editProperty({
        propertyId: listingId,
        payload,
      }).unwrap();

      Swal.fire({
        title: "Success",
        text: "Property details updated successfully",
        icon: "success",
        confirmButtonColor: "#a99068",
      });
    } catch (err) {
      // Don't show Swal if it's our local validation error (it already showed an alert)
      if (err.message && err.message.startsWith("Validation Error")) {
        return;
      }
      
      Swal.fire({
        title: "Error",
        text: err?.data?.message || "Failed to update property details",
        icon: "error",
        confirmButtonColor: "#a99068",
      });
    }
  };

  // For lightgallery ref (optional, if you want to control)

  return (
    <main className="app-content body-bg">
      <section className="container">
        <div className="title-heading mb-3">View Listing</div>
        <Breadcrumbs />

        <div className="custom-card bg-white p-4 mt-3 position-relative">
          <h2 className="title text-black mb-4">Listing Details</h2>

          {/* Status badge */}
          {(() => {
            const statusMap = {
              "under-review": { label: "Under review", className: "pending" },
              approved: { label: "Approved", className: "info" },
              dealSealed: { label: "Deal sealed", className: "" },
              rejected: { label: "Rejected", className: "inactive" },
            };

            const status = statusMap[listing?.status] || {};
            return (
              <div className={`status-badge ${status.className}`}>
                {status.label}
              </div>
            );
          })()}
          <div className="row">
            <SectionHeader title="General Information" />
            <Detail
              label="Listing ID"
              name="listingId"
              value={formData?.listingId}
              onChange={handleChange}
              readOnly
            />
            <Detail
              label="Listing Address"
              name="servicePropertyAddress"
              value={formData?.servicePropertyAddress}
              onChange={handleChange}
            />
            <Detail
              label="Legal Owner Name"
              name="legalOwnerName"
              value={formData?.legalOwnerName}
              onChange={handleChange}
            />
            {formData?.isvendorListing && (
              <Detail
                label="Connection to Property"
                name="connectiontoProperty"
                value={formData?.connectiontoProperty}
                onChange={handleChange}
              />
            )}
            <Detail
              label="Service Category"
              name="serviceCategoryType"
              value={formData?.serviceCategoryType}
              onChange={handleChange}
            />
            <Detail
              label="Property Completion Status"
              name="ispropertyComplete"
              value={formData?.ispropertyComplete}
              onChange={handleChange}
            />
            <Detail
              label="Listing Type"
              value={
                formData?.isvendorListing ? "Vendor Listing" : "Manager Listing"
              }
              readOnly
            />

            <SectionHeader title="Property Specifications" />
            <Detail
              label="Property Type"
              name="propertyType"
              value={formData?.propertyType}
              onChange={handleChange}
            />
            <Detail
              label="Total Residential Units"
              name="totalResidentialUnits"
              value={formData?.totalResidentialUnits}
              onChange={handleChange}
            />
            <Detail
              label="Vacant Residential Units"
              name="vacantResidentialUnits"
              value={formData?.vacantResidentialUnits}
              onChange={handleChange}
            />
            <Detail
              label="Commercial Square Feet"
              name="commercialSquareFeet"
              value={formData?.commercialSquareFeet}
              onChange={handleChange}
            />
            <Detail
              label="Current Gross Monthly Rent"
              name="currentGrossMonthlyRent"
              value={formData?.currentGrossMonthlyRent}
              onChange={handleChange}
              error={errors.currentGrossMonthlyRent}
            />

            <SectionHeader title="Terms & Project Timeline" />
            <Detail
              label="Due Diligence Period (Days)"
              name="dueDiligenceDays"
              value={formData?.dueDiligenceDays}
              onChange={handleChange}
            />
            <Detail
              label="Inspection Allowed"
              name="allowInspection"
              value={formData?.allowInspection}
              onChange={handleChange}
            />

            {(formData?.allowInspection === "Yes" ||
              formData?.allowInspection === true) && (
              <div className="col-12 mt-2 mb-3">
                <label className="form-label fw-semibold text-primary">
                  Inspection Slots Calendar
                </label>
                <div className="row g-3 mb-2">
                  {(formData?.inspections || []).map((insp, idx) => {
                    let dateVal = "";
                    if (insp.inspectionDate) {
                      dateVal = insp.inspectionDate.split("T")[0];
                    }

                    return (
                      <div key={insp._id || idx} className="col-md-6">
                        <div
                          className="card p-3 border rounded shadow-sm"
                          style={{ background: "#fdfdfd" }}
                        >
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <span
                              className="badge px-2.5 py-1.5"
                              style={{
                                fontSize: "0.85rem",
                                background: "#a99068",
                              }}
                            >
                              Slot #{idx + 1}
                            </span>
                            {/* <button
                              type="button"
                              // className="btn text-danger p-0"
                              onClick={() => handleRemoveInspectionSlot(idx)}
                              className="badge px-2.5 py-1.5"
                              style={{
                                fontSize: "0.85rem",
                                background: "#a99068",
                                border: "none",
                              }}
                            >
                              Remove Slot
                            </button> */}
                          </div>

                          <div className="row g-2">
                            <div className="col-12 mb-2">
                              <label className="form-label small fw-semibold text-muted mb-1">
                                Inspection Date
                              </label>
                              <input
                                type="date"
                                className="form-control bg-white"
                                value={dateVal}
                                onChange={(e) =>
                                  handleInspectionChange(
                                    idx,
                                    "inspectionDate",
                                    e.target.value,
                                  )
                                }
                                onClick={(e) => e.target.showPicker?.()}
                                onFocus={(e) => e.target.showPicker?.()}
                              />
                            </div>
                            <div className="col-6">
                              <label className="form-label small fw-semibold text-muted mb-1">
                                Start Time
                              </label>
                              <input
                                type="time"
                                className="form-control bg-white"
                                value={insp.startTime || ""}
                                onChange={(e) =>
                                  handleInspectionChange(
                                    idx,
                                    "startTime",
                                    e.target.value,
                                  )
                                }
                                onClick={(e) => e.target.showPicker?.()}
                                onFocus={(e) => e.target.showPicker?.()}
                              />
                            </div>
                            <div className="col-6">
                              <label className="form-label small fw-semibold text-muted mb-1">
                                End Time
                              </label>
                              <input
                                type="time"
                                className="form-control bg-white"
                                value={insp.endTime || ""}
                                onChange={(e) =>
                                  handleInspectionChange(
                                    idx,
                                    "endTime",
                                    e.target.value,
                                  )
                                }
                                onClick={(e) => e.target.showPicker?.()}
                                onFocus={(e) => e.target.showPicker?.()}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            )}
            <Detail
              label="Bid Duration (Days)"
              name="bidDurationDays"
              value={formData?.bidDurationDays}
              onChange={handleChange}
            />

            <SectionHeader title="Scope & Requirements" />
            {formData?.ismanagerListing && (
              <>
                <Detail
                  label="Experience Requirement (Years)"
                  name="propertyManagementExperienceRequirement"
                  value={formData?.propertyManagementExperienceRequirement}
                  onChange={handleChange}
                />
                <Detail
                  label="Software Requirement"
                  name="propertyManagementSoftwareRequirement"
                  value={formData?.propertyManagementSoftwareRequirement}
                  onChange={handleChange}
                />
              </>
            )}
            <FullDetail
              label="Scope of Work"
              name="scopeOfworkDescription"
              value={formData?.scopeOfworkDescription}
              onChange={handleChange}
            />
            <FullDetail
              label="Additional Requirements"
              name="additionalRequirementText"
              value={formData?.additionalRequirementText}
              onChange={handleChange}
            />

            <div className="col-md-12 mb-3">
              <label className="form-label fw-semibold">
                Relevant Documents
              </label>
              <div className="d-flex flex-wrap gap-2">
                {listing?.additionalRequirementDocuments?.length > 0 ? (
                  listing.additionalRequirementDocuments.map((doc, idx) => {
                    const url = typeof doc === "string" ? doc : doc.url;
                    const name =
                      typeof doc === "string" ? doc.split("/").pop() : doc.name;
                    return (
                      <a
                        key={idx}
                        href={getFileUrl(url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="document-item"
                      >
                        <File size={18} />
                        <span className="ms-2">{name}</span>
                      </a>
                    );
                  })
                ) : (
                  <span className="text-muted small">
                    No documents uploaded
                  </span>
                )}
              </div>
            </div>

            <SectionHeader title="Payment & Financials" />
            <Detail
              label="Total Amount"
              name="amount"
              value={formData?.amount}
              onChange={handleChange}
            />
            <Detail
              label="Target Amount"
              name="target"
              value={formData?.target}
              onChange={handleChange}
            />
            <Detail
              label="Current Bid"
              name="bid"
              value={formData?.bid}
              onChange={handleChange}
            />
            <Detail
              label="Completion Percentage"
              name="percent"
              value={formData?.percent}
              onChange={handleChange}
            />

            {formData?.isvendorListing && (
              <>
                <Detail
                  label="Compensation Amount"
                  name="compensationAmount"
                  value={formData?.compensationAmount}
                  onChange={handleChange}
                />
                <Detail
                  label="Upfront Percentage (%)"
                  name="upfrontPercentage"
                  value={formData?.upfrontPercentage}
                  onChange={handleChange}
                />
                <Detail
                  label="Payment Methods"
                  name="methodOfPayment"
                  value={formData?.methodOfPayment}
                  onChange={handleChange}
                />
                <FullDetail
                  label="Payment Description"
                  name="paymentDescription"
                  value={formData?.paymentDescription}
                  onChange={handleChange}
                />
              </>
            )}

            {formData?.ismanagerListing && (
              <>
                <Detail
                  label="Management Compensation"
                  name="pmCompensation"
                  value={formData?.pmCompensation}
                  onChange={handleChange}
                />
                <Detail
                  label="New Tenant Compensation"
                  name="ntCompensation"
                  value={formData?.ntCompensation}
                  onChange={handleChange}
                />
                <Detail
                  label="Lease Renewal Compensation"
                  name="lrCompensation"
                  value={formData?.lrCompensation}
                  onChange={handleChange}
                />
              </>
            )}

            <SectionHeader title="Contract Details" />
            <Detail
              label="Contract Choice"
              name="contractChoice"
              value={formData?.contractChoice}
              onChange={handleChange}
            />
            <Detail
              label="Service Contract Length"
              name="contractLength"
              value={formData?.contractLength}
              onChange={handleChange}
            />
            {/* <Detail
              label="Expected Start Date"
              name="contractStartDate"
              value={formData?.contractStartDate}
              onChange={handleChange}
            /> */}
            <Detail
              label="Completion Timeframe (Days)"
              name="completionTimeframeDays"
              value={formData?.completionTimeframeDays}
              onChange={handleChange}
            />

            <SectionHeader title="Media & Documents" />

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Contract File</label>
              <div className="contract-file-item">
                {listing?.contractFile?.url ||
                listing?.ownContractFile?.length > 0 ? (
                  <a
                    href={getFileUrl(
                      listing?.contractFile?.url ||
                        listing?.ownContractFile?.[0]?.url,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fd-inline-flex align-items-center me-3 mb-2 text-decoration-none"
                    style={{ color: "#7f6c4d" }}
                  >
                    <File size={18} />{" "}
                    <span className="ms-1">
                      {listing?.contractFile?.name ||
                        listing?.ownContractFile?.[0]?.name ||
                        "View Contract"}
                    </span>
                  </a>
                ) : (
                  <span className="text-muted small">No contract file</span>
                )}
              </div>
            </div>

            {/* Photos Preview with Lightgallery */}
            <div className="col-md-12 mb-3">
              <label className="form-label fw-semibold">Photos Uploaded</label>
              <LightGallery
                speed={500}
                plugins={[lgThumbnail, lgZoom]}
                elementClassNames="property-gallery"
                ref={lightGalleryRef}
              >
                {listing?.uploadPhotos?.map((src, idx) => (
                  <a
                    key={idx}
                    href={getFileUrl(src)}
                    className="property-gallery-item"
                  >
                    <img
                      src={getFileUrl(src)}
                      alt={`Property photo ${idx + 1}`}
                    />
                  </a>
                ))}
              </LightGallery>
            </div>

            {/* Videos Preview */}
            <div className="col-md-12 mb-3">
              <label className="form-label fw-semibold">Videos Uploaded</label>

              <div className="video-gallery">
                {listing?.uploadVideos?.map((src, idx) => (
                  <div
                    key={idx}
                    className="video-item video-thumb"
                    onClick={() => setActiveVideo(getFileUrl(src))}
                  >
                    <video src={getFileUrl(src)} muted />
                    <div className="play-overlay">
                      <Play />{" "}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="d-flex justify-content-center gap-3 mt-4">
            <button className="button-secondary" onClick={() => navigate(-1)}>
              Back
            </button>
            {/* <button
              className="primary-button"
              onClick={handleSaveChanges}
              disabled={isUpdating}
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </button> */}
            {listing?.status === "under-review" && (
              <>
                <button className="primary-button" onClick={handleApprove}>
                  Approve
                </button>
                <button
                  className="primary-button"
                  style={{ background: "#e83f3f" }}
                  onClick={handleReject}
                >
                  Reject
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Video modal  */}
      {activeVideo && (
        <div className="video-modal" onClick={() => setActiveVideo(null)}>
          <div
            className="video-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <video src={activeVideo} controls autoPlay />
          </div>
        </div>
      )}

      {showApproveModal && (
        <div
          className="modal fade show d-block"
          style={{ background: "#00000080" }}
          onClick={() => {
            // Clicking outside modal closes it
            setShowApproveModal(false);
            setApproveDateTime(""); // reset input
            setApproveError("");
          }}
        >
          <div
            className="modal-dialog modal-md modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content p-3">
              <div className="modal-body">
                <h5 className="text-center">Select Start Date & Time</h5>

                <div className="my-4">
                  <label className="form-label fw-semibold">
                    Date & Time <span className="text-danger">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={approveDateTime}
                    onChange={(e) => {
                      setApproveDateTime(e.target.value);
                      setApproveError("");
                    }}
                    onClick={(e) => e.target.showPicker?.()}
                    onFocus={(e) => e.target.showPicker?.()}
                  />
                  {approveError && (
                    <div className="text-danger mt-1">{approveError}</div>
                  )}
                </div>

                <div className="d-flex align-items-center gap-2 justify-content-center">
                  <button
                    className="button-secondary"
                    onClick={() => {
                      setShowApproveModal(false);
                      setApproveDateTime(""); // reset input
                      setApproveError("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="primary-button"
                    onClick={handleApproveConfirm}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ViewListing;

const SectionHeader = ({ title }) => (
  <div className="col-12 mt-4 mb-2">
    <h4 className="text-primary fw-bold" style={{ fontSize: "1.1rem" }}>
      {title}
    </h4>
    <hr className="mt-1 mb-3" style={{ opacity: 0.1 }} />
  </div>
);

const Detail = ({
  label,
  value,
  name,
  onChange,
  readOnly = false,
  error = "",
}) => (
  <div className="col-md-6 mb-3">
    <label className="form-label fw-semibold">{label}</label>
    <input
      type="text"
      name={name}
      className={`form-control ${readOnly ? "bg-light text-muted" : "bg-white"} ${error ? "is-invalid border-danger" : ""}`}
      value={value ?? ""}
      onChange={onChange}
      readOnly={readOnly}
    />
    {error && <div className="text-danger small mt-1">{error}</div>}
  </div>
);

const FullDetail = ({ label, value, name, onChange }) => (
  <div className="col-md-12 mb-3">
    <label className="form-label fw-semibold">{label}</label>
    <textarea
      className="form-control bg-white"
      name={name}
      value={value ?? ""}
      rows={4}
      onChange={onChange}
    />
  </div>
);
