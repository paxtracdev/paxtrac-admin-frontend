import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import logo from "../assets/images/logo.png";
import { X } from "lucide-react";

export default function OtpModal({
  show,
  handleClose,
  phoneNumber,
  onVerify,
  onResend,
  loading,
}) {
  const [otp, setOtp] = useState(["", "", "", ""]);

  const handleChange = (value, index) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input automatically
    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
  if (e.key === "Backspace") {
    const newOtp = [...otp];

    // Clear current input if there's a value
    if (newOtp[index]) {
      newOtp[index] = "";
      setOtp(newOtp);
    } else if (index > 0) {
      // Move to previous input if current is empty
      document.getElementById(`otp-${index - 1}`).focus();
      const prevOtp = [...otp];
      prevOtp[index - 1] = "";
      setOtp(prevOtp);
    }
  }
};

  const handleVerify = () => {
    onVerify(otp.join(""));
  };

  return (
    <Modal
      show={show}
      onHide={() => {}}
      centered
      backdrop="static"
      keyboard={false}
    >
      <div className="text-center p-4">

         {/* Close Icon */}
        <X
          onClick={handleClose}
          style={{
            position: "absolute",
            top: 15,
            right: 15,
            cursor: "pointer",
            width: 24,
            height: 24,
          }}
        />


        <img src={logo} style={{ width: 50 }} alt="logo" />

        <h5 className="otp-head-text mt-3">Enter Verification Code</h5>
        <p className="otp-resend-text">
          We’ve sent a code to <span>{phoneNumber}</span>
        </p>

        {/* OTP Inputs */}
        <div className="d-flex justify-content-center gap-2 my-3">
          {otp.map((digit, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              type="text"
              maxLength="1"
              className={`auth-otp-box ${digit ? "filled" : ""}`}
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
            />
          ))}
        </div>

        <p className="code-resend-text" style={{ fontSize: "14px" }}>
          Didn’t get a code?
          <span className="" style={{ cursor: "pointer" }} onClick={onResend}>
            {loading ? "Resending..." : "Click to resend"}
          </span>
        </p>

        <div className="d-flex align-items-center justify-content-center gap-3 mt-3">
          <button className="button-secondary" onClick={handleClose}>
            Cancel
          </button>
          <button className="button-primary" onClick={handleVerify}>
            Verify
          </button>
        </div>
      </div>
    </Modal>
  );
}
