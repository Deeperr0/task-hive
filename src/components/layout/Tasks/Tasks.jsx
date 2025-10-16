import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

export default function Tasks({ name, tasksList }) {
  return (
    <>
      {tasksList.length > 0 ? (
        <div className="w-full rounded-2xl border border-neutral-500/30 overflow-hidden">
          <table className="w-full">
            <tr className="bg-neutral-500/20 [&>th]:py-2">
              <th>Task</th>
              <th>Assignee</th>
              <th>Due Date</th>
              <th>Priority</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
            {tasksList.map((task) => (
              <tr className="text-center border border-neutral-500/20">
                <td>{task.content}</td>
                <td className="text-neutral-500">{task.owner}</td>
                <td
                  className={`text-neutral-500 ${
                    task.deadline >= Date.now()
                      ? "text-red-700"
                      : task.priority === "medium"
                      ? "text-yellow-700"
                      : "text-green-700"
                  }`}
                >
                  {task.deadline}
                </td>
                <td className="py-4 flex items-center justify-center">
                  <p
                    className={`px-4 rounded-full ${
                      task.priority === "high"
                        ? "text-red-700 bg-red-200"
                        : task.priority === "medium"
                        ? "text-yellow-700 bg-yellow-200"
                        : "text-green-700 bg-green-200"
                    }`}
                  >
                    {task.priority}
                  </p>
                </td>
                <td className="text-neutral-500">{task.notes || "Notes..."}</td>
                <td className="text-neutral-500 cursor-pointer">
                  <FontAwesomeIcon icon={faPenToSquare} />
                </td>
              </tr>
            ))}
          </table>
        </div>
      ) : (
        <>
          <p>There are no tasks here yet..</p>
        </>
      )}
    </>
  );
}

Tasks.propTypes = {
  tasksList: PropTypes.arrayOf(PropTypes.object).isRequired,
  name: PropTypes.string.isRequired,
};
