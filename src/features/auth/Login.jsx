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
			<div className="bg-primary-450 flex flex-col items-center h-11/12 justify-between gap-5 w-11/12 md:w-8/12 lg:w-5/12 mx-auto pt-16 pb-4 mt-6 rounded-lg text-accent-500">
				<h2 className="text-white text-3xl md:text-[2rem]">Welcome Back</h2>
				<p className="text-xs w-11/12 md:text-sm md:w-9/12 text-center text-accent-50">
					{"Don't have an account?"}{" "}
					<a
						href="/register"
						className="text-accent-500 hover:text-accent-300 transition-all duration-300"
					>
						Sign up
					</a>
				</p>
				<form
					onSubmit={handleLogin}
					className="w-11/12 md:w-1/2 flex flex-col gap-4 [&>*]:h-12 [&>*]:pl-3 [&>*]:rounded-4"
				>
					<div className="bg-white flex items-center gap-2">
						<FontAwesomeIcon
							icon={faEnvelope}
							className="text-accent-500"
						/>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Email"
							required
							className="h-full w-full"
						/>
					</div>
					<div className="bg-white text-neutral1 flex items-center gap-2">
						<FontAwesomeIcon
							icon={faLock}
							className="text-accent-500"
						/>
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
					<button
						type="submit"
						className="bg-accent-500 border-2 border-transparent rounded-md hover:bg-transparent hover:border-accent-500 px-4 py-2 w-full text-xl text-white transition-all duration-300"
					>
						Login
					</button>
					<p className="text-accent-50 text-xs md:text-sm text-center">
						{`Forgot your password? `}
						<a
							href="/reset-password"
							className="text-accent-500 hover:text-accent-300 transition-all duration-300"
						>
							Reset password
						</a>
					</p>
				</form>

				<p className="login-error hidden">{`Error: ${auth.error}`}</p>
			</div>
		</>
	);
}

Login.propTypes = {
	setUser: PropTypes.func,
};
