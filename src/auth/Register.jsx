import { startTransition, useState } from "react";
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

export default function Register({ user, setUser, usersList }) {
	const [registrationDetails, setRegistrationDetails] = useState({
		username: "",
		fullName: "",
		email: "",
		password: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();

	if (user !== null) {
		startTransition(() => navigate("/"));
	}

	async function handleRegister(event) {
		const url = window.location.href;

		const urlObj = new URL(url);
		const invitationCode = urlObj.searchParams.get("invitationCode");

		event.preventDefault();

		if (checkUsernameAvailability(registrationDetails.username) === false) {
			document.querySelector(".register-status").innerHTML =
				"Username already exists. Please choose a different username.";
			return;
		}

		if (registrationDetails.fullName.split(" ").length < 2) {
			document.querySelector(".register-status").innerHTML =
				"Please enter your full name.";
			return;
		}

		if (registrationDetails.password.length < 6) {
			document.querySelector(".register-status").innerHTML =
				"Password must be at least 6 characters.";
			return;
		}

		if (
			registrationDetails.email === "" ||
			registrationDetails.email.includes("@") === false
		) {
			document.querySelector(".register-status").innerHTML =
				"Please enter a valid email address.";
			return;
		}

		if (registrationDetails.username === "") {
			document.querySelector(".register-status").innerHTML =
				"Please enter a username.";
			return;
		}

		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				registrationDetails.email,
				registrationDetails.password
			);

			const newUser = userCredential.user;

			await sendEmailVerification(auth.currentUser);

			const newUserRef = doc(db, "users", newUser.uid);
			const firstName = registrationDetails.fullName.split(" ")[0];
			const lastName = registrationDetails.fullName.split(" ")[1];
			await setDoc(newUserRef, {
				username: registrationDetails.username,
				firstName,
				lastName,
				email: registrationDetails.email,
				teams: [],
			});
			if (!invitationCode) {
				document.querySelector(".register-status").innerHTML =
					"User added successfully. An email was sent with instructions to verify account and update password.";
				startTransition(() => navigate("/"));
			} else {
				const invitationDocRef = doc(db, "invitationCodes", invitationCode);
				const invitationDoc = await getDoc(invitationDocRef);

				if (invitationDoc.exists()) {
					const invitationData = invitationDoc.data();

					if (invitationData.used) {
						<div className="flex flex-col items-center justify-center">
							<p>This link has already been used.</p>
							<p>
								If this is a mistake, please ask your admin to add you again to
								the team.
							</p>
							<p>Thank you for using TaskHive.</p>
							<button onClick={startTransition(() => navigate("/"))}>
								Go back
							</button>
						</div>;
					} else {
						const teamDocRef = doc(db, "teams", invitationData.teamId);
						const teamDoc = await getDoc(teamDocRef);
						const teamData = teamDoc.data();
						const teamMembers = teamData.teamMembers;
						await updateDoc(teamDocRef, {
							teamMembers: [
								...teamMembers,
								{
									username: registrationDetails.username,
									uid: newUser.uid,
									email: registrationDetails.email,
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
						setTimeout(
							startTransition(() => navigate("/")),
							5000
						);
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

	function handleChange(e) {
		setRegistrationDetails({
			...registrationDetails,
			[e.target.name]: e.target.value,
		});
	}
	return (
		<>
			<div className="bg-primary-450 flex flex-col items-center h-11/12 justify-between gap-5 w-11/12 lg:w-5/12 mx-auto pt-16 pb-4 mt-6 rounded-lg text-accent-500 lg:h-11/12">
				<h2 className="text-white text-2xl md:text-[2rem]">
					Welcome to TaskHive!
				</h2>
				<p className="text-accent-50 text-xs w-11/12 md:text-sm md:w-9/12 text-center">
					Start managing your tasks and projects efficiently.
				</p>
				<form
					onSubmit={handleRegister}
					className="w-10/12 md:w-1/2 flex flex-col gap-4 [&>div]:bg-white [&>*]:h-12 [&>*]:pl-3 [&>*]:rounded-4"
					autoComplete="off"
					noValidate
				>
					<div className=" flex items-center gap-2">
						<FontAwesomeIcon
							icon={faUser}
							className="text-accent-500"
						/>
						<input
							name="fullName"
							type="text"
							value={registrationDetails.fullName}
							onChange={(e) => {
								handleChange(e);
							}}
							placeholder="Full Name"
							required
							autoFocus
							className="bg-transparent w-full"
						/>
					</div>
					<div className=" flex items-center gap-2">
						<FontAwesomeIcon
							icon={faAt}
							className="text-accent-500"
						/>
						<input
							name="username"
							type="text"
							value={registrationDetails.username}
							onChange={(e) => handleChange(e)}
							placeholder="Username"
							required
							autoFocus
							className="bg-transparent w-full"
						/>
					</div>

					<div className=" flex items-center gap-2">
						<FontAwesomeIcon
							icon={faEnvelope}
							className="text-accent-500"
						/>
						<input
							name="email"
							type="email"
							value={registrationDetails.email}
							onChange={(e) => handleChange(e)}
							placeholder="Email"
							required
							autoFocus
							className="bg-transparent w-full"
						/>
					</div>
					<div className=" text-neutral1 flex items-center gap-2">
						<FontAwesomeIcon
							icon={faLock}
							className="text-accent-500"
						/>
						<input
							name="password"
							type={showPassword ? "text" : "password"}
							value={registrationDetails.password}
							onChange={(e) => handleChange(e)}
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
						className="bg-accent-500 border-2 border-transparent rounded-md hover:bg-transparent hover:border-accent-500 px-4 py-2 w-full text-xl text-white transition-all duration-300"
					>
						Create Account
					</button>
				</form>
				<p className="text-sm text-white">
					Already have an account?{" "}
					<a
						href="/login"
						className="text-accent-500 hover:text-white transition-all duration-200"
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
