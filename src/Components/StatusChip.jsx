import React from "react";

const STATUS_CONFIG = {
  awaiting_finalization: {
    label: "Pending",
    bg: "#FFF3CD",
    color: "#856404",
  },
  upcoming: {
    label: "Upcoming",
    bg: "#E7F1FF",
    color: "#0D6EFD",
  },
  ongoing: {
    label: "Ongoing",
    bg: "#D1E7DD",
    color: "#0F5132",
  },
  completed: {
    label: "Completed",
    bg: "#E9ECEF",
    color: "#495057",
  },
};

export const StatusChip = ({ value }) => {
  if (!value) return "N/A";

  const key = value.toLowerCase(); // normalize
  const config = STATUS_CONFIG[key];

  if (!config) return value;

  return (
    <span
      style={{
        backgroundColor: config.bg,
        color: config.color,
        padding: "4px 10px",
        borderRadius: "6px",
        fontSize: "12px",
        display: "inline-block",
        textTransform: "capitalize",
      }}
    >
      {config.label}
    </span>
  );
};
