import { useState, useEffect, useCallback, useContext, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faSave } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import { WorkSpaceContext } from "../../App";
import Overlay from "../Overlay";

function debounce(func, wait) {
	let timeout;
	return function (...args) {
		clearTimeout(timeout);
		timeout = setTimeout(() => func.apply(this, args), wait);
	};
}

function formatDateToDisplay(dateStr) {
	const date = new Date(dateStr);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${day}-${month}-${year}`;
}

export default function TaskCard({ taskObj, deleteTask, updateTask }) {
	const [localContent, setLocalContent] = useState(taskObj.content);
	const [localDeadline, setLocalDeadline] = useState(taskObj.deadline);
	const [localPriority, setLocalPriority] = useState(taskObj.priority);
	const [localOwner, setLocalOwner] = useState(taskObj.owner);
	const [localNotes, setLocalNotes] = useState(taskObj.notes);
	const [isChanged, setIsChanged] = useState(false);
	const [confirmDeletion, setConfirmDeletion] = useState(false);
	const [localStatus, setLocalStatus] = useState(taskObj.status);
	const { currentWorkSpace } = useContext(WorkSpaceContext);

	useEffect(() => {
		setLocalContent(taskObj.content);
		setLocalDeadline(taskObj.deadline);
		setLocalPriority(taskObj.priority);
		setLocalOwner(taskObj.owner);
		setLocalNotes(taskObj.notes);
	}, [
		taskObj.content,
		taskObj.deadline,
		taskObj.priority,
		taskObj.owner,
		taskObj.notes,
	]);

	const stickyRef = useRef(null);
	const parentRef = useRef(null);
	const [isPinned, setIsPinned] = useState(false);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				// Check if the element is horizontally pinned
				setIsPinned(entry.intersectionRatio < 1);
			},
			{
				root: null, // Use the viewport as the container
				rootMargin: "0px", // No margin around the root
				threshold: [1], // Fully visible
			}
		);

		const currentElement = stickyRef.current;
		if (currentElement) {
			observer.observe(currentElement);
		}

		return () => {
			if (currentElement) {
				observer.unobserve(currentElement);
			}
		};
	}, []);

	const debouncedUpdateStatus = useCallback(
		debounce((taskId, newStatus) => {
			updateTask(taskId, {
				lastUpdated: new Date().toISOString(),
				owner: localOwner,
				ownerUid: taskObj.ownerUid,
				notes: localNotes,
				priority: localPriority,
				deadline: localDeadline,
				content: localContent,
				status: newStatus,
				taskId: taskId,
			});
			setLocalStatus(newStatus);
		}, 1000),
		[]
	);

	function changeSelection(event) {
		let newStatus = event.target.value;
		debouncedUpdateStatus(taskObj.taskId, newStatus);
	}

	function handleDelete() {
		deleteTask(taskObj.taskId);
		setConfirmDeletion(false);
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
		updateTask(taskObj.taskId, updates);
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

	const priorityClass =
		localPriority === "Low"
			? "bg-info"
			: localPriority === "Medium"
			? "bg-subtleWarning"
			: localPriority === "High"
			? "bg-warning"
			: localPriority === "Critical"
			? "bg-danger text-customBackground"
			: "";

	const statusClass =
		localStatus === "Done"
			? "bg-success"
			: localStatus === "Working on it"
			? "bg-subtleWarning"
			: localStatus === "Stuck"
			? "bg-danger text-customBackground"
			: localStatus === "Not started"
			? "bg-info"
			: "";

	return (
		<div
			className="grid grid-cols-customGrid items-center h-max text-sm"
			ref={parentRef}>
			{confirmDeletion && (
				<Overlay>
					<p className="text-customText">
						Are you sure you want to delete this task?
					</p>
					<button
						onClick={handleDelete}
						className="bg-danger text-customBackground rounded-lg p-2">
						Delete
					</button>
					<button onClick={() => setConfirmDeletion(false)} className="">
						Cancel
					</button>
				</Overlay>
			)}
			<div className="sticky text-customText border-gray-900 " />

			{currentWorkSpace.role === "admin" ? (
				<input
					type="text"
					value={localContent}
					onChange={handleContentChange}
					placeholder="Task Content"
					className={
						isPinned
							? "text-customText border-gray-900 border-1 h-full pl-2"
							: "text-customText border-gray-900 border-1 h-full pl-2"
					}
					ref={stickyRef}
				/>
			) : (
				<p
					className={
						isPinned
							? "border-gray-900 border-1 h-full"
							: "border-gray-900 border-1 h-full"
					}
					ref={stickyRef}>
					{localContent}
				</p>
			)}

			{currentWorkSpace.role === "admin" ? (
				<select
					value={localOwner}
					onChange={handleOwnerChange}
					className="w-full border-gray-900 border-1 h-full">
					{currentWorkSpace.teamMembers.map((user) => (
						<option key={user.uid} value={user.username}>
							{user.username}
						</option>
					))}
				</select>
			) : (
				<p className="border-gray-900 border-1 h-full">{localOwner}</p>
			)}

			<select
				onChange={(e) => changeSelection(e)}
				value={localStatus}
				className={`${statusClass} border-gray-900 border-1 h-full`}>
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
			{currentWorkSpace.role === "admin" ? (
				<input
					type="date"
					value={localDeadline}
					onChange={handleDeadlineChange}
					className={` border-gray-900 border-1 h-full
						${
							taskObj.status == "Done"
								? "deadline-column"
								: checkDeadline() === 1
								? "deadline-column overdue"
								: checkDeadline() === 0
								? "deadline-column today"
								: "deadline-column"
						}`}
				/>
			) : (
				<p
					className={
						checkDeadline() === 1
							? "deadline-column overdue"
							: checkDeadline() === 0
							? "deadline-column today"
							: "deadline-column"
					}>
					{formatDateToDisplay(localDeadline)}
				</p>
			)}
			{currentWorkSpace.role === "admin" ? (
				<select
					value={localPriority}
					onChange={handlePriorityChange}
					className={`w-full border-gray-900 border-1 h-full ${priorityClass} `}>
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
				<p
					className={`border-gray-900 border-1 h-full ${priorityClass} priority-column`}>
					{localPriority}
				</p>
			)}
			<textarea
				value={localNotes}
				onChange={handleNotesChange}
				placeholder="Notes"
				className="h-full border-1 text-customText border-gray-900 pl-2 resize-none placeholder:align-middle"
			/>
			<div className="buttons buttons-column text-customText border-gray-900 flex gap-4 px-4 text-sm">
				<button
					onClick={handleUpdate}
					className="bg-success text-customBackground w-8 h-8 rounded-full disabled:bg-gray-500"
					disabled={!isChanged}>
					<FontAwesomeIcon icon={faSave} />
				</button>
				{currentWorkSpace.role === "admin" && (
					<button
						onClick={() => setConfirmDeletion(true)}
						className="bg-danger text-customBackground w-8 h-8 rounded-full">
						<FontAwesomeIcon icon={faTrash} />
					</button>
				)}
			</div>
		</div>
	);
}

TaskCard.propTypes = {
	taskObj: PropTypes.object,
	updateTask: PropTypes.func,
	deleteTask: PropTypes.func,
};
