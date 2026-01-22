import React, { useState, useMemo, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import Breadcrumbs from "../../Components/Breadcrumbs";
import CustomPagination from "../../Components/CustomPagination";
import NoData from "../../Components/NoData";
import { Modal, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import CustomDropdown from "../../Components/CustomDropdown";
import { Eye, Trash2 } from "lucide-react";
import { ReadMoreCell } from "../../Components/ReadMoreCell";

ModuleRegistry.registerModules([AllCommunityModule]);

/* ---------------- DROPDOWN OPTIONS ---------------- */

const notiTypeOptions = [
  { label: "General Notification", value: "general" },
  { label: "Promotional Offer", value: "promotion" },
  { label: "System Update", value: "system_update" },
  { label: "Important Update", value: "important" },
  { label: "Maintenance Notice", value: "maintenance" },
];

const prioritytyOptions = [
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

const userGroupOptions = [
  { label: "All Users", value: "all" },
  { label: "Vendors", value: "vendors" },
  { label: "Owners", value: "owners" },
  { label: "Managers", value: "managers" },
];

/* ---------------- STATIC DATA ---------------- */

const STATIC_NOTIFICATIONS = [
  {
    id: 1,
    title: "Scheduled Maintenance",
    message: "Platform maintenance will occur tonight from 12 AM to 2 AM.",
    type: "maintenance",
    priority: "high",
    targetAudience: "all",
    status: "sent",
    sentAt: "2026-01-20",
  },
  {
    id: 2,
    title: "New Feature Release",
    message: "We have launched a new dashboard experience.",
    type: "system_update",
    priority: "medium",
    targetAudience: "vendors",
    status: "failed",
    sentAt: "2026-01-18",
  },
  {
    id: 3,
    title: "Upcoming Announcement",
    message: "Draft notification for upcoming platform changes.",
    type: "general",
    priority: "medium",
    targetAudience: "owners",
    status: "draft",
    sentAt: "2026-01-15", // draft hasn’t been sent yet
  },
];

/* ---------------- COMPONENT ---------------- */

const NotificationCommunication = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [notiType, setNotiType] = useState("");
  const [priorityType, setPriorityType] = useState("");
  const [userGroup, setUserGroup] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const filteredData = useMemo(() => {
    return STATIC_NOTIFICATIONS.filter(
      (n) =>
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.message.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  const handleSubmit = () => {
    if (!title || !message || !notiType || !priorityType || !userGroup) {
      Swal.fire("Error", "All fields are required", "error");
      return;
    }

    Swal.fire({
      title: "Success!",
      text: "Notification sent successfully!",
      icon: "success",
      timer: 2500,
      showConfirmButton: true,
    });

    setTitle("");
    setMessage("");
    setNotiType("");
    setPriorityType("");
    setUserGroup("");
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete Announcement?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Here you would call your delete API or remove item
        // Example: deleteAnnouncement(id);

        // Show success alert
        Swal.fire({
          title: "Deleted!",
          text: "The announcement has been deleted.",
          icon: "success",
          confirmButtonColor: "#a99068",
        });
      }
    });
  };

  const StatusBadge = ({ status }) => {
    let bgColor = "#6c757d"; // default gray
    let color = "#fff"; // default white

    if (status === "sent") {
      bgColor = "#d1fae5";
      color = "#065f46";
    } else if (status === "failed") {
      bgColor = "#fee2e2"; // red
      color = "#991b1b";
    } else if (status === "draft") {
      bgColor = "#fff6d9"; // gray
      color = "#dda200";
    }

    return (
      <span
        style={{
          backgroundColor: bgColor,
          color: color,
          padding: "5px 15px",
          borderRadius: "50px",
          textTransform: "capitalize",
          fontSize: "12px",
        }}
      >
        {status}
      </span>
    );
  };

  const columnDefs = useMemo(
    () => [
      {
        headerName: "S.NO.",
        valueGetter: (p) => p.node.rowIndex + 1,
        width: 80,
      },
      {
        headerName: "Title",
        field: "title",
        flex: 1,
        minWidth: 200,
        cellRenderer: ReadMoreCell,
      },
      { headerName: "Type", field: "type", flex: 1 },
      {
        headerName: "Target Audience",
        field: "targetAudience",
        flex: 1,
      },
      { headerName: "Priority", field: "priority", flex: 1 },
      {
        headerName: "Status",
        field: "status",
        flex: 1,
        cellRenderer: (params) => <StatusBadge status={params.value} />,
      },
      {
        headerName: "Sent At",
        field: "sentAt",
        flex: 1,
      },
      {
        headerName: "Action",
        cellRenderer: (params) => (
          <div className="d-flex gap-3">
            <Eye
              size={18}
              style={{ cursor: "pointer" }}
              onClick={() => {
                setSelectedNotification(params.data);
                setOpenModal(true);
              }}
            />
            |
            <Trash2
              size={18}
              className="text-danger"
              style={{ cursor: "pointer" }}
              onClick={() => handleDelete(params.data.id)}
            />
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <main className="app-content body-bg">
      <section className="container">
        <div className="title-heading mb-2">Notification & Communication</div>
        <p className="title-sub-heading">
          Send platform-wide or targeted notifications to keep users informed
        </p>

        <Breadcrumbs />

        {/* FORM */}
        <div className="custom-card bg-white p-4 mb-4">
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Title *</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter notification title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">
                Notification Type *
              </label>
              <CustomDropdown
                options={notiTypeOptions}
                placeholder="Select notification type"
                value={notiType}
                onChange={setNotiType}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Priority *</label>
              <CustomDropdown
                options={prioritytyOptions}
                placeholder="Select priority"
                value={priorityType}
                onChange={setPriorityType}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">User Group *</label>
              <CustomDropdown
                options={userGroupOptions}
                placeholder="Select target audience"
                value={userGroup}
                onChange={setUserGroup}
              />
            </div>

            <div className="col-md-12 mb-3">
              <label className="form-label fw-semibold">Message *</label>
              <textarea
                className="form-control"
                rows={4}
                placeholder="Type notification message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div className="col-md-12">
              <button
                className="primary-button card-btn"
                onClick={handleSubmit}
              >
                Send Notification
              </button>
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <div className="search-bar mb-3 w-50">
          <input
            type="text"
            className="form-control ps-3"
            placeholder="Search by title..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* TABLE */}
        <div className="custom-card bg-white p-3">
          <h5 className="mb-3">Recent Notifications</h5>

          {filteredData.length === 0 ? (
            <NoData text="No notifications found" />
          ) : (
            <>
              <div className="ag-theme-alpine">
                <AgGridReact
                  rowData={filteredData}
                  columnDefs={columnDefs}
                  domLayout="autoHeight"
                  headerHeight={40}
                  rowHeight={48}
                  getRowStyle={(params) => ({
                    backgroundColor:
                      params.node.rowIndex % 2 !== 0 ? "#e7e0d52b" : "white",
                  })}
                />
              </div>

              <CustomPagination
                currentPage={page}
                totalPages={1}
                totalCount={filteredData.length}
                pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
              />
            </>
          )}
        </div>

        {/* VIEW MODAL */}
        <Modal show={openModal} onHide={() => setOpenModal(false)} centered>
          <Modal.Body>
            <Modal.Title className="fw-light text-center mb-3">
              {selectedNotification?.title}
            </Modal.Title>

            <Form.Group>
              <Form.Label className="fw-semibold">Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={selectedNotification?.message || ""}
                readOnly
                disabled
              />
            </Form.Group>

            <div className="text-end mt-4">
              <button
                className="button-secondary"
                onClick={() => setOpenModal(false)}
              >
                Close
              </button>
            </div>
          </Modal.Body>
        </Modal>
      </section>
    </main>
  );
};

export default NotificationCommunication;
