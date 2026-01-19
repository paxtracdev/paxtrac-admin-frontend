import React from "react"; 
import Breadcrumbs from "../Components/Breadcrumbs";

const Legal = () => {
  const lastUpdated = "December 2025";

  return (
    <main className="app-content body-bg">
      <section className="container">
        {/* HEADER */}
        <div className="d-flex justify-content-between mb-4">
          <div>
            <div className="title-heading mb-2">Legal</div>
            <p className="title-sub-heading">
              Privacy Policy & Terms & Conditions 
            </p>
          </div>
        </div>

        <Breadcrumbs />

        {/* CONTENT */}
        <div className="custom-card bg-white p-4 mt-3">
          <div className="title-heading   mb-1">
            Privacy Policy & Terms & Conditions
          </div>
          <p className="  mb-4" style={{ color: "#6b7280" }}>
            Last updated: {lastUpdated}
          </p>

          {/* PRIVACY POLICY */}
          <div className="mb-4">
            <h5 className="fw-semibold mb-2">Privacy Policy</h5>
            <p style={{ color: "#374151" }}>
              Your privacy is important to us. This Privacy Policy explains how
              we collect, use, and protect your information when you use our
              platform.
            </p>

            <div className="mb-3">
              <h6 className="fw-semibold">1. Information We Collect</h6>
              <ul style={{ color: "#374151" }}>
                <li>Personal details such as name, email address, phone number</li>
                <li>Account login details</li>
                <li>Usage data including pages visited and actions performed</li>
                <li>Device and browser information for security and analytics</li>
              </ul>
            </div>

            <div className="mb-3">
              <h6 className="fw-semibold">2. How We Use Your Information</h6>
              <ul style={{ color: "#374151" }}>
                <li>Create and manage your account</li>
                <li>Provide and improve our services</li>
                <li>Communicate important updates and notifications</li>
                <li>Ensure platform security and prevent fraudulent activity</li>
              </ul>
            </div>

            <div className="mb-3">
              <h6 className="fw-semibold">3. Data Protection</h6>
              <p style={{ color: "#374151" }}>
                We implement appropriate security measures to protect your
                personal data against unauthorized access, alteration, or
                disclosure.
              </p>
            </div>

            <div className="mb-3">
              <h6 className="fw-semibold">4. Data Sharing</h6>
              <p style={{ color: "#374151" }}>
                We do not sell or rent your personal information. Data may only
                be shared with trusted service providers for platform operations
                or legal authorities if required by law.
              </p>
            </div>

            <div className="mb-3">
              <h6 className="fw-semibold">5. Your Rights</h6>
              <ul style={{ color: "#374151" }}>
                <li>Access your personal data</li>
                <li>Request corrections or deletion</li>
                <li>Withdraw consent where applicable</li>
              </ul>
            </div>
          </div>

          <hr />

          {/* TERMS & CONDITIONS */}
          <div className="mt-4">
            <h5 className="fw-semibold mb-2">Terms & Conditions</h5>
            <p style={{ color: "#374151" }}>
              By accessing or using this platform, you agree to comply with the
              following terms.
            </p>

            <div className="mb-3">
              <h6 className="fw-semibold">1. Use of the Platform</h6>
              <ul style={{ color: "#374151" }}>
                <li>You must provide accurate and complete information</li>
                <li>You are responsible for maintaining the confidentiality of your account</li>
                <li>Unauthorized use of the platform is strictly prohibited</li>
              </ul>
            </div>

            <div className="mb-3">
              <h6 className="fw-semibold">2. User Responsibilities</h6>
              <p style={{ color: "#374151" }}>You agree not to:</p>
              <ul style={{ color: "#374151" }}>
                <li>Violate any applicable laws or regulations</li>
                <li>Attempt to disrupt or compromise system security</li>
                <li>Misuse content or data from the platform</li>
              </ul>
            </div>

            <div className="mb-3">
              <h6 className="fw-semibold">3. Account Suspension</h6>
              <p style={{ color: "#374151" }}>
                We reserve the right to suspend or terminate accounts if the
                terms are violated, suspicious/fraudulent activity is detected,
                or required by legal/regulatory authorities.
              </p>
            </div>

            <div className="mb-3">
              <h6 className="fw-semibold">4. Intellectual Property</h6>
              <p style={{ color: "#374151" }}>
                All content, trademarks, and data on this platform are the
                property of the company. Unauthorized reproduction or
                distribution is prohibited.
              </p>
            </div>

            <div className="mb-3">
              <h6 className="fw-semibold">5. Limitation of Liability</h6>
              <ul style={{ color: "#374151" }}>
                <li>Any indirect or consequential damages</li>
                <li>Service interruptions due to technical issues</li>
                <li>Loss of data beyond reasonable control</li>
              </ul>
            </div>

            <div className="mb-3">
              <h6 className="fw-semibold">6. Changes to Policy</h6>
              <p style={{ color: "#374151" }}>
                We may update these policies from time to time. Continued use of
                the platform after updates implies acceptance of the revised
                terms.
              </p>
            </div>
          </div>

          <hr />

          {/* CONTACT */}
          <div className="mt-4">
            <h5 className="fw-semibold mb-2">Contact Us</h5>
            <p style={{ color: "#374151" }} className="mb-0">
              If you have questions regarding this Privacy Policy or Terms &
              Conditions, please contact our support team.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Legal;