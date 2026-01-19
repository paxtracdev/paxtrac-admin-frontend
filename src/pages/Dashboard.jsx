import { Plus, Tag } from "lucide-react";
import dollarIcon from "../assets/images/sidebar/dollar-circle.png";
import calendarIconDashboard from "../assets/images/sidebar/calendar.png";
import clockIconDashboard from "../assets/images/sidebar/clock.png";
import starIcon from "../assets/images/sidebar/star.png";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import NoData from "../Components/NoData";
import { useGetDashboardStatsQuery } from "../api/dashboardApi";
import DashboardShimmer from "../shimmers/DashboardShimmer";

function Dashboard() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetDashboardStatsQuery();
  const statsData = data?.data;

  const stats = [
    {
      icon: <img src={clockIconDashboard} alt="clock" />,
      title: "Active Users",
      value: statsData?.active_users ?? 0,
      path: "/user-management",
    },
    {
      icon: <img src={calendarIconDashboard} alt="calendar" />,
      title: "Total Events",
      value: statsData?.total_events ?? 0,
      path: "/event-management",
    },
    {
      icon: <img src={starIcon} alt="star" />,
      title: "Engagement Ratio",
      value: statsData?.engagement_ratio ?? "0%",
      path: "/voting-management",
    },
    {
      icon: <img src={dollarIcon} alt="dollar" />,
      title: "Revenue",
      value: `$${statsData?.total_revenue ?? 0}`,
      path: "/monetization",
    },
  ];

  if (isLoading) {
    return (
      <main className="app-content body-bg">
        <section className="container">
          <div className="row">
            <DashboardShimmer />
          </div>
        </section>
      </main>
    );
  }

  if (error) return <p>Failed to load dashboard</p>;

  return (
    <main className="app-content body-bg">
      <section className="container">
        {/* Stats Cards */}
        <div className="row">
          {stats.map((card, i) => {
            let cardBgClass = "nopending";
            if (card.title === "Pending Approvals" && Number(card.value) > 0) {
              cardBgClass = "pending-stat";
            }

            return (
              <div className="col-lg-4 col-xl-3 g-3 mb-4" key={i}>
                <div
                  className={`p-3 text-white light-green-card ${cardBgClass} d-flex flex-column justify-content-between h-100 c-pointer`}
                  onClick={() => navigate(card.path)}
                >
                  <div className="d-flex align-items-center mb-2">
                    <div className="w-100">
                      <p className="card-title mb-2">{card.title}</p>
                      <div className="w-100 d-flex align-items-center justify-content-between">
                        <h5 className="mb-0 card-value">{card.value}</h5>
                        <div className="me-2 stat-icon">{card.icon}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

export default Dashboard;
