import React, { useState } from "react";
import { Eye, EyeClosed, ArrowLeft } from "lucide-react";
import loginLleft from "../../assets/images/login-left.png";
import logo from "../../assets/images/logos.png";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLoginMutation, useForgotPasswordMutation } from "../../api/authApi";
import { setUser } from "../../redux/slice/userSlice";
export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState("login"); // "login" | "forgot"
  const [forgotEmail, setForgotEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const [login, { isLoading }] = useLoginMutation();
  const [forgotPassword] = useForgotPasswordMutation();

  const dispatch = useDispatch();

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await login({
        email,
        password,
      }).unwrap();

      console.log("Login Response:", res);

      dispatch(
        setUser({
          token: res.token,
          user: res.data,
        }),
      );

      // Optional: store token in localStorage
      localStorage.setItem("token", res.token);

      navigate("/dashboard");
    } catch (error) {
      alert(error?.data?.message || "Login failed");
    }
  };

  const handleSendReset = async () => {
    if (!forgotEmail) return;

    try {
      await forgotPassword({ email: forgotEmail }).unwrap();
      setEmailSent(true);
    } catch (err) {
      alert(err?.data?.message || "Failed to send reset link");
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();

    if (!forgotEmail) return;

    alert("Password reset link sent to your email."); // later replace with API
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

            {step === "login" && (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label input-label">
                    Email Address:
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                <div className="mb-3 position-relative pass-input">
                  <label className="form-label input-label">Password:</label>
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

                <div className="text-center mb-3">
                  <button
                    type="submit"
                    className="login-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </button>
                </div>
              </form>
            )}
            {step === "forgot" && !emailSent && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendReset();
                }}
              >
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
                  className="form-label input-label c-pointer text-start"
                  onClick={() => setStep("login")}
                >
                  <ArrowLeft size={16} /> Back to Login
                </div>
              </form>
            )}

            {step === "forgot" && emailSent && (
              <div className="reset-success-box text-center">
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
