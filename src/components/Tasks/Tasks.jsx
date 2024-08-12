import TaskCard from "../TaskCard";
import PropTypes from "prop-types";

export default function Tasks({ name, tasksList, deleteTask, updateTask }) {
	return (
		<div className="bg-secondaryShade1 rounded-4 overflow-hidden w-screen">
			<h3
				className={
					name === "Done"
						? "text-success text-lg my-2 ml-2"
						: "text-info text-lg my-2 ml-2"
				}>
				{name}
			</h3>
			<div className="text-customText border-gray-900 rounded-lg pb-4 text-sm whitespace-nowrap overflow-scroll md:overflow-hidden w-screen">
				<div className="">
					<div className="grid grid-cols-customGrid py-4 text-customText [&>*]:border-gray-900 w-[66rem]">
						<div className="sticky left-0" />
						<div className="text-customText sticky left-0 bg-secondaryShade1">
							Task
						</div>
						<div>Owner</div>
						<div>Status</div>
						<div>Deadline</div>
						<div>Priority</div>
						<div>Notes</div>
						<div></div>
					</div>
					<div>
						{tasksList.length != 0 && (
							<div className="w-[66rem]">
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
		</div>
	);
}

Tasks.propTypes = {
	tasksList: PropTypes.arrayOf(PropTypes.object).isRequired,
	name: PropTypes.string.isRequired,
	deleteTask: PropTypes.func.isRequired,
	updateTask: PropTypes.func.isRequired,
};
