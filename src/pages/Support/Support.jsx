import React, { useState, useMemo, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import Breadcrumbs from "../../Components/Breadcrumbs";
import CustomPagination from "../../Components/CustomPagination";
import NoData from "../../Components/NoData";
import { Modal, Form } from "react-bootstrap";
import { Eye, MessageSquare, Building2 } from "lucide-react";
import Swal from "sweetalert2";
import SupportStatusDropdown from "../../Components/SupportStatusDropdown";
import { useGetSupportQuery, useSupportMutation } from "../../api/userApi";
import { LoadingComponent } from "../../Components/LoadingComponent";

ModuleRegistry.registerModules([AllCommunityModule]);

// Static initial data for General Support Requests
const STATIC_GENERAL_SUPPORT_DATA = [
  {
    _id: "gen-1",
    userName: "John Doe",
    userEmail: "john@example.com",
    subject: "Account Login & Authentication Issue",
    message: "I am unable to login with my registered credentials after requesting a password reset.",
    status: "pending",
    createdAt: "2026-10-05T10:30:00.000Z",
  },
  {
    _id: "gen-2",
    userName: "Jane Smith",
    userEmail: "jane@example.com",
    subject: "Billing & Payment Inquiry",
    message: "My subscription payment failed during auto-renewal, but the amount was deducted from my account.",
    status: "success",
    createdAt: "2026-10-04T14:15:00.000Z",
  },
  {
    _id: "gen-3",
    userName: "Alex Brown",
    userEmail: "alex@example.com",
    subject: "Mobile App Crash Report",
    message: "The application crashes repeatedly when trying to open the analytics & reports section.",
    status: "pending",
    createdAt: "2026-10-03T09:45:00.000Z",
  },
  {
    _id: "gen-4",
    userName: "Emily Davis",
    userEmail: "emily@example.com",
    subject: "Tax ID & Profile Update",
    message: "Please assist with updating our company tax registration number in the account settings page.",
    status: "pending",
    createdAt: "2026-10-02T16:20:00.000Z",
  },
  {
    _id: "gen-5",
    userName: "Michael Clark",
    userEmail: "michael@example.com",
    subject: "General Platform Inquiry",
    message: "How can I upgrade our plan to allow additional property managers to access the dashboard?",
    status: "success",
    createdAt: "2026-10-01T11:10:00.000Z",
  },
];

const Support = () => {
  // Tab state: "general" | "listing"
  const [activeTab, setActiveTab] = useState("general");

  // General Support local state
  const [generalSupportData, setGeneralSupportData] = useState(
    STATIC_GENERAL_SUPPORT_DATA,
  );
  const [generalPage, setGeneralPage] = useState(1);
  const [generalPageSize, setGeneralPageSize] = useState(10);

  // Listing Support API pagination & search
  const [listingPage, setListingPage] = useState(1);
  const [listingPageSize, setListingPageSize] = useState(10);

  // Search input state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // Modal & Selection State
  const [openModal, setOpenModal] = useState(false);
  const [selectedSupport, setSelectedSupport] = useState(null);

  // Debounce search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setGeneralPage(1);
      setListingPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // RTK Query for Listing Support Requests
  const { data: listingApiData, isLoading: isListingLoading } = useGetSupportQuery(
    {
      page: listingPage,
      pageSize: listingPageSize,
      search: debouncedSearch,
    },
    { skip: activeTab !== "listing" },
  );

  const [supportMutation] = useSupportMutation();

  const listingSupportData = listingApiData?.data || [];
  const listingTotalCount = listingApiData?.pagination?.total || 0;
  const listingTotalPages = Math.ceil(listingTotalCount / listingPageSize) || 1;

  // Filter General Support Data
  const filteredGeneralData = useMemo(() => {
    const query = debouncedSearch.toLowerCase().trim();
    if (!query) return generalSupportData;
    return generalSupportData.filter(
      (item) =>
        item.userName?.toLowerCase().includes(query) ||
        item.userEmail?.toLowerCase().includes(query) ||
        item.subject?.toLowerCase().includes(query) ||
        item.message?.toLowerCase().includes(query),
    );
  }, [generalSupportData, debouncedSearch]);

  const generalTotalCount = filteredGeneralData.length;
  const generalTotalPages = Math.ceil(generalTotalCount / generalPageSize) || 1;

  const paginatedGeneralData = useMemo(() => {
    const start = (generalPage - 1) * generalPageSize;
    return filteredGeneralData.slice(start, start + generalPageSize);
  }, [filteredGeneralData, generalPage, generalPageSize]);

  // General Support Status Change Handler
  const handleGeneralStatusChange = async (value, rowData, node) => {
    if (value === "success") {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to mark this support request as resolved?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#a99068",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Yes, Resolve it!",
      });

      if (result.isConfirmed) {
        setGeneralSupportData((prev) =>
          prev.map((item) =>
            item._id === rowData._id ? { ...item, status: "success" } : item,
          ),
        );
        node.setData({ ...rowData, status: "success" });

        Swal.fire({
          title: "Resolved!",
          text: "General support request resolved successfully",
          icon: "success",
          confirmButtonColor: "#a99068",
        });
      }
    }
  };

  // Listing Support Status Change Handler
  const handleListingStatusChange = async (value, rowData, node) => {
    if (value === "success") {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to mark this listing support request as resolved?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#a99068",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Yes, Resolve it!",
      });

      if (result.isConfirmed) {
        try {
          const response = await supportMutation(rowData._id).unwrap();
          node.setData({ ...rowData, status: "success" });

          Swal.fire({
            title: "Resolved!",
            text: response?.message || "Listing support resolved successfully",
            icon: "success",
            confirmButtonColor: "#a99068",
          });
        } catch (err) {
          console.error("Support update error:", err);
          Swal.fire({
            title: "Error",
            text:
              err?.data?.message ||
              err?.error ||
              "Failed to update support status",
            icon: "error",
            confirmButtonColor: "#a99068",
          });
        }
      }
    }
  };

  // Column Definitions for Tab 1: General Support
  const generalColumnDefs = useMemo(
    () => [
      {
        headerName: "S.No",
        width: 80,
        valueGetter: (p) => (generalPage - 1) * generalPageSize + p.node.rowIndex + 1,
      },
      {
        headerName: "User Name",
        field: "userName",
        minWidth: 160,
        flex: 1,
      },
      {
        headerName: "User Email",
        field: "userEmail",
        cellStyle: { textTransform: "lowercase" },
        minWidth: 220,
        flex: 1.2,
      },
      {
        headerName: "Subject",
        field: "subject",
        minWidth: 220,
        flex: 1.5,
      },
      {
        headerName: "Status",
        field: "status",
        minWidth: 160,
        cellRenderer: SupportStatusDropdown,
        cellRendererParams: {
          options: [
            { value: "pending", label: "Pending" },
            { value: "success", label: "Resolved" },
          ],
          lockAfter: "success",
          onChange: handleGeneralStatusChange,
        },
      },
      {
        headerName: "Action",
        width: 100,
        cellRenderer: (params) => (
          <button
            className="btn p-0 bg-transparent border-0"
            title="View Details"
            onClick={() => {
              setSelectedSupport(params.data);
              setOpenModal(true);
            }}
          >
            <Eye size={18} />
          </button>
        ),
      },
    ],
    [generalPage, generalPageSize],
  );

  // Column Definitions for Tab 2: Listing Support
  const listingColumnDefs = useMemo(
    () => [
      {
        headerName: "S.No",
        width: 80,
        valueGetter: (p) => (listingPage - 1) * listingPageSize + p.node.rowIndex + 1,
      },
      {
        headerName: "User Name",
        valueGetter: (params) => {
          const first = params.data?.userId?.firstName || "";
          const last = params.data?.userId?.lastName || "";
          return `${first} ${last}`.trim() || "-";
        },
        minWidth: 160,
        flex: 1,
      },
      {
        headerName: "User Email",
        cellStyle: { textTransform: "lowercase" },
        minWidth: 220,
        flex: 1.2,
        valueGetter: (params) => params.data?.userId?.email || "-",
      },
      {
        headerName: "Status",
        field: "status",
        minWidth: 160,
        cellRenderer: SupportStatusDropdown,
        cellRendererParams: {
          options: [
            { value: "pending", label: "Pending" },
            { value: "success", label: "Resolved" },
          ],
          lockAfter: "success",
          onChange: handleListingStatusChange,
        },
      },
      {
        headerName: "Action",
        width: 100,
        cellRenderer: (params) => (
          <button
            className="btn p-0 bg-transparent border-0"
            title="View Details"
            onClick={() => {
              setSelectedSupport(params.data);
              setOpenModal(true);
            }}
          >
            <Eye size={18} />
          </button>
        ),
      },
    ],
    [listingPage, listingPageSize],
  );

  return (
    <main className="app-content body-bg">
      <section className="container">
        {/* Title Header */}
        <div className="title-heading mb-2">Support Management</div>
        <p className="title-sub-heading">
          Review and resolve general user support requests and listing edit support queries
        </p>

        <Breadcrumbs />

        {/* Horizontal Tab Navigation */}
        <div className="d-flex align-items-center border-bottom mb-4 mt-3 gap-4">
          <button
            type="button"
            className={`btn px-1 py-2 rounded-0 bg-transparent border-0 d-flex align-items-center gap-2 fw-semibold ${
              activeTab === "general" ? "fw-bold" : "text-muted"
            }`}
            style={{
              borderBottom: activeTab === "general" ? "3px solid #a99068" : "3px solid transparent",
              color: activeTab === "general" ? "#a99068" : "#6c757d",
              fontSize: "15px",
              cursor: "pointer",
            }}
            onClick={() => {
              setActiveTab("general");
              setSearch("");
            }}
          >
            <MessageSquare size={18} />
            General Support Requests
          </button>

          <button
            type="button"
            className={`btn px-1 py-2 rounded-0 bg-transparent border-0 d-flex align-items-center gap-2 fw-semibold ${
              activeTab === "listing" ? "fw-bold" : "text-muted"
            }`}
            style={{
              borderBottom: activeTab === "listing" ? "3px solid #a99068" : "3px solid transparent",
              color: activeTab === "listing" ? "#a99068" : "#6c757d",
              fontSize: "15px",
              cursor: "pointer",
            }}
            onClick={() => {
              setActiveTab("listing");
              setSearch("");
            }}
          >
            <Building2 size={18} />
            Listing Support Requests
          </button>
        </div>

        {/* Search Bar */}
        <div className="search-bar mb-3">
          <input
            type="text"
            className="form-control w-50"
            placeholder={
              activeTab === "general"
                ? "Search general support by user, email, or subject..."
                : "Search listing support requests..."
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table Content */}
        <div className="custom-card bg-white p-3">
          {activeTab === "general" ? (
            /* TAB 1: General Support Requests */
            paginatedGeneralData.length === 0 ? (
              <NoData text="No general support requests found" />
            ) : (
              <>
                <div className="ag-theme-alpine">
                  <AgGridReact
                    rowData={paginatedGeneralData}
                    columnDefs={generalColumnDefs}
                    headerHeight={40}
                    rowHeight={48}
                    domLayout="autoHeight"
                    getRowStyle={(params) => ({
                      backgroundColor:
                        params.node.rowIndex % 2 !== 0 ? "#e7e0d52b" : "white",
                    })}
                  />
                </div>

                <CustomPagination
                  currentPage={generalPage}
                  totalPages={generalTotalPages}
                  totalCount={generalTotalCount}
                  pageSize={generalPageSize}
                  onPageChange={setGeneralPage}
                  onPageSizeChange={(size) => {
                    setGeneralPageSize(size);
                    setGeneralPage(1);
                  }}
                />
              </>
            )
          ) : (
            /* TAB 2: Listing Support Requests */
            isListingLoading ? (
              <LoadingComponent isLoading fullScreen />
            ) : listingSupportData.length === 0 ? (
              <NoData text="No listing support requests found" />
            ) : (
              <>
                <div className="ag-theme-alpine">
                  <AgGridReact
                    rowData={listingSupportData}
                    columnDefs={listingColumnDefs}
                    headerHeight={40}
                    rowHeight={48}
                    domLayout="autoHeight"
                    getRowStyle={(params) => ({
                      backgroundColor:
                        params.node.rowIndex % 2 !== 0 ? "#e7e0d52b" : "white",
                    })}
                  />
                </div>

                <CustomPagination
                  currentPage={listingPage}
                  totalPages={listingTotalPages}
                  totalCount={listingTotalCount}
                  pageSize={listingPageSize}
                  onPageChange={setListingPage}
                  onPageSizeChange={(size) => {
                    setListingPageSize(size);
                    setListingPage(1);
                  }}
                />
              </>
            )
          )}
        </div>

        {/* View Details Modal */}
        <Modal show={openModal} onHide={() => setOpenModal(false)} centered>
          <Modal.Header closeButton className="border-bottom">
            <Modal.Title className="h5 fw-bold">
              {activeTab === "general"
                ? "General Support Request Details"
                : "Listing Support Request Details"}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="p-4">
            {selectedSupport && (
              <>
                <div className="mb-3">
                  <label className="fw-semibold text-muted small">User Name</label>
                  <div className="fw-bold">
                    {selectedSupport.userName ||
                      `${selectedSupport?.userId?.firstName || ""} ${
                        selectedSupport?.userId?.lastName || ""
                      }`.trim() ||
                      "N/A"}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="fw-semibold text-muted small">User Email</label>
                  <div className="fw-semibold text-primary">
                    {selectedSupport.userEmail || selectedSupport?.userId?.email || "N/A"}
                  </div>
                </div>

                {selectedSupport.subject && (
                  <div className="mb-3">
                    <label className="fw-semibold text-muted small">Subject</label>
                    <div className="fw-semibold text-dark">{selectedSupport.subject}</div>
                  </div>
                )}

                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold text-muted small">Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={selectedSupport.message || "No message content provided."}
                    readOnly
                    className="bg-light"
                  />
                </Form.Group>
              </>
            )}
          </Modal.Body>

          <Modal.Footer className="border-top">
            <button
              className="button-secondary"
              onClick={() => setOpenModal(false)}
            >
              Close
            </button>
          </Modal.Footer>
        </Modal>
      </section>
    </main>
  );
};

export default Support;
