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
import { CirclePlay, File, Play, Pencil, X } from "lucide-react";
import {
  usePropertyByIdQuery,
  useApprovePropertyMutation,
  useRejectPropertyMutation,
  useEditPropertyMutation,
} from "../../api/propertyApi";
import { formatHumanReadableFileName } from "../../utils/helpers";
const getFileUrl = (path) => {
  if (!path) return "";
  let cleanPath = String(path).trim();
  try {
    cleanPath = decodeURI(cleanPath);
  } catch (e) {
    // Ignore error
  }

  const backendOrigin = (
    import.meta.env.VITE_LIVE_URL ||
    (import.meta.env.VITE_BASE_URL
      ? import.meta.env.VITE_BASE_URL.replace(/\/api\/admin\/?$/, "")
      : "")
  ).replace(/\/+$/, "");

  if (cleanPath.startsWith("http://") || cleanPath.startsWith("https://")) {
    // In local dev environment, ensure assets from foreign test domains route through configured backendOrigin
    if (
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1")
    ) {
      try {
        const parsed = new URL(cleanPath);
        if (
          backendOrigin &&
          parsed.origin !== backendOrigin &&
          (parsed.pathname.startsWith("/rustfs/") ||
            parsed.pathname.startsWith("/uploads/"))
        ) {
          cleanPath = `${backendOrigin}${parsed.pathname}${parsed.search}`;
        }
      } catch {
        // Keep cleanPath as is
      }
    }
    return encodeURI(cleanPath);
  }

  return encodeURI(`${backendOrigin}/${cleanPath.replace(/^\/+/, "")}`);
};

