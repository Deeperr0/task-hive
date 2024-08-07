import { useState } from "react";
import { auth, db } from "../firebase";
import {
	createUserWithEmailAndPassword,
	sendEmailVerification,
} from "firebase/auth";
import {
	collection,
	doc,
	getDoc,
	getDocs,
	updateDoc,
	query,
	where,
	setDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
// import "./Register.css";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid"; // Import UUID generator
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

// TODO: MAKE IT SO THAT IT CHECKS THE LINK FOR AN INVITATION CODE IT SHOULD CHECK THE LINK THEN CHECK A COLLECTION CALLED "invitationCodes" which will contain docs the doc.id is the invitation code and it will have a map with 2 keys. Team: this will contain the teamID that is using the invitation code, Used: this will be a boolean of whether the code has already been used

export default function Register({ setUser, usersList }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [username, setUsername] = useState("");
	const navigate = useNavigate();

	async function handleRegister(event) {
		// Log the function call
		console.log("handleRegister function called.");

		// Log the URL from which the function is called
		const url = window.location.href;
		console.log("Current URL:", url);

		const urlObj = new URL(url);
		const invitationCode = urlObj.searchParams.get("invitationCode");
		console.log("Invitation code:", invitationCode);

		event.preventDefault();
		console.log("Form submission prevented.");

		// Log username availability check
		console.log("Checking username availability for:", username);
		if (checkUsernameAvailability(username) === false) {
			document.querySelector(".register-status").innerHTML =
				"Username already exists. Please choose a different username.";
			console.log("Username taken.");
			return;
		}

		try {
			console.log("Creating user with email and password.");
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			console.log("User credential received:", userCredential);

			const user = userCredential.user;
			console.log("User created:", user);

			console.log("Sending email verification.");
			await sendEmailVerification(auth.currentUser);
			console.log("Email verification sent.");

			console.log("Generating unique teamId.");
			const teamId = uuidv4();
			console.log("Generated teamId:", teamId);

			const newUserRef = doc(db, "users", user.uid);
			console.log("Creating Firestore document for new user.");

			await setDoc(newUserRef, {
				username,
				firstName,
				lastName,
				email,
				teams: [],
			});
			console.log("User details saved in Firestore.");
			if (!invitationCode) {
				console.log("Navigating to homepage, no invitation code present.");
				document.querySelector(".register-status").innerHTML =
					"User added successfully. An email was sent with instructions to verify account and update password.";
				navigate("/");
			} else {
				console.log("Fetching invitation document for code:", invitationCode);
				const invitationDocRef = doc(db, "invitationCodes", invitationCode);
				const invitationDoc = await getDoc(invitationDocRef);
				console.log("Invitation document received:", invitationDoc);

				if (invitationDoc.exists()) {
					const invitationData = invitationDoc.data();
					console.log("Invitation data:", invitationData);

					if (invitationData.used) {
						console.log(
							"Invitation code already used. Navigating to homepage."
						);
						navigate("/");
					} else {
						console.log("Invitation code is valid. Adding user to teams.");
						await Promise.all(
							usersList.map(async (userItem) => {
								if (
									userItem.teams.some(
										(team) => team.teamId === invitationData.teamId
									)
								) {
									console.log("User item found in team:", userItem);

									const q = query(
										collection(db, "users"),
										where("username", "==", userItem.username)
									);
									const qSnapshot = await getDocs(q);
									console.log("Query snapshot received:", qSnapshot);

									const userDoc = qSnapshot.docs[0];

									if (userDoc) {
										const userData = userDoc.data();
										const updatedTeams = userData.teams.map((team) => {
											if (team.teamId === invitationData.teamId) {
												return {
													...team,
													teamMembers: [
														...team.teamMembers,
														{
															username,
															uid: user.uid,
															email,
														},
													],
												};
											}
											return team;
										});

										const userDocRef = doc(db, "users", userItem.id);
										console.log("Updating team for user:", userItem.username);
										await updateDoc(userDocRef, { teams: updatedTeams });
										console.log("Team updated for user:", userItem.username);
									}
								}
							})
						);

						const adminRef = doc(db, "users", invitationData.invitedBy);
						const adminDoc = await getDoc(adminRef);
						console.log("Admin document received:", adminDoc);

						const adminData = adminDoc.data();
						const teamObj = adminData.teams.filter(
							(team) => team.teamId === invitationData.teamId
						)[0];
						console.log("Updating new user team with admin data.");
						await updateDoc(newUserRef, {
							teams: [teamObj],
						});
						console.log("New user team updated.");

						console.log("Marking invitation as used.");
						await updateDoc(invitationDocRef, {
							...invitationData,
							used: true,
						});
						console.log("Invitation marked as used.");
						setUser(user);
						setTimeout(navigate("/"), 5000);
					}
				} else {
					console.log("Invitation document does not exist.");
				}
			}
		} catch (error) {
			console.error("Error registering:", error);
			if (error.code === "auth/email-already-in-use") {
				document.querySelector(".register-status").innerHTML =
					"Email already in use. Please try again with a different email.";
			}
		}
	}

	function checkUsernameAvailability(username) {
		return !usersList.some((user) => user.username === username);
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
