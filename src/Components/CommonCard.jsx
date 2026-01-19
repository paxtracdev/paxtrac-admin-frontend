import React from "react";

function CommonCard({ stats }) {

  const colXL = stats.length === 3 ? "col-xl-4" : "col-xl-3";

  return (
    <div className="row">
      {stats.map((card, i) => (
        <div className={`col-lg-4 ${colXL} g-3 mb-4`} key={i} onClick={card.onClick}>
          <div className="p-3 text-white light-green-card d-flex flex-column justify-content-between h-100 ">
            <div className="d-flex align-items-center mb-2">
              <div className="w-100">
                <p className="card-title mb-2">{card.title}</p>
                <div className="w-100 d-flex align-items-center justify-content-between">
                  <h5 className="mb-0 card-value">{card.value}</h5>
                </div>
              </div>
            </div>
            <p className="card-desc-text mb-0 mt-2">{card.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CommonCard;
