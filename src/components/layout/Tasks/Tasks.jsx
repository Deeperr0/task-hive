import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { deleteTask } from "../../../utils/manageTasks";
import { useContext } from "react";
import { WorkSpaceContext } from "../../../App";
import { fmtDate } from "../../../utils/manageDates";

export default function Tasks({ name, tasksList }) {
  const navigate = useNavigate();
  const { currentWorkSpace, setCurrentWorkSpace } =
    useContext(WorkSpaceContext);

  return (
    <>
      {tasksList.length > 0 ? (
        <div className="w-full rounded-2xl border border-neutral-300/30 overflow-hidden">
          <table className="w-full table-fixed">
            <colgroup>
              <col className="w-[20%]" /> {/* Task */}
              <col className="w-[14%]" /> {/* Assignee */}
              <col className="w-[14%]" /> {/* Due Date */}
              <col className="w-[12%]" /> {/* Priority */}
              <col className="w-[36%]" /> {/* Notes */}
              <col className="w-[4.5rem]" /> {/* Actions fixed width */}
            </colgroup>
            <thead>
              <tr className="bg-neutral-500/20 [&>th]:py-2">
                <th>Task</th>
                <th>Assignee</th>
                <th>Due Date</th>
                <th>Priority</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasksList.map((task) => (
                <tr
                  className="text-center border border-neutral-500/20"
                  key={task.taskId}
                >
                  <td
                    className="cursor-pointer truncate px-4"
                    onClick={() => navigate(`/tasks/${task.taskId}`)}
                  >
                    {task.content}
                  </td>
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
                    {fmtDate(task.deadline)}
                  </td>
                  <td className="py-4 flex items-center justify-center">
                    <p
                      className={`px-4 rounded-full ${
                        task.priority === "Urgent"
                          ? "text-red-700 bg-red-200"
                          : task.priority === "High"
                          ? "text-orange-700 bg-orange-200"
                          : task.priority === "Medium"
                          ? "text-yellow-700 bg-yellow-200"
                          : "text-green-700 bg-green-200"
                      }`}
                    >
                      {task.priority}
                    </p>
                  </td>
                  <td className="text-neutral-500 truncate px-4">
                    {task.notes || "Notes..."}
                  </td>
                  <td className="text-neutral-500 [&>*]:cursor-pointer flex gap-4 w-full justify-center items-center">
                    <FontAwesomeIcon
                      onClick={() => {
                        navigate(`/tasks/edit-task/${task.taskId}`);
                      }}
                      icon={faPenToSquare}
                    />
                    <FontAwesomeIcon
                      onClick={() =>
                        deleteTask(
                          task.taskId,
                          currentWorkSpace,
                          setCurrentWorkSpace
                        )
                      }
                      icon={faTrashCan}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
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
