import React, { useState, useMemo, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { Eye } from "lucide-react";
import Breadcrumbs from "../../Components/Breadcrumbs";
import CustomPagination from "../../Components/CustomPagination";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useNavigate } from "react-router-dom";
import { useGetBidsQuery } from "../../api/userApi";
import BidManagementFilterModal from "../../Components/BidManagementFilterModal";
import { LoadingComponent } from "../../Components/LoadingComponent";
import NoData from "../../Components/NoData";

const pageSizeOptions = [2, 3, 5, 10];

const BidManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    propertyType: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isError } = useGetBidsQuery({
    page: currentPage,
    limit: pageSize,
    search: debouncedSearch,
    status: filters.status,
    type: filters.propertyType,
  });

  const navigate = useNavigate();

  const properties = data?.data || [];
  const totalCount = data?.pagination?.total || 0;
  const totalPages =
    data?.pagination?.totalPages || Math.ceil(totalCount / pageSize) || 1;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // Edit handler (for demo just show alert)
  const handleViewBid = (bid) => {
    navigate(`/bid-management/${bid._id}`, {
      state: {
        bidStatus: bid.bidStatus, 
      },
    });
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
      {
        headerName: "Property ID",
        field: "_id",
        flex: 1,
        minWidth: 250,
      },
      {
        headerName: "Property Type",
        field: "propertyType",
        flex: 1,
        minWidth: 200,
      },
      {
        headerName: "Property Lister Name",
        field: "createdByName",
        flex: 1.5,
        minWidth: 250,
      },
      {
        headerName: "Bidding Status",
        field: "bidStatus",
        flex: 1,
        minWidth: 200,
        cellRenderer: (params) => {
          const status = params.value?.toLowerCase();

          const statusClass =
            status === "active"
              ? ""
              : status === "request-reopen"
                ? "pending"
                : "inactive";

          return (
            <span className={`status-badge-table ${statusClass}`}>
              {params.value}
            </span>
          );
        },
      },
      {
        headerName: "Total Bidders",
        field: "totalBidder",
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: "Email",
        field: "email",
        flex: 1.5,
        minWidth: 300,
        cellStyle: {
          textTransform: "lowercase",
        },
      },
      {
        headerName: "Action",
        flex: 0.5,
        minWidth: 100,
        cellRenderer: (params) => (
          <Eye
            size={18}
            style={{ cursor: "pointer" }}
            title="View Bid"
            onClick={() => handleViewBid(params.data)}
          />
        ),
      },
    ],
    [currentPage, pageSize, navigate],
  );

  return (
    <main className="app-content body-bg">
      <section className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <div className="title-heading mb-2">Bid Management</div>
            <p className="title-sub-heading"> Manage bids</p>
          </div>

          <button
            className="primary-button"
            onClick={() => setShowFilter(true)}
          >
            Filter
          </button>
        </div>

        <Breadcrumbs />

        {/* SEARCH */}
        <div className="search-bar mb-4">
          <input
            type="text"
            className="form-control w-50"
            placeholder="Search by property ID, type, lister, or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <div className="custom-card bg-white p-4 mt-3">
          {isLoading ? (
            <LoadingComponent isLoading fullScreen />
          ) : properties?.length === 0 ? (
            <NoData text="No found" />
          ) : (
            <>
              <div
                className="ag-theme-alpine"
                style={{ width: "100%", overflowX: "auto" }}
              >
                <AgGridReact
                  rowData={properties}
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
            </>
          )}
        </div>
      </section>

      <BidManagementFilterModal
        show={showFilter}
        onClose={() => setShowFilter(false)}
        initialFilters={filters}
        onApply={(data) => {
          setFilters(data);
          setCurrentPage(1);
          setShowFilter(false);
        }}
      />
    </main>
  );
};

export default BidManagement;
