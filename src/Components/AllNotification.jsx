import React, { useState, useEffect, useRef } from "react";
import Breadcrumbs from "./Breadcrumbs";
import { LoadingComponent } from "./LoadingComponent";
import { useGetNotificationsQuery } from "../Api/notificationApi";
import NoData from "../Components/NoData";
import { useNavigate } from "react-router-dom";

export default function AllNotification() {
  const { data, isLoading } = useGetNotificationsQuery({ page: 1, limit: 10 });
  const notifications = data?.data || [];
  const navigate = useNavigate();

  const [expanded, setExpanded] = useState({});
  const [isOverflowing, setIsOverflowing] = useState({});
  const refs = useRef({});
  useEffect(() => {
    notifications.forEach((n) => {
      const el = refs.current[n.id];
      if (el) {
        const hasOverflow = el.scrollWidth > el.clientWidth;
        setIsOverflowing((prev) => ({ ...prev, [n.id]: hasOverflow }));
      }
    });
  }, [notifications]);

  return (
    <main className="app-content body-bg">
      <section className="container">
        <div className="d-flex  mb-4 justify-content-between">
          <div>
            <div className="title-heading mb-2">All Notifications</div>
            <p className="title-sub-heading">
              See all your recent notifications and stay informed
            </p>
          </div>
        </div>
        <Breadcrumbs />

        <div>
          {isLoading ? (
            <LoadingComponent isLoading={isLoading} fullScreen />
          ) : notifications.length === 0 ? (
            <NoData text="No notifications found" />
          ) : (
            notifications.map((n) => (
              <div key={n.id} className="custom-card mb-3 shadow-sm" onClick={() => navigate(n.link || "/")} style={{ cursor: "pointer" }}>
                <div className="d-flex align-items-start justify-content-between">
                  <div>
                    <h5 className="form-title-basic mb-1">{n.title}</h5>
                  </div>
                  <div>
                    <small className="table-email-text">
                      {new Date(n.createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </small>
                  </div>
                </div>
                <div className=" " style={{ maxWidth: "90%" }}>
                  <p
                    ref={(el) => (refs.current[n.id] = el)}
                    className="text-desc-common mb-1"
                    style={{
                      maxWidth: "100%", 
                      whiteSpace: expanded[n.id] ? "normal" : "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "inline-block", 
                    }}
                  >
                    {n.message}
                  </p>

                  {isOverflowing[n.id] && (
                    <span
                      onClick={() =>
                        setExpanded((prev) => ({
                          ...prev,
                          [n.id]: !prev[n.id],
                        }))
                      }
                      style={{
                        color: "#4B7EFF",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: 500,
                        position: "relative",
                        bottom: "7.5px",
                      }}
                    >
                      {expanded[n.id] ? "View less" : "View more"}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