const getReadableFileName = (fileOrUrl, fallback = "View Document") => {
  return formatHumanReadableFileName(fileOrUrl, fallback);
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
  const [isEditing, setIsEditing] = useState(false);

  const populateFormData = (item) => {
    if (!item) return;
    const formatCompensation = (comp) => {
      if (!comp || !comp.type || comp.type === "None") return "None";
      return `${comp.type} (${comp.unit || ""}${comp.amount ?? 0})`;
    };

    setFormData({
      ...item,
      contractStartDate: item.contractStartDate
        ? item.contractStartDate.split("T")[0]
        : "",
      methodOfPayment: item.methodOfPayment?.join(", ") || "",
      listOfServices: item.listOfServices?.join(", ") || "",
      allowInspection: item.allowInspection ? "Yes" : "No",
      // Flattening complex compensation for Manager listings
      pmCompensation: formatCompensation(
        item.propertyManagementCompensation,
      ),
      ntCompensation: formatCompensation(item.newTenantCompensation),
      lrCompensation: formatCompensation(item.leaseRenewalCompensation),
    });
  };

  useEffect(() => {
    if (listing) {
      populateFormData(listing);
    }
  }, [listing]);

  const handleCancelEdit = () => {
    if (listing) {
      populateFormData(listing);
    }
    setErrors({});
    setIsEditing(false);
  };

  const isFieldReadOnly = (alwaysReadOnly = false) => alwaysReadOnly || !isEditing;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "allowInspection") {
      const isYes =
        String(value).trim().toLowerCase() === "yes" || value === true;
      setFormData((prev) => ({
        ...prev,
        allowInspection: isYes ? "Yes" : "No",
        inspections:
          isYes && (!prev.inspections || prev.inspections.length === 0)
            ? [{ inspectionDate: "", startTime: "", endTime: "" }]
            : prev.inspections || [],
      }));
      return;
    }

    if (name === "currentGrossMonthlyRent") {
      const numVal = Number(value);
      if (value !== "" && value !== null && value !== undefined && (isNaN(numVal) || numVal < 0)) {
        setErrors((prev) => ({
          ...prev,
          currentGrossMonthlyRent:
            "Current gross monthly rent must be a valid non-negative number",
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
    // Validate currentGrossMonthlyRent (only if provided / not empty)
    if (
      formData.currentGrossMonthlyRent !== "" &&
      formData.currentGrossMonthlyRent !== null &&
      formData.currentGrossMonthlyRent !== undefined
    ) {
      const rentVal = Number(formData.currentGrossMonthlyRent);
      if (isNaN(rentVal) || rentVal < 0) {
        setErrors((prev) => ({
          ...prev,
          currentGrossMonthlyRent:
            "Current gross monthly rent must be a valid non-negative number",
        }));
        Swal.fire({
          title: "Validation Error",
          text: "Current gross monthly rent must be a valid non-negative number.",
          icon: "warning",
          confirmButtonColor: "#a99068",
        });
        throw new Error(
          "Validation Error: Current gross monthly rent must be a valid non-negative number",
        );
      }
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
      formData.allowInspection === "Yes" ||
      formData.allowInspection === true ||
      String(formData.allowInspection).trim().toLowerCase() === "yes";

    // Process and format inspection slots
    if (payload.allowInspection) {
      payload.inspections = (payload.inspections || [])
        .filter((insp) => insp.inspectionDate || insp.startTime || insp.endTime)
        .map((insp) => {
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

      setIsEditing(false);
      setErrors({});

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

  // Helper to resolve contract file info (PaxTrac standard agreement vs Custom/Own contract file)
  const getContractInfo = () => {
    const rawChoice = (
      formData?.contractChoice ||
      listing?.contractChoice ||
      ""
    )
      .trim()
      .toLowerCase();

    const hasOwnFile = Boolean(
      listing?.contractFile ||
      (Array.isArray(listing?.ownContractFile) && listing.ownContractFile.length > 0) ||
      (typeof listing?.ownContractFile === "string" && listing.ownContractFile.trim())
    );

    const hasPaxtracFile = Boolean(listing?.paxtracContractFile);

    const backendOrigin = (
      import.meta.env.VITE_LIVE_URL ||
      (import.meta.env.VITE_BASE_URL
        ? import.meta.env.VITE_BASE_URL.replace(/\/api\/admin\/?$/, "")
        : "")
    ).replace(/\/+$/, "");

    // 1. PaxTrac contract choice OR stored paxtrac contract file
    if (rawChoice === "paxtrac" || (!hasOwnFile && hasPaxtracFile)) {
      const url = hasPaxtracFile
        ? getFileUrl(listing.paxtracContractFile)
        : `${backendOrigin}/api/agreement/${
            listing?.isvendorListing
              ? "property-vendor-preview"
              : "property-manager-preview"
          }/${listing?._id || listingId}`;

      const name = hasPaxtracFile
        ? getReadableFileName(
            listing.paxtracContractFile,
            "PaxTrac Standard Agreement.pdf"
          )
        : "PaxTrac Standard Agreement.pdf";

      return {
        type: "paxtrac",
        label: "PaxTrac Standard Contract",
        name,
        url,
      };
    }

    // 2. Custom / Own contract choice OR uploaded ownContractFile / contractFile
    if (rawChoice === "own" || rawChoice === "custom" || hasOwnFile) {
      if (hasOwnFile) {
        const ownFile =
          listing?.contractFile ||
          (Array.isArray(listing?.ownContractFile)
            ? listing.ownContractFile[0]
            : listing.ownContractFile);

        const rawUrl =
          typeof ownFile === "string" ? ownFile : ownFile?.url || ownFile;
        const url = getFileUrl(rawUrl);
        const name = getReadableFileName(ownFile, "Custom Contract File.pdf");

        return {
          type: "custom",
          label: "Custom Contract",
          name,
          url,
        };
      }

      return {
        type: "custom",
        label: "Custom Contract",
        name: "No custom contract file uploaded",
        url: null,
      };
    }

    // 3. Fallback: if property exists, default to PaxTrac Standard Agreement
    if (listing?._id || listingId) {
      const url = `${backendOrigin}/api/agreement/${
        listing?.isvendorListing
          ? "property-vendor-preview"
          : "property-manager-preview"
      }/${listing?._id || listingId}`;

      return {
        type: "paxtrac",
        label: "PaxTrac Standard Contract",
        name: "PaxTrac Standard Agreement.pdf",
        url,
      };
    }

    return null;
  };

  // For lightgallery ref (optional, if you want to control)

  return (
    <main className="app-content body-bg">
      <section className="container">
        <div className="title-heading mb-3">View Listing</div>
        <Breadcrumbs />

        <div className="custom-card bg-white p-4 mt-3 position-relative">
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <h2 className="title text-black mb-0">Listing Details</h2>

            <div className="d-flex align-items-center gap-2">
              {!isEditing ? (
                <button
                  type="button"
                  className="primary-button d-flex align-items-center gap-2"
                  style={{
                    padding: "6px 14px",
                    fontSize: "14px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil size={15} />
                  <span>Edit</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="button-secondary d-flex align-items-center gap-2"
                  style={{
                    padding: "6px 14px",
                    fontSize: "14px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    backgroundColor: "#fff",
                  }}
                  onClick={handleCancelEdit}
                >
                  <X size={15} />
                  <span>Cancel Edit</span>
                </button>
              )}

              {(() => {
                const statusMap = {
                  "under-review": { label: "Under review", className: "pending" },
                  contractPending: { label: "Contract Pending", className: "pending" },
                  approved: { label: "Approved", className: "info" },
                  dealSealed: { label: "Deal sealed", className: "" },
                  rejected: { label: "Rejected", className: "inactive" },
                };

                const status = statusMap[listing?.status] || {};
                return (
                  <div
                    className={`status-badge ${status.className}`}
                    style={{ position: "static" }}
                  >
                    {status.label}
                  </div>
                );
              })()}
            </div>
          </div>
          <div className="row">
            <SectionHeader title="General Information" />
            <Detail
              label="Listing ID"
              name="listingId"
              value={formData?.listingId}
              onChange={handleChange}
              readOnly={isFieldReadOnly(true)}
            />
            <Detail
              label="Listing Address"
              name="servicePropertyAddress"
              value={formData?.servicePropertyAddress}
              onChange={handleChange}
              readOnly={isFieldReadOnly()}
            />
            <Detail
              label="Legal Owner Name"
              name="legalOwnerName"
              value={formData?.legalOwnerName}
              onChange={handleChange}
              readOnly={isFieldReadOnly()}
            />
            {formData?.isvendorListing && (
              <Detail
                label="Connection to Property"
                name="connectiontoProperty"
                value={formData?.connectiontoProperty}
                onChange={handleChange}
                readOnly={isFieldReadOnly()}
              />
            )}
            <Detail
              label="Service Category"
              name="serviceCategoryType"
              value={formData?.serviceCategoryType}
              onChange={handleChange}
              readOnly={isFieldReadOnly()}
            />
            <Detail
              label="Property Completion Status"
              name="ispropertyComplete"
              value={formData?.ispropertyComplete}
              onChange={handleChange}
              readOnly={isFieldReadOnly()}
            />
            <Detail
              label="Listing Type"
              value={
                formData?.isvendorListing ? "Vendor Listing" : "Manager Listing"
              }
              readOnly={isFieldReadOnly(true)}
            />

            <SectionHeader title="Property Specifications" />
            <Detail
              label="Property Type"
              name="propertyType"
              value={formData?.propertyType}
              onChange={handleChange}
              readOnly={isFieldReadOnly()}
            />
            <Detail
              label="Total Residential Units"
              name="totalResidentialUnits"
              value={formData?.totalResidentialUnits}
              onChange={handleChange}
              readOnly={isFieldReadOnly()}
            />
            <Detail
              label="Vacant Residential Units"
              name="vacantResidentialUnits"
              value={formData?.vacantResidentialUnits}
              onChange={handleChange}
              readOnly={isFieldReadOnly()}
            />
            <Detail
              label="Commercial Square Feet"
              name="commercialSquareFeet"
              value={formData?.commercialSquareFeet}
              onChange={handleChange}
              readOnly={isFieldReadOnly()}
            />
            <Detail
              label="Current Gross Monthly Rent"
              name="currentGrossMonthlyRent"
              value={formData?.currentGrossMonthlyRent}
              onChange={handleChange}
              readOnly={isFieldReadOnly()}
              error={errors.currentGrossMonthlyRent}
            />

            <SectionHeader title="Terms & Project Timeline" />
            <Detail
              label="Due Diligence Period (Days)"
              name="dueDiligenceDays"
              value={formData?.dueDiligenceDays}
              onChange={handleChange}
              readOnly={isFieldReadOnly()}
            />
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Inspection Allowed</label>
              {isFieldReadOnly() ? (
                <input
                  type="text"
                  className="form-control"
                  style={{
                    backgroundColor: "#f2f4f7",
                    color: "#475467",
                    borderColor: "#d0d5dd",
                    cursor: "not-allowed",
                  }}
                  value={
                    formData?.allowInspection === "Yes" ||
                    formData?.allowInspection === true ||
                    String(formData?.allowInspection).trim().toLowerCase() === "yes"
                      ? "Yes"
                      : "No"
                  }
                  readOnly
                  disabled
                />
              ) : (
                <select
                  className="form-select"
                  name="allowInspection"
                  value={
                    formData?.allowInspection === "Yes" ||
                    formData?.allowInspection === true ||
                    String(formData?.allowInspection).trim().toLowerCase() === "yes"
                      ? "Yes"
                      : "No"
                  }
                  onChange={handleChange}
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#101828",
                    borderColor: "#a99068",
                    cursor: "pointer",
                  }}
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              )}
            </div>

            {(formData?.allowInspection === "Yes" ||
              formData?.allowInspection === true ||
              String(formData?.allowInspection).trim().toLowerCase() === "yes") && (
              <div className="col-12 mt-2 mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label fw-semibold text-primary mb-0">
                    Inspection Slots Calendar
                  </label>
                  {isEditing && (
                    <button
                      type="button"
                      className="primary-button d-flex align-items-center gap-1"
                      style={{
                        padding: "5px 12px",
                        fontSize: "13px",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                      onClick={handleAddInspectionSlot}
                    >
                      + Add Slot
                    </button>
                  )}
                </div>

                <div className="row g-3 mb-2">
                  {(!formData?.inspections || formData.inspections.length === 0) ? (
                    <div className="col-12">
                      <div className="p-3 border rounded text-center text-muted bg-light">
                        No inspection slots configured yet.
                        {isEditing && (
                          <div className="mt-2">
                            <button
                              type="button"
                              className="button-secondary"
                              style={{ fontSize: "13px", padding: "4px 10px" }}
                              onClick={handleAddInspectionSlot}
                            >
                              + Add First Inspection Slot
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    formData.inspections.map((insp, idx) => {
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
                                style={{
                                  fontSize: "12px",
                                  fontWeight: "600",
                                  color: "#ffffff",
                                  backgroundColor: "#a99068",
                                  padding: "4px 10px",
                                  borderRadius: "5px",
                                  display: "inline-block",
                                  lineHeight: "1.2",
                                }}
                              >
                                Slot #{idx + 1}
                              </span>
                              {isEditing && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveInspectionSlot(idx)}
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    fontSize: "12px",
                                    fontWeight: "500",
                                    color: "#dc2626",
                                    backgroundColor: "#fef2f2",
                                    border: "1px solid #fee2e2",
                                    borderRadius: "5px",
                                    padding: "4px 10px",
                                    cursor: "pointer",
                                    width: "auto",
                                    lineHeight: "1.2",
                                    transition: "all 0.15s ease",
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "#fee2e2";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "#fef2f2";
                                  }}
                                >
                                  <X size={14} />
                                  <span>Remove Slot</span>
                                </button>
                              )}
                            </div>

                            <div className="row g-2">
                              <div className="col-12 mb-2">
                                <label className="form-label small fw-semibold text-muted mb-1">
                                  Inspection Date
                                </label>
                                <input
                                  type="date"
                                  className="form-control"
                                  style={
                                    !isEditing
                                      ? {
                                          backgroundColor: "#f2f4f7",
                                          color: "#475467",
                                          borderColor: "#d0d5dd",
                                          cursor: "not-allowed",
                                        }
                                      : {
                                          backgroundColor: "#ffffff",
                                          color: "#101828",
                                          borderColor: "#a99068",
                                          cursor: "text",
                                        }
                                  }
                                  value={dateVal}
                                  disabled={!isEditing}
                                  onChange={(e) =>
                                    handleInspectionChange(
                                      idx,
                                      "inspectionDate",
                                      e.target.value,
                                    )
                                  }
                                  onClick={(e) => isEditing && e.target.showPicker?.()}
                                  onFocus={(e) => isEditing && e.target.showPicker?.()}
                                />
                              </div>
                              <div className="col-6">
                                <label className="form-label small fw-semibold text-muted mb-1">
                                  Start Time
                                </label>
                                <input
                                  type="time"
                                  className="form-control"
                                  style={
                                    !isEditing
                                      ? {
                                          backgroundColor: "#f2f4f7",
                                          color: "#475467",
                                          borderColor: "#d0d5dd",
                                          cursor: "not-allowed",
                                        }
                                      : {
                                          backgroundColor: "#ffffff",
                                          color: "#101828",
                                          borderColor: "#a99068",
                                          cursor: "text",
                                        }
                                  }
                                  value={insp.startTime || ""}
                                  disabled={!isEditing}
                                  onChange={(e) =>
                                    handleInspectionChange(
                                      idx,
                                      "startTime",
                                      e.target.value,
                                    )
                                  }
                                  onClick={(e) => isEditing && e.target.showPicker?.()}
                                  onFocus={(e) => isEditing && e.target.showPicker?.()}
                                />
                              </div>
                              <div className="col-6">
                                <label className="form-label small fw-semibold text-muted mb-1">
                                  End Time
                                </label>
                                <input
                                  type="time"
                                  className="form-control"
                                  style={
                                    !isEditing
                                      ? {
                                          backgroundColor: "#f2f4f7",
                                          color: "#475467",
                                          borderColor: "#d0d5dd",
                                          cursor: "not-allowed",
                                        }
                                      : {
                                          backgroundColor: "#ffffff",
                                          color: "#101828",
                                          borderColor: "#a99068",
                                          cursor: "text",
                                        }
                                  }
                                  value={insp.endTime || ""}
                                  disabled={!isEditing}
                                  onChange={(e) =>
                                    handleInspectionChange(
                                      idx,
                                      "endTime",
                                      e.target.value,
                                    )
                                  }
                                  onClick={(e) => isEditing && e.target.showPicker?.()}
                                  onFocus={(e) => isEditing && e.target.showPicker?.()}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
            <Detail
              label="Bid Duration (Days)"
              name="bidDurationDays"
              value={formData?.bidDurationDays}
              onChange={handleChange}
              readOnly={isFieldReadOnly()}
            />

            <SectionHeader title="Scope & Requirements" />
            {formData?.ismanagerListing && (
              <>
                <Detail
                  label="Experience Requirement (Years)"
                  name="propertyManagementExperienceRequirement"
                  value={formData?.propertyManagementExperienceRequirement}
                  onChange={handleChange}
                  readOnly={isFieldReadOnly()}
                />
                <Detail
                  label="Software Requirement"
                  name="propertyManagementSoftwareRequirement"
                  value={formData?.propertyManagementSoftwareRequirement}
                  onChange={handleChange}
                  readOnly={isFieldReadOnly()}
                />
              </>
            )}
            <FullDetail
              label="Scope of Work"
              name="scopeOfworkDescription"
              value={formData?.scopeOfworkDescription}
              onChange={handleChange}
              readOnly={isFieldReadOnly()}
            />
            <FullDetail
              label="Additional Requirements"
              name="additionalRequirementText"
              value={formData?.additionalRequirementText}
              onChange={handleChange}
              readOnly={isFieldReadOnly()}
            />

            <div className="col-md-12 mb-3">
              <label className="form-label fw-semibold">
                Relevant Documents
              </label>
              <div className="d-flex flex-wrap gap-2">
                {listing?.additionalRequirementDocuments?.length > 0 ? (
                  listing.additionalRequirementDocuments.map((doc, idx) => {
                    const url = typeof doc === "string" ? doc : doc.url;
                    const name = getReadableFileName(doc, "Document");
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
              readOnly={isFieldReadOnly()}
            />
            <Detail
              label="Target Amount"
              name="target"
              value={formData?.target}
              onChange={handleChange}
              readOnly={isFieldReadOnly()}
            />
            <Detail
              label="Current Bid"
              name="bid"
              value={formData?.bid}
              onChange={handleChange}
              readOnly={isFieldReadOnly()}
            />
            <Detail
              label="Completion Percentage"
              name="percent"
              value={formData?.percent}
              onChange={handleChange}
              readOnly={isFieldReadOnly()}
            />

            {formData?.isvendorListing && (
              <>
                <Detail
                  label="Compensation Amount"
                  name="compensationAmount"
                  value={formData?.compensationAmount}
                  onChange={handleChange}
                  readOnly={isFieldReadOnly()}
                />
                <Detail
                  label="Upfront Percentage (%)"
                  name="upfrontPercentage"
                  value={formData?.upfrontPercentage}
                  onChange={handleChange}
                  readOnly={isFieldReadOnly()}
                />
                <Detail
                  label="Payment Methods"
                  name="methodOfPayment"
                  value={formData?.methodOfPayment}
                  onChange={handleChange}
                  readOnly={isFieldReadOnly()}
                />
                <FullDetail
                  label="Payment Description"
                  name="paymentDescription"
                  value={formData?.paymentDescription}
                  onChange={handleChange}
                  readOnly={isFieldReadOnly()}
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
                  readOnly={isFieldReadOnly()}
                />
                <Detail
                  label="New Tenant Compensation"
                  name="ntCompensation"
                  value={formData?.ntCompensation}
                  onChange={handleChange}
                  readOnly={isFieldReadOnly()}
                />
                <Detail
                  label="Lease Renewal Compensation"
                  name="lrCompensation"
                  value={formData?.lrCompensation}
                  onChange={handleChange}
                  readOnly={isFieldReadOnly()}
                />
              </>
            )}

            <SectionHeader title="Contract Details" />
            <Detail
              label="Contract Choice"
              name="contractChoice"
              value={formData?.contractChoice}
              onChange={handleChange}
              readOnly={isFieldReadOnly()}
            />
            <Detail
              label="Service Contract Length"
              name="contractLength"
              value={formData?.contractLength}
              onChange={handleChange}
              readOnly={isFieldReadOnly()}
            />
            {/* <Detail
              label="Expected Start Date"
              name="contractStartDate"
              value={formData?.contractStartDate}
              onChange={handleChange}
              readOnly={isFieldReadOnly()}
            /> */}
            <Detail
              label="Completion Timeframe (Days)"
              name="completionTimeframeDays"
              value={formData?.completionTimeframeDays}
              onChange={handleChange}
              readOnly={isFieldReadOnly()}
            />

            <SectionHeader title="Media & Documents" />

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">
                Contract File
                {(() => {
                  const contract = getContractInfo();
                  if (contract?.type === "paxtrac") {
                    return (
                      <span
                        className="badge bg-secondary ms-2 fw-normal"
                        style={{ fontSize: "11px", verticalAlign: "middle" }}
                      >
                        PaxTrac Agreement
                      </span>
                    );
                  }
                  if (contract?.type === "custom") {
                    return (
                      <span
                        className="badge bg-secondary ms-2 fw-normal"
                        style={{ fontSize: "11px", verticalAlign: "middle" }}
                      >
                        Custom Contract
                      </span>
                    );
                  }
                  return null;
                })()}
              </label>
              <div className="contract-file-item">
                {(() => {
                  const contract = getContractInfo();
                  if (!contract) {
                    return <span className="text-muted small">No contract file</span>;
                  }

                  if (contract.url) {
                    return (
                      <a
                        href={contract.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="fd-inline-flex align-items-center me-3 mb-2 text-decoration-none"
                        style={{ color: "#7f6c4d" }}
                      >
                        <File size={18} />{" "}
                        <span className="ms-1">{contract.name}</span>
                      </a>
                    );
                  }

                  return (
                    <span className="text-muted small">{contract.name}</span>
                  );
                })()}
              </div>
            </div>

            {/* Photos Preview with Lightgallery */}
            <div className="col-md-12 mb-3">
              <label className="form-label fw-semibold">Photos Uploaded</label>
              {listing?.uploadPhotos?.length > 0 ? (
                <LightGallery
                  speed={500}
                  plugins={[lgThumbnail, lgZoom]}
                  elementClassNames="property-gallery"
                  ref={lightGalleryRef}
                >
                  {listing?.uploadPhotos?.map((src, idx) => {
                    const fileUrl = getFileUrl(src);
                    return (
                      <a
                        key={idx}
                        href={fileUrl}
                        data-src={fileUrl}
                        className="property-gallery-item"
                        style={{
                          display: "block",
                          width: "100%",
                          height: "120px",
                          borderRadius: "6px",
                          overflow: "hidden",
                          border: "1px solid #e5e7eb",
                          backgroundColor: "#f9fafb",
                        }}
                      >
                        <img
                          src={fileUrl}
                          alt={`Property photo ${idx + 1}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      </a>
                    );
                  })}
                </LightGallery>
              ) : (
                <div className="text-muted small">No photos uploaded</div>
              )}
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
            {isEditing ? (
              <>
                <button
                  type="button"
                  className="button-secondary"
                  onClick={handleCancelEdit}
                  disabled={isUpdating}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="primary-button"
                  onClick={handleSaveChanges}
                  disabled={isUpdating}
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </>
            ) : (
              <>
                <button
                  className="button-secondary"
                  onClick={() => navigate(-1)}
                >
                  Back
                </button>
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
      className={`form-control ${error ? "is-invalid border-danger" : ""}`}
      style={
        readOnly
          ? {
              backgroundColor: "#f2f4f7",
              color: "#475467",
              borderColor: "#d0d5dd",
              cursor: "not-allowed",
            }
          : {
              backgroundColor: "#ffffff",
              color: "#101828",
              borderColor: "#a99068",
              cursor: "text",
            }
      }
      value={value ?? ""}
      onChange={readOnly ? undefined : onChange}
      readOnly={readOnly}
      disabled={readOnly}
    />
    {error && <div className="text-danger small mt-1">{error}</div>}
  </div>
);

const FullDetail = ({ label, value, name, onChange, readOnly = false }) => (
  <div className="col-md-12 mb-3">
    <label className="form-label fw-semibold">{label}</label>
    <textarea
      className="form-control"
      style={
        readOnly
          ? {
              backgroundColor: "#f2f4f7",
              color: "#475467",
              borderColor: "#d0d5dd",
              cursor: "not-allowed",
            }
          : {
              backgroundColor: "#ffffff",
              color: "#101828",
              borderColor: "#a99068",
              cursor: "text",
            }
      }
      name={name}
      value={value ?? ""}
      rows={4}
      onChange={readOnly ? undefined : onChange}
      readOnly={readOnly}
      disabled={readOnly}
    />
  </div>
);
