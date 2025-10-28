function getMillis(value) {
	if (!value) return 0;

	// Firestore Timestamp
	if (value?.toDate) {
		return value.toDate().getTime();
	}

	// { seconds, nanoseconds }
	if (typeof value === "object" && "seconds" in value) {
		return value.seconds * 1000;
	}

	// ISO string fallback
	const t = new Date(value);
	return isNaN(t.getTime()) ? 0 : t.getTime();
}

export function getLatestAccessed(teamsArray) {
	if (!Array.isArray(teamsArray) || teamsArray.length === 0) return null;

	let latestTeam = teamsArray[0];
	let latestTime = getMillis(teamsArray[0].lastAccessed);

	for (let i = 1; i < teamsArray.length; i++) {
		const currentTime = getMillis(teamsArray[i].lastAccessed);
		if (currentTime > latestTime) {
			latestTime = currentTime;
			latestTeam = teamsArray[i];
		}
	}

	return latestTeam?.teamId || null;
}
