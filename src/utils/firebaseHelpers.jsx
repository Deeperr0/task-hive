import { db } from "../firebase";
import {
	doc,
	getDoc,
	setDoc,
	collection,
	getDocs,
	updateDoc,
	query,
	where,
	addDoc,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export async function addTeamFirestore(user, userData, teamName) {
	const teamId = uuidv4();
	const userDocRef = doc(db, "users", user.uid);
	const userDoc = await getDoc(userDocRef);

	if (!userDoc.exists()) {
		return null;
	}

	const newTeam = {
		teamName: localTeamName.trim() || "My Team",
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

	const currentUserData = userDoc.data();
	const updatedTeams = {
		...currentUserData.teams,
		[teamId]: { role: "admin" },
	};
	await setDoc(
		userDocRef,
		{
			...currentUserData,
			teams: updatedTeams,
		},
		{ merge: true }
	);
	await setDoc(doc(db, "teams", teamId), newTeam);
	return updatedTeams;
}
export async function addUserFirebase(
	user,
	currentWorkSpace,
	userToAdd,
	sendEmail,
	setToggleAddUser,
	chosenRole
) {
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
	await updateDoc(teamDocRef, {
		teamMembers: arrayUnion({
			username: userToBeAdded.data().username,
			uid: userToBeAdded.id,
			email: userToBeAdded.data().email,
		}),
	});

	const userToBeAddedRef = doc(db, "users", userToBeAdded.id);
	await updateDoc(userToBeAddedRef, {
		teams: {
			...userToBeAdded.data().teams,
			[currentWorkSpace.teamId]: { role: chosenRole },
		},
	});
}
export async function getTeamFirebase(teamId) {
	const teamDocRef = doc(db, "teams", teamId);
	const teamDoc = await getDoc(teamDocRef);
	return teamDoc?.data();
}

export async function fetchTeamsFirebase(teams) {
	const teamEntries = await Promise.all(
		Object.keys(teams).map(async (teamId) => {
			const teamData = await getTeamFirebase(teamId);
			return [teamId, teamData];
		})
	);
	return Object.fromEntries(teamEntries);
}
