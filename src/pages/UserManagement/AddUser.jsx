import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../Components/Breadcrumbs";
import { Editor } from "@tinymce/tinymce-react";
import Swal from "sweetalert2";
import CustomDropdown from "../../Components/CustomDropdown";

const genderOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
];
const AddUser = () => {
  const navigate = useNavigate();
  const [gender, setGender] = useState("");

  const handleAddUser = () => {
    Swal.fire({
      title: "Success!",
      text: "User Added Successfully",
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
            <div className="title-heading mb-2">Add User</div>
            {/* <p className="title-sub-heading">Add User</p> */}
          </div>
        </div>

        <Breadcrumbs />

        <div className="custom-card bg-white p-4 mt-3">
          <div className="title-heading d-flex justify-content-center text-align-center">
            Add User
          </div>

          <div className="row">
            {/* Page Title */}
            <div className="col-md-6 mb-3 mt-2">
              <label className="form-label fw-semibold">User Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter user name"
              />
            </div>

            {/* Slug Field */}
            <div className="col-md-6 mb-3 mt-2">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter email"
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Gender</label>
              <CustomDropdown
                options={genderOptions}
                placeholder="Select Gender"
                value={gender}
                onChange={setGender}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="d-flex gap-3 mt-4 justify-content-center">
            <button className="button-secondary" onClick={() => navigate(-1)}>
              Cancel
            </button>

            <button className="primary-button card-btn" onClick={handleAddUser}>
              Add User
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AddUser;
