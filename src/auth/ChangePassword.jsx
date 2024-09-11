import { useState } from "react";
import { auth } from "../firebase"; // Import your Firebase auth instance
import { updatePassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function ChangePassword() {
	const [newPassword, setNewPassword] = useState("");
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	async function handleChangePassword(event) {
		event.preventDefault();
		try {
			await updatePassword(auth.currentUser, newPassword);
			// Password updated successfully
			console.log("Password updated successfully");
			// Optionally, redirect user or show a success message
			navigate("/");
		} catch (error) {
			console.error("Error changing password:", error.message);
			setError(error.message);
		}
	}

	return (
		<div className="bg-primary w-1/3 mx-auto mt-36 flex flex-col justify-center items-center py-10 gap-4 rounded-lg">
			<div className="flex items-center gap-2 justify-between">
				<FontAwesomeIcon
					icon={faArrowLeft}
					className="text-xl"
					onClick={() => navigate("/")}
				/>
				<h2 className="text-2xl">Change Password</h2>
			</div>

			<form
				onSubmit={handleChangePassword}
				className="flex gap-2"
			>
				<input
					type="password"
					value={newPassword}
					onChange={(e) => setNewPassword(e.target.value)}
					placeholder="New Password"
					required
					minLength={6}
					maxLength={20}
					className="pl-2 text-customText"
				/>
				<button
					type="submit"
					className="bg-accent rounded-md px-4 py-2 hover:bg-accentShade1 transition-all duration-300"
				>
					Change Password
				</button>
				{error && <p style={{ color: "red" }}>{error}</p>}
			</form>
		</div>
	);
}
