import { useEffect } from "react";
import TaskCard from "../TaskCard";
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
			<div className="text-customText border-gray-900 rounded-lg pb-4 text-sm overflow-auto md:overflow-hidden whitespace-nowrap">
				<div className="">
					<div className="grid grid-cols-customGrid py-4 text-customText [&>*]:border-gray-900 overflow-auto md:overflow-hidden">
						<div className="sticky" />
						<div className="text-customText">Task</div>
						<div>Owner</div>
						<div>Status</div>
						<div>Deadline</div>
						<div>Priority</div>
						<div>Notes</div>
						<div></div>
					</div>

					{tasksList.length != 0 && (
						<div>
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
