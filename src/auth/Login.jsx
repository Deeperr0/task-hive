import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import "./Login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import parseError from "./parseError";

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
			loginError.innerHTML = parseError(error.message);
		}
	}

	return (
		<div className="login-container">
			<h2 className="login-title">Login</h2>
			<form
				onSubmit={handleLogin}
				className="login-form"
			>
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
					<a
						href="/reset-password"
						className="reset-password-link"
					>
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
