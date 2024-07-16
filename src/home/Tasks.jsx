import { useEffect } from "react";
import Task from "./TaskCard";
import "./Tasks.css";
import PropTypes from "prop-types";

export default function Tasks(props) {
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
          {props.tasksList.length != 0 && (
            <div className="tasks--list">
              {props.tasksList
                .filter((task) => task.owner === props.userData.username)
                .map((task) => (
                  <Task
                    key={task.taskId}
                    taskId={task.taskId}
                    content={task.content}
                    owner={task.owner}
                    ownerUid={task.ownerUid}
                    status={task.status}
                    deadline={task.deadline}
                    priority={task.priority}
                    notes={task.notes}
                    deleteTask={props.deleteTask}
                    updateTask={props.updateTask}
                    role={props.role}
                    users={props.users}
                    currentUserUid={props.currentUserUid}
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
  role: PropTypes.string.isRequired,
  users: PropTypes.array.isRequired,
  currentUserUid: PropTypes.string.isRequired,
  deleteTask: PropTypes.func.isRequired,
  updateTask: PropTypes.func.isRequired,
};
