import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import CustomPagination from "../../Components/CustomPagination";
import Breadcrumbs from "../../Components/Breadcrumbs";
import Swal from "sweetalert2";

const IssueResolutionView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const issueId = location.state?.issueId;

  const [issueDetails, setIssueDetails] = useState(null);
  const [communications, setCommunications] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  // Fetch issue details and communications
  useEffect(() => {
    setIssueDetails({
      id,
      jobId: "JOB123",
      propertyOwnerName: "John Smith",
      propertyName: "Green Valley Apartments",
      description: "Customer reports delay in service.",
      status: "Pending",
      parties: ["Manager", "Vendor", "Owner"],
    });

    setCommunications([
      {
        id: 1,
        from: "Manager",
        message: "We are looking into it.",
        timestamp: "2026-01-28 10:00",
      },
      {
        id: 2,
        from: "Vendor",
        message: "Will resolve by tomorrow.",
        timestamp: "2026-01-28 12:00",
      },
    ]);
  }, [id]);

  const columnDefs = useMemo(
    () => [
      { headerName: "S.No", valueGetter: "node.rowIndex + 1", width: 80 },
      { field: "from", headerName: "From", flex: 1 },
      { field: "message", headerName: "Message", flex: 3 },
      { field: "timestamp", headerName: "Timestamp", flex: 1.5 },
    ],
    [],
  );

  // Pagination slice for communications
  const pagedCommunications = useMemo(() => {
    const start = page * pageSize;
    return communications.slice(start, start + pageSize);
  }, [communications, page, pageSize]);

  const totalPages = Math.ceil(communications.length / pageSize);

  const handleResolve = () => {
    Swal.fire({
      title: "Issue Resolved",
      text: "The issue has been successfully resolved.",
      icon: "success",
      confirmButtonText: "OK",
      confirmButtonColor: "#a99068",
    }).then((result) => {
      if (result.isConfirmed) {
        setIssueDetails((prev) => ({ ...prev, status: "Resolved" }));

        // Redirect after resolve
        navigate("/issue-resolution");
      }
    });
  };

  if (!issueDetails) return <div>Loading issue details...</div>;

  return (
    <main className="app-content body-bg">
      <section className="container">
        <div className="title-heading mb-2">Issue Resolution</div>
        <p className="title-sub-heading">
          Send updates that matter, to the people who need them.
        </p>

        <Breadcrumbs />
        <div className="custom-card bg-white p-3 mb-4 position-relative">
          <h5>
            Issue Details -{" "}
            <span
              className="text-secondary fw-semibold"
              style={{ borderBottom: "2px solid #6c757d" }}
            >
              {issueDetails.jobId}
            </span>
          </h5>
          <span
            className={`status-badge ${
              issueDetails.status !== "active" ? "inactive" : ""
            }`}
          >
            {issueDetails.status}
          </span>

          <div className="row my-4">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">
                Property Owner Name
              </label>
              <input
                type="text"
                className="form-control"
                value={issueDetails.propertyOwnerName}
                readOnly
                disabled
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold"> Property Name</label>
              <input
                type="text"
                className="form-control"
                value={issueDetails.propertyName}
                disabled
                readOnly
              />
            </div>
            <div className="col-md-12 mb-3">
              <label className="form-label fw-semibold">Description</label>
              <textarea
                className="form-control"
                value={issueDetails.description}
                rows={3}
                disabled
                readOnly
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Parties Involved</label>
              <div className="members-container">
                {issueDetails.parties.map((member, index) => (
                  <span key={index} className="service-chip me-2">
                    {member}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div mb-5>
            <button
              className="login-btn"
              onClick={handleResolve}
              disabled={issueDetails.status === "Resolved"}
            >
              Resolve Issue
            </button>
          </div>
        </div>

        <div className="custom-card bg-white p-3 mb-4">
          <div>
            <h5>Communication Logs</h5>
            <div className="ag-theme-alpine" style={{ width: "100%" }}>
              <AgGridReact
                rowData={pagedCommunications}
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
              totalPages={totalPages}
              totalCount={communications.length}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setPage(0);
              }}
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default IssueResolutionView;
