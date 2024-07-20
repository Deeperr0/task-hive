import { useEffect, useState } from "react";

export default function useFilterTasks(
	priorityFilter,
	statusFilter,
	currentWorkSpace
) {
	const [filteredTasks, setFilteredTasks] = useState([]);
	useEffect(() => {
		let filtered = currentWorkSpace.tasks;
		if (priorityFilter) {
			filtered = filtered.filter(
				(task) => task.priority.toLowerCase() === priorityFilter.toLowerCase()
			);
		}
		if (statusFilter) {
			filtered = filtered.filter(
				(task) => task.status.toLowerCase() === statusFilter.toLowerCase()
			);
		}
		setFilteredTasks(filtered);
	}, [priorityFilter, statusFilter, currentWorkSpace]);

	return filteredTasks;
}
