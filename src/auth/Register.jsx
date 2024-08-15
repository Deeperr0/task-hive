import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
	createUserWithEmailAndPassword,
	sendEmailVerification,
} from "firebase/auth";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
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

export default function Register({ user, setUser, usersList }) {
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [username, setUsername] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		if (user !== null) {
			navigate("/");
		}
	});
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

			const newUser = userCredential.user;

			await sendEmailVerification(auth.currentUser);

			const newUserRef = doc(db, "users", newUser.uid);
			const firstName = fullName.split(" ")[0];
			const lastName = fullName.split(" ")[1];
			await setDoc(newUserRef, {
				username,
				firstName,
				lastName,
				email,
				teams: [],
			});
			if (!invitationCode) {
				document.querySelector(".register-status").innerHTML =
					"User added successfully. An email was sent with instructions to verify account and update password.";
				navigate("/");
			} else {
				const invitationDocRef = doc(db, "invitationCodes", invitationCode);
				const invitationDoc = await getDoc(invitationDocRef);

				if (invitationDoc.exists()) {
					const invitationData = invitationDoc.data();

					if (invitationData.used) {
						navigate("/");
					} else {
						const teamDocRef = doc(db, "teams", invitationData.teamId);
						const teamDoc = await getDoc(teamDocRef);
						const teamData = teamDoc.data();
						const teamMembers = teamData.teamMembers;
						await updateDoc(teamDocRef, {
							teamMembers: [
								...teamMembers,
								{
									username,
									uid: newUser.uid,
									email,
								},
							],
						});
						const newUserDoc = await getDoc(newUserRef);
						const newUserData = newUserDoc.data();
						await updateDoc(newUserRef, {
							...newUserData,
							teams: {
								[invitationData.teamId]: { role: invitationData.chosenRole },
							},
						});

						await updateDoc(invitationDocRef, {
							...invitationData,
							used: true,
						});
						setUser(newUser);
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
			<div className="bg-primary flex flex-col items-center h-1/2 justify-between gap-5 w-11/12 md:w-5/12 mx-auto pt-16 pb-4 mt-6 rounded-lg text-customText lg:h-4/6">
				<h2 className="text-white text-3xl md:text-[2rem]">
					Welcome to TaskHive!
				</h2>
				<p className="text-customBackground text-xs w-11/12 md:text-sm md:w-9/12 text-center">
					Register now to create your account and start managing your tasks and
					projects efficiently with TaskHive.
				</p>
				<form
					onSubmit={handleRegister}
					className="w-11/12 md:w-1/2 flex flex-col gap-4 [&>*]:h-12 [&>*]:pl-3 [&>*]:rounded-4"
					autoComplete="off"
				>
					<div className="bg-customBackground flex items-center gap-2">
						<FontAwesomeIcon
							icon={faUser}
							className="text-customText"
						/>
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
						<FontAwesomeIcon
							icon={faAt}
							className="text-customText"
						/>
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
						<FontAwesomeIcon
							icon={faEnvelope}
							className="text-customText"
						/>
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
						<FontAwesomeIcon
							icon={faLock}
							className="text-customText"
						/>
						<input
							type={showPassword ? "text" : "password"}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Password"
							required
							minLength={6}
							maxLength={20}
							className="bg-transparent w-9/12 md:w-4/5"
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
						className="bg-accentShade1 rounded-md px-4 py-2 w-full text-xl text-white"
					>
						Create Account
					</button>
				</form>
				<p className="text-sm text-white">
					Already have an account?{" "}
					<a
						href="/login"
						className="text-accent"
					>
						Login
					</a>
				</p>
				<div className="register-status"></div>
			</div>
		</>
	);
}

Register.propTypes = {
	user: PropTypes.object,
	setUser: PropTypes.func.isRequired,
	usersList: PropTypes.array.isRequired,
};
