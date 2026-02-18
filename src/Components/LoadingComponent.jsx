import React from "react";
import loadingAnimation from "../assets/json/loadingAnimation.json";
import Lottie from "lottie-react";

export const LoadingComponent = ({ isLoading = false, fullScreen = false }) => {
  if (!isLoading) return null;

  // Clone the JSON so original na badle
  const modifiedAnimation = JSON.parse(JSON.stringify(loadingAnimation));

  // Set your color #a99068
  const newColor = [0.6627, 0.5647, 0.4078, 1]; // normalized RGB for Lottie

  // Loop through layers and shapes to change fill color
  modifiedAnimation.layers.forEach(layer => {
    if (layer.shapes) {
      layer.shapes.forEach(shape => {
        if (shape.it) {
          shape.it.forEach(item => {
            if (item.ty === "fl") {
              item.c.k = newColor;
            }
          });
        }
      });
    }
  });

  return (
    <main className="app-content body-bg">
      <section className="container">
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
              animationData={modifiedAnimation}
              loop
            />
          </div>
        </div>
      </section>
    </main>
  );
};
