import React, { useState } from "react";
import { Eye, EyeClosed, ArrowLeft } from "lucide-react";
import loginLleft from "../../assets/images/login-left.png";
import logo from "../../assets/images/logos.png";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function LoginPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [step, setStep] = useState("login"); // login | forgot
  const [forgotEmail, setForgotEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Email and password are required",
        confirmButtonColor: "#a99068",
      });
      return;
    }

    // MOCK LOGIN SUCCESS
    localStorage.setItem("token", "mock-token");

    Swal.fire({
      icon: "success",
      title: "Login Successful",
      text: "Welcome to Admin Dashboard",
      confirmButtonColor: "#a99068",
    }).then(() => navigate("/dashboard"));
  };

  const handleSendReset = (e) => {
    e.preventDefault();

    if (!forgotEmail) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Email is required",
        confirmButtonColor: "#a99068",
      });
      return;
    }

    setEmailSent(true);

    Swal.fire({
      icon: "success",
      title: "Email Sent",
      text: "Password reset link has been sent to your email",
      confirmButtonColor: "#a99068",
    });
  };

  return (
    <div className="container-fluid vh-100 body-bg overflow-hidden">
      <div className="row h-100">
        {/* Left Image */}
        <div className="col-md-5 d-none p-0 dark-bg">
          <div className="login-left">
            <img src={loginLleft} alt="login" />
          </div>
        </div>

        {/* Login Card */}
        <div className="col-12 d-flex align-items-center justify-content-center">
          <div className="login-card p-5 w-75">
            <div className="text-center mb-4">
              <img src={logo} alt="Logo" className="logo-login w-max mb-3" />
              <h2 className="login-heading">Access Your Admin Dashboard</h2>
            </div>

            {/* LOGIN */}
            {step === "login" && (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label input-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                <div className="mb-3 position-relative pass-input">
                  <label className="form-label input-label">Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control pe-5"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span onClick={togglePassword}>
                    {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
                  </span>
                </div>

                <div
                  className="form-label input-label c-pointer text-end"
                  onClick={() => setStep("forgot")}
                >
                  Forgot Password?
                </div>

                <div className="text-center mt-3">
                  <button type="submit" className="login-btn">
                    Sign In
                  </button>
                </div>
              </form>
            )}

            {/* FORGOT PASSWORD */}
            {step === "forgot" && !emailSent && (
              <form onSubmit={handleSendReset}>
                <div className="mb-3">
                  <label className="form-label input-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your registered email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                <div className="text-center mb-3">
                  <button type="submit" className="login-btn">
                    Send Reset Link
                  </button>
                </div>

                <div
                  className="form-label input-label c-pointer text-center"
                  onClick={() => setStep("login")}
                >
                  <ArrowLeft size={16} /> Back to Login
                </div>
              </form>
            )}

            {/* EMAIL SENT */}
            {step === "forgot" && emailSent && (
              <div className="text-center">
                <p className="reset-success-text">
                  Please check your email for the password reset link.
                </p>

                <button
                  className="login-btn secondary-btn"
                  onClick={() => {
                    setStep("login");
                    setEmailSent(false);
                    setForgotEmail("");
                  }}
                >
                  Back to Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
