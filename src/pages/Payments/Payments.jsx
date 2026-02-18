import React, { useState, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import Breadcrumbs from "../../Components/Breadcrumbs";
import CustomPagination from "../../Components/CustomPagination";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import NoData from "../../Components/NoData";
import PaymentFilterModal from "../../Components/PaymentFilterModal";

const demoPayments = [
  {
    id: 1,
    transactionId: "TXN-2026-001",
    propertyId: "PROP-2026-001",
    paymentType: "pre registration",
    amount: 250,
    status: "paid",
  },
  {
    id: 2,
    transactionId: "TXN-2026-002",
    propertyId: "PROP-2026-002",
    paymentType: "success fee",
    amount: 500,
    status: "failed",
  },
  {
    id: 3,
    transactionId: "TXN-2026-003",
    propertyId: "PROP-2026-003",
    paymentType: "subscription plan",
    amount: 999,
    status: "refund",
  },
  {
    id: 4,
    transactionId: "TXN-2026-004",
    propertyId: "PROP-2026-004",
    paymentType: "background check",
    amount: 50,
    status: "paid",
  },
];

const pageSizeOptions = [2, 3, 5, 10];

const Payments = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [payments, setPayments] = useState(demoPayments);
  const [searchInput, setSearchInput] = useState("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");

  // FILTERED PAYMENTS
  const filteredPayments = useMemo(() => {
    let result = payments;

    // Search filter
    if (searchInput) {
      const query = searchInput.toLowerCase();
      result = result.filter(
        (p) =>
          p.transactionId.toLowerCase().includes(query) ||
          p.propertyId.toLowerCase().includes(query) ||
          p.paymentType.toLowerCase().includes(query) ||
          p.status.toLowerCase().includes(query),
      );
    }

    // Status filter
  if (statusFilter) {
  result = result.filter((p) => p.status.toLowerCase() === statusFilter);
}


    return result;
  }, [payments, searchInput, statusFilter]);

  const totalCount = filteredPayments.length;
  const totalPages = Math.ceil(totalCount / pageSize);

  // PAGINATION SLICE
  const paginatedPayments = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPayments.slice(start, start + pageSize);
  }, [filteredPayments, currentPage, pageSize]);

  const handlePageChange = (page) => setCurrentPage(page);
  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

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
        flex: 1,
        minWidth: 200,
        cellStyle: { textTransform: "lowercase" },
      },
      {
        headerName: "Property ID",
        field: "propertyId",
        flex: 1,
        minWidth: 200,
      },
      {
        headerName: "Payment Type",
        field: "paymentType",
        flex: 1,
        minWidth: 200,
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
        minWidth: 150,
        cellRenderer: (params) =>
          params.value != null ? `$${params.value}` : "-",
      },
      {
        headerName: "Status",
        field: "status",
        flex: 1,
        minWidth: 160,
        cellRenderer: (params) => {
          const value = params.value?.toLowerCase();

          const statusClass =
            value === "paid"
              ? ""
              : value === "failed"
                ? "inactive"
                : value === "refund"
                  ? "pending"
                  : "";

          return (
            <span className={`status-badge-table ${statusClass}`}>{value}</span>
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
          {paginatedPayments.length === 0 ? (
            <NoData text="No payments found" />
          ) : (
            <>
              <div
                className="ag-theme-alpine"
                style={{ width: "100%", overflowX: "auto" }}
              >
                <AgGridReact
                  rowData={paginatedPayments}
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
