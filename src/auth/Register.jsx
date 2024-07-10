import { useState } from "react";
import { auth, db } from "../firebase";
import {
	createUserWithEmailAndPassword,
	sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import PropTypes from "prop-types";

export default function Register({ setUser }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const handleRegister = async (event) => {
		event.preventDefault();
		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user = userCredential.user;

			// Send email verification
			await sendEmailVerification(auth.currentUser);

			// Save user role in Firestore
			await setDoc(doc(db, "users", user.uid), { role: "user" });

			document.querySelector(".register-status").innerHTML =
				"User added successfully. An email was sent with instructions to verify account and update password.";
		} catch (error) {
			console.error("Error registering:", error);
			if (error.code === "auth/email-already-in-use") {
				document.querySelector(".register-status").innerHTML =
					"Email already in use. Please try again with a different email.";
			}
		}
	};

	return (
		<div className="register-container">
			<h2 className="register-title">Register</h2>
			<form
				onSubmit={handleRegister}
				className="register-form"
				autoComplete="off"
			>
				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="Email"
					required
					autoFocus
				/>
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="Password"
					required
					minLength={6}
					maxLength={20}
				/>
				<button
					type="submit"
					className="register-button"
				>
					Register
				</button>
			</form>
			<div className="register-status"></div>
		</div>
	);
}

Register.propTypes = {
	setUser: PropTypes.func.isRequired,
};
