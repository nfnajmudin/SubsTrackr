import "./login.css";
import SocialLogin from "../component/SocialLogin";
import InputField from "../component/InputField";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);

    console.log(result.user.email);
    console.log(result.user.displayName);

    navigate("/home"); 

  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className="login-container">

      {/* LEFT SIDE */}
      <div className="left">
        
        {/* LOGO SECTION */}
        <div className="brand">
          <img src="/logo.png" alt="logo" className="logo-img" />
          <h1>SubsTrackr</h1>
        </div>

        <h2>
            Take control of <br />
            your <span>subscriptions.</span>
        </h2>

        <p>
          Track, manage, and optimize all your subscriptions in one place. <br />
          Save more, stress less.
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="right">
        <div className="login-card">

            <h2 className="form-title">Log in with</h2>

            <SocialLogin onGoogleClick={handleGoogleLogin} />         

            <p className="separator"><span>or</span></p>

            <form className="login-form">
            <InputField type="email" placeholder="Email address" icon="mail" />
            <InputField type="password" placeholder="Password" icon="lock" />

            <a href="#" className="forgot-password-link">Forgot password?</a>

            <button type="submit" className="login-button">Log In</button>
            </form>

            <p className="signup-prompt">
            Don&apos;t have an account? <a href="#">Sign up</a>
            </p>

        </div>
    </div>
     
    </div>
  );
};

export default Login;