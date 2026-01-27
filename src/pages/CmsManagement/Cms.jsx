import React, { useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import Breadcrumbs from "../../Components/Breadcrumbs";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NoData from "../../Components/NoData";

ModuleRegistry.registerModules([AllCommunityModule]);

const STATIC_CMS_DATA = [
  {
    _id: "1",
    title: "Privacy Policy",
    slug: "privacy-policy",
    updatedAt: "2024-10-01T10:30:00",
    content: "<p>This is privacy policy content.</p>",
  },
  {
    _id: "2",
    title: "Terms & Conditions",
    slug: "terms-and-conditions",
    updatedAt: "2024-10-05T14:45:00",
    content: "<p>This is terms and conditions content.</p>",
  },
];

const Cms = () => {
  const navigate = useNavigate();
  const [cmsData, setCmsData] = useState(STATIC_CMS_DATA);

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
              navigate("/cms/view", {
                state: { cmsItem: params.data },
              })
            }
          >
            <Eye size={20} />
          </button>
        ),
      },
    ],
    [navigate]
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
          {cmsData.length === 0 ? (
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
