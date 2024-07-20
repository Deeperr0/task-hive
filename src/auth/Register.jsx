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
import { v4 as uuidv4 } from "uuid"; // Import UUID generator
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function Register({ setUser, usersList }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [username, setUsername] = useState("");
	const navigate = useNavigate();

	async function handleRegister(event) {
		event.preventDefault();
		if (checkUsernameAvailability(username) === false) {
			document.querySelector(".register-status").innerHTML =
				"Username already exists. Please choose a different username.";
			return;
		}
		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user = userCredential.user;

			// Send email verification
			await sendEmailVerification(auth.currentUser);

			// Generate a unique teamId using UUID
			const teamId = uuidv4();

			// Save user details in firestore
			await setDoc(doc(db, "users", user.uid), {
				username,
				firstName,
				lastName,
				email,
				teams: [
					{
						teamName: "My Team",
						teamId,
						teamMembers: [
							{
								username,
								uid: user.uid,
								email,
							},
						],
						tasks: [],
						role: "admin",
						lastUpdated: new Date().toISOString(),
						created: new Date().toISOString(),
						createdById: user.uid,
						subWorkspaces: [{}],
					},
				],
			});

			setUser(user);
			document.querySelector(".register-status").innerHTML =
				"User added successfully. An email was sent with instructions to verify account and update password.";
			navigate("/");
		} catch (error) {
			console.error("Error registering:", error);
			if (error.code === "auth/email-already-in-use") {
				document.querySelector(".register-status").innerHTML =
					"Email already in use. Please try again with a different email.";
			}
		}
	}
	function checkUsernameAvailability(username) {
		const uniqueUsername = usersList.filter(
			(user) => user.username === username
		);
		if (uniqueUsername.length > 0) {
			return false;
		} else {
			return true;
		}
	}
	return (
		<div className="register-container">
			<h2 className="register-title">Register</h2>
			<form
				onSubmit={handleRegister}
				className="register-form"
				autoComplete="off"
			>
				<div className="name-fields-container">
					<input
						type="text"
						value={firstName}
						onChange={(e) => setFirstName(e.target.value)}
						placeholder="First Name"
						required
						autoFocus
					/>
					<input
						type="text"
						value={lastName}
						onChange={(e) => setLastName(e.target.value)}
						placeholder="Last Name"
						required
						autoFocus
					/>
				</div>

				<input
					type="text"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					placeholder="Username"
					required
					autoFocus
				/>
				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="Email"
					required
					autoFocus
				/>
				<div className="password-field-register">
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
				<button
					type="submit"
					className="register-button"
				>
					Register
				</button>
			</form>
			<p className="login-link-container">
				Already have an account?{" "}
				<a
					href="/"
					className="login-link"
				>
					Login
				</a>
			</p>
			<div className="register-status"></div>
		</div>
	);
}

Register.propTypes = {
	setUser: PropTypes.func.isRequired,
	usersList: PropTypes.array.isRequired,
};
