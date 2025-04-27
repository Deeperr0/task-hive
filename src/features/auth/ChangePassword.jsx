import { startTransition, useState, useEffect } from "react";
import { auth } from "../../firebase";
import { updatePassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function ChangePassword() {
	// State to keep track of password so that it can be updated
	// It is better than using e.target.value because it is a controlled component now making it easier to sync the UI and the logic
	const [newPassword, setNewPassword] = useState("");
	// State to keep track of error to display it
	const [error, setError] = useState(null);
	// useNavigate hooks returns a navigate function that allows you to navigate to a different route when using react router
	const navigate = useNavigate();

	// Handle password change
	async function handleChangePassword(event) {
		// Stops the default behavior of the form submit event which is to reload the page
		event.preventDefault();
		try {
			// Updates the password
			await updatePassword(auth.currentUser, newPassword);
			console.log("Password updated successfully");
			startTransition(() => navigate("/")); // Start transition for smoother navigation
		} catch (error) {
			console.error("Error changing password:", error.message);
			setError(error.message);
		}
	}

	return (
		<div className="bg-primary-450 w-fit py-10 px-10 mx-auto mt-36 flex flex-col justify-center items-center gap-4 rounded-lg">
			<div className="flex flex-col items-start gap-2 justify-between w-full">
				<FontAwesomeIcon
					icon={faArrowLeft}
					className="text-xl hover:text-accent-500 transition-all duration-200"
					onClick={() => startTransition(() => navigate("/"))} // No direct call in JSX
				/>
				<h2 className="text-2xl w-full text-center">Change Password</h2>
			</div>

			<form
				onSubmit={handleChangePassword}
				className="flex flex-col lg:flex-row gap-4">
				<input
					type="password"
					value={newPassword}
					onChange={(e) => setNewPassword(e.target.value)}
					placeholder="New Password"
					required
					minLength={6}
					maxLength={20}
					className="p-2 text-customText"
				/>
				<button
					type="submit"
					className="bg-accent-500 rounded-md px-4 py-2 border-2 border-transparent hover:text-accent-500 hover:border-accent-500 hover:bg-transparent transition-all duration-300">
					Change Password
				</button>
				{error && <p style={{ color: "red" }}>{error}</p>}
			</form>
		</div>
	);
}
