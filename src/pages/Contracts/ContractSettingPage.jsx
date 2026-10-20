import React, { useEffect, useState, useRef } from "react";
import {
  Upload,
  User,
  Briefcase,
  Clock,
  FileCheck,
  PenTool,
} from "lucide-react";
import Swal from "sweetalert2";
import Breadcrumbs from "../../Components/Breadcrumbs";
import {
  useGetContractSettingsQuery,
  useUpdateContractSettingsMutation,
} from "../../api/userApi";
import { LoadingComponent } from "../../Components/LoadingComponent";
import { formatHumanReadableFileName, formatBytes } from "../../utils/helpers";

const getFileUrl = (imageProp) => {
  if (!imageProp) return "";

  let path = "";
  if (typeof imageProp === "string") {
    path = imageProp;
  } else if (imageProp?.fileUrl) {
    path = imageProp.fileUrl;
  } else if (imageProp?.url) {
    path = imageProp.url;
  }

  if (!path) return "";

  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("blob:") ||
    path.startsWith("data:")
  ) {
    return path;
  }

  const baseUrl = import.meta.env.VITE_BASE_URL || "https://api.paxtrac.dev/api/admin";
  const domain = baseUrl
    .replace(/\/api\/admin\/?$/, "")
    .replace(/\/api\/?$/, "")
    .replace(/\/+$/, "");

  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  if (cleanPath.startsWith("/rustfs/paxtrac")) {
    return `${domain}${cleanPath}`;
  }

  return `${domain}/rustfs/paxtrac${cleanPath}`;
};

