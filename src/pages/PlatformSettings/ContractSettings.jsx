import React, { useEffect, useState, useRef } from "react";
import {
  Upload,
  Image as ImageIcon,
  User,
  Briefcase,
  FileText,
  Trash2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Swal from "sweetalert2";
import {
  useGetContractSettingsQuery,
  useUpdateContractSettingsMutation,
} from "../../api/userApi";
import { LoadingComponent } from "../../Components/LoadingComponent";
import NoData from "../../Components/NoData";

const ContractSettings = () => {
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    signerName: "",
    signerTitle: "",
    automaticSignatureText: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [errors, setErrors] = useState({});

  const { data, isLoading: isFetching, refetch } = useGetContractSettingsQuery(
    undefined,
    { refetchOnMountOrArgChange: true }
  );

  const [updateContractSettings, { isLoading: isUpdating }] =
    useUpdateContractSettingsMutation();

  // Populate data from GET API
  useEffect(() => {
    if (data) {
      const contractData = data?.data || data;
      setForm({
        signerName: contractData.signerName || "",
        signerTitle: contractData.signerTitle || "",
        automaticSignatureText: contractData.automaticSignatureText || "",
      });

      if (contractData.automaticSignatureImage) {
        setPreviewUrl(contractData.automaticSignatureImage);
      }
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
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          automaticSignatureImage: "Please select a valid image file",
        }));
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, automaticSignatureImage: "" }));
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!form.signerName.trim()) {
      newErrors.signerName = "Signer name is required";
    }

    if (!form.signerTitle.trim()) {
      newErrors.signerTitle = "Signer title is required";
    }

    if (!form.automaticSignatureText.trim()) {
      newErrors.automaticSignatureText = "Automatic signature text is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const formData = new FormData();
      formData.append("signerName", form.signerName);
      formData.append("signerTitle", form.signerTitle);
      formData.append("automaticSignatureText", form.automaticSignatureText);

      if (selectedFile) {
        formData.append("automaticSignatureImage", selectedFile);
      }

      const res = await updateContractSettings(formData).unwrap();

      Swal.fire({
        title: "Success!",
        text: res?.message || "Contract settings updated successfully",
        icon: "success",
        confirmButtonColor: "#a99068",
      });
      refetch();
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err?.data?.message || err?.message || "Failed to update contract settings",
        icon: "error",
        confirmButtonColor: "#a99068",
      });
    }
  };

  if (isFetching) {
    return <LoadingComponent isLoading fullScreen />;
  }

  return (
    <div className="contract-settings-container">
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
              className={`form-control ${errors.signerName ? "is-invalid" : ""}`}
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
              className={`form-control ${errors.signerTitle ? "is-invalid" : ""}`}
              placeholder="e.g. Manager"
              value={form.signerTitle}
              onChange={handleChange}
            />
            {errors.signerTitle && (
              <div className="invalid-feedback">{errors.signerTitle}</div>
            )}
          </div>

          {/* Automatic Signature Text */}
          <div className="col-md-12">
            <label className="form-label fw-semibold d-flex align-items-center gap-2">
              <FileText size={18} className="text-muted" />
              Automatic Signature Text <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="automaticSignatureText"
              className={`form-control ${
                errors.automaticSignatureText ? "is-invalid" : ""
              }`}
              placeholder="e.g. Pxtrac"
              value={form.automaticSignatureText}
              onChange={handleChange}
            />
            {errors.automaticSignatureText && (
              <div className="invalid-feedback">
                {errors.automaticSignatureText}
              </div>
            )}
          </div>

          {/* Automatic Signature Image Upload */}
          <div className="col-md-12">
            <label className="form-label fw-semibold d-flex align-items-center gap-2">
              <ImageIcon size={18} className="text-muted" />
              Automatic Signature Image
            </label>

            <div className="card p-3 border-dashed bg-light">
              <div className="row align-items-center">
                {previewUrl && (
                  <div className="col-auto mb-2 mb-md-0">
                    <div
                      className="position-relative border rounded p-1 bg-white shadow-sm d-flex align-items-center justify-content-center"
                      style={{ width: "160px", height: "100px", overflow: "hidden" }}
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
                  </div>
                )}

                <div className="col">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="d-none"
                    onChange={handleFileChange}
                  />
                  <div className="d-flex flex-wrap gap-2 align-items-center">
                    <button
                      type="button"
                      className="button-secondary d-flex align-items-center gap-2"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload size={16} />
                      {previewUrl ? "Change Signature Image" : "Upload Signature Image"}
                    </button>

                    {previewUrl && (
                      <button
                        type="button"
                        className="btn btn-outline-danger d-flex align-items-center gap-2"
                        onClick={handleRemoveImage}
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    )}
                  </div>
                  <small className="text-muted d-block mt-2">
                    Accepted formats: PNG, JPG, JPEG, WEBP. Max recommended size: 2MB.
                  </small>
                  {errors.automaticSignatureImage && (
                    <div className="text-danger small mt-1">
                      {errors.automaticSignatureImage}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
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
    </div>
  );
};

export default ContractSettings;
