import { useEffect, useState } from "react";

export default function useFilterTasks(priorityFilter, currentWorkSpace) {
	const [filteredTasks, setFilteredTasks] = useState([]);
	useEffect(() => {
		let filtered = currentWorkSpace?.tasks ? [...currentWorkSpace.tasks] : [];
		if (priorityFilter) {
			filtered = filtered.filter(
				(task) => task.priority.toLowerCase() === priorityFilter.toLowerCase()
			);
		}
		setFilteredTasks(filtered);
	}, [priorityFilter, currentWorkSpace]);

	return filteredTasks;
}
