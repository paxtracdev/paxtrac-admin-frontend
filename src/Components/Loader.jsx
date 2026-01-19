import React from "react";

const Loader = ({
  size = "md",
  color = "primary",
  text = "Loading...",
  fullScreen = false,
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const colorClasses = {
    primary: "text-primary border-primary",
    secondary: "text-secondary border-secondary",
    white: "text-white border-white",
    logo: "text-[#166FFF] border-[#166FFF]",
  };

  const loaderContent = (
    <div className={`loader-container loader-fade-in ${className}`}>
      <div
        className={`spinner-border ${sizeClasses[size]} ${colorClasses[color]}`}
        role="status"
        style={{
          borderWidth: size === "sm" ? "0.15em" : "0.25em",
          ...(color === "logo" && {
            borderColor: "#166FFF",
            borderRightColor: "transparent",
          }),
        }}
      >
        <span className="visually-hidden">{text}</span>
      </div>
      {text && (
        <div
          className={`loader-text ${
            color === "white"
              ? "text-white"
              : color === "logo"
              ? "text-[#166FFF]"
              : "text-muted"
          }`}
        >
          {text}
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          zIndex: 9999,
        }}
      >
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
};

export default Loader;
