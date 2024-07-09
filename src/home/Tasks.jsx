import { useEffect } from "react";
import Task from "./TaskCard";
import "./Tasks.css";

export default function Tasks(props) {
	useEffect(() => {
		const handleScroll = () => {
			const header = document.querySelector(".task--header");
			if (header) {
				const sticky = header.getBoundingClientRect().top <= 0;
				header.classList.toggle("is-sticky", sticky);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<div className="task-type-container">
			<h3
				className={props.name === "Done" ? "tasks--type done" : "tasks--type"}
			>
				{props.name}
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
					<div className="tasks--list">
						{props.tasksList.map((task) => (
							<Task
								key={task.id}
								id={task.id}
								content={task.content}
								owner={task.owner}
								ownerUid={task.ownerUid}
								status={task.status}
								deadline={task.deadline}
								priority={task.priority}
								notes={task.notes}
								updateStatus={props.updateStatus}
								updateDeadline={props.updateDeadline}
								updatePriority={props.updatePriority}
								updateContent={props.updateContent}
								updateOwner={props.updateOwner}
								updateNotes={props.updateNotes}
								deleteTask={props.deleteTask}
								updateLastUpdated={props.updateLastUpdated}
								updateTask={props.updateTask}
								role={props.role}
								users={props.users}
								currentUserUid={props.currentUserUid}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
