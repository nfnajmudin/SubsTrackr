import "./login.css"; // reuse same styling for now
import InputField from "../component/InputField";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "../services/authService";

const Register = () => {
  const navigate = useNavigate();

  // state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // signup handler
  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await signUp(email, password);
      navigate("/home"); // auto login after signup
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="right">
        <div className="login-card">

          <h2 className="form-title">Create Account</h2>

          <form className="login-form" onSubmit={handleSignup}>

            <InputField
              type="email"
              placeholder="Email address"
              icon="mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <InputField
              type="password"
              placeholder="Password"
              icon="lock"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit" className="login-button">
              Sign Up
            </button>
          </form>

          <p className="signup-prompt">
            Already have an account? <a href="/">Log in</a>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Register;