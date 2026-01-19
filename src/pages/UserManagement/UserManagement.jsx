import React, { useEffect, useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import Breadcrumbs from "../../Components/Breadcrumbs";
import { Link, useNavigate } from "react-router-dom";
import Switch from "react-switch";
import Swal from "sweetalert2";
import CustomPagination from "../../Components/CustomPagination";
import NoData from "../../Components/NoData";
import { Eye, Trash2 } from "lucide-react";
import { useGetUsersQuery, useUpdateUserMutation } from "../../api/userApi";
import Loader from "../../Components/Loader";

ModuleRegistry.registerModules([AllCommunityModule]);

const UserManagement = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useGetUsersQuery({
    page,
    limit: pageSize,
    search,
  });

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const users = data?.data?.users || [];
  const pagination = data?.data?.pagination || {};

  const totalCount = pagination.total || 0;
  const totalPages = pagination.pages || 1;

  const paginatedData = useMemo(() => users, [users]);

  // COLUMNS
  const columnDefs = useMemo(
    () => [
      {
        headerName: "S.NO.",
        cellRenderer: (params) => {
          return params.node.rowIndex + 1;
        },
        minWidth: 100,
        flex: 1,
        cellStyle: { textAlign: "center" },
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
        minWidth: 200,
        flex: 1,
      },
      {
        headerName: "Role",
        field: "role",
        minWidth: 200,
        flex: 1,
        cellRenderer: (p) =>
          p.value
            ? p.value.charAt(0).toUpperCase() + p.value.slice(1).toLowerCase()
            : "",
      },

      {
        headerName: "All Notifications",
        field: "allNotifications",
        minWidth: 200,
        flex: 1,
        cellRenderer: (p) => (p.value ? "Yes" : "No"),
      },
      {
        headerName: "Chat Notifications",
        field: "chatNotifications",
        minWidth: 200,
        flex: 1,
        cellRenderer: (p) => (p.value ? "Yes" : "No"),
      },

      {
        headerName: "isOtpVerified",
        field: "isOtpVerified",
        minWidth: 200,
        cellRenderer: (p) => (p.value ? "Yes" : "No"),

        flex: 1,
      },
      {
        headerName: "star tDate",
        valueGetter: (p) =>
          p.data.subscription?.startDate
            ? new Date(p.data.subscription.startDate).toLocaleDateString(
                "en-GB"
              )
            : "N/A",
        minWidth: 200,
        flex: 1,
      },

      {
        headerName: "End Date",
        valueGetter: (p) =>
          p.data.subscription?.expiryDate
            ? new Date(p.data.subscription.expiryDate).toLocaleDateString(
                "en-GB"
              )
            : "N/A",
        minWidth: 200,
        flex: 1,
      },

      {
        headerName: "Status",
        field: "status",
        minWidth: 140,
        cellRenderer: (params) => {
          const handleToggle = async (checked) => {
            try {
              await updateUser({
                id: params.data._id,
                payload: {
                  status: checked,
                },
              }).unwrap();

              Swal.fire({
                icon: "success",
                title: "Updated",
                text: "User status updated successfully",
                showConfirmButton: true,
              });
            } catch (error) {
              Swal.fire({
                icon: "error",
                title: "Failed",
                text: "Unable to update status",
              });
            }
          };

          return (
            <Switch
              checked={Boolean(params.value)}
              onChange={handleToggle}
              onColor="#166FFF"
              // offColor="#ef4444"
              checkedIcon={false}
              uncheckedIcon={false}
              height={20}
              width={40}
            />
          );
        },
      },

      {
        headerName: "Action",
        width: 150,
        cellRenderer: (params) => {
          const handleDelete = () => {
            Swal.fire({
              title: "Delete User?",
              text: `Are you sure you want to delete ${params.data.name}?`,
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#d33",
              cancelButtonColor: "#166fff",
              confirmButtonText: "Yes, delete",
            }).then((result) => {
              if (result.isConfirmed) {
                const updated = userData.filter(
                  (u) => u._id !== params.data._id
                );
                setUserData(updated);

                Swal.fire({
                  title: "Deleted!",
                  icon: "success",
                  confirmButtonColor: "#166fff",
                });
              }
            });
          };
          return (
            // View Button
            <div className="d-flex align-items-center gap-1">
              <button
                className="btn p-0 border-0 bg-transparent"
                title="View"
                onClick={() =>
                  navigate(`/user-management/view-user/${params.data._id}`)
                }
                style={{ cursor: "pointer" }}
              >
                <Eye size={20} />
              </button>
              {/* <p className="mb-0 ms-2"> | </p> */}
              {/* Delete Button */}
              {/* <button
                className="delete-btn-icon"
                onClick={handleDelete}
                title="Delete"
              >
                <Trash2 size={20} />
              </button> */}
            </div>
          );
        },
      },
    ],
    [page, pageSize]
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
          <NoData text="User not found" imageWidth={300} showImage={true} />
        </div>
      </div>
    );
  }

  return (
    <main className="app-content body-bg">
      <section className="container">
        {/* Header */}
        <div className="d-flex justify-content-between mb-4">
          <div>
            <div className="title-heading mb-2">Users Management</div>
            <p className="title-sub-heading">
              Manage registered users and their access
            </p>
          </div>
        </div>

        <Breadcrumbs />

        {/* Search */}
        <div className="search-bar mb-4 position-relative">
          <input
            type="text"
            className="form-control ps-3"
            placeholder="Search users..."
            value={search}
            autoFocus
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // reset pagination on search
            }}
          />
        </div>

        {/* Table */}
        <div className="custom-card bg-white p-3">
          {isLoading ? (
            <p className="text-center">Loading users...</p>
          ) : users.length === 0 ? (
            <NoData text="No users found" />
          ) : (
            <>
              <div className="ag-theme-alpine">
                <AgGridReact
                  rowData={paginatedData}
                  columnDefs={columnDefs}
                  headerHeight={40}
                  rowHeight={48}
                  domLayout="autoHeight"
                  getRowStyle={(params) => ({
                    backgroundColor:
                      params.node.rowIndex % 2 !== 0 ? "#0061ff10" : "white",
                  })}
                />
              </div>

              <CustomPagination
                currentPage={page}
                totalPages={totalPages}
                totalCount={totalCount}
                pageSize={pageSize}
                onPageChange={(p) => setPage(p)}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setPage(1);
                }}
              />
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default UserManagement;
