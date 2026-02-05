import React, { useEffect, useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import Breadcrumbs from "../../Components/Breadcrumbs";
import { Eye, Trash2 } from "lucide-react";
import CustomPagination from "../../Components/CustomPagination";
import NoData from "../../Components/NoData";
import { useNavigate } from "react-router-dom";
import FilterUserModal from "../../Components/FilterUserModal";
import Swal from "sweetalert2";

ModuleRegistry.registerModules([AllCommunityModule]);

const STATIC_USERS = [
  {
    _id: "1",
    userId: "USR-001",
    first_name: "Amit ",
    last_name: "Sharma",
    email: "john@amit.owner@example.com",
    phone: "9876543210",
    role: "Owner",
    status: true,
    registrationDate: "2025-12-01",
  },
  {
    _id: "2",
    userId: "USR-002",
    first_name: "John ",
    last_name: "Doe",
    email: "john.vendor@example.com",
    phone: "9876500000",
    role: "Vendor",
    status: false,
    registrationDate: "2026-01-10",
  },
  {
    _id: "3",
    userId: "USR-003",
    first_name: "Jane ",
    last_name: "Smith",
    email: "jane.manager@example.com",
    phone: "9123456789",
    role: "Manager",
    status: true,
    registrationDate: "2026-01-15",
  },
  // add more users as needed
];

const UserManagement = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({ role: "" });

  // Use userData state so we can update status locally
  const [userData, setUserData] = useState(STATIC_USERS);

  // Filtering + Searching on userData
  const filteredUsers = useMemo(() => {
    return userData.filter((user) => {
      const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
      const email = user.email.toLowerCase();
      const phone = user.phone.toLowerCase();
      const userId = user.userId.toLowerCase();  
      const searchLower = search.toLowerCase();

      const matchesSearch =
        fullName.includes(searchLower) ||
        email.includes(searchLower) ||
        phone.includes(searchLower) ||
        userId.includes(searchLower);  

      const matchesRole =
        !filters.role || filters.role === ""
          ? true
          : user.role.toLowerCase() === filters.role.toLowerCase();

      return matchesSearch && matchesRole;
    });
  }, [search, filters, userData]);

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, page, pageSize]);

  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;

  const handleDelete = (id) => {
    const user = userData.find((u) => u._id === id);
    if (!user) return;

    Swal.fire({
      title: `Delete user ${user.first_name} ${user.last_name}?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc3545", // Bootstrap danger color
    }).then((result) => {
      if (result.isConfirmed) {
        setUserData((prev) => prev.filter((u) => u._id !== id));
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "User has been deleted.",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  };

  const columnDefs = useMemo(
    () => [
      {
        headerName: "S.NO.",
        valueGetter: (params) =>
          params.node.rowIndex + 1 + (page - 1) * pageSize,
        minWidth: 100,
        flex: 1,
        cellStyle: { textAlign: "center" },
      },
      {
        headerName: "User ID",
        field: "userId", // NEW COLUMN
        minWidth: 120,
        flex: 1,
      },
      {
        headerName: "Name",
        valueGetter: (p) => `${p.data.first_name} ${p.data.last_name}`,
        minWidth: 200,
        flex: 1,
      },
      {
        headerName: "Email",
        field: "email",
        minWidth: 250,
        flex: 1,
        cellStyle: { textTransform: "lowerCase" },
      },
      {
        headerName: "Phone Number",
        field: "phone",
        minWidth: 150,
        flex: 1,
      },
      {
        headerName: "Role",
        field: "role",
        minWidth: 150,
        flex: 1,
        cellRenderer: (p) =>
          p.value
            ? p.value.charAt(0).toUpperCase() + p.value.slice(1).toLowerCase()
            : "",
      },
      {
        headerName: "Registration Date",
        field: "registrationDate",
        minWidth: 160,
        flex: 1,
        valueFormatter: (p) =>
          p.value ? new Date(p.value).toLocaleDateString("en-GB") : "N/A",
      },
      {
        headerName: "Action",
        minWidth: 140,
        flex: 1,
        cellRenderer: (params) => (
          <div className="d-flex gap-2 align-items-center">
            <button
              className="btn p-0 border-0 bg-transparent"
              title="View"
              onClick={() =>
                navigate(`/user-management/view-user?id=${params.data._id}`)
              }
              style={{ cursor: "pointer" }}
            >
              <Eye size={18} />
            </button>
            <span>|</span>
            <button
              className="btn p-0 border-0 bg-transparent text-danger"
              title="Delete"
              onClick={() => handleDelete(params.data._id)}
              style={{ cursor: "pointer" }}
            >
              <Trash2 size={18} />
            </button>
          </div>
        ),
      },
    ],
    [navigate, page, pageSize],
  );

  return (
    <main className="app-content body-bg">
      <section className="container">
        {/* Header */}
        <div className="d-flex justify-content-between mb-4 align-items-center">
          <div>
            <div className="title-heading mb-2">User Management</div>
            <p className="title-sub-heading">
              Manage registered users and their access
            </p>
          </div>

          <button
            className="primary-button"
            onClick={() => setFilterModalOpen(true)}
            style={{ height: "38px" }}
          >
            Filter
          </button>
        </div>

        <Breadcrumbs />

        {/* Search */}
        <div className="search-bar mb-4 position-relative">
          <input
            type="text"
            className="form-control ps-3 w-50"
            placeholder="Search users by name, email or phone..."
            value={search}
            autoFocus
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {/* Table */}
        <div className="custom-card bg-white p-3">
          {paginatedUsers.length === 0 ? (
            <NoData text="No users found" />
          ) : (
            <>
              <div className="ag-theme-alpine">
                <AgGridReact
                  rowData={paginatedUsers}
                  columnDefs={columnDefs}
                  headerHeight={40}
                  rowHeight={48}
                  domLayout="autoHeight"
                  getRowStyle={(params) => ({
                    backgroundColor:
                      params.node.rowIndex % 2 !== 0 ? "#e7e0d52b" : "white",
                  })}
                />
              </div>

              <CustomPagination
                currentPage={page}
                totalPages={totalPages}
                totalCount={filteredUsers.length}
                pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setPage(1);
                }}
              />
            </>
          )}
        </div>

        {/* Filter Modal */}
        <FilterUserModal
          show={filterModalOpen}
          onClose={() => setFilterModalOpen(false)}
          initialFilters={filters}
          onApply={(newFilters) => {
            setFilters(newFilters);
            setFilterModalOpen(false);
            setPage(1);
          }}
        />
      </section>
    </main>
  );
};

export default UserManagement;
