import React, { useState, useEffect, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { useNavigate } from "react-router-dom";
import CustomPagination from "../../Components/CustomPagination";
import Breadcrumbs from "../../Components/Breadcrumbs";
import { Eye } from "lucide-react";

const IssueResolution = () => {
  const [issues, setIssues] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const navigate = useNavigate();

  useEffect(() => {
    setIssues([
      { id: 1, jobId: "JOB123", status: "Pending", ownerName: "John Doe" },
      { id: 2, jobId: "JOB124", status: "Resolved", ownerName: "Alice Smith" },
      { id: 3, jobId: "JOB125", status: "Pending", ownerName: "Michael Brown" },
    ]);
  }, []);

  const columnDefs = useMemo(
    () => [
      {
        headerName: "S.No",
        valueGetter: (params) => page * pageSize + params.node.rowIndex + 1,
      },
      {
        field: "jobId",
        headerName: "Job ID",
        flex: 1,
      },
      {
        field: "ownerName",
        headerName: "Owner Name",
        flex: 1.2,
      },
      {
        field: "status",
        headerName: "Status",
        flex: 1,
        cellRenderer: (params) => {
          const isResolved = params.value?.toLowerCase() === "resolved";

          return (
            <span className={`status-badge-table ${isResolved ? "" : "inactive"}`}>
              {params.value}
            </span>
          );
        },
      },
      {
        headerName: "Action",
        flex: 1,
        cellRenderer: (params) => (
          <Eye
            className=" "
            onClick={() =>
              navigate("/issueresolution/view", {
                state: { issueId: params.data.id },
              })
            }
            size={18}
          />
        ),
      },
    ],
    [navigate, page, pageSize],
  );

  const pagedData = useMemo(() => {
    const start = page * pageSize;
    return issues.slice(start, start + pageSize);
  }, [issues, page, pageSize]);

  const totalPages = Math.ceil(issues.length / pageSize);

  return (
    <main className="app-content body-bg">
      <section className="container">
        <div className="title-heading mb-2">Issue Resolution</div>
        <p className="title-sub-heading">
          Send updates that matter, to the people who need them.
        </p>

        <Breadcrumbs />

        <div className="custom-card bg-white p-3">
          <div className="ag-theme-alpine" style={{ width: "100%" }}>
            <AgGridReact
              rowData={pagedData}
              columnDefs={columnDefs}
              domLayout="autoHeight"
              headerHeight={40}
              rowHeight={48}
              getRowStyle={(params) => ({
                backgroundColor:
                  params.node.rowIndex % 2 !== 0 ? "#e7e0d52b" : "#ffffff",
              })}
            />
          </div>

          <CustomPagination
            currentPage={page}
            totalPages={totalPages}
            totalCount={issues.length}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(0);
            }}
          />
        </div>
      </section>
    </main>
  );
};

export default IssueResolution;
