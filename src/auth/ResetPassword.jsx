import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./ResetPassword.css";

export default function ResetPassword() {
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const navigate = useNavigate();

	const handleResetPassword = async (event) => {
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
	};

	useEffect(() => {
		if (
			message ===
			"Password reset email sent. Please check your inbox. You will be redirected to the login page in 5 seconds."
		) {
			const timer = setTimeout(() => {
				navigate("/");
			}, 5000);

			return () => clearTimeout(timer); // Cleanup the timer if the component unmounts
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
