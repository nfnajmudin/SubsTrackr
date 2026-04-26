import "./login.css";

const Login = () => {
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
      <div className="right"></div>

    </div>
  );
};

export default Login;