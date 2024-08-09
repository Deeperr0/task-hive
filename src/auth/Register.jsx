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
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faAt,
	faEnvelope,
	faEye,
	faEyeSlash,
	faLock,
	faUser,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "../components/Navbar";

// TODO: MAKE IT SO THAT IT CHECKS THE LINK FOR AN INVITATION CODE IT SHOULD CHECK THE LINK THEN CHECK A COLLECTION CALLED "invitationCodes" which will contain docs the doc.id is the invitation code and it will have a map with 2 keys. Team: this will contain the teamID that is using the invitation code, Used: this will be a boolean of whether the code has already been used

export default function Register({ setUser, usersList }) {
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	// const [firstName, setFirstName] = useState("");
	// const [lastName, setLastName] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [username, setUsername] = useState("");
	const navigate = useNavigate();

	async function handleRegister(event) {
		const url = window.location.href;

		const urlObj = new URL(url);
		const invitationCode = urlObj.searchParams.get("invitationCode");

		event.preventDefault();

		// Log username availability check
		if (checkUsernameAvailability(username) === false) {
			document.querySelector(".register-status").innerHTML =
				"Username already exists. Please choose a different username.";
			console.log("Username taken.");
			return;
		}

		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);

			const user = userCredential.user;

			await sendEmailVerification(auth.currentUser);

			const newUserRef = doc(db, "users", user.uid);
			const firstName = fullName.split(" ")[0];
			const lastName = fullName.split(" ")[1];
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
		<>
			<Navbar />
			<div className="bg-primary flex flex-col items-center h-1/2 justify-between gap-5 w-5/12 mx-auto pt-16 pb-4 mt-6 rounded-lg text-customText">
				<h2 className="text-white text-[2rem]">Welcome to TaskHive!</h2>
				<p className="text-customBackground text-sm w-9/12 text-center">
					Register now to create your account and start managing your tasks and
					projects efficiently with TaskHive.
				</p>
				<form
					onSubmit={handleRegister}
					className="w-1/2 flex flex-col gap-4 [&>*]:h-12 [&>*]:pl-3 [&>*]:rounded-4"
					autoComplete="off">
					<div className="bg-customBackground flex items-center gap-2">
						<FontAwesomeIcon icon={faUser} className="text-customText" />
						<input
							type="text"
							value={fullName}
							onChange={(e) => {
								setFullName(e.target.value);
							}}
							placeholder="Full Name"
							required
							autoFocus
							className="bg-transparent w-full"
						/>
					</div>
					<div className="bg-customBackground flex items-center gap-2">
						<FontAwesomeIcon icon={faAt} className="text-customText" />
						<input
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							placeholder="Username"
							required
							autoFocus
							className="bg-transparent w-full"
						/>
					</div>

					<div className="bg-customBackground flex items-center gap-2">
						<FontAwesomeIcon icon={faEnvelope} className="text-customText" />
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Email"
							required
							autoFocus
							className="bg-transparent w-full"
						/>
					</div>
					<div className="bg-customBackground text-neutral1 flex items-center gap-2">
						<FontAwesomeIcon icon={faLock} className="text-customText" />
						<input
							type={showPassword ? "text" : "password"}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Password"
							required
							minLength={6}
							maxLength={20}
							className="bg-transparent w-4/5"
						/>
						<button
							type="button"
							className="show-password"
							onClick={(e) => {
								e.preventDefault();
								setShowPassword(!showPassword);
							}}>
							{showPassword ? (
								<FontAwesomeIcon icon={faEye} />
							) : (
								<FontAwesomeIcon icon={faEyeSlash} />
							)}
						</button>
					</div>
					<button
						type="submit"
						className="bg-accentShade1 rounded-md px-4 py-2 w-full text-xl text-white">
						Create Account
					</button>
				</form>
				<p className="text-sm text-white">
					Already have an account?{" "}
					<a href="/login" className="text-accent">
						Login
					</a>
				</p>
				<div className="register-status"></div>
			</div>
		</>
	);
}

Register.propTypes = {
	setUser: PropTypes.func.isRequired,
	usersList: PropTypes.array.isRequired,
};
