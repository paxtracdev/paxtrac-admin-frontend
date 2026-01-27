import { CalendarCheck, DollarSign, TrendingUp, Users } from "lucide-react"; 
import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  // Mock static data instead of API
  const statsData = {
    active_users: 1250,
    total_events: 32,
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
    title: "Total Events",
    value: statsData.total_events,
    path: "/event-management",
  },
  {
    icon: <TrendingUp size={22} />,
    title: "Engagement Ratio",
    value: statsData.engagement_ratio,
    path: "/voting-management",
  },
  {
    icon: <DollarSign size={22} />,
    title: "Revenue",
    value: `$${statsData.total_revenue}`,
    path: "/monetization",
  },
];


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
                  className={`dashboard-stat p-3 ${cardBgClass} d-flex flex-column justify-content-between h-100 c-pointer`}
                  onClick={() => navigate(card.path)}
                >
                  <div className="d-flex align-items-center mb-2">
                    <div className="w-100">
                      <div className="w-100 d-flex align-items-center justify-content-between">
                        <p className="card-title dashboard mb-2">
                          {card.title}
                        </p>
                        <div className="me-2 stat-icon">{card.icon}</div>
                      </div> 
                      <h5 className="mb-0 card-value">{card.value}</h5>
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
