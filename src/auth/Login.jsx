import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import "./Login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setTimeout(() => {
        setUser(userCredential.user);
      }, 2000);
    } catch (error) {
      const loginError = document.querySelector(".login-error");
      loginError.classList.remove("hidden");
      console.log(error);
      switch (error.message) {
        case "Firebase: Error (auth/user-disabled).":
          loginError.innerHTML = "User disabled. Please contact support.";
          break;
        case "Firebase: Error (auth/user-not-found).":
          loginError.innerHTML = "User not found. Please register first.";
          break;
        case "Firebase: Error (auth/wrong-password).":
          loginError.innerHTML = "Wrong password. Please try again.";
          break;
        case "Firebase: Error (auth/too-many-requests).":
          loginError.innerHTML = "Too many requests. Please try again later.";
          break;
        case "Firebase: Error (auth/invalid-email).":
          loginError.innerHTML = "Invalid email. Please try again.";
          break;
        case "Firebase: Error (auth/network-request-failed).":
          loginError.innerHTML = "Network request failed. Please try again.";
          break;
        case "Firebase: Error (auth/weak-password).":
          loginError.innerHTML = "Password must be at least 6 characters.";
          break;
        case "Firebase: Error (auth/invalid-credential).":
          loginError.innerHTML = "Invalid credentials. Please try again.";
          break;
        default:
          loginError.innerHTML = "An error occurred. Please try again.";
          break;
      }
      console.error("Error logging in:", error);
    }
  }

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            minLength={6}
            maxLength={20}
          />
          <button
            type="button"
            className="show-password"
            onClick={(e) => {
              e.preventDefault();
              setShowPassword(!showPassword);
            }}
          >
            {showPassword ? (
              <FontAwesomeIcon icon={faEye} />
            ) : (
              <FontAwesomeIcon icon={faEyeSlash} />
            )}
          </button>
        </div>
        <button type="submit">Login</button>
        <p className="reset-password">
          {`Forgot your password? `}
          <a href="/reset-password" className="reset-password-link">
            Reset password
          </a>
        </p>
      </form>
      <p className="no-account">
        {"Don't have an account?"} <a href="/register">Sign up</a>
      </p>

      <p className="login-error hidden">{`Error: ${auth.error}`}</p>
    </div>
  );
}

Login.propTypes = {
  setUser: PropTypes.func,
};
