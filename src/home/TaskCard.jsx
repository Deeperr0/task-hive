import React, { useState, useEffect, useCallback } from "react";
import "./TaskCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faSave, faCheck } from "@fortawesome/free-solid-svg-icons";

// Debounce function to delay execution
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

export default function TaskCard(props) {
  const [localContent, setLocalContent] = useState(props.content);
  const [localDeadline, setLocalDeadline] = useState(props.deadline);
  const [localPriority, setLocalPriority] = useState(props.priority);
  const [localOwner, setLocalOwner] = useState(props.owner);
  const [localNotes, setLocalNotes] = useState(props.notes);

  useEffect(() => {
    setLocalContent(props.content);
    setLocalDeadline(props.deadline);
    setLocalPriority(props.priority);
    setLocalOwner(props.owner);
    setLocalNotes(props.notes);
  }, [props.content, props.deadline, props.priority, props.owner, props.notes]);

  const debouncedUpdateStatus = useCallback(
    debounce((taskId, newStatus) => {
      props.updateStatus(taskId, newStatus);
    }, 1000),
    []
  );

  function changeSelection(event) {
    let taskId = props.id;
    let newStatus = event.target.value;
    debouncedUpdateStatus(taskId, newStatus);
  }

  function handleDelete() {
    props.deleteTask(props.id);
  }

  function handleContentChange(event) {
    setLocalContent(event.target.value);
  }

  function handleDeadlineChange(event) {
    setLocalDeadline(event.target.value);
  }

  function handlePriorityChange(event) {
    setLocalPriority(event.target.value);
  }

  function handleOwnerChange(event) {
    setLocalOwner(event.target.value);
  }

  function handleNotesChange(event) {
    setLocalNotes(event.target.value);
  }

  function handleUpdate() {
    props.updateContent(props.id, localContent);
    props.updateDeadline(props.id, localDeadline);
    props.updatePriority(props.id, localPriority);
    props.updateOwner(props.id, localOwner);
    props.updateNotes(props.id, localNotes);
  }

  // Determine priority class
  const priorityClass =
    localPriority === "Low"
      ? "task--priority-low"
      : localPriority === "Medium"
      ? "task--priority-medium"
      : localPriority === "High"
      ? "task--priority-high"
      : localPriority === "Critical"
      ? "task--priority-critical"
      : "";

  // Determine status class
  const statusClass =
    props.status === "Done"
      ? "task--status-done"
      : props.status === "Working on it"
      ? "task--status-working"
      : props.status === "Stuck"
      ? "task--status-stuck"
      : props.status === "Not started"
      ? "task--status-not-started"
      : "";

  return (
    <div className={`task--card `}>
      {props.role === "admin" ? (
        <input
          type="text"
          value={localContent}
          onChange={handleContentChange}
          placeholder="Task Content"
        />
      ) : (
        <p className="task--text">{localContent}</p>
      )}
      <p className="task--owner">
        {props.role === "admin" ? (
          <select value={localOwner} onChange={handleOwnerChange}>
            {props.users.map((user) => (
              <option key={user.uid} value={user.email}>
                {user.email.split("@")[0]}
              </option>
            ))}
          </select>
        ) : (
          localOwner
        )}
      </p>
      <select
        onChange={changeSelection}
        value={props.status}
        disabled={
          props.role !== "admin" && props.ownerUid !== props.currentUserUid
        }
        className={`select-status ${statusClass}`}
      >
        <option value="Done" className="option-status-done">
          Done
        </option>
        <option value="Working on it" className="option-status-working">
          Working on it
        </option>
        <option value="Stuck" className="option-status-stuck">
          Stuck
        </option>
        <option value="Not started" className="option-status-not-started">
          Not started
        </option>
      </select>
      {props.role === "admin" ? (
        <input
          type="date"
          value={localDeadline}
          onChange={handleDeadlineChange}
        />
      ) : (
        <p>{localDeadline}</p>
      )}
      {props.role === "admin" ? (
        <select
          value={localPriority}
          onChange={handlePriorityChange}
          className={`select-priority ${priorityClass}`}
        >
          <option value="Low" className="option-priority-low">
            Low
          </option>
          <option value="Medium" className="option-priority-medium">
            Medium
          </option>
          <option value="High" className="option-priority-high">
            High
          </option>
          <option value="Critical" className="option-priority-critical">
            Critical
          </option>
        </select>
      ) : (
        <p>{localPriority}</p>
      )}
      <textarea
        value={localNotes}
        onChange={handleNotesChange}
        placeholder="Notes"
        disabled={
          props.role !== "admin" && props.ownerUid !== props.currentUserUid
        }
      />

      <div className="buttons">
        <button onClick={handleUpdate} className="task--update">
          <FontAwesomeIcon icon={faCheck} />
        </button>
        {props.role === "admin" && (
          <button onClick={handleDelete} className="task--delete">
            <FontAwesomeIcon icon={faTrash} />
          </button>
        )}
      </div>
    </div>
  );
}
