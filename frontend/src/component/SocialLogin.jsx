const SocialLogin = ({ onGoogleClick }) => {
  return (
    <div className="social-login">
      <button
        className="social-button"
        onClick={onGoogleClick}
        disabled={!onGoogleClick}
      >
        <img src="google.svg" alt="Google" className="social-icon" />
        Google
      </button>
      {/* Apple login temporarily hidden until implementation is ready.
      <button className="social-button">
        <img src="apple.svg" alt="Apple" className="social-icon" />
        Apple
      </button>
      */}
    </div>
  )
}

export default SocialLogin;
