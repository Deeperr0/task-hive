import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Overlay from "../../ui/Overlay";
import {
	collection,
	doc,
	getDocs,
	updateDoc,
	query,
	where,
	addDoc,
} from "firebase/firestore";
import { db } from "../../../firebase";
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
		if (userToAdd === "") {
			errorDiv.innerText = "Please enter an email";
			return;
		}
		currentWorkSpace.teamMembers.map((member) => {
			if (member.email === userToAdd) {
				errorDiv.innerText = "User already exists";
				return;
			}
		});
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
			...updatedTeam,
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
			<div className="flex flex-col items-start gap-4 px-10 pt-8">
				<div>
					<h4 className="w-full font-semibold">Invite new member</h4>
					<p className="text-neutral-500 mt-2">
						Add a new member to your team by filling out the form below.
					</p>
				</div>
				<div className="flex flex-col gap-4 w-full">
					<div className="flex flex-col gap-4 [&>div]:flex [&>div]:flex-col [&>div]:gap-2 [&_input]:border [&_input]:border-neutral-300/40 [&_input]:outline-none [&_input]:py-2 [&_input]:px-4 [&_input]:rounded-lg [&_input]:w-full [&_label]:font-medium">
						<div>
							<label htmlFor="user-email">Email Address</label>
							<input
								type="text"
								placeholder="name@example.com"
								id="user-email"
								value={userToAdd}
								onChange={(e) => setUserToAdd(e.target.value)}
								className="pl-2 text-primary-900"
							/>
						</div>
						<div>
							<label htmlFor="user-role">Assign Role</label>
							<div className="flex gap-4">
								<button
									className={`border-2 rounded-lg py-2 px-3 transition-all duration-200 ${
										chosenRole === "admin"
											? "border-accent-500 text-accent-500 bg-accent-200"
											: "bg-white text-black border-neutral-300/40"
									}`}
									value={"admin"}
									onClick={(e) => setChosenRole(e.target.value)}>
									Admin
								</button>
								<button
									className={`border-2 rounded-lg p-2 px-3 transition-all duration-200 ${
										chosenRole === "user"
											? "border-accent-500 text-accent-500 bg-accent-200"
											: "bg-white text-black border-neutral-300/40"
									}`}
									value={"user"}
									onClick={(e) => setChosenRole(e.target.value)}>
									User
								</button>
							</div>
						</div>
						<div>
							<label htmlFor="message">Personalized Message (Optional)</label>
							<textarea
								name="message"
								id="message"
								className="resize-none w-full rounded-xl border border-neutral-300/30 outline-none p-2"
								rows="4"
								placeholder="Welcome to the team! We're excited to have you on board."
							/>
						</div>
					</div>
					<div className="w-fit ml-auto flex gap-4 my-2">
						<button
							onClick={() => setToggleAddUser(false)}
							className="bg-neutral-500/20 hover:bg-neutral-500/30 px-4 rounded-md transition-all duration-300">
							Cancel
						</button>
						<button
							onClick={() => addUser(chosenRole)}
							className="bg-accent-500 border-2 border-transparent hover:border-accent-500 hover:bg-transparent h-9 rounded-md transition-all duration-300 px-4 text-accent-50 hover:text-accent-500">
							Send Invitation
						</button>
					</div>
					<div className="" id="add-error"></div>
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
