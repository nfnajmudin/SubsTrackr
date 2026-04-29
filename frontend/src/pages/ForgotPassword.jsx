import { useState } from "react";
import { resetPassword } from "../services/authService";
import InputField from "../component/InputField";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    try {
      await resetPassword(email);
      alert("Reset email sent! Check your inbox.");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="register-container">

      {/* BRAND (same as Register) */}
      <div className="register-brand">
        <img src="/logo.png" alt="logo" className="register-logo" />
        <h1>SubsTrackr</h1>
      </div>

      {/* CARD */}
      <div className="login-card">
        <h2 className="form-title">Reset Password</h2>

        <form className="login-form" onSubmit={handleReset}>
          <InputField
            type="email"
            placeholder="Email address"
            icon="mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button type="submit" className="login-button">
            Send Reset Email
          </button>
        </form>

        <p className="signup-prompt">
          Remember your password? <a href="/">Log in</a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;