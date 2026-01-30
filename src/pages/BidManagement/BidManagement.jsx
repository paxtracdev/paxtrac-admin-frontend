import React, { useState, useMemo, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { Eye, Pencil } from "lucide-react";
import Swal from "sweetalert2";
import Breadcrumbs from "../../Components/Breadcrumbs";
import CustomPagination from "../../Components/CustomPagination";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useNavigate } from "react-router-dom";

const initialBids = [
  {
    id: "BID-2026-0001",
    bidAmount: 5000,
    firmName: "Sunrise Realty Group",
    propertyType: "Commercial",
    status: "Pending",
    bidTime: "2026-01-28 10:30",
  },
  {
    id: "BID-2026-0002",
    bidAmount: 7500,
    firmName: "Prestige Vacation Homes",
    propertyType: "Vacation Rentals",
    status: "Flagged",
    bidTime: "2026-01-28 11:15",
  },
  {
    id: "BID-2026-0003",
    bidAmount: 3200,
    firmName: "Crestpoint Realty",
    propertyType: "Other",
    status: "Approved",
    bidTime: "2026-01-28 09:45",
  },
  {
    id: "BID-2026-0004",
    bidAmount: 9000,
    firmName: "Diamond REO Solutions",
    propertyType: "REO",
    status: "Pending",
    bidTime: "2026-01-27 16:30",
  },
  {
    id: "BID-2026-0005",
    bidAmount: 4500,
    firmName: "Evergreen Multifamily LLC",
    propertyType: "Multi Family",
    status: "Flagged",
    bidTime: "2026-01-26 14:00",
  },
];

const pageSizeOptions = [2, 3, 5, 10];

const BidManagement = () => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Data state (for flag toggle)
  const [bids, setBids] = useState(initialBids);
  const navigate = useNavigate();

  const totalCount = bids.length;
  const totalPages = Math.ceil(totalCount / pageSize);

  // Paginate bids
  const paginatedBids = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return bids.slice(startIndex, startIndex + pageSize);
  }, [bids, currentPage, pageSize]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // Flag/unflag bid with notification
  const toggleFlag = useCallback(
    (id) => {
      setBids((prev) =>
        prev.map((bid) => {
          if (bid.id === id) {
            const newStatus = bid.status === "Flagged" ? "Pending" : "Flagged";
            Swal.fire({
              icon: "info",
              title: `Bid ${newStatus === "Flagged" ? "flagged" : "unflagged"}`,
              text: `Bid from ${bid.firmName} is now ${newStatus}.`,
              timer: 1500,
              showConfirmButton: false,
            });
            return { ...bid, status: newStatus };
          }
          return bid;
        }),
      );
    },
    [setBids],
  );

  // Edit handler (for demo just show alert)
  const handleViewBid = (bid) => {
    navigate("/bid-management/view", { state: { bid } });
  };

  const columnDefs = useMemo(
    () => [
      {
        headerName: "S.No",
        width: 80,
        valueGetter: (params) =>
          (currentPage - 1) * pageSize + params.node.rowIndex + 1,
        sortable: false,
      },
      { headerName: "Bid ID", field: "id" },
      {
        headerName: "Bid Amount",
        field: "bidAmount",
        flex: 1,
        cellRenderer: (params) => `$${params.value.toLocaleString()}`,
      },
      { headerName: "Firm Name", field: "firmName", flex: 1, minWidth: 250 },
      { headerName: "Property Type", field: "propertyType", flex: 1.5 },
      // {
      //   headerName: "Status",
      //   field: "status",
      //   flex: 1,
      //   cellRenderer: (params) => {
      //     const isFlagged = params.value === "Flagged";
      //     return (
      //       <button
      //         style={{
      //           backgroundColor: isFlagged ? "#f44336" : "#4caf50",
      //           color: "white",
      //           border: "none",
      //           borderRadius: "4px",
      //           padding: "4px 10px",
      //           cursor: "pointer",
      //         }}
      //         onClick={() => toggleFlag(params.data.id)}
      //         title={isFlagged ? "Unflag bid" : "Flag bid"}
      //       >
      //         {params.value}
      //       </button>
      //     );
      //   },
      // },
      { headerName: "Bid Time", field: "bidTime", flex: 1, minWidth: 200 },
      {
        headerName: "Actions",
        flex: 0.5,
        minWidth: 0,
        cellRenderer: (params) => (
          <Eye
            style={{ cursor: "pointer" }}
            onClick={() => handleViewBid(params.data)}
            size={18}
            color="#333"
            title="View Bid"
          />
        ),
      },
    ],
    [toggleFlag, handleViewBid],
  );

  return (
    <main className="app-content body-bg">
      <section className="container">
        <div className="title-heading mb-2">Bid Management</div>
        <p className="title-sub-heading">Manage bids</p>

        <Breadcrumbs />

        <div className="custom-card bg-white p-4 mt-3">
          <div
            className="ag-theme-alpine"
            style={{ width: "100%", overflowX: "auto" }}
          >
            <AgGridReact
              rowData={paginatedBids}
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

          {/* Custom Pagination */}
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            pageSizeOptions={pageSizeOptions}
          />
        </div>
      </section>
    </main>
  );
};

export default BidManagement;
