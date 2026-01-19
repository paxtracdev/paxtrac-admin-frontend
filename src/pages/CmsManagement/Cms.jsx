import React, { useEffect, useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import Breadcrumbs from "../../Components/Breadcrumbs";
import { Eye, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import CustomPagination from "../../Components/CustomPagination";
import NoData from "../../Components/NoData";
import { Link, useNavigate } from "react-router-dom";
import { useGetAllPagesQuery } from "../../api/cmsApi";
import Loader from "../../Components/Loader";

ModuleRegistry.registerModules([AllCommunityModule]);

const Cms = () => {
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetAllPagesQuery();

  const cmsData = useMemo(() => {
    if (!data?.data) return [];

    return [
      {
        _id: data.data.privacyPolicy.id,
        title: data.data.privacyPolicy.title,
        updatedAt: data.data.privacyPolicy.lastUpdated,
        // content: data.data.privacyPolicy.content, // keep for View page
      },
      {
        _id: data.data.termsAndConditions.id,
        title: data.data.termsAndConditions.title,
        updatedAt: data.data.termsAndConditions.lastUpdated,
        // content: data.data.termsAndConditions.content,
      },
    ];
  }, [data]);

  // COLUMNS
  const columnDefs = useMemo(
    () => [
      {
        headerName: "S.NO.",
        width: 100,
        cellStyle: { textAlign: "center" },
        valueGetter: (params) => params.node.rowIndex + 1,
      },
      {
        headerName: "Page Name",
        field: "title",
        flex: 1.5,
      },
      {
        headerName: "Last Updated",
        field: "updatedAt",
        flex: 1.2,
        valueGetter: (p) => {
          if (!p.data?.updatedAt) return "—";

          const date = new Date(p.data.updatedAt);

          const formattedDate = date.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });

          const formattedTime = date.toLocaleString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          });

          return `${formattedDate} | ${formattedTime}`;
        },
      },

      {
        headerName: "Action",
        width: 120,
        cellRenderer: (params) => {
          const handleDelete = () => {
            Swal.fire({
              title: "Delete Page?",
              text: `Are you sure you want to delete "${params.data.title}"?`,
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#d33",
              cancelButtonColor: "#166fff",
              confirmButtonText: "Yes, delete",
            }).then((result) => {
              if (result.isConfirmed) {
                const updated = cmsData.filter(
                  (p) => p._id !== params.data._id
                );
                setCmsData(updated);

                Swal.fire({
                  title: "Deleted!",
                  icon: "success",
                  confirmButtonColor: "#166fff",
                });
              }
            });
          };

          return (
            <div className="d-flex align-items-center gap-2">
              <button
                className="btn p-0 bg-transparent border-0"
                title="View"
                onClick={() =>
                  navigate("/cms/view", {
                    state: { cmsItem: params.data },
                  })
                }
              >
                <Eye size={20} />
              </button>

              {/* <button className="delete-btn-icon" onClick={handleDelete}>
                <Trash2 size={20} />
              </button> */}
            </div>
          );
        },
      },
    ],
    [cmsData]
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
          <NoData text="CMS not found" imageWidth={300} showImage={true} />
        </div>
      </div>
    );
  }
  return (
    <main className="app-content body-bg">
      <section className="container">
        <div className="d-flex justify-content-between mb-4">
          <div>
            <div className="title-heading mb-2">CMS Management</div>
            <p className="title-sub-heading">
              Manage content pages of your platform
            </p>
          </div>

          {/* <Link to={"/cms/add"}>
            <button className="primary-button card-btn">Add Page</button>
          </Link> */}
        </div>

        <Breadcrumbs />

        {/* Table */}
        <div className="custom-card bg-white p-3">
          {isLoading ? (
            <div className="text-center py-5">Loading CMS pages...</div>
          ) : cmsData.length === 0 ? (
            <NoData text="No CMS pages found" />
          ) : (
            <>
              <div className="ag-theme-alpine">
                <AgGridReact
                  rowData={cmsData}
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
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default Cms;
