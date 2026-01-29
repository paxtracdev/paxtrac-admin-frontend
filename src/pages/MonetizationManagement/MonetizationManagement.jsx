import React, { useEffect, useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import Breadcrumbs from "../../Components/Breadcrumbs";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import CustomPagination from "../../Components/CustomPagination";
import NoData from "../../Components/NoData";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Modal } from "react-bootstrap";
import { useGetSubscriptionsQuery } from "../../api/monetizationApi";
import Loader from "../../Components/Loader";

ModuleRegistry.registerModules([AllCommunityModule]);

const MonetizationManagement = () => {
  // Demo subscription data (replace with API later)

  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    search: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [isPageChanging, setIsPageChanging] = useState(false);

  const { data, isLoading, error } = useGetSubscriptionsQuery(query);

  const handlePageChange = (page) => {
    setIsPageChanging(true);
    setQuery((prev) => ({
      ...prev,
      page: page,
    }));
  };

  const handlePageSizeChange = (pageSize) => {
    setIsPageChanging(true);
    setQuery((prev) => ({
      ...prev,
      limit: pageSize,
      page: 1, // Reset to first page when changing page size
    }));
  };

  useEffect(() => {
    if (data?.data?.subscriptions) {
      const rows = data.data.subscriptions.map((item) => ({
        id: item._id,
        name: item.name,
        email: item.email,
        planName: item.planName,
        amount: item.amount,
        status: item.status,
        startDate: item.startDate,
        endDate: item.endDate,
        billingIssue: item.billingIssue,
      }));

      setFilteredRowData(rows);

      setPagination({
        currentPage: data.data.pagination.page,
        totalPages: data.data.pagination.pages,
        totalCount: data.data.pagination.total,
        pageSize: data.data.pagination.limit,
      });
    }
  }, [data]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery((prev) => ({
        ...prev,
        search,
        page: 1,
      }));
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const [openModal, setOpenModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  const [subscriptions, setSubscriptions] = useState();

  // ACTION: Adjust Pricing
  const adjustPricing = () => {
    Swal.fire({
      title: "Adjust Subscription Pricing",
      input: "number",
      inputLabel: "Enter new monthly price",
      inputPlaceholder: "e.g. 9.99",
      showCancelButton: true,
      confirmButtonColor: "#a99068",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Updated!", "Pricing updated successfully.", "success");
      }
    });
  };

  // ACTION: Handle Billing Issue
  const resolveBillingIssue = (row) => {
    Swal.fire({
      title: "Resolve Billing Issue?",
      text: `Resolve billing issue for ${row.userName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#a99068",
    }).then((res) => {
      if (res.isConfirmed) {
        const update = subscriptions.map((s) =>
          s._id === row._id ? { ...s, hasIssue: false } : s
        );
        setSubscriptions(update);

        Swal.fire("Resolved", "Billing issue marked as resolved.", "success");
      }
    });
  };

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("en-GB") : "N/A";

  // AG GRID COLUMNS
  const columnDefs = useMemo(
    () => [
      {
        headerName: "S.NO.",
        minWidth: 100,
        flex: 1,
        cellStyle: { textAlign: "center" },
        cellRenderer: (params) => {
          return params.node.rowIndex + 1;
        },
      },
      {
        headerName: "User",
        field: "name",
        minWidth: 200,
        flex: 1,
        cellRenderer: (p) => (
          <div style={{ fontWeight: 500, textTransform: "capitalize" }}>
            {p.value}
            <br />
            <span style={{ fontSize: "12px", color: "#666" }}>
              {p.data.email}
            </span>
          </div>
        ),
      },
      { headerName: "Plan", field: "planName", minWidth: 200, flex: 1 },
      {
        headerName: "Amount",
        field: "amount",
        minWidth: 200,
        flex: 1,
        valueFormatter: (p) => `$${p.value}`,
      },
      {
        headerName: "Status",
        field: "status",
        minWidth: 200,
        flex: 1,
        cellRenderer: (p) => (
          <span
            style={{
              padding: "4px 10px",
              borderRadius: "6px",
              fontSize: "12px",
              backgroundColor: p.value === "active" ? "#d1fae5" : "#fee2e2",
              color: p.value === "active" ? "#065f46" : "#991b1b",
            }}
          >
            {p.value.charAt(0).toUpperCase() + p.value.slice(1)}
          </span>
        ),
      },
      {
        headerName: "Start Date",
        field: "startDate",
        minWidth: 200,
        flex: 1,
        valueFormatter: (p) => formatDate(p.value),
      },
      {
        headerName: "End Date",
        field: "endDate",
        minWidth: 200,
        flex: 1,
        valueFormatter: (p) => formatDate(p.value),
      },
      {
        headerName: "Billing Issue",
        field: "billingIssue",
        minWidth: 200,
        flex: 1,
        cellRenderer: (p) =>
          String(p.value).toLowerCase() === "yes" ? (
            <span className="text-success">Yes</span>
          ) : (
            <span className="text-danger">No</span>
          ),
      },
      {
        headerName: "Action",
        minWidth: 150,
        flex: 1,
        cellRenderer: (p) => (
          <div
            className="text-primary"
            style={{ cursor: "pointer", fontWeight: 500 }}
            onClick={() => {
              setSelectedSubscription(p.data);
              setOpenModal(true);
            }}
          >
            View
          </div>
        ),
      },
    ],
    [subscriptions]
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
          <NoData
            text="Monetization not found"
            imageWidth={300}
            showImage={true}
          />
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
            <div className="title-heading mb-2">Monetization Management</div>
            <p className="title-sub-heading">
              Track premium subscriptions, manage billing issues, and pricing
            </p>
          </div>

          {/* <Link to={"#"}>
            <button className="primary-button card-btn" onClick={adjustPricing}> Adjust Pricing </button>
          </Link> */}
        </div>

        <Breadcrumbs />

        {/* SEARCH BAR */}
        <div className="search-bar mb-4">
          <input
            type="text"
            className="form-control ps-3"
            placeholder="Search subscriptions..."
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </div>

        {/* TABLE */}
        <div className="custom-card bg-white p-3">
          {!isLoading && filteredRowData.length === 0 ? (
            <NoData text="No subscriptions found" />
          ) : (
            <>
              <div className="ag-theme-alpine">
                <AgGridReact
                  rowData={filteredRowData}
                  columnDefs={columnDefs}
                  headerHeight={40}
                  rowHeight={50}
                  domLayout="autoHeight"
                  getRowStyle={(params) => ({
                    backgroundColor:
                      params.node.rowIndex % 2 !== 0 ? "#0061ff10" : "white",
                  })}
                />
              </div>

              {!isLoading && !isPageChanging && filteredRowData.length > 0 && (
                <CustomPagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  totalCount={pagination.totalCount}
                  pageSize={pagination.pageSize}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                />
              )}
            </>
          )}
        </div>

        <Modal show={openModal} onHide={() => setOpenModal(false)} centered>
          <Modal.Body>
            <Modal.Title className="title fw-light text-center mb-3">
              Subscription Details
            </Modal.Title>

            {selectedSubscription && (
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="fw-semibold">User</label>
                  <input
                    className="form-control"
                    placeholder="Enter your name"
                    value={selectedSubscription.name}
                    readOnly
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="fw-semibold">Email</label>
                  <input
                    className="form-control"
                    placeholder="Enter your email"
                    value={selectedSubscription.email}
                    readOnly
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="fw-semibold">Plan</label>
                  <input
                    className="form-control"
                    placeholder="Enter plan"
                    value={selectedSubscription.planName}
                    readOnly
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="fw-semibold">Amount</label>
                  <input
                    className="form-control"
                    placeholder="Enter amount"
                    value={`$${selectedSubscription.amount}`}
                    readOnly
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="fw-semibold">Status</label>
                  <input
                    className="form-control"
                    placeholder="Status"
                    value={selectedSubscription.status.toUpperCase()}
                    readOnly
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="fw-semibold">Billing Issue</label>
                  <input
                    className="form-control"
                    value={selectedSubscription.billingIssue}
                    readOnly
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="fw-semibold">Start Date</label>
                  <input
                    className="form-control"
                    placeholder="Enter start date"
                    value={formatDate(selectedSubscription.startDate)}
                    readOnly
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="fw-semibold">End Date</label>
                  <input
                    className="form-control"
                    placeholder="Enter end date"
                    value={formatDate(selectedSubscription.endDate)}
                    readOnly
                  />
                </div>
              </div>
            )}

            <div className="text-end mt-3">
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

export default MonetizationManagement;
