import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../Components/Breadcrumbs";
import { Editor } from "@tinymce/tinymce-react";
import Swal from "sweetalert2";
import CustomDropdown from "../../Components/CustomDropdown";

const genderOptions = [
  { label: "Ongoing", value: "Ongoing" },
  { label: "Completed", value: "Completed" },
];
const AddEvent = () => {
  const navigate = useNavigate();
  const [gender, setGender] = useState("");

  const [startDate, setStartDate] = useState(""); // format: "YYYY-MM-DD"
  const [endDate, setEndDate] = useState("");

  const handleAddUser = () => {
    // basic validation
    if (!startDate) {
      Swal.fire({
        title: "Missing start date",
        text: "Please select a start date.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }
    if (!endDate) {
      Swal.fire({
        title: "Missing end date",
        text: "Please select an end date.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    // compare dates
    const s = new Date(startDate);
    const e = new Date(endDate);
    if (e < s) {
      Swal.fire({
        title: "Invalid dates",
        text: "End date cannot be earlier than start date.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    // success - include chosen values if you want
    Swal.fire({
      title: "Success!",
      html: `
        <p>Event added successfully.</p>
        <p><strong>Start:</strong> ${s.toLocaleDateString()}</p>
        <p><strong>End:</strong> ${e.toLocaleDateString()}</p>
        <p><strong>Status:</strong> ${status || "—"}</p>
      `,
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      navigate(-1); // Optional: go back after success
    });
  };

  return (
    <main className="app-content body-bg">
      <section className="container">
        {/* Header */}
        <div className="d-flex justify-content-between mb-4">
          <div>
            <div className="title-heading mb-2">Add Event</div>
            {/* <p className="title-sub-heading">Add User</p> */}
          </div>
        </div>

        <Breadcrumbs />

        <div className="custom-card bg-white p-4 mt-3">
          <div className="title-heading d-flex justify-content-center text-align-center">
            Add Event
          </div>

          <div className="row">
            {/* Page Title */}
            <div className="col-md-6 mb-3 mt-2">
              <label className="form-label fw-semibold">Event Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter event name"
              />
            </div>

            {/* Slug Field */}
            <div className="col-md-6 mb-3 mt-2">
              <label className="form-label fw-semibold">Participants</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter participants"
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Status</label>
              <CustomDropdown
                options={genderOptions}
                placeholder="Select Status"
                value={gender}
                onChange={setGender}
              />
            </div>

            {/* Start Date */}
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Start Date</label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                onClick={(e) => e.currentTarget.showPicker?.()}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  // if endDate is before newly picked startDate, clear endDate
                  if (endDate && new Date(e.target.value) > new Date(endDate)) {
                    setEndDate("");
                  }
                }}
                aria-label="Start date"
              />
            </div>

            {/* End Date */}
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">End Date</label>
              <input
                type="date"
                className="form-control"
                value={endDate}
                onClick={(e) => e.currentTarget.showPicker?.()}
                onChange={(e) => setEndDate(e.target.value)}
                aria-label="End date"
                // enforce minimum selectable date to be the chosen startDate (if set)
                min={startDate || undefined}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="d-flex gap-3 mt-4 justify-content-center">
            <button className="button-secondary" onClick={() => navigate(-1)}>
              Cancel
            </button>

            <button className="primary-button card-btn" onClick={handleAddUser}>
              Add Event
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AddEvent;
