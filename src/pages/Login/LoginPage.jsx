import React, { useState } from "react";
import { Eye, EyeClosed, ArrowLeft } from "lucide-react";
import loginLleft from "../../assets/images/login-left.png";
import logo from "../../assets/images/logos.png";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import showToast from "../../utils/showToast";

export default function LoginPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [step, setStep] = useState("login"); // login | forgot
  const [forgotEmail, setForgotEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [errors, setErrors] = React.useState({
    email: "",
    password: "",
    forgotEmail: "",
  });

  const validateEmail = (value) => {
    if (!value) return "Email is required";
    // Simple email regex check (optional)
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(value)) return "Enter a valid email";
    return "";
  };

  const validatePassword = (value) => {
    if (!value) return "Password is required";
    return "";
  };

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = (e) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    setErrors({ email: emailError, password: passwordError, forgotEmail: "" });

    if (emailError || passwordError) return;

    // MOCK LOGIN SUCCESS
    localStorage.setItem("token", "mock-token");

    showToast("Login Successful. Welcome to Admin Dashboard", "success");
    navigate("/dashboard");
  };

  const handleSendReset = (e) => {
    e.preventDefault();

    const forgotEmailError = validateEmail(forgotEmail);
    setErrors((prev) => ({ ...prev, forgotEmail: forgotEmailError }));

    if (forgotEmailError) return;

    setEmailSent(true);
    showToast("Password reset link has been sent to your email", "success");
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
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors((prev) => ({
                        ...prev,
                        email: validateEmail(e.target.value),
                      }));
                    }}
                    autoFocus
                  />
                  {errors.email && (
                    <div className="text-danger">{errors.email}</div>
                  )}
                </div>

                <div className="mb-3 ">
                  <div className="position-relative pass-input">
                    <label className="form-label input-label">Password</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control pe-5"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setErrors((prev) => ({
                          ...prev,
                          password: validatePassword(e.target.value),
                        }));
                      }}
                    />
                    <span onClick={togglePassword}>
                      {showPassword ? (
                        <Eye size={20} />
                      ) : (
                        <EyeClosed size={20} />
                      )}
                    </span>
                  </div>

                  {errors.password && (
                    <div className="text-danger">{errors.password}</div>
                  )}
                </div>

                <div
                  className="form-label input-label text-end" 
                >
                  <span className="c-pointer" onClick={() => setStep("forgot")}>Forgot Password?</span>
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
                    onChange={(e) => {
                      setForgotEmail(e.target.value);
                      setErrors((prev) => ({
                        ...prev,
                        forgotEmail: validateEmail(e.target.value),
                      }));
                    }}
                    autoFocus
                  />
                  {errors.forgotEmail && (
                    <div className="text-danger">{errors.forgotEmail}</div>
                  )}
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
