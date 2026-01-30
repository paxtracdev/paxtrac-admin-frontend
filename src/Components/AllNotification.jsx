import React, { useState, useEffect, useRef } from "react";
import Breadcrumbs from "./Breadcrumbs";
import NoData from "../Components/NoData";
import { useNavigate } from "react-router-dom";

export default function AllNotification() {
  const navigate = useNavigate();

  // Static notifications
  const notifications = [
    {
      id: 1,
      title: "Welcome!",
      message: "Thanks for joining our platform. Get started by exploring the dashboard.",
      createdAt: "2026-01-28T10:30:00Z",
      link: "/dashboard",
    },
    {
      id: 2,
      title: "New Feature Released",
      message: "We've added a new analytics tool to help you track your progress.",
      createdAt: "2026-01-27T14:15:00Z",
      link: "/features",
    },
    {
      id: 3,
      title: "System Maintenance",
      message: "Scheduled maintenance will occur on Feb 1, 2026, from 1 AM to 3 AM UTC.",
      createdAt: "2026-01-26T09:00:00Z",
      link: "/maintenance-info",
    },
    {
      id: 4,
      title: "Reminder",
      message: "Don't forget to complete your profile to unlock all features.",
      createdAt: "2026-01-25T12:45:00Z",
      link: "/profile",
    },
    {
      id: 5,
      title: "Survey",
      message: "Share your feedback with us to help improve our services.",
      createdAt: "2026-01-24T08:20:00Z",
      link: "/survey",
    },
  ];

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
  }, []);

  return (
    <main className="app-content body-bg">
      <section className="container">
        <div className="d-flex mb-4 justify-content-between">
          <div>
            <div className="title-heading mb-2">All Notifications</div>
            <p className="title-sub-heading">
              See all your recent notifications and stay informed
            </p>
          </div>
        </div>
        <Breadcrumbs />

        <div>
          {notifications.length === 0 ? (
            <NoData text="No notifications found" />
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className="custom-card mb-3 shadow-sm"
                onClick={() => navigate(n.link || "/")}
                style={{ cursor: "pointer" }}
              >
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
                <div style={{ maxWidth: "90%" }}>
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
