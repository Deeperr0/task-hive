import { useState } from "react";
import { auth } from "../firebase"; // Import your Firebase auth instance
import { updatePassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
	const [newPassword, setNewPassword] = useState("");
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	const handleChangePassword = async (event) => {
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
	};

	return (
		<div>
			<h2>Change Password</h2>
			<form onSubmit={handleChangePassword}>
				<input
					type="password"
					value={newPassword}
					onChange={(e) => setNewPassword(e.target.value)}
					placeholder="New Password"
					required
					minLength={6}
					maxLength={20}
				/>
				<button type="submit">Change Password</button>
				{error && <p style={{ color: "red" }}>{error}</p>}
			</form>
		</div>
	);
}
