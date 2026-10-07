import React, { useState, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import Breadcrumbs from "../../Components/Breadcrumbs";
import CustomPagination from "../../Components/CustomPagination";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import NoData from "../../Components/NoData";
import PaymentFilterModal from "../../Components/PaymentFilterModal";
import { useGetAllTransactionsQuery } from "../../api/analyticsApi";
import { LoadingComponent } from "../../Components/LoadingComponent";

const pageSizeOptions = [5, 10, 20, 50];

const Payments = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");

  const { data, isLoading } = useGetAllTransactionsQuery({
    page: currentPage,
    limit: pageSize,
    search: searchInput,
    status: statusFilter,
  });

  const totalCount = data?.pagination?.total || 0;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  const handlePageChange = (page) => setCurrentPage(page);
  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const defaultColDef = useMemo(
    () => ({
      valueFormatter: (params) =>
        params.value !== undefined &&
        params.value !== null &&
        String(params.value).trim() !== ""
          ? params.value
          : "-",
    }),
    []
  );

  // AG-GRID COLUMNS
  const columnDefs = useMemo(
    () => [
      {
        headerName: "S.No",
        valueGetter: (params) =>
          (currentPage - 1) * pageSize + params.node.rowIndex + 1,
        width: 80,
      },
      {
        headerName: "Transaction ID",
        field: "transactionId",
        flex: 2,
        minWidth: 280,
        wrapText: true,
        autoHeight: true,
        cellStyle: {
          wordBreak: "break-all",
          lineHeight: "1.5",
          paddingTop: "10px",
          paddingBottom: "10px",
          textTransform: "lowercase",
        },
      },
      {
        headerName: "Property ID",
        field: "propertyId",
        flex: 1.5,
        minWidth: 200,
        wrapText: true,
        autoHeight: true,
        cellStyle: {
          wordBreak: "break-all",
          lineHeight: "1.5",
          paddingTop: "10px",
          paddingBottom: "10px",
        },
      },
      {
        headerName: "Payment Type",
        field: "transactionfor",
        flex: 1,
        minWidth: 160,
        cellRenderer: (params) => (
          <span style={{ textTransform: "capitalize" }}>
            {params.value || "-"}
          </span>
        ),
      },
      {
        headerName: "Amount",
        field: "amount",
        flex: 1,
        minWidth: 120,
        cellRenderer: (params) =>
          params.value != null && params.value !== "" ? `$${params.value}` : "-",
      },
      {
        headerName: "Status",
        field: "transactionStatus",
        flex: 1,
        minWidth: 140,
        cellRenderer: (params) => {
          if (!params.value) return "-";
          const value = String(params.value).toLowerCase();

          const statusClass =
            value === "success" || value === "paid"
              ? ""
              : value === "pending"
                ? "inactive"
                : value === "refund" || value === "failed"
                  ? "pending"
                  : "";

          return (
            <span className={`status-badge-table ${statusClass}`}>
              {value.toUpperCase()}
            </span>
          );
        },
      },
    ],
    [currentPage, pageSize],
  );

  return (
    <main className="app-content body-bg">
      <section className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <div className="title-heading mb-2">Payments Management</div>
            <p className="title-sub-heading">View all property payments</p>
          </div>

          {/* Filter Button */}
          <button
            className="login-btn"
            onClick={() => setFilterModalOpen(true)}
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
            placeholder="Search by transaction, property ID, subscription or status..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* TABLE */}
        <div className="custom-card bg-white p-4">
          {isLoading ? (
            <LoadingComponent isLoading fullScreen />
          ) : !data?.data || data?.data?.length === 0 ? (
            <NoData text="No payments found" />
          ) : (
            <>
              <div
                className="ag-theme-alpine"
                style={{ width: "100%", overflowX: "auto" }}
              >
                <AgGridReact
                  rowData={data?.data}
                  columnDefs={columnDefs}
                  defaultColDef={defaultColDef}
                  domLayout="autoHeight"
                  headerHeight={40}
                  getRowStyle={(params) => ({
                    backgroundColor:
                      params.node.rowIndex % 2 !== 0 ? "#e7e0d52b" : "white",
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
                pageSizeOptions={pageSizeOptions}
              />
            </>
          )}
        </div>
      </section>

      <PaymentFilterModal
        show={filterModalOpen}
        initialStatus={statusFilter}
        onClose={() => setFilterModalOpen(false)}
        onApply={(status) => {
          setStatusFilter(status);
          setFilterModalOpen(false);
          setCurrentPage(1);
        }}
      />
    </main>
  );
};

export default Payments;
