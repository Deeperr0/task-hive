import { useEffect } from "react";
import TaskCard from "../../TaskCard";
import "./Tasks.css";
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
		<div className="task-type-container">
			<h3 className={name === "Done" ? "tasks--type done" : "tasks--type"}>
				{name}
			</h3>
			<div className="tasks--container">
				<div className="tasks--table">
					<div className="task--header">
						<div className="task-column">Task</div>
						<div className="owner-column">Owner</div>
						<div className="status-column">Status</div>
						<div className="deadline-column">Deadline</div>
						<div className="priority-column">Priority</div>
						<div className="notes-column">Notes</div>
						<div className="buttons-column"></div>
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
