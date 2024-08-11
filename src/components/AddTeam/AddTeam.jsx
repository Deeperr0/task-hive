import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Overlay from "../Overlay";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useContext, useState } from "react";
import {
	CurrentUserContext,
	UserDataContext,
	WorkSpaceContext,
} from "../../App";
import { db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import PropTypes from "prop-types";

export default function AddTeam({ setToggleAddTeam }) {
	const { user } = useContext(CurrentUserContext);
	const { userData, setUserData } = useContext(UserDataContext);
	const { currentWorkSpace, setCurrentWorkSpace } =
		useContext(WorkSpaceContext);
	const [localTeamName, setLocalTeamName] = useState("");
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

		setCurrentWorkSpace({ ...currentWorkSpace }); // To trigger an update in the page
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
						className="w-7/12 text-customText pl-2 h-full"
					/>
					<button
						onClick={handleAddTeam}
						className="bg-accent hover:bg-accentShade1 transition-all duration-300 rounded-md px-4 py-2">
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
