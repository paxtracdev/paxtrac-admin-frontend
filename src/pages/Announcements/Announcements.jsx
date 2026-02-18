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
import {
  useCreateAnnouncementMutation,
  useGetAnnouncementsQuery,
} from "../../api/notificationApi";
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
  { label: "Vendors", value: "vendor" },
  { label: "Owners", value: "owner" },
  { label: "Managers", value: "manager" },
];

/* ---------------- STATIC DATA ---------------- */

const STATIC_NOTIFICATIONS = [
  {
    id: 1,
    title: "Scheduled Maintenance",
    message: "Platform maintenance will occur tonight from 12 AM to 2 AM.",
    type: "maintenance",
    priority: "high",
    target: "all",

    sentAt: "2026-01-20",
  },
  {
    id: 2,
    title: "New Feature Release",
    message: "We have launched a new dashboard experience.",
    type: "system_update",
    priority: "medium",
    target: "vendors",

    sentAt: "2026-01-18",
  },
  {
    id: 3,
    title: "Upcoming Announcement",
    message: "Draft notification for upcoming platform changes.",
    type: "general",
    priority: "medium",
    target: "owners",

    sentAt: "2026-01-15", // draft hasn’t been sent yet
  },
];

/* ---------------- COMPONENT ---------------- */

const Announcements = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [notiType, setNotiType] = useState("");
  const [priorityType, setPriorityType] = useState("");
  const [userGroup, setUserGroup] = useState("");
  const [errors, setErrors] = useState({});
  const [createAnnouncement, { isLoading }] = useCreateAnnouncementMutation();
  const { data, isLoading: isListLoading } = useGetAnnouncementsQuery({
    page,
    limit: pageSize,
    search,
  });

  const [openModal, setOpenModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const filteredData = useMemo(() => {
    return STATIC_NOTIFICATIONS.filter((n) => {
      const searchText = search.toLowerCase();

      return (
        n.title.toLowerCase().includes(searchText) ||
        n.message.toLowerCase().includes(searchText) ||
        n.target.toLowerCase().includes(searchText)
      );
    });
  }, [search]);

  const validate = () => {
    const newErrors = {};

    if (!title.trim()) newErrors.title = "Title is required";
    if (!message.trim()) newErrors.message = "Message is required";
    if (!userGroup) newErrors.userGroup = "Target audience  is required";
    // if (!notiType) newErrors.notiType = "Notification type is required";
    // if (!priorityType) newErrors.priorityType = "Priority is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      await createAnnouncement({
        title,
        message,
        target: userGroup,
      }).unwrap();

      Swal.fire({
        title: "Success!",
        text: "Notification sent successfully!",
        icon: "success",
        timer: 2500,
        showConfirmButton: true,
        confirmButtonColor: "#a99068",
      });

      setTitle("");
      setMessage("");
      setUserGroup("");
      setErrors({});
    } catch (err) {
      Swal.fire(
        "Failed",
        err?.data?.message || "Failed to send notification",
        "error",
      );
    }
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
        minWidth: 250,
        cellRenderer: ReadMoreCell,
      },
      // { headerName: "Type", field: "type", flex: 1 },
      {
        headerName: "Target Audience",
        field: "target",
        flex: 1,
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
        <div className="title-heading mb-2">Announcements</div>
        <p className="title-sub-heading">
          Send updates that matter, to the people who need them.{" "}
        </p>

        <Breadcrumbs />

        {/* FORM */}
        <div className="custom-card bg-white p-4 mb-4">
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Title *</label>
              <input
                type="text"
                className={`form-control ${errors.title ? "is-invalid" : ""}`}
                placeholder="Enter notification title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setErrors((prev) => ({ ...prev, title: "" }));
                }}
              />
              {errors.title && (
                <div className="text-danger">{errors.title}</div>
              )}
            </div>

            {/* <div className="col-md-6 mb-3">
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
            </div> */}

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">
                Target Audience *
              </label>
              <CustomDropdown
                options={userGroupOptions}
                placeholder="Select target audience"
                value={userGroup}
                onChange={(val) => {
                  setUserGroup(val);
                  setErrors((prev) => ({ ...prev, userGroup: "" }));
                }}
              />
              {errors.userGroup && (
                <small className="text-danger">{errors.userGroup}</small>
              )}
            </div>

            <div className="col-md-12 mb-3">
              <label className="form-label fw-semibold">Message *</label>
              <textarea
                className={`form-control ${errors.message ? "text-danger" : ""}`}
                rows={4}
                placeholder="Type notification message here..."
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  setErrors((prev) => ({ ...prev, message: "" }));
                }}
              />
              {errors.message && (
                <div className="text-danger">{errors.message}</div>
              )}
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
            placeholder="Search by title or target audience ..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* TABLE */}
        <div className="custom-card bg-white p-3">
          <h5 className="mb-3">Recent Notifications</h5>

          {data?.data?.length === 0 ? (
            <NoData text="No notifications found" />
          ) : (
            <>
              <div className="ag-theme-alpine">
                <AgGridReact
                  rowData={data?.data || []}
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
                totalPages={data?.totalPages || 1}
                totalCount={data?.total}
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

export default Announcements;
