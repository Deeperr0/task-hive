import {
	doc,
	deleteDoc,
	getDoc,
	deleteField,
	updateDoc,
} from "firebase/firestore";
import { useContext } from "react";
import { CurrentUserContext, WorkSpaceContext } from "../../../App";
import { db } from "../../../firebase";
export default function DeleteTeam() {
	const { user } = useContext(CurrentUserContext);
	const { currentWorkSpace, setCurrentWorkSpace } =
		useContext(WorkSpaceContext);

	async function handleDeleteTeam(userId, teamId) {
		const userDocRef = doc(db, "users", userId);
		const userDoc = await getDoc(userDocRef);
		if (!userDoc.exists()) {
			return;
		}
		const userDocData = userDoc.data();
		const teamDocRef = doc(db, "teams", teamId);
		const teamDoc = await getDoc(teamDocRef);
		if (!teamDoc.exists()) {
			return;
		}
		const teamData = teamDoc.data();
		if (teamData.createdById == userId) {
			await deleteDoc(doc(db, "teams", teamId));
			let updatedTeams = {};
			for (const team in userDocData.teams) {
				if (team == teamId) {
					continue;
				}
				updatedTeams[team] = userDocData.teams[team];
			}
			await updateDoc(userDocRef, {
				...userDocData,
				teams: updatedTeams,
			});
		} else {
			console.log(
				"Team to be deleted was not created by user attempting to delete it."
			);
		}
	}
	return (
		<div>
			<button
				className="bg-accent-500 hover:bg-accent-600 text-customBackground py-2 px-3 rounded-lg transition-all duration-300"
				onClick={() => {
					handleDeleteTeam(user.uid, currentWorkSpace.teamId);
				}}>
				Delete Team
			</button>
		</div>
	);
}
