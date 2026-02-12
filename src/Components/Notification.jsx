  import React from "react";
import { Dropdown } from "react-bootstrap";
import { Bell } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Notification = ({ notifications = [] }) => {
  const hasNotifications = notifications.length > 0;
  const navigate = useNavigate();

  return (
    <Dropdown align="end" className="notification-dropdown">
      <Dropdown.Toggle
        as="div"
        id="dropdown-notifications"
        className="notification-icon c-pointer me-3 position-relative"
      >
        <Bell size={20} />
        {/* {hasNotifications && (
          <span
            className="notification-badge position-absolute translate-middle badge rounded-pill bg-danger"
            style={{ fontSize: "0.6rem" }}
          >
            {notifications.length}
          </span>
        )} */}
      </Dropdown.Toggle>

      <Dropdown.Menu
        className="shadow-lg border-0 p-0"
        style={{
          minWidth: "320px",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <div className="p-3">
          <h6 className="mb-0 fw-semibold">Notifications</h6>
        </div>

        <div
          className="notification-list"
          style={{ maxHeight: "250px", overflowY: "auto" }}
        >
          {!hasNotifications ? (
            <div className="p-3 text-center  small">
              <p className="mb-0">No notifications available</p>
            </div>
          ) : (
            notifications.map((n, idx) => (
              <div
                key={idx}
                className="p-3 small notification-item"
                style={{ cursor: "pointer" }}
              >
                <strong>{n.title}</strong> — {n.message}
                <div
                  className="text-secondary mt-1"
                  style={{ fontSize: "0.75rem" }}
                >
                  {n.time}
                </div>
              </div>
            ))
          )}
        </div>

        {hasNotifications && (
          <div className="p-2 text-center border-top">
            <Link
              to="/all-notification"
              className="d-block text-decoration-none fw-semibold text-color"
            >
              View All
            </Link>
          </div>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default Notification;
