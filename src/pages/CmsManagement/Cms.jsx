import React, { useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import Breadcrumbs from "../../Components/Breadcrumbs";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NoData from "../../Components/NoData";
import { useGetAllPagesQuery } from "../../api/cmsApi";
import { LoadingComponent } from "../../Components/LoadingComponent";

ModuleRegistry.registerModules([AllCommunityModule]); 
const Cms = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetAllPagesQuery();

  const cmsData = useMemo(() => {
    return (data?.data || []).map((item) => ({
      ...item,
      title: item.name, // map API field to table field
    }));
  }, [data]);

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
          const date = new Date(p.data.updatedAt);
          return date.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
          });
        },
      },
      {
        headerName: "Action",
        width: 120,
        cellRenderer: (params) => (
          <button
            className="btn p-0 bg-transparent border-0 text-start"
            title="View"
            onClick={() =>
              navigate("/policies/view", {
                state: { cmsItem: params.data },
              })
            }
          >
            <Eye size={20} />
          </button>
        ),
      },
    ],
    [navigate],
  );

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
        </div>

        <Breadcrumbs />

        <div className="custom-card bg-white p-3">
          {isLoading ? (
            <LoadingComponent isLoading fullScreen />
          ) : cmsData.length === 0 ? (
            <NoData text="No CMS pages found" />
          ) : (
            <div className="ag-theme-alpine">
              <AgGridReact
                rowData={cmsData}
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
          )}
        </div>
      </section>
    </main>
  );
};

export default Cms;
