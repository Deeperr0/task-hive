import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export function toDate(val) {
  if (!val) return null;
  if (val instanceof Date) return val;
  if (typeof val.toDate === "function") return val.toDate(); // Firestore Timestamp
  if (typeof val === "number") return new Date(val); // epoch ms
  if (typeof val === "string") return new Date(val); // ISO
  if (typeof val.seconds === "number") {
    // {seconds, nanoseconds}
    return new Date(
      val.seconds * 1000 + Math.floor((val.nanoseconds ?? 0) / 1e6)
    );
  }
  return null;
}
export function fmtDate(
  val,
  opts = { year: "numeric", month: "short", day: "2-digit" }
) {
  const d = toDate(val);
  return d ? d.toLocaleDateString(undefined, opts) : "—";
}

export default function Tasks({ name, tasksList }) {
  const navigate = useNavigate();

  return (
    <>
      {tasksList.length > 0 ? (
        <div className="w-full rounded-2xl border border-neutral-500/30 overflow-hidden">
          <table className="w-full">
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
                  className="text-center border border-neutral-500/20 cursor-pointer"
                  onClick={() => navigate(`/tasks/${task.taskId}`)}
                  key={task.taskId}
                >
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
                    {fmtDate(task.deadline)}
                  </td>
                  <td className="py-4 flex items-center justify-center">
                    <p
                      className={`px-4 rounded-full ${
                        task.priority === "High"
                          ? "text-red-700 bg-red-200"
                          : task.priority === "Medium"
                          ? "text-yellow-700 bg-yellow-200"
                          : "text-green-700 bg-green-200"
                      }`}
                    >
                      {task.priority}
                    </p>
                  </td>
                  <td className="text-neutral-500">
                    {task.notes || "Notes..."}
                  </td>
                  <td className="text-neutral-500 cursor-pointer">
                    <FontAwesomeIcon icon={faPenToSquare} />
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
