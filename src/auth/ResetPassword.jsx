import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
// import "./ResetPassword.css";

export default function ResetPassword() {
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const navigate = useNavigate();

	async function handleResetPassword(event) {
		event.preventDefault();
		try {
			await sendPasswordResetEmail(auth, email);
			setMessage(
				"Password reset email sent. Please check your inbox. You will be redirected to the login page in 5 seconds."
			);
		} catch (error) {
			console.error("Error sending password reset email:", error);
			setMessage("Error sending password reset email.");
		}
	}

	useEffect(() => {
		if (
			message ===
			`Password reset email sent. Please check your inbox. You will be redirected to the login page in 5 seconds.`
		) {
			let timerText = 5;
			const timerInterval = setInterval(() => {
				timerText--;
				setMessage(
					`Password reset email sent. Please check your inbox. You will be redirected to the login page in ${timerText} seconds.`
				);
				if (timerText === 0) {
					clearInterval(timerInterval);
					navigate("/");
				}
			}, 1000);
		}
	}, [message, navigate]);

	return (
		<div className="reset-password-container">
			<h2 className="reset-password-title">Reset Password</h2>
			<form onSubmit={handleResetPassword}>
				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="Enter your email"
					required
				/>
				<button type="submit">Send Reset Email</button>
			</form>
			{message && <p>{message}</p>}
		</div>
	);
}
