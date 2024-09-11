import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

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
			message ==
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
					navigate("/login");
				}
			}, 1000);

			return () => clearInterval(timerInterval);
		}
	}, [message, navigate]);

	return (
		<div className="bg-primary-450 w-11/12 md:w-1/3 mx-auto mt-36 flex flex-col justify-center items-center py-10 gap-4 rounded-lg">
			<div className="flex items-center gap-2 justify-between">
				<FontAwesomeIcon
					icon={faArrowLeft}
					className="text-xl"
					onClick={() => navigate("/login")}
				/>
				<h2 className="text-2xl">Reset Password</h2>
			</div>
			<form
				onSubmit={handleResetPassword}
				className="flex flex-col gap-4 text-customText [&>*]:w-full"
			>
				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="Enter your email"
					required
					className="p-2"
				/>
				<button
					type="submit"
					className="p-2 bg-accent hover:bg-accentShade1 text-customBackground rounded-md"
				>
					Send Reset Email
				</button>
			</form>
			{message && <p>{message}</p>}
		</div>
	);
}
