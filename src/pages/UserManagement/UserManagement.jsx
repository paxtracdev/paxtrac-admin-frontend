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
import { useGetUsersQuery, useDeleteUserMutation } from "../../api/userApi";
import { LoadingComponent } from "../../Components/LoadingComponent";

ModuleRegistry.registerModules([AllCommunityModule]);

const UserManagement = () => {
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({ role: "" });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading } = useGetUsersQuery({
    page,
    limit: pageSize,
    search: debouncedSearch,
    role: filters.role,
  });

  const [deleteUser] = useDeleteUserMutation();

  const user = data?.data || [];
  const totalCount = data?.pagination?.total || 0;
  const totalPages = data?.pagination?.totalPages || Math.ceil(totalCount / pageSize) || 1;

  const handleDelete = (targetUser) => {
    if (!targetUser) return;
    const displayName =
      `${targetUser.firstName || ""} ${targetUser.lastName || ""}`.trim() ||
      targetUser.email ||
      "this user";

    Swal.fire({
      title: `Delete user "${displayName}"?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc3545",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteUser(targetUser._id).unwrap();
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "User has been deleted successfully.",
            timer: 2000,
            showConfirmButton: false,
          });
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "Delete Failed",
            text: err?.data?.message || "Failed to delete user.",
          });
        }
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
        field: "_id", // NEW COLUMN
        minWidth: 250,
        flex: 1,
      },
      {
        headerName: "Name",
        valueGetter: (p) => `${p.data.firstName} ${p.data.lastName}`,
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
        field: "mobileNumber",
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
        field: "createdAt",
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
                navigate(`/user-management/view-user/${params.data._id}`)
              }
              style={{ cursor: "pointer" }}
            >
              <Eye size={18} />
            </button>
            <span>|</span>
            <button
              className="btn p-0 border-0 bg-transparent text-danger"
              title="Delete"
              onClick={() => handleDelete(params.data)}
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
            value={searchInput}
            autoFocus
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        {/* Table */}

        <div className="custom-card bg-white p-3">
          {isLoading ? (
            <LoadingComponent isLoading fullScreen />
          ) : user.length === 0 ? (
            <NoData text="No users found" />
          ) : (
            <>
              <div className="ag-theme-alpine">
                <AgGridReact
                  rowData={user}
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
                totalCount={totalCount}
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
