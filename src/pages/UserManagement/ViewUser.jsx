import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "../../Components/Breadcrumbs";
import CustomDropdown from "../../Components/CustomDropdown";
import Swal from "sweetalert2";
import Switch from "react-switch";
import { useGetUserByIdQuery, useUpdateUserMutation } from "../../api/userApi";
import Loader from "../../Components/Loader";
import NoData from "../../Components/NoData";

const ViewUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const { data, isLoading, error } = useGetUserByIdQuery(id);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  useEffect(() => {
    if (data?.data) {
      const user = data.data;

      setFormData({
        id: user._id,
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        gender: user.gender || "",
        role: user.role || "",
        status: user.status,
        isOtpVerified: user.isOtpVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        subscriptionStatus: user.subscription?.status || "none",
        eventsCreated: user.subscription?.eventsCreated || 0,
      });
    }
  }, [data]);

  // if (!user) return null;
  const formatDateForInput = (date) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };

  if (isLoading) {
    return (
      <section className="app-content h-full overflow-auto">
        <div
          className="container d-flex justify-content-center align-items-center"
          style={{ height: "70vh" }}
        >
          <Loader size="lg" color="logo" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <div className="app-content">
        <div className="container">
          <NoData text="User not found" imageWidth={300} showImage={true} />
        </div>
      </div>
    );
  }
  return (
    <main className="app-content body-bg">
      <section className="container">
        <div className="d-flex justify-content-between mb-4">
          <div>
            <div className="title-heading mb-2">View User</div>
          </div>
        </div>

        <Breadcrumbs />

        <div className="custom-card bg-white p-4 mt-3">
          <div className="title-heading text-center mb-4">User Details</div>

          <div className="row">
            {/* User ID */}
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">User ID</label>
              <input
                type="text"
                className="form-control"
                value={formData?.id || ""}
                readOnly
                disabled
              />
            </div>

            {/* User Name */}
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">First Name</label>
              <input
                type="text"
                className="form-control"
                value={formData?.first_name || ""}
                readOnly
                disabled
                onChange={(e) =>
                  setFormData({ ...formData, first_name: e.target.value })
                }
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Last Name</label>
              <input
                type="text"
                className="form-control"
                value={formData?.last_name || ""}
                readOnly
                disabled 
                onChange={(e) =>
                  setFormData({ ...formData, last_name: e.target.value })
                }
              />
            </div>

            {/* Email */}
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your email"
                value={formData?.email || ""}
                readOnly
                disabled
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Role</label>
              <input
                type="text"
                className="form-control"
                value={formData?.role || ""}
                readOnly
                disabled
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="fw-semibold">Subscription Status</label>
              <input
                className="form-control"
                value={formData?.subscriptionStatus}
                readOnly
                disabled
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="fw-semibold">Events Created</label>
              <input
                className="form-control"
                value={formData?.eventsCreated}
                readOnly
                disabled
                onChange={(e) =>
                  setFormData({ ...formData, eventsCreated: e.target.value })
                }
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="fw-semibold">OTP Verified</label>
              <input
                className="form-control"
                value={formData?.isOtpVerified ? "Yes" : "No"}
                readOnly
                disabled
              />
            </div>

            <div className="col-md-6">
              <label className="fw-semibold">Created Date</label>
              <input
                type="date"
                className="form-control"
                value={formatDateForInput(formData?.createdAt)}
                readOnly
                disabled
              />
            </div>
          </div>

          <div className="d-flex justify-content-center gap-3 mt-4">
            <button className="button-secondary" onClick={() => navigate(-1)}>
              Back
            </button> 
          </div>
        </div>
      </section>
    </main>
  );
};

export default ViewUser;
