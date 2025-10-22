import React, { useMemo, useState } from "react";

const ASSIGNEE_OPTIONS = [
	"Alex Johnson",
	"Maria Garcia",
	"Chen Wei",
	"Fatima Al-Fassi",
];

const STATUS_OPTIONS = ["To Do", "In Progress", "Review", "Done"];

export default function CreateTask() {
	const [title, setTitle] = useState("");
	const [desc, setDesc] = useState("");
	const [assignees, setAssignees] = useState(ASSIGNEE_OPTIONS);
	const [dueDate, setDueDate] = useState(new Date(2023, 9, 5)); // Oct 5, 2023
	const [priority, setPriority] = useState("Medium");
	const [status, setStatus] = useState("To Do");
	const [files, setFiles] = useState([]);
	const [isOver, setIsOver] = useState(false);

	const toggleAssignee = (name) =>
		setAssignees((prev) =>
			prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
		);

	const onDrop = (e) => {
		e.preventDefault();
		setIsOver(false);
		const dropped = Array.from(e.dataTransfer.files || []);
		if (dropped.length) setFiles((f) => [...f, ...dropped]);
	};

	const onCreate = (e) => {
		e.preventDefault();
		const payload = {
			title,
			description: desc,
			assignees,
			dueDate,
			priority,
			status,
			files: files.map((f) => f.name),
		};
		console.log("Create Task:", payload);
		alert("Task created! Check the console for the payload.");
	};

	const onCancel = () => {
		setTitle("");
		setDesc("");
		setAssignees([]);
		setDueDate(null);
		setPriority("Medium");
		setStatus("To Do");
		setFiles([]);
	};

	/* -------- Calendar -------- */
	const [cursor, setCursor] = useState(
		dueDate
			? new Date(dueDate.getFullYear(), dueDate.getMonth(), 1)
			: new Date()
	);

	const cal = useMemo(() => {
		const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
		const firstDay = first.getDay(); // 0..6
		const daysInMonth = new Date(
			cursor.getFullYear(),
			cursor.getMonth() + 1,
			0
		).getDate();

		const grid = [];
		let d = 1 - firstDay;
		for (let w = 0; w < 6; w++) {
			const row = [];
			for (let i = 0; i < 7; i++) {
				row.push(new Date(cursor.getFullYear(), cursor.getMonth(), d++));
			}
			grid.push(row);
		}
		const monthName = cursor.toLocaleString("default", { month: "long" });
		return { monthName, year: cursor.getFullYear(), weeks: grid, daysInMonth };
	}, [cursor]);

	const isSameDay = (a, b) =>
		a &&
		b &&
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate();

	return (
		<div className="text-black max-w-[980px] mx-auto px-6 pb-16 pt-10 bg-slate-50">
			<h1 className="text-3xl font-bold tracking-tight mb-6">
				Create a New Task
			</h1>

			<form
				onSubmit={onCreate}
				className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
				{/* Left column */}
				<div className="flex flex-col gap-3">
					<label className="text-sm font-semibold text-slate-600">
						Task Title
					</label>
					<input
						className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-inner focus:outline-none focus:ring-4 focus:ring-blue-200"
						placeholder="Enter task title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						required
					/>

					<label className="text-sm font-semibold text-slate-600 mt-2">
						Description
					</label>
					<textarea
						rows={7}
						className="w-full min-h-[140px] rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-inner focus:outline-none focus:ring-4 focus:ring-blue-200"
						placeholder="Add a detailed description"
						value={desc}
						onChange={(e) => setDesc(e.target.value)}
					/>

					<label className="text-sm font-semibold text-slate-600 mt-2">
						Attachments
					</label>
					<div
						onDragOver={(e) => {
							e.preventDefault();
							setIsOver(true);
						}}
						onDragLeave={() => setIsOver(false)}
						onDrop={onDrop}
						className={`rounded-xl border-2 border-dashed ${
							isOver
								? "border-blue-400 bg-blue-50"
								: "border-slate-300 bg-white"
						} p-6`}>
						<div className="flex flex-col items-center gap-2 text-sm text-slate-500">
							<div className="text-3xl">☁︎</div>
							<div>
								Drag &amp; drop files here or{" "}
								<label className="text-blue-600 underline cursor-pointer">
									browse
									<input
										type="file"
										multiple
										className="sr-only"
										onChange={(e) =>
											setFiles((f) => [
												...f,
												...Array.from(e.target.files || []),
											])
										}
									/>
								</label>
							</div>
						</div>

						{files.length > 0 && (
							<ul className="mt-4 space-y-1 text-sm text-slate-700">
								{files.map((f, i) => (
									<li key={i} className="truncate">
										• {f.name}
									</li>
								))}
							</ul>
						)}
					</div>
				</div>

				{/* Right column */}
				<div className="flex flex-col gap-4">
					{/* Assignees */}
					<div>
						<label className="text-sm font-semibold text-slate-600">
							Assignees
						</label>
						<div className="mt-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
							<ul className="divide-y divide-slate-100">
								{ASSIGNEE_OPTIONS.map((name) => {
									const on = assignees.includes(name);
									return (
										<li key={name}>
											<button
												type="button"
												onClick={() => toggleAssignee(name)}
												aria-pressed={on}
												className={`w-full text-left px-2 py-2 rounded-lg transition ${
													on ? "bg-indigo-50" : "hover:bg-slate-50"
												}`}>
												{name}
											</button>
										</li>
									);
								})}
							</ul>
						</div>
					</div>

					{/* Due Date (Calendar) */}
					<div>
						<label className="text-sm font-semibold text-slate-600">
							Due Date
						</label>
						<div className="mt-2 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
							<div className="flex items-center justify-between px-3 py-2 border-b border-slate-200">
								<button
									type="button"
									className="h-7 w-7 grid place-items-center rounded-md border border-slate-200"
									onClick={() =>
										setCursor(
											new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1)
										)
									}
									aria-label="Previous month">
									‹
								</button>
								<div className="font-semibold">
									{cal.monthName} {cal.year}
								</div>
								<button
									type="button"
									className="h-7 w-7 grid place-items-center rounded-md border border-slate-200"
									onClick={() =>
										setCursor(
											new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1)
										)
									}
									aria-label="Next month">
									›
								</button>
							</div>

							<div className="grid grid-cols-7 gap-1 px-3 py-3">
								{["S", "M", "T", "W", "T", "F", "S"].map((d) => (
									<div
										key={d}
										className="text-center text-xs text-slate-500 tracking-wide mb-1">
										{d}
									</div>
								))}
								{cal.weeks.flat().map((date, idx) => {
									const inMonth = date.getMonth() === cursor.getMonth();
									const selected = dueDate && isSameDay(date, dueDate);
									return (
										<button
											key={idx}
											type="button"
											aria-pressed={selected}
											aria-label={date.toDateString()}
											className={`mx-auto grid h-9 w-9 place-items-center rounded-full text-sm transition ${
												selected
													? "bg-blue-500 text-white font-semibold"
													: inMonth
													? "hover:bg-slate-100"
													: "text-slate-400"
											}`}
											onClick={() => setDueDate(new Date(date))}>
											{date.getDate()}
										</button>
									);
								})}
							</div>
						</div>
					</div>

					{/* Priority */}
					<div>
						<label className="text-sm font-semibold text-slate-600">
							Priority
						</label>
						<div className="mt-2 flex gap-2">
							{["Low", "Medium", "High", "Urgent"].map((p) => (
								<button
									key={p}
									type="button"
									onClick={() => setPriority(p)}
									aria-pressed={priority === p}
									className={`rounded-xl border px-3 py-2 text-sm transition ${
										priority === p
											? p === "Low"
												? "bg-slate-100 border-slate-200"
												: p === "Medium"
												? "bg-amber-100 border-amber-200"
												: p === "High"
												? "bg-rose-100 border-rose-200"
												: "bg-pink-100 border-pink-200"
											: "bg-white border-slate-200 hover:bg-slate-50"
									}`}>
									{p}
								</button>
							))}
						</div>
					</div>

					{/* Status */}
					<div>
						<label className="text-sm font-semibold text-slate-600">
							Status
						</label>
						<div className="relative mt-2 inline-block">
							<select
								value={status}
								onChange={(e) => setStatus(e.target.value)}
								className="appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-4 focus:ring-blue-200 min-w-[200px]">
								{STATUS_OPTIONS.map((s) => (
									<option key={s} value={s}>
										{s}
									</option>
								))}
							</select>
							<span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-500">
								▾
							</span>
						</div>
					</div>
				</div>

				{/* Footer actions */}
				<div className="lg:col-span-2 flex justify-end gap-3 pt-2">
					<button
						type="button"
						onClick={onCancel}
						className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm shadow-sm hover:bg-slate-50">
						Cancel
					</button>
					<button
						type="submit"
						className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
						Create Task
					</button>
				</div>
			</form>
		</div>
	);
}
