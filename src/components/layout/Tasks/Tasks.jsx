import TaskCard from "../../ui/TaskCard";
import PropTypes from "prop-types";

export default function Tasks({ name, tasksList }) {
  return (
    <div className="bg-secondary-500/30 rounded-2xl overflow-hidden flex flex-col items-center lg:w-1/4">
      <h3
        className={
          name === "Done"
            ? "text-success text-lg my-2 ml-2"
            : name === "Stuck"
            ? "text-danger text-lg my-2 ml-2"
            : name === "In progress"
            ? "text-warning text-lg my-2 ml-2"
            : "text-info text-lg my-2 ml-2"
        }
      >
        {name}
      </h3>
      <div className=" border-gray-900 rounded-lg pb-4 text-sm w-full">
        <div className="">
          <div>
            {tasksList?.length != 0 ? (
              <div className="w-full">
                {tasksList?.map((task) => (
                  <TaskCard key={task.taskId} taskObj={task} />
                ))}
              </div>
            ) : (
              <div className="flex justify-center items-center w-full h-full">
                No tasks here yet :3
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
};
