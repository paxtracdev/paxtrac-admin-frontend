import React from "react";
import { Construction } from "lucide-react";

const UnderDevelopment = () => {
  return (
    <main className="app-content body-bg">
      <section className="container d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
        
        <div className="text-center p-4">
          <Construction size={80} color="#166fff" className="mb-3" />

          <h2 className="fw-bold mb-2">This Page Is Under Development</h2>

          <p className="text-muted mb-4" style={{ fontSize: "15px" }}>
            We’re working hard to bring this feature to you soon.  
            Please check back later!
          </p>

          <button 
            className="primary-button card-btn" 
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        </div>

      </section>
    </main>
  );
};

export default UnderDevelopment;