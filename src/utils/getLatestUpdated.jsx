export function getLatestUpdated(idsArray) {
	if (idsArray.length === 0) {
		return null;
	}
	console.log(idsArray);
	let latestUpdated = new Date(idsArray[0].lastUpdated);
	let lastUpdatedIndex = 0;
	for (let i = 1; i < idsArray.length; i++) {
		const updated = new Date(idsArray[i].lastUpdated);
		if (updated > latestUpdated) {
			latestUpdated = updated;
			lastUpdatedIndex = i;
		}
	}
	return idsArray[lastUpdatedIndex].teamId;
}
