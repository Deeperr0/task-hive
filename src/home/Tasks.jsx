import Task from "./TaskCard";
import "./Tasks.css";

export default function Tasks(props) {
  return (
    <div>
      <h3
        className={props.name === "Done" ? "tasks--type done" : "tasks--type"}
      >
        {props.name}
      </h3>
      <div className="tasks--container">
        <div className="tasks--table">
          <div className="task--header">
            <div>Task</div>
            <div>Owner</div>
            <div>Status</div>
            <div>Deadline</div>
            <div>Priority</div>
            <div>Notes</div>
          </div>
          <div className="tasks--list">
            {props.tasksList.map((task) => (
              <Task
                key={task.id}
                id={task.id}
                content={task.content}
                owner={task.owner}
                ownerUid={task.ownerUid} // Pass ownerUid to Task component
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
                role={props.role}
                users={props.users} // Pass users list to Task component
                currentUserUid={props.currentUserUid} // Pass currentUserUid to Task component
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
