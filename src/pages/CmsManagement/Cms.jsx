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
  const { data, isLoading, isError, refetch } = useGetAllPagesQuery();

  const formatTitle = (name, title) => {
    if (name === "privacy-policy") return "Privacy Policy";
    if (
      name === "terms-of-service" ||
      name === "terms-of-use" ||
      name === "term-of-use" ||
      (title && title.toLowerCase().includes("terms"))
    ) {
      return "Terms of Use";
    }
    if (name === "join-us") return "Join Us";
    if (title && title.trim()) return title.trim();
    return name
      ? name
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
      : "Untitled Page";
  };

  const cmsData = useMemo(() => {
    const rawList = data?.data || [];
    const seen = new Set();
    const unique = [];

    for (const item of rawList) {
      const rawName = item.name || item.slug || "";
      let canonicalKey = rawName;
      if (
        rawName === "terms-of-service" ||
        rawName === "terms-of-use" ||
        rawName === "term-of-use"
      ) {
        canonicalKey = "terms-of-use";
      } else if (rawName === "privacy-policy" || rawName === "privacypolicy") {
        canonicalKey = "privacy-policy";
      } else if (rawName === "join-us" || rawName === "joinus") {
        canonicalKey = "join-us";
      }

      if (!seen.has(canonicalKey)) {
        seen.add(canonicalKey);
        unique.push({
          ...item,
          title: formatTitle(item.name, item.title),
        });
      }
    }

    return unique;
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
          if (!p.data.updatedAt) return "-";
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
            title="Edit Content"
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
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <div className="title-heading mb-2">CMS Management</div>
            <p className="title-sub-heading">
              Manage content pages of your platform
            </p>
          </div>
          {/* <button
            className="login-btn"
            onClick={() => navigate("/policies/add")}
          >
            Add New Page
          </button> */}
        </div>

        <Breadcrumbs />

        <div className="custom-card bg-white p-3">
          {isLoading ? (
            <LoadingComponent isLoading fullScreen />
          ) : isError ? (
            <div className="text-center py-5">
              <p className="text-muted mb-2">Failed to load CMS pages. The server might have been reloading.</p>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => refetch()}
              >
                Retry
              </button>
            </div>
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
