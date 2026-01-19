import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "../../Components/Breadcrumbs";
import Swal from "sweetalert2";
import {
  useGetEventDetailsQuery,
  useUpdateEventMutation,
} from "../../api/eventApi";
import Loader from "../../Components/Loader";
import NoData from "../../Components/NoData";

const ViewEvent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetEventDetailsQuery(eventId);
  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();

  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState(null);

  // Fill form when API responds
  useEffect(() => {
    if (data?.data) {
      setFormData({
        location: data.data.location,
        description: data.data.description,
        participantsCount: data.data.participantsCount,
        eventName: data.data.eventName,
        startDate: data.data.startDate?.split("T")[0],
        endDate: data.data.endDate?.split("T")[0],
        status: data.data.status,
      });
    }
  }, [data]);

  const handleUpdate = async () => {
    try {
      await updateEvent({
        id: eventId,
        body: {
          description: formData.description,
          location: formData.location,
          participantsCount: formData.participantsCount,
          eventName: formData.eventName,
          startDate: formData.startDate,
          endDate: formData.endDate,
          participantsCount: formData.participantsCount,
          status: formData.status,
        },
      }).unwrap();

      Swal.fire("Success", "Event updated successfully", "success");
      setIsEdit(false);
    } catch (err) {
      Swal.fire("Error", "Failed to update event", "error");
    }
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
          <NoData text="Event not found" imageWidth={300} showImage={true} />
        </div>
      </div>
    );
  }
  if (!formData) return null;

  return (
    <main className="app-content body-bg">
      <section className="container">
        <div className="d-flex justify-content-between mb-4">
          <div>
            <div className="title-heading mb-2">View Event</div>
          </div>
        </div>

        <Breadcrumbs />

        <div className="custom-card bg-white p-4 mt-3">
          <div className="title-heading text-center mb-4">Event Details</div>

          <div>
            <label className="form-label fw-semibold">Description</label>
            <textarea
              className="form-control"
              rows={4}
              placeholder="Type your description..."
              value={formData.description}
              readOnly={!isEdit}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            ></textarea>
          </div>
          <div className="row">
            {/* Event ID */}
            <div className="col-md-6 mb-3 mt-2">
              <label className="form-label fw-semibold">Event ID</label>
              <input
                type="text"
                className="form-control"
                value={eventId}
                readOnly
              />
            </div>

            {/* Event Name */}
            <div className="col-md-6 mb-3 mt-2">
              <label className="form-label fw-semibold">Event Name</label>
              <input
                type="text"
                className="form-control"
                value={formData.eventName}
                readOnly={!isEdit}
                onChange={(e) =>
                  setFormData({ ...formData, eventName: e.target.value })
                }
              />
            </div>

            {/* location */}
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">location</label>
              <input
                type="text"
                className="form-control"
                value={formData.location}
                readOnly={!isEdit}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>

            {/* Participants count */}
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">
                Participants count
              </label>
              <input
                type="text"
                className="form-control"
                value={formData.participantsCount}
                readOnly={!isEdit}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    participantsCount: e.target.value,
                  })
                }
              />
            </div>
            {/* Start Date */}
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Start Date</label>
              <input
                type="date"
                className="form-control cursor-pointer"
                value={formData.startDate}
                readOnly={!isEdit}
                onClick={(e) => {
                  if (isEdit && e.target.showPicker) {
                    e.target.showPicker();
                  }
                }}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    startDate: e.target.value,
                    endDate:
                      formData.endDate && e.target.value > formData.endDate
                        ? ""
                        : formData.endDate,
                  })
                }
              />
            </div>

            {/* End Date */}
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">End Date</label>
              <input
                type="date"
                className="form-control cursor-pointer"
                value={formData.endDate}
                readOnly={!isEdit}
                min={formData.startDate}
                onClick={(e) => {
                  if (isEdit && e.target.showPicker) {
                    e.target.showPicker();
                  }
                }}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
              />
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="d-flex justify-content-center gap-3 mt-4">
            <button className="button-secondary" onClick={() => navigate(-1)}>
              Back
            </button>

            {!isEdit ? (
              <button
                className="primary-button card-btn"
                onClick={() => {
                  Swal.fire({
                    title: "Edit Mode Enabled",
                    text: "You can now edit the event details.",
                    icon: "info",
                    confirmButtonColor: "#166fff",
                  }).then(() => setIsEdit(true));
                }}
              >
                Edit
              </button>
            ) : (
              <button
                className="primary-button card-btn"
                onClick={handleUpdate}
                disabled={isUpdating}
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default ViewEvent;
