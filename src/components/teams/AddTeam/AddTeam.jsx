import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Overlay from "../../ui/Overlay";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useContext, useState } from "react";
import {
	CurrentUserContext,
	UserDataContext,
	WorkSpaceContext,
} from "../../../App";
import { db } from "../../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import PropTypes from "prop-types";

export default function AddTeam({ setToggleAddTeam }) {
	// Stores the current user credentials
	const { user } = useContext(CurrentUserContext);
	// Stores the data of the logged in user
	const { userData, setUserData } = useContext(UserDataContext);
	// Stores the current work space of the logged in user
	const { currentWorkSpace, setCurrentWorkSpace } =
		useContext(WorkSpaceContext);
	// Stores the name of the team to be created by the user
	const [localTeamName, setLocalTeamName] = useState("");

	// Handles the creation of a new team
	async function handleAddTeam() {
		// Creates a new team id using uuid
		const teamId = uuidv4();
		// Opens the user document of the logged in user
		const userDocRef = doc(db, "users", user.uid);
		const userDoc = await getDoc(userDocRef);
		// If the user doc is not found then the function stops immediately
		if (!userDoc.exists()) {
			return;
		}
		// New teams object is created
		const newTeam = {
			teamName: `${localTeamName != "" ? localTeamName : "My Team"}`,
			teamId,
			teamMembers: [
				{
					username: userData.username,
					uid: user.uid,
					email: userData.email,
				},
			],
			tasks: [],
			lastUpdated: new Date().toISOString(),
			created: new Date().toISOString(),
			createdById: user.uid,
			subWorkspaces: [{}],
		};
		// Fetch the data of the current user from doc
		const currentUserData = userDoc.data();
		// Append the new team to the teams object with the teamId as the key and an object as value
		// (currently only containing the role of the user)
		const updatedTeams = {
			...currentUserData.teams,
			[teamId]: { role: "admin" },
		};
		// Update the user doc with the new teams object (including the old teams)
		await setDoc(
			userDocRef,
			{
				...currentUserData,
				teams: updatedTeams,
			},
			// Merge the new data with the existing data
			{ merge: true }
		);
		// Add the new team to the teams collection
		await setDoc(doc(db, "teams", teamId), newTeam);
		// Set the toggleAddTeam to false to close the form
		setToggleAddTeam(false);
		// Update the userData with the new teams object
		setUserData({ ...userData, teams: updatedTeams });

		setCurrentWorkSpace(newTeam); // To trigger a re-render
	}
	return (
		<Overlay>
			<div className="flex flex-col items-start gap-2">
				<button
					onClick={() => setToggleAddTeam(false)}
					className="text-customText text-left">
					<FontAwesomeIcon icon={faArrowLeft} />
				</button>
				<div className="flex gap-2 h-10 items-center">
					<input
						type="text"
						placeholder="Team Name"
						onChange={(e) => setLocalTeamName(e.target.value)}
						className="w-7/12 text-black pl-2 h-full"
					/>
					<button
						onClick={handleAddTeam}
						className="bg-accent-500 hover:bg-accent-600 transition-all duration-300 rounded-md px-4 py-2">
						Add Team
					</button>
				</div>
			</div>
		</Overlay>
	);
}

AddTeam.propTypes = {
	setToggleAddTeam: PropTypes.func,
};
