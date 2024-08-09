import { useEffect } from "react";
import TaskCard from "../TaskCard";
// import "./Tasks.css";
import PropTypes from "prop-types";

export default function Tasks({ name, tasksList, deleteTask, updateTask }) {
	useEffect(() => {
		function handleScroll() {
			const header = document.querySelector(".task--header");
			if (header) {
				const sticky = header.getBoundingClientRect().top <= 0;
				header.classList.toggle("is-sticky", sticky);
			}
		}

		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);
	return (
		<div className="bg-secondaryShade1 rounded-4">
			<h3
				className={
					name === "Done"
						? "text-success text-lg my-2 ml-2"
						: "text-info text-lg my-2 ml-2"
				}>
				{name}
			</h3>
			<div className=" text-customText border-gray-900 rounded-lg pb-4 text-sm">
				<div className="">
					<div className="grid grid-cols-customGrid py-4">
						<div className="strip sticky  text-customText border-gray-900" />
						<div className="task-column-sticky  text-customText border-gray-900">
							Task
						</div>
						<div className="owner-column  text-customText border-gray-900">
							Owner
						</div>
						<div className="status-column  text-customText border-gray-900">
							Status
						</div>
						<div className="deadline-column  text-customText border-gray-900">
							Deadline
						</div>
						<div className="priority-column  text-customText border-gray-900">
							Priority
						</div>
						<div className="notes-column  text-customText border-gray-900">
							Notes
						</div>
						<div className="buttons-column  text-customText border-gray-900 "></div>
					</div>

					{tasksList.length != 0 && (
						<div className="tasks--list">
							{tasksList.map((task) => (
								<TaskCard
									key={task.taskId}
									taskObj={task}
									deleteTask={deleteTask}
									updateTask={updateTask}
								/>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

Tasks.propTypes = {
	tasksList: PropTypes.arrayOf(PropTypes.object).isRequired,
	name: PropTypes.string.isRequired,
	deleteTask: PropTypes.func.isRequired,
	updateTask: PropTypes.func.isRequired,
};
