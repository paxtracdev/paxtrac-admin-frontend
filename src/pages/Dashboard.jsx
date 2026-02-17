import { CalendarCheck, DollarSign, TrendingUp, Users } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  // Mock static data instead of API
  const statsData = {
    active_users: 1250,
    total_events: 1240,
    engagement_ratio: "75%",
    total_revenue: 15400,
  };

  const stats = [
    {
      icon: <Users size={22} />,
      title: "Active Users",
      value: statsData.active_users,
      path: "/user-management",
    },
    {
      icon: <CalendarCheck size={22} />,
      title: "Total Jobs",
      value: statsData.total_events,
      path: "/listing-management",
    },
    // {
    //   icon: <TrendingUp size={22} />,
    //   title: "Engagement Ratio",
    //   value: statsData.engagement_ratio,
    //   path: "/analytics",
    // },
    {
      icon: <DollarSign size={22} />,
      title: "Revenue",
      value: `$${statsData.total_revenue}`,
      path: "/payment",
    },
  ];

  return (
    <main className="app-content body-bg">
   <section className="container">
  <div className="row align-items-stretch g-3">

    {/* LEFT: Admin Welcome Card */}
    <div className="col-lg-6 col-xl-5">
      <div className="dashboard-welcome-card p-4 h-100">
        <h4 className="mb-1 fw-semibold">Hey Admin!</h4>
        <p className="mb-2 text-muted">
          Ready to conquer the day? Let's get started!
        </p>
        <div className="mt-5">
          <strong>Last Login:</strong> 29 Jan 2026 | 18:04 PM
        </div>
      </div>
    </div>

    {/* RIGHT: Stats Cards */}
    <div className="col-lg-6 col-xl-7">
      <div className="row g-3">
        {stats.map((card, i) => (
          <div className="col-md-4" key={i}>
            <div
              className="dashboard-stat p-3 h-100 c-pointer"
              onClick={() => navigate(card.path)}
            >
              <div className="d-flex justify-content-between align-items-center">
                <p className="card-title mb-1">{card.title}</p>
                <div className="stat-icon">{card.icon}</div>
              </div>
              <h5 className="mb-0 card-value">{card.value}</h5>
            </div>
          </div>
        ))}
      </div>
    </div>

  </div>
</section>

    </main>
  );
}

export default Dashboard;
