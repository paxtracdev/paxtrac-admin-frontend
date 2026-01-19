import React from "react";

import editImg from "../assets/images/sidebar/cardEdit.png";
import timerImg from "../assets/images/sidebar/timer.png";
import trophyImg from "../assets/images/sidebar/trophy.png";
import mobileImg from "../assets/images/sidebar/mobile.png";
import walletImg from "../assets/images/sidebar/walleticon.png";

const steps = [
  {
    img: editImg,
    title: "Create Promotion",
    desc: "Enter Promotion details and bid.",
  },
  {
    img: timerImg,
    title: "Bidding Period",
    desc: "Bidding open until month end",
  },
  {
    img: trophyImg,
    title: "Admin Review",
    desc: "Admin selects top bids",
  },
  {
    img: mobileImg,
    title: "Featured",
    desc: "Selected promotions shown for 30 days.",
  },
  {
    img: walletImg,
    title: "Refund",
    desc: "Other bids refunded automatically.",
  },
];

const HowItWorks = () => {
  return (
    <div
      className="promotion-card"
    >
      {/* Header */}
      <h5 className="card-title-common mb-1">How It Works</h5>
        <p className="text-desc-common fw-normal mb-4">
        Understanding the bidding and section process
        </p>

      {/* Steps */}
      <div className="row text-center g-4">
        {steps.map((step, i) => (
          <div key={i} className="col-12 col-md-4 col-xl-2 mx-auto promo-column">
            <div
              className="promotion-img-circle"
            >
              <img
                src={step.img}
                alt={step.title}
              />
            </div>
            <h6 className="mb-0" >{step.title}</h6>
            <p className="mb-0">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;
