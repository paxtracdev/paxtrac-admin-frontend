import { useState } from "react";

export const ReadMoreCell = ({ value }) => {
  const [expanded, setExpanded] = useState(false);

  if (!value) return "-";

  const isLongText = value.length > 100;

  return (
    <div>
      <div className={!expanded ? "truncate-text" : ""}>{value}</div>

      {isLongText && (
        <span className="read-more-btn" onClick={() => setExpanded(!expanded)}>
          {expanded ? "Read less" : "Read more"}
        </span>
      )}
    </div>
  );
};
