import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Overlay from "../Overlay";
import {
	arrayUnion,
	collection,
	doc,
	getDoc,
	getDocs,
	updateDoc,
	query,
	where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useState } from "react";
import PropTypes from "prop-types";
import "./AddUser.css";

export default function AddUser({ setToggleAddUser, user, currentWorkSpace }) {
	const [chosenRole, setChosenRole] = useState("");
	const [userToAdd, setUserToAdd] = useState("");
	async function addUser(chosenRole) {
		const userOneRef = doc(db, "users", user.uid);
		const userOne = await getDoc(userOneRef);
		const userOneData = userOne.data();
		const currentWorkSpaceObj = userOneData.teams.find(
			(team) => team.teamId === currentWorkSpace
		);
		const q = query(collection(db, "users"), where("email", "==", userToAdd));
		const querySnapshot = await getDocs(q);
		const user2 = querySnapshot.docs[0];
		if (
			currentWorkSpace.teamMembers.filter(
				(member) => member.email === user2.data().email
			).length > 0
		) {
			return;
		}
		currentWorkSpaceObj.teamMembers.push({
			username: user2.data().username,
			uid: user2.id,
			email: user2.data().email,
		});
		currentWorkSpaceObj.role = chosenRole;
		console.log(currentWorkSpaceObj);
		const updatedTeamMembers = currentWorkSpaceObj.teamMembers;
		// Update current team object with new members
		const updatedTeams = userOneData.teams.map((team) => {
			if (team.teamId === currentWorkSpace.teamId) {
				return { ...team, teamMembers: updatedTeamMembers };
			}
			return team;
		});
		await updateDoc(userOneRef, { teams: updatedTeams });
		const user2Ref = doc(db, "users", user2.id);
		await updateDoc(user2Ref, { teams: arrayUnion(currentWorkSpaceObj) });
	}

	return (
		<Overlay>
			<div className="add-user-close">
				<FontAwesomeIcon
					icon={faArrowLeft}
					onClick={() => setToggleAddUser(false)}
				/>
			</div>

			<h2 className="add-user-title">Add User</h2>
			<div className="add-user-inputs">
				<input
					type="text"
					placeholder="Enter user email"
					value={userToAdd}
					onChange={(e) => setUserToAdd(e.target.value)}
				/>
				<select onChange={(e) => setChosenRole(e.target.value)}>
					<option value="admin">Admin</option>
					<option value="user">User</option>
				</select>
				<button onClick={() => addUser(chosenRole)}>Add</button>
			</div>
		</Overlay>
	);
}

AddUser.propTypes = {
	setToggleAddUser: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired,
	currentWorkSpace: PropTypes.object.isRequired,
};
