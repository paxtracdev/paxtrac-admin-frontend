import React from "react";

function CommonCard({ stats }) {
  const colXL = stats.length === 3 ? "col-xl-4" : "col-xl-3";

  return (
    <div className="row">
      {stats.map((card, i) => (
        <div
          className={`col-lg-4 ${colXL} g-3 mb-4`}
          key={i}
          onClick={card.onClick}
        >
          <div className="dashboard-stat p-3 d-flex flex-column justify-content-between h-100 ">
            <div className="d-flex align-items-center mb-2">
              <div className="w-100">
                <div className="w-100 d-flex align-items-center justify-content-between">
                  <p className="card-title dashboard mb-2">{card.title}</p> 
                  <div className="me-2 stat-icon">{card.icon}</div>
                </div>
                <h5 className="mb-0 card-value">{card.value}</h5>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CommonCard;