const ContractSettingPage = () => {
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    signerName: "",
    signerTitle: "",
    automaticSignatureText: "Automatic E-Signature from PaxTrac",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [imageMeta, setImageMeta] = useState(null);
  const [contractMeta, setContractMeta] = useState(null);
  const [errors, setErrors] = useState({});

  const { data, isLoading: isFetching, refetch } = useGetContractSettingsQuery(
    undefined,
    { refetchOnMountOrArgChange: true }
  );

  const [updateContractSettings, { isLoading: isUpdating }] =
    useUpdateContractSettingsMutation();

  // Populate data from GET API response
  useEffect(() => {
    if (data) {
      const contractData = data?.data || data;
      setForm({
        signerName: contractData.signerName || "Lauren Gobel",
        signerTitle: contractData.signerTitle || "Manager",
        automaticSignatureText:
          contractData.automaticSignatureText ||
          "Automatic E-Signature from PaxTrac",
      });

      if (contractData.automaticSignatureImage) {
        if (typeof contractData.automaticSignatureImage === "object") {
          setImageMeta(contractData.automaticSignatureImage);
          setPreviewUrl(getFileUrl(contractData.automaticSignatureImage));
        } else {
          setPreviewUrl(getFileUrl(contractData.automaticSignatureImage));
        }
      }

      setContractMeta({
        id: contractData._id,
        active: contractData.active ?? true,
        createdAt: contractData.createdAt,
        updatedAt: contractData.updatedAt,
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
      const ext = file.name.split(".").pop()?.toLowerCase();
      const allowedExts = ["png", "jpg", "jpeg", "webp"];

      if (!allowedTypes.includes(file.type) && !allowedExts.includes(ext)) {
        const errorMsg = "Only PNG, JPG, JPEG, or WEBP image files are allowed.";
        setErrors((prev) => ({
          ...prev,
          automaticSignatureImage: errorMsg,
        }));
        Swal.fire({
          icon: "error",
          title: "Invalid File Format",
          text: errorMsg,
          confirmButtonColor: "#a99068",
        });
        e.target.value = "";
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setImageMeta({
        originalFileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
      });
      setErrors((prev) => ({ ...prev, automaticSignatureImage: "" }));
    }
  };

  const handleViewDocument = (e) => {
    e.preventDefault();
    const url = selectedFile
      ? previewUrl
      : getFileUrl(imageMeta || previewUrl);
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      Swal.fire({
        icon: "warning",
        title: "No signature image available",
        text: "No authorized signature image has been uploaded yet.",
        confirmButtonColor: "#a99068",
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!form.signerName?.trim()) {
      newErrors.signerName = "Signer name is required";
    }

    if (!form.signerTitle?.trim()) {
      newErrors.signerTitle = "Signer title is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const formData = new FormData();
      formData.append("signerName", form.signerName.trim());
      formData.append("signerTitle", form.signerTitle.trim());
      formData.append(
        "automaticSignatureText",
        form.automaticSignatureText?.trim() || "Automatic E-Signature from PaxTrac"
      );

      if (selectedFile) {
        formData.append("automaticSignatureImage", selectedFile);
      }

      const res = await updateContractSettings(formData).unwrap();

      Swal.fire({
        title: "Success!",
        text: res?.message || "PaxTrac contract setting updated successfully",
        icon: "success",
        confirmButtonColor: "#a99068",
      });
      refetch();
    } catch (err) {
      Swal.fire({
        title: "Error",
        text:
          err?.data?.message ||
          err?.message ||
          "Failed to update contract setting",
        icon: "error",
        confirmButtonColor: "#a99068",
      });
    }
  };

  const hasSignature = Boolean(previewUrl || imageMeta?.fileUrl || selectedFile);

  const displayFileName = hasSignature
    ? formatHumanReadableFileName(
        selectedFile?.name ||
          imageMeta?.originalFileName ||
          imageMeta?.storedFileName ||
          previewUrl,
        "Contract_Signature.png"
      )
    : "No signature file uploaded yet";

  const displayFileSize = selectedFile?.size || imageMeta?.fileSize;

  return (
    <main className="app-content body-bg">
      <section className="container">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div>
            <div className="title-heading">Contracts</div>
            <p className="title-sub-heading">
              Manage automatic signature image, signer name, signer title, and contract settings
            </p>
          </div>

          {contractMeta?.active !== undefined && (
            <span
              className={`badge px-3 py-2 ${
                contractMeta.active ? "bg-success" : "bg-secondary"
              }`}
              style={{ fontSize: "14px", fontWeight: "600" }}
            >
              {contractMeta.active ? "Status: Active" : "Status: Inactive"}
            </span>
          )}
        </div>

        <Breadcrumbs />

        {/* Content Card */}
        <div className="custom-card bg-white p-4 mt-3">
          {isFetching ? (
            <LoadingComponent isLoading fullScreen />
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="row g-4">
                {/* Signer Name */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold d-flex align-items-center gap-2">
                    <User size={18} className="text-muted" />
                    Signer Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="signerName"
                    className={`form-control ${
                      errors.signerName ? "is-invalid" : ""
                    }`}
                    placeholder="e.g. Lauren Gobel"
                    value={form.signerName}
                    onChange={handleChange}
                  />
                  {errors.signerName && (
                    <div className="invalid-feedback">{errors.signerName}</div>
                  )}
                </div>

                {/* Signer Title */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold d-flex align-items-center gap-2">
                    <Briefcase size={18} className="text-muted" />
                    Signer Title <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="signerTitle"
                    className={`form-control ${
                      errors.signerTitle ? "is-invalid" : ""
                    }`}
                    placeholder="e.g. Manager"
                    value={form.signerTitle}
                    onChange={handleChange}
                  />
                  {errors.signerTitle && (
                    <div className="invalid-feedback">{errors.signerTitle}</div>
                  )}
                </div>

                {/* Contract Section (Matching PaxTrac Theme) */}
                <div className="col-md-12">
                  <h5
                    style={{ color: "#a99068", fontWeight: "600" }}
                    className="mb-2"
                  >
                    Contract
                  </h5>

                  <div className="border rounded-3 p-3 bg-white d-flex align-items-center justify-content-between shadow-sm">
                    <div className="d-flex align-items-center gap-3">
                      {previewUrl ? (
                        <div
                          className="border rounded-2 p-1 bg-light d-flex align-items-center justify-content-center"
                          style={{
                            width: "48px",
                            height: "40px",
                            overflow: "hidden",
                            backgroundColor: "#fcfbf9",
                          }}
                        >
                          <img
                            src={previewUrl}
                            alt="Signature Preview"
                            style={{
                              maxWidth: "100%",
                              maxHeight: "100%",
                              objectFit: "contain",
                            }}
                          />
                        </div>
                      ) : (
                        <div
                          className="rounded-2 p-2 d-flex align-items-center justify-content-center"
                          style={{
                            backgroundColor: "#fcfbf9",
                            border: "1px solid #ebd9c0",
                            width: "48px",
                            height: "40px",
                          }}
                        >
                          <PenTool size={20} color="#a99068" />
                        </div>
                      )}
                      <div>
                        <span className="fw-semibold text-dark fs-6 d-block">
                          {displayFileName}
                        </span>
                        {displayFileSize ? (
                          <small className="text-muted">
                            {formatBytes(displayFileSize)}
                          </small>
                        ) : null}
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-3">
                      {hasSignature && (
                        <button
                          type="button"
                          onClick={handleViewDocument}
                          className="btn border-0 bg-transparent p-0 text-decoration-none fw-semibold"
                          style={{
                            color: "#a99068",
                            backgroundColor: "transparent",
                            fontSize: "15px",
                            cursor: "pointer",
                            boxShadow: "none",
                            outline: "none",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.textDecoration = "underline")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.textDecoration = "none")
                          }
                        >
                          View
                        </button>
                      )}

                      <input
                        type="file"
                        ref={fileInputRef}
                        accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/jpg,image/webp"
                        className="d-none"
                        onChange={handleFileChange}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="d-flex align-items-center gap-1 px-3 py-1 fw-semibold"
                        style={{
                          backgroundColor: "#ffffff",
                          color: "#a99068",
                          border: "1.5px solid #a99068",
                          borderRadius: "6px",
                          fontSize: "14px",
                          cursor: "pointer",
                          transition: "all 0.2s ease-in-out",
                          boxShadow: "none",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#a99068";
                          e.currentTarget.style.color = "#ffffff";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#ffffff";
                          e.currentTarget.style.color = "#a99068";
                        }}
                      >
                        <Upload size={14} /> {hasSignature ? "Change" : "Upload"}
                      </button>
                    </div>
                  </div>
                  <small className="text-muted d-block mt-1">
                    Accepted formats: PNG, JPG, JPEG, WEBP.
                  </small>
                  {errors.automaticSignatureImage && (
                    <div className="text-danger small mt-1">
                      {errors.automaticSignatureImage}
                    </div>
                  )}
                </div>

                {/* Metadata Footer info */}
                {contractMeta?.updatedAt && (
                  <div className="col-12 border-top pt-3 text-muted small d-flex flex-wrap gap-4">
                    <span className="d-flex align-items-center gap-1">
                      <Clock size={14} />
                      Last Updated: {new Date(contractMeta.updatedAt).toLocaleString()}
                    </span>
                    {contractMeta.createdAt && (
                      <span className="d-flex align-items-center gap-1">
                        <FileCheck size={14} />
                        Created At: {new Date(contractMeta.createdAt).toLocaleString()}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Form Action Buttons */}
              <div className="d-flex gap-3 mt-4">
                <button
                  type="submit"
                  className="primary-button"
                  disabled={isUpdating || isFetching}
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default ContractSettingPage;
