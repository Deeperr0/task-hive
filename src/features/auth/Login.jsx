import { startTransition, useState } from "react";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
// import "./Login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faEye,
  faEyeSlash,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import parseError from "./parseError";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/ui/Footer";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

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
        startTransition(() => navigate("/"));
      }, 2000);
    } catch (error) {
      const loginError = document.querySelector(".login-error");
      loginError.classList.remove("hidden");
      loginError.innerHTML = parseError(error.message);
    }
  }

  return (
    <>
      <div className="text-black flex flex-col items-center justify-center gap-5 h-11/12 w-11/12 md:w-8/12 lg:w-5/12 mx-auto pt-16 pb-4 rounded-lg ">
        <h3 className="font-bold">Log in to TaskHive</h3>
        <p className="text-neutral-500">
          Welcome back! Please enter your details.
        </p>

        <form
          onSubmit={handleLogin}
          className="[&_svg]:text-accent-600 [&_input]:outline-none [&>div]:border [&>div]:border-neutral-300 w-11/12 md:w-1/2 flex flex-col gap-4 *:h-12 *:pl-3 *:rounded-4"
        >
          <div className="bg-white flex items-center gap-2">
            <FontAwesomeIcon icon={faEnvelope} className="0" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="h-full w-full"
            />
          </div>
          <div className="relative bg-white flex items-center gap-2">
            <FontAwesomeIcon icon={faLock} className="0" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              minLength={6}
              maxLength={20}
              className="w-4/5 md:w-9/12 h-full"
            />
            <button
              type="button"
              className="absolute right-5 show-password"
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
          <p className="w-full text-right">
            <a
              href="/reset-password"
              className="font-medium text-accent-500 hover:text-accent-300 transition-all duration-300"
            >
              Forgot password?
            </a>
          </p>
          <button
            type="submit"
            className="bg-accent-500 text-accent-50 border-2 border-transparent rounded-lg hover:bg-transparent hover:border-accent-500 hover:text-accent-500 px-4 py-2 w-full text-xl  transition-all duration-300"
          >
            Login
          </button>
          <p className="text-center">
            {"Don't have an account?"}{" "}
            <a
              href="/register"
              className="font-medium text-accent-500 hover:text-accent-300 transition-all duration-300"
            >
              Sign up
            </a>
          </p>
        </form>

        <p className="login-error hidden">{`Error: ${auth.error}`}</p>
      </div>
      <Footer />
    </>
  );
}

Login.propTypes = {
  setUser: PropTypes.func,
};
