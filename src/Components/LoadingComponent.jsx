import React from "react"; 
import loadingAnimation from "../assets/json/loadingAnimation.json";
import Lottie from "lottie-react";

export const LoadingComponent = ({ isLoading = false, fullScreen = false }) => {
  if (!isLoading) return null;

  return (
    <div
      className={`${fullScreen ? "" : ""}`}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="loading-container">
        <Lottie
          animationData={loadingAnimation}
          // style={{ width: "100px" }}
          loop
        />
      </div>
    </div>
  );
};