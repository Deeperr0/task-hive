import { useState, useEffect, useCallback } from "react";
import "./TaskCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faSave } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import {
	RoleContext,
	UserDataContext,
	UsersListContext,
	WorkSpaceContext,
} from "../App";

// Debounce function to delay execution
function debounce(func, wait) {
	let timeout;
	return function (...args) {
		clearTimeout(timeout);
		timeout = setTimeout(() => func.apply(this, args), wait);
	};
}

function convertToUserTimezone(dateStr) {
	const date = new Date(dateStr);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

function formatDateToDisplay(dateStr) {
	const date = new Date(dateStr);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${day}-${month}-${year}`;
}

export default function TaskCard({
	ownerUid,
	taskId,
	content,
	owner,
	status,
	deadline,
	priority,
	notes,
	deleteTask,
	updateTask,
}) {
	const [localContent, setLocalContent] = useState(content);
	const [localDeadline, setLocalDeadline] = useState(
		convertToUserTimezone(deadline)
	);
	const [localPriority, setLocalPriority] = useState(priority);
	const [localOwner, setLocalOwner] = useState(owner);
	const [localNotes, setLocalNotes] = useState(notes);
	const [isChanged, setIsChanged] = useState(false);
	const [confirm, setConfirm] = useState(false);
	const { role, setRole } = useContext(RoleContext);

	// const { usersList, setUsersList } = useContext(UsersListContext);
	const { userData, setUserData } = useContext(UserDataContext);
	const { currentWorkSpace, setCurrentWorkSpace } =
		useContext(WorkSpaceContext);

	useEffect(() => {
		setLocalContent(content);
		setLocalDeadline(convertToUserTimezone(deadline));
		setLocalPriority(priority);
		setLocalOwner(owner);
		setLocalNotes(notes);
	}, [content, deadline, priority, owner, notes, role]);

	const debouncedUpdateStatus = useCallback(
		debounce((taskId, newStatus) => {
			updateTask(taskId, {
				lastUpdated: new Date().toISOString(),
				owner: localOwner,
				ownerUid: ownerUid,
				notes: localNotes,
				priority: localPriority,
				deadline: localDeadline,
				content: localContent,
				status: newStatus,
				taskId: taskId,
			});
		}, 1000),
		[]
	);

	function changeSelection(event) {
		let taskId = taskId;
		let newStatus = event.target.value;
		debouncedUpdateStatus(taskId, newStatus);
	}

	function handleDelete() {
		deleteTask(taskId);
	}

	function handleContentChange(event) {
		setLocalContent(event.target.value);
		setIsChanged(true);
	}

	function handleDeadlineChange(event) {
		setLocalDeadline(event.target.value);
		setIsChanged(true);
	}

	function handlePriorityChange(event) {
		setLocalPriority(event.target.value);
		setIsChanged(true);
	}

	function handleOwnerChange(event) {
		setLocalOwner(event.target.value);
		setIsChanged(true);
	}

	function handleNotesChange(event) {
		setLocalNotes(event.target.value);
		setIsChanged(true);
	}

	function handleUpdate() {
		const now = new Date().toISOString();
		const updates = {
			content: localContent,
			deadline: localDeadline,
			priority: localPriority,
			owner: localOwner,
			notes: localNotes,
			lastUpdated: now,
		};
		updateTask(taskId, updates);
		setIsChanged(false);
	}

	function checkDeadline() {
		let today = new Date().toISOString().split("T")[0];
		if (today > localDeadline) {
			return 1;
		} else if (today === localDeadline) {
			return 0;
		} else {
			return -1;
		}
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

	const statusClass =
		status === "Done"
			? "task--status-done"
			: status === "Working on it"
			? "task--status-working"
			: status === "Stuck"
			? "task--status-stuck"
			: status === "Not started"
			? "task--status-not-started"
			: "";

	return (
		<div className="task--card task--row">
			<div className={confirm ? "overlay" : "overlay hidden"}>
				<div className="confirm-delete-container">
					<p>Are you sure you want to delete this task?</p>
					<button
						onClick={handleDelete}
						className="delete-button"
					>
						Delete
					</button>
					<button
						onClick={() => setConfirm(false)}
						className="cancel-button"
					>
						Cancel
					</button>
				</div>
			</div>
			{role === "admin" ? (
				<input
					type="text"
					value={localContent}
					onChange={handleContentChange}
					placeholder="Task Content"
					className="sticky task-column"
				/>
			) : (
				<p className="task--text sticky task-column">{localContent}</p>
			)}
			<p className="task--owner owner-column">
				{role === "admin" ? (
					<select
						value={localOwner}
						onChange={handleOwnerChange}
					>
						{props.users.map((user) => (
							<option
								key={user.uid}
								value={user.email}
							>
								{user.email.split("@")[0]}
							</option>
						))}
					</select>
				) : (
					localOwner.split("@")[0]
				)}
			</p>
			<select
				onChange={changeSelection}
				value={status}
				className={`select-status ${statusClass} status-column`}
			>
				<option
					value="Done"
					className="option-status-done"
				>
					Done
				</option>
				<option
					value="Working on it"
					className="option-status-working"
				>
					Working on it
				</option>
				<option
					value="Stuck"
					className="option-status-stuck"
				>
					Stuck
				</option>
				<option
					value="Not started"
					className="option-status-not-started"
				>
					Not started
				</option>
			</select>
			{role === "admin" ? (
				<input
					type="date"
					value={localDeadline}
					onChange={handleDeadlineChange}
					className={
						status == "Done"
							? "deadline-column"
							: checkDeadline() === 1
							? "deadline-column overdue"
							: checkDeadline() === 0
							? "deadline-column today"
							: "deadline-column"
					}
				/>
			) : (
				<p
					className={
						checkDeadline() === 1
							? "deadline-column overdue"
							: checkDeadline() === 0
							? "deadline-column today"
							: "deadline-column"
					}
				>
					{formatDateToDisplay(localDeadline)}
				</p>
			)}
			{role === "admin" ? (
				<select
					value={localPriority}
					onChange={handlePriorityChange}
					className={`select-priority ${priorityClass} priority-column`}
				>
					<option
						value="Low"
						className="option-priority-low"
					>
						Low
					</option>
					<option
						value="Medium"
						className="option-priority-medium"
					>
						Medium
					</option>
					<option
						value="High"
						className="option-priority-high"
					>
						High
					</option>
					<option
						value="Critical"
						className="option-priority-critical"
					>
						Critical
					</option>
				</select>
			) : (
				<p className={`select-priority ${priorityClass} priority-column`}>
					{localPriority}
				</p>
			)}
			<textarea
				value={localNotes}
				onChange={handleNotesChange}
				placeholder="Notes"
				disabled={
					props.role !== "admin" && props.ownerUid !== props.currentUserUid
				}
				className="notes-column"
			/>
			<div className="buttons buttons-column">
				<button
					onClick={handleUpdate}
					className="task--update"
					disabled={!isChanged}
				>
					<FontAwesomeIcon icon={faSave} />
				</button>
				{role === "admin" && (
					<button
						onClick={() => setConfirm(true)}
						className="task--delete"
					>
						<FontAwesomeIcon icon={faTrash} />
					</button>
				)}
			</div>
		</div>
	);
}

TaskCard.propTypes = {
	content: PropTypes.string.isRequired,
	deadline: PropTypes.string.isRequired,
	priority: PropTypes.string.isRequired,
	owner: PropTypes.string.isRequired,
	notes: PropTypes.string.isRequired,
	status: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	role: PropTypes.string.isRequired,
	ownerUid: PropTypes.string.isRequired,
	users: PropTypes.array.isRequired,
	currentUserUid: PropTypes.string.isRequired,
	deleteTask: PropTypes.func.isRequired,
	updateContent: PropTypes.func.isRequired,
	updateDeadline: PropTypes.func.isRequired,
	updatePriority: PropTypes.func.isRequired,
	updateOwner: PropTypes.func.isRequired,
	updateNotes: PropTypes.func.isRequired,
	updateLastUpdated: PropTypes.func.isRequired,
	updateStatus: PropTypes.func.isRequired,
};
