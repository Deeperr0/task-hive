// Login.jsx
import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom"; // Ensure you have react-router-dom installed and set up
import "./Login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

export default function Login({ setUser }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();

	const handleLogin = async (event) => {
		event.preventDefault();
		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			setUser(userCredential.user);
		} catch (error) {
			console.error("Error logging in:", error);
		}
	};

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
		</div>
	);
}

Login.propTypes = {
	setUser: PropTypes.func,
};
