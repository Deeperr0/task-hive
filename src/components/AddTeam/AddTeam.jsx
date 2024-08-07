import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Overlay from "../Overlay";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
// import "./AddTeam.css";
import { useContext, useState } from "react";
import {
	CurrentUserContext,
	UserDataContext,
	WorkSpaceContext,
} from "../../App";
import { db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export default function AddTeam({ setToggleAddTeam }) {
	const { user, setUser } = useContext(CurrentUserContext);
	const { userData, setUserData } = useContext(UserDataContext);
	const { currentWorkSpace, setCurrentWorkSpace } =
		useContext(WorkSpaceContext);
	const [localTeamName, setLocalTeamName] = useState("");
	console.log(localTeamName);
	async function handleAddTeam() {
		const teamId = uuidv4();
		const userDocRef = doc(db, "users", user.uid);
		const userDoc = await getDoc(userDocRef);
		if (!userDoc.exists()) {
			return;
		}
		const currentUserData = userDoc.data();
		const updatedTeams = [
			...currentUserData.teams,
			{
				teamName: `${localTeamName != "" ? localTeamName : "My Team"}`,
				teamId,
				teamMembers: [
					{
						username: currentUserData.username,
						uid: user.uid,
						email: currentUserData.email,
					},
				],
				tasks: [],
				role: "admin",
				lastUpdated: new Date().toISOString(),
				created: new Date().toISOString(),
				createdById: user.uid,
				subWorkspaces: [{}],
			},
		];
		await setDoc(userDocRef, { teams: updatedTeams }, { merge: true });
		setToggleAddTeam(false);
		setUserData({ ...userData, teams: updatedTeams });
		setCurrentWorkSpace({ ...currentWorkSpace });
	}
	return (
		<Overlay>
			<button
				onClick={() => setToggleAddTeam(false)}
				className="add-team-close"
			>
				<FontAwesomeIcon icon={faArrowLeft} />
			</button>
			<div className="add-team-content">
				<input
					type="text"
					placeholder="Team Name"
					onChange={(e) => setLocalTeamName(e.target.value)}
				/>
				<button onClick={handleAddTeam}>Add Team</button>
			</div>
		</Overlay>
	);
}
