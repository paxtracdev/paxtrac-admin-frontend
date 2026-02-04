import React, { useState, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import Breadcrumbs from "../../Components/Breadcrumbs";
import CustomPagination from "../../Components/CustomPagination";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import NoData from "../../Components/NoData";

const demoPayments = [
  {
    id: 1,
    transactionId: "TXN-2026-001",
    propertyId: "PROP-2026-001",
    subscription: "Plan A",
    preRegistration: 250,
    successFee: 500,
    status: "paid",
    adminAmount: 100,
    backgroundCheck: 50,
    preRegistrationStatus: "paid",
    successFeeStatus: "paid",
    backgroundCheckStatus: "paid",
  },
  {
    id: 2,
    transactionId: "TXN-2026-002",
    propertyId: "PROP-2026-002",
    subscription: "Plan B",
    preRegistration: 250,
    successFee: 400,
    status: "failed",
    adminAmount: 90,
    backgroundCheck: 50,
    preRegistrationStatus: "paid",
    successFeeStatus: "paid",
    backgroundCheckStatus: "paid",
  },
  {
    id: 3,
    transactionId: "TXN-2026-003",
    propertyId: "PROP-2026-003",
    subscription: "Plan C",
    preRegistration: 250,
    successFee: 600,
    status: "refund",
    adminAmount: 120,
    backgroundCheck: 50,
    preRegistrationStatus: "paid",
    successFeeStatus: "paid",
    backgroundCheckStatus: "paid",
  },
  {
    id: 4,
    transactionId: "TXN-2026-004",
    propertyId: "PROP-2026-004",
    subscription: "Plan A",
    preRegistration: 250,
    successFee: 300,
    status: "paid",
    adminAmount: 80,
    backgroundCheck: 50,
    preRegistrationStatus: "paid",
    successFeeStatus: "failed",
    backgroundCheckStatus: "paid",
  },
  {
    id: 5,
    transactionId: "TXN-2026-005",
    propertyId: "PROP-2026-005",
    subscription: "Plan B",
    preRegistration: 250,
    successFee: 450,
    status: "paid",
    adminAmount: 110,
    backgroundCheck: 50,
    preRegistrationStatus: "paid",
    successFeeStatus: "paid",
    backgroundCheckStatus: "paid",
  },
];

const pageSizeOptions = [2, 3, 5, 10];

const Payments = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [payments, setPayments] = useState(demoPayments);
  const [searchInput, setSearchInput] = useState("");

  // FILTERED PAYMENTS
  const filteredPayments = useMemo(() => {
    if (!searchInput) return payments;
    const query = searchInput.toLowerCase();
    return payments.filter(
      (p) =>
        p.transactionId.toLowerCase().includes(query) ||
        p.propertyId.toLowerCase().includes(query) ||
        p.subscription.toLowerCase().includes(query) ||
        p.status.toLowerCase().includes(query),
    );
  }, [payments, searchInput]);

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
      // {
      //   headerName: "S.No",
      //   valueGetter: (params) =>
      //     (currentPage - 1) * pageSize + params.node.rowIndex + 1,
      //   width: 80,
      // },
      {
        headerName: "Status",
        field: "status",
        width: 120,
        cellRenderer: (params) => {
          const value = params.value?.toLowerCase();

          const isSuccess = value === "paid";
          const isRefund = value === "refund" || value === "failed";

          return (
            <span
              style={{
                color: isSuccess ? "#16a34a" : "#dc2626",
                textTransform: "capitalize",
              }}
            >
              {isSuccess ? "Success" : "Refund"}
            </span>
          );
        },
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
      //   {
      //     headerName: "Subscription",
      //     field: "subscription",
      //     flex: 1,
      //     minWidth: 200,
      //   },
      {
        headerName: "Pre Registration ",
        field: "preRegistration",
        flex: 1,
        minWidth: 200,
        cellRenderer: (params) => {
          if (!params.value) return "-";

          const status = params.data.preRegistrationStatus ;

          const color =
            status === "paid"
              ? "#16a34a"
              : status === "pending"
                ? "#ca8a04"
                : "#dc2626";

          return (
            <span style={{ color, fontWeight: 500 }}>${params.value}</span>
          );
        },
      },
      {
        headerName: "Success Fee ",
        field: "successFee",
        flex: 1,
        minWidth: 200,
        cellRenderer: (params) => {
          if (params.value == null || params.value === "") return "-";

          const status = params.data.successFeeStatus;

          const color =
            status === "paid"
              ? "#16a34a"
              : status === "pending"
                ? "#ca8a04"
                : "#dc2626";

          return (
            <span style={{ color, fontWeight: 500 }}>${params.value}</span>
          );
        },
      },
      // {
      //   headerName: "Status",
      //   field: "status",
      //   flex: 1,
      //   minWidth: 200,
      //   cellRenderer: (params) => {
      //     const statusClass =
      //       params.value.toLowerCase() === "paid"
      //         ? ""
      //         : params.value.toLowerCase() === "failed"
      //           ? "inactive"
      //           : "pending";
      //     return (
      //       <span className={`status-badge-table ${statusClass}`}>
      //         {params.value}
      //       </span>
      //     );
      //   },
      // },
      //   {
      //     headerName: "Admin Amount ($)",
      //     field: "adminAmount",
      //     flex: 1,
      //     minWidth: 200,
      //   },
      {
        headerName: "Background Check ",
        field: "backgroundCheck",
        flex: 1,
        minWidth: 200,
        cellRenderer: (params) => {
          if (params.value == null || params.value === "") return "-";

          const status = params.data.backgroundCheckStatus ;

          const color =
            status === "paid"
              ? "#16a34a"
              : status === "pending"
                ? "#ca8a04"
                : "#dc2626";

          return (
            <span style={{ color, fontWeight: 500 }}>${params.value}</span>
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
    </main>
  );
};

export default Payments;
