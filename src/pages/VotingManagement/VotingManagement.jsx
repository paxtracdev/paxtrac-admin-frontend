import React, { useEffect, useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import Breadcrumbs from "../../Components/Breadcrumbs";
import CustomPagination from "../../Components/CustomPagination";
import NoData from "../../Components/NoData";
import Swal from "sweetalert2";
import { Eye, Trash2 } from "lucide-react";
import CommonCard from "../../Components/CommonCard";
import { useNavigate } from "react-router-dom";
import {
  useDeleteVoteMutation,
  useGetVotingDetailsQuery,
  useGetVotingStatsQuery,
} from "../../api/voteApi";
import Loader from "../../Components/Loader";
import { ReadMoreCell } from "../../Components/ReadMoreCell";

ModuleRegistry.registerModules([AllCommunityModule]);

const VotingManagement = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    search: "",
  });

  const {
    data: votingResponse,
    isLoading,
    isFetching,
  } = useGetVotingDetailsQuery(query);

  const {
    data: statsData,
    isLoading: statsLoading,
    error,
  } = useGetVotingStatsQuery();
  const [deleteVote] = useDeleteVoteMutation();

  const votingData = votingResponse?.data || [];

  const [searchInput, setSearchInput] = useState("");

  const totalCount = votingData.length;
  const totalPages = Math.ceil(totalCount / query.limit);
  const currentPage = query.page;
  const pageSize = query.limit;

  const handleSearch = (e) => {
    setQuery((prev) => ({
      ...prev,
      search: e.target.value,
      page: 1,
    }));
  };

  // ---------------- PAGINATION ----------------
  const handlePageChange = (page) => {
    setQuery((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (size) => {
    setQuery((prev) => ({ ...prev, limit: size, page: 1 }));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery((prev) => ({
        ...prev,
        search: searchInput,
        page: 1,
      }));
    }, 500); // debounce

    return () => clearTimeout(timer);
  }, [searchInput]);

  const statusColorMap = {
    active: { bg: "#d1fae5", color: "#065f46" },
    closed: { bg: "#fee2e2", color: "#991b1b" },
  };

  const handleDelete = async (voteId) => {
    if (!voteId) {
      Swal.fire("Error", "Invalid event ID", "error");
      return;
    }

    const result = await Swal.fire({
      title: "Delete Event?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
    });

    if (result.isConfirmed) {
      try {
        await deleteVote(voteId).unwrap();
        Swal.fire("Deleted!", "Event removed successfully.", "success");
      } catch (err) {
        Swal.fire("Error", "Failed to delete event", "error");
      }
    }
  };

  const stats = [
    {
      title: "Total Voting Events",
      value: statsData?.data?.totalVotingEvents || 0,
      sub: "All voting sessions created",
    },
    {
      title: "Active Voting",
      value: statsData?.data?.activeVoting || 0,
      sub: "Currently active votings",
    },
    {
      title: "Closed Voting",
      value: statsData?.data?.closedVoting || 0,
      sub: "Completed voting sessions",
    },
    {
      title: "Suspicious Votes",
      value: statsData?.data?.suspiciousVotes || 0,
      sub: "Flagged abnormal activity",
    },
  ];
  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const columnDefs = useMemo(
    () => [
      {
        headerName: "S.No",
        valueGetter: (p) => p.node.rowIndex + 1 + (currentPage - 1) * pageSize,
        minWidth: 80,
        flex: 1,
      },
      { headerName: "Event ID", field: "voteId", minWidth: 200, flex: 1 },
      {
        headerName: "Event Name",
        field: "event",
        minWidth: 200,
        flex: 1,
        wrapText: true,
        autoHeight: true,
        cellRenderer: ReadMoreCell,
      },
      {
        headerName: "Total Votes",
        field: "totalVotes",
        minWidth: 100,
        flex: 1,
      },
      {
        headerName: "Suspicious Votes",
        field: "totalSuspiciousVotes",
        minWidth: 160,
        flex: 1,
        cellRenderer: (p) =>
          p.value > 0 ? (
            <span style={{ color: "red", fontWeight: 600 }}>{p.value}</span>
          ) : (
            "0"
          ),
      },
      {
        headerName: "Status",
        field: "status",
        minWidth: 120,
        flex: 1,
        cellRenderer: (p) => {
          const status = p.value;
          const colors = statusColorMap[status] || {};
          return (
            <span
              style={{
                background: colors.bg,
                color: colors.color,
                padding: "4px 10px",
                borderRadius: "6px",
                fontSize: "12px",
              }}
            >
              {status}
            </span>
          );
        },
      },
      {
        headerName: "Started",
        field: "votingStartedDate",
        minWidth: 200,
        flex: 1,
        valueFormatter: (p) => formatDate(p.value),
      },

      {
        headerName: "Action",
        cellRenderer: (params) => (
          <div className="d-flex gap-2">
            <button
              className="border-0 bg-transparent"
              title="View"
              onClick={() =>
                navigate(`/voting-management/view-vote/${params.data.voteId}`)
              }
            >
              <Eye size={18} />
            </button>

            {/* <button
              className="border-0 bg-transparent text-danger"
              title="Delete"
              onClick={() => handleDelete(params.data.voteId)}
            >
              <Trash2 size={18} />
            </button> */}
          </div>
        ),
      },
    ],
    [currentPage, pageSize]
  );

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
          <NoData text="Voting not found" imageWidth={300} showImage={true} />
        </div>
      </div>
    );
  }
  return (
    <main className="app-content body-bg">
      <section className="container">
        {/* HEADER */}
        <div className="d-flex justify-content-between mb-4">
          <div>
            <div className="title-heading mb-2">Voting Management</div>
            <p className="title-sub-heading">
              Track voting patterns, timelines & suspicious activity
            </p>
          </div>
        </div>

        <Breadcrumbs />

        {/* 📊 STATS SECTION */}
        <div className="mb-4">
          {statsLoading ? (
            <p>Loading stats...</p>
          ) : (
            <CommonCard stats={stats} />
          )}
        </div>

        {/* SEARCH */}
        <div className="search-bar mb-4 position-relative">
          <input
            type="text"
            className="form-control ps-3"
            placeholder="Search votes..."
            value={searchInput}
            autoFocus
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        {/* TABLE */}
        <div className="custom-card bg-white p-3">
          {votingData.length === 0 ? (
            <NoData text="No voting activity found" />
          ) : (
            <>
              <div className="ag-theme-alpine">
                <AgGridReact
                  rowData={votingData}
                  columnDefs={columnDefs}
                  headerHeight={40}
                  rowHeight={48}
                  domLayout="autoHeight"
                  pagination={false}
                  enableCellTextSelection={true}
                  className="activity-log-table"
                  getRowStyle={(params) => ({
                    backgroundColor:
                      params.node.rowIndex % 2 !== 0 ? "#0061ff10" : "white",
                  })}
                />
              </div>

              <CustomPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalCount={totalCount}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default VotingManagement;
