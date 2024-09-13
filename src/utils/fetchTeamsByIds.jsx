import { query, where, getDocs, collection } from "firebase/firestore";
import { db } from "../firebase";

async function fetchTeamsByIds(teamIds) {
	// If no team IDs, return an empty array
	if (!teamIds || teamIds.length === 0) return [];

	// Firestore 'in' query can only handle up to 10 values at once
	const teamData = [];
	const batchSize = 10;

	// Batch the queries in groups of 10 if the array is larger
	for (let i = 0; i < teamIds.length; i += batchSize) {
		const batch = teamIds.slice(i, i + batchSize);
		const q = query(
			collection(db, "teams"),
			where("__name__", "in", batch) // Firestore uses '__name__' for document ID
		);
		const querySnapshot = await getDocs(q);

		querySnapshot.forEach((doc) => {
			teamData.push({ id: doc.id, ...doc.data() });
		});
	}

	return teamData;
}

export default fetchTeamsByIds;
