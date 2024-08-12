import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Overlay from "../Overlay";
import { collection, doc, getDocs, updateDoc, query, where, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useState } from "react";
import PropTypes from "prop-types";
import emailjs from "emailjs-com";
emailjs.init(import.meta.env.VITE_EMAIL_JS_USER_ID);

function sendEmail(email, invitationCode) {
	const templateParams = {
		to_email: email, // The recipient's email address
		invitation_code: invitationCode,
	};

	emailjs.send("task-hive-private", "invitation_email", templateParams).then(
		(response) => {
			console.log("SUCCESS!", response.status, response.text);
		},
		(error) => {
			console.log("FAILED...", error);
		}
	);
}
export default function AddUser({ setToggleAddUser, user, currentWorkSpace }) {
	const [chosenRole, setChosenRole] = useState("admin");
	const [userToAdd, setUserToAdd] = useState("");
	async function addUser(chosenRole) {
		const errorDiv = document.getElementById("add-error");
		if (
			currentWorkSpace.teamMembers.filter((member) => {
				member.email === userToAdd;
			})
		) {
			errorDiv.innerText = "User already exists";
			return;
		}
		const teamDocRef = doc(db, "teams", currentWorkSpace.teamId);
		const q = query(collection(db, "users"), where("email", "==", userToAdd));
		const querySnapshot = await getDocs(q);
		if (querySnapshot.empty) {
			const collectionRef = collection(db, "invitationCodes");
			const invitationCode = {
				used: false,
				teamId: currentWorkSpace.teamId,
				chosenRole,
				invitedBy: user.uid,
			};
			const docRef = await addDoc(collectionRef, invitationCode);
			sendEmail(userToAdd, docRef.id);
			setToggleAddUser(false);
			return;
		}
		const userToBeAdded = querySnapshot.docs[0];
		let updatedTeam = currentWorkSpace;
		updatedTeam.teamMembers.push({
			username: userToBeAdded.data().username,
			uid: userToBeAdded.id,
			email: userToBeAdded.data().email,
		});
		await updateDoc(teamDocRef, {
			updatedTeam,
		});
		const userToBeAddedRef = doc(db, "users", userToBeAdded.id);
		await updateDoc(userToBeAddedRef, {
			teams: {
				...userToBeAdded.data().teams,
				[currentWorkSpace.teamId]: { role: chosenRole },
			},
		});
	}

	return (
		<Overlay>
			<div className="flex flex-col items-start gap-4">
				<div>
					<FontAwesomeIcon
						icon={faArrowLeft}
						onClick={() => setToggleAddUser(false)}
						className="cursor-pointer"
					/>
				</div>

				<h2 className="text-center w-full">Add User</h2>
				<div className="flex flex-col gap-4">
					<div className="flex gap-4 h-10">
						<input
							type="text"
							placeholder="Enter user email"
							value={userToAdd}
							onChange={(e) => setUserToAdd(e.target.value)}
							className="pl-2"
						/>
						<select onChange={(e) => setChosenRole(e.target.value)}>
							<option value="admin">Admin</option>
							<option value="user">User</option>
						</select>
					</div>
					<button
						onClick={() => addUser(chosenRole)}
						className="bg-accent hover:bg-accentShade1 w-1/2 mx-auto h-9 rounded-md">
						Add
					</button>
					<div className="text-customText" id="add-error"></div>
				</div>
			</div>
		</Overlay>
	);
}

AddUser.propTypes = {
	setToggleAddUser: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired,
	currentWorkSpace: PropTypes.object.isRequired,
};
