import React, { useState, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { Eye } from "lucide-react";
import Switch from "react-switch";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../Components/Breadcrumbs";
import NoData from "../../Components/NoData";
import CustomPagination from "../../Components/CustomPagination";

ModuleRegistry.registerModules([AllCommunityModule]);

const STATIC_VENDORS = [
  {
    _id: "v1",
    vendorName: "Alice Wake",
    email: "contact@acme.com",
    phoneNumber: "1234567890",
    businessDetails: {
      businessName: "Acme Services LLC",
      numberOfStaff: 50,
      businessStartYear: 2015,
      propertyManagementLicense: true,
    },
    accountStatus: true,
  },
  {
    _id: "v2",
    vendorName: "William Byce",
    email: "info@bestbuilders.com",
    phoneNumber: "0987654321",
    businessDetails: {
      businessName: "Best Builders Inc",
      numberOfStaff: 30,
      businessStartYear: 2010,
      propertyManagementLicense: false,
    },
    accountStatus: false,
  },
];

export default function VendorManagement() {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState(STATIC_VENDORS);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalCount = vendors.length;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  const paginatedVendors = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return vendors.slice(start, start + pageSize);
  }, [vendors, currentPage, pageSize]);

  const toggleAccountStatus = (id) => {
    const vendor = vendors.find((v) => v._id === id);
    if (!vendor) return;

    Swal.fire({
      title: `Change account status for ${vendor.vendorName}?`,
      text: `This will ${vendor.accountStatus ? "deactivate" : "activate"} this vendor.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, change it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#a99068",
    }).then((result) => {
      if (result.isConfirmed) {
        setVendors((prev) =>
          prev.map((v) =>
            v._id === id ? { ...v, accountStatus: !v.accountStatus } : v
          )
        );
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: `Vendor account status has been ${
            vendor.accountStatus ? "deactivated" : "activated"
          }.`,
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  };

  const columnDefs = useMemo(() => [
    {
      headerName: "S.NO.",
      valueGetter: (params) => params.node.rowIndex + 1 + (currentPage - 1) * pageSize,
      minWidth: 80,
      flex: 0.5,
      cellStyle: { textAlign: "center" },
    },
    {
      headerName: "Name",
      field: "vendorName",
      minWidth: 180,
      flex: 1,
    },
    {
      headerName: "Email",
      field: "email",
      minWidth: 250,
      flex: 1.2,
      cellStyle: { textTransform: "lowercase" },
    },
    {
      headerName: "Phone",
      field: "phoneNumber",
      minWidth: 140,
      flex: 1,
    },
    {
      headerName: "Business Name",
      minWidth: 250,
      flex: 1.5,
      valueGetter: (params) => params.data.businessDetails.businessName,
    },
    {
      headerName: "Status",
      field: "accountStatus",
      minWidth: 120,
      flex: 1,
      cellRenderer: (params) => (
        <Switch
          checked={params.value}
          onChange={() => toggleAccountStatus(params.data._id)}
          onColor="#a99068"
          uncheckedIcon={false}
          checkedIcon={false}
          height={20}
          width={40}
        />
      ),
    },
    {
      headerName: "Number of Staff",
      minWidth: 150,
      flex: 1,
      valueGetter: (params) => params.data.businessDetails.numberOfStaff,
    },
    {
      headerName: "Licensed",
      minWidth: 100,
      flex: 1,
      cellRenderer: (params) =>
        params.data.businessDetails.propertyManagementLicense ? (
          <span className="status-badge ">Yes</span>
        ) : (
          <span className="status-badge inactive ">No</span>
        ),
    },
    {
      headerName: "Business Start ",
      minWidth: 150,
      flex: 1,
      valueGetter: (params) => params.data.businessDetails.businessStartYear,
    },
    {
      headerName: "Action",
      minWidth: 130,
      flex: 1,
      cellRenderer: (params) => (
        <button
          className="btn p-0 bg-transparent border-0 text-start"
          onClick={() => navigate(`/vendor-management/view?id=${params.data._id}`)}
        >
          <Eye size={16} /> 
        </button>
      ),
    },
  ], [currentPage, pageSize]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return (
    <main className="app-content body-bg">
      <section className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="title-heading">Vendor Management</h1>
            <p className="title-sub-heading">
              Approve or reject vendors and manage their profiles
            </p>
          </div>
        </div>

        <Breadcrumbs />

        <div className="custom-card bg-white p-3">
          {vendors.length === 0 ? (
            <NoData text="No vendors found" />
          ) : (
            <>
              <div className="ag-theme-alpine">
                <AgGridReact
                  rowData={paginatedVendors}
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

              {/* ✅ CUSTOM PAGINATION */}
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
}
