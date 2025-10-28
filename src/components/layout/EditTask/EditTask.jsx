import { X, Plus, Paperclip, Calendar } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { WorkSpaceContext } from "../../../App";
import { lazy, useContext, useMemo, useEffect, useState } from "react";
import { updateTask } from "../../../utils/manageTasks";
import { Timestamp } from "firebase/firestore";
const LazySideMenu = lazy(() => import("../../ui/SideMenu"));

function toDateAny(val) {
  if (!val) return null;
  if (val instanceof Date) return val;
  if (typeof val.toDate === "function") return val.toDate(); // Firestore Timestamp
  if (typeof val.seconds === "number") {
    // {seconds, nanoseconds}
    return new Date(
      val.seconds * 1000 + Math.floor((val.nanoseconds ?? 0) / 1e6)
    );
  }
  if (typeof val === "number") return new Date(val); // epoch ms
  if (typeof val === "string") {
    // try native parse first
    const d = new Date(val);
    if (!isNaN(d)) return d;
    // fallback for Firestore console-like strings: "October 19, 2023 at 12:00:00 AM UTC+2"
    const m = val.match(/^[A-Za-z]+\s+\d{1,2},\s*\d{4}/);
    if (m) {
      const d2 = new Date(m[0]); // e.g. "October 19, 2023"
      if (!isNaN(d2)) return d2;
    }
  }
  return null;
}

// 2) Date -> "YYYY-MM-DD" in local time (no UTC shift)
function toYMDLocal(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// 3) Normalizer for <input type="date">
function normalizeDate(val) {
  const dt = toDateAny(val);
  return dt ? toYMDLocal(dt) : "";
}

export default function EditTask({
  currentTab,
  user,
  userData,
  setCurrentTab,
}) {
  const navigate = useNavigate();
  const { taskId } = useParams();
  const { currentWorkSpace, setCurrentWorkSpace } =
    useContext(WorkSpaceContext);

  const currentTask = useMemo(() => {
    return currentWorkSpace?.tasks?.find((t) => t.taskId == taskId);
  }, [currentWorkSpace?.tasks, taskId]);

  // --- form state (controlled inputs) ---
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [deadline, setDeadline] = useState(""); // yyyy-mm-dd
  const [priority, setPriority] = useState("Low");
  const [status, setStatus] = useState("To do");

  // hydrate when task loads/changes
  useEffect(() => {
    if (!currentTask) return;
    setTitle(currentTask.content || "");
    setNotes(currentTask.notes ?? "");
    setDeadline(normalizeDate(currentTask.deadline));
    setPriority(currentTask.priority || "Low");
    setStatus(currentTask.status || "To do");
  }, [currentTask]);

  const onCancel = () => navigate(-1);

  const onSave = async () => {
    if (!currentTask) return;
    const atMidnightLocal = deadline ? new Date(`${deadline}T00:00:00`) : null;

    const updates = {
      content: title.trim(),
      notes,
      deadline: atMidnightLocal ? Timestamp.fromDate(atMidnightLocal) : null,
      priority,
      status,
      lastUpdated: new Date().toISOString(),
    };

    await updateTask(
      currentTask.taskId,
      updates,
      currentWorkSpace,
      setCurrentWorkSpace
    );
    navigate(-1);
  };

  if (!currentTask) return null;

  return (
    <div className="flex h-full text-black">
      <div className="py-8 border-r border-neutral-250 px-8 text-base self-stretch hidden md:block w-80">
        <LazySideMenu
          currentTab={currentTab}
          user={user}
          teams={userData?.teams}
          setCurrentTab={setCurrentTab}
        />
      </div>
      <div className="w-full rounded-xl bg-white py-10">
        {/* Header */}
        <div className="border-b-2 border-neutral-300/30 px-6 py-4">
          <div className="text-sm text-slate-500">
            Teams / {currentWorkSpace?.teamName} / {currentTask.content}
          </div>
          <h2 className="mt-1 text-xl font-semibold text-slate-800">
            Edit Task
          </h2>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 gap-6 px-6 py-6 lg:grid-cols-3">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Task Title */}
            <div className="rounded-xl  p-4">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Task Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg  px-3 py-2 text-sm outline-none border border-neutral-300/20"
              />
            </div>

            <div className="rounded-xl p-4">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Notes
              </label>
              <textarea
                rows={7}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full resize-y rounded-lg  px-3 py-2 text-sm outline-none border border-neutral-300/20"
              />
            </div>

            {/* Attachments (UI only) */}
            <div className="rounded-xl p-4">
              <div className="mb-3 flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-700">
                  Attachments
                </label>
                <button
                  className="inline-flex items-center gap-2 rounded-lg shadow-sm px-3 py-1.5 text-sm hover:bg-slate-50"
                  type="button"
                >
                  <Plus className="h-4 w-4" />
                  Add Attachment
                </button>
              </div>

              <ul className="space-y-2">
                <li className="flex items-center justify-between rounded-lg border border-neutral-300/20 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Paperclip className="h-4 w-4 text-slate-500" />
                    <span className="text-sm text-slate-700">
                      API_documentation.pdf
                    </span>
                  </div>
                  <button
                    className="rounded-md p-1.5 hover:bg-slate-100"
                    title="Remove"
                    type="button"
                  >
                    <X className="h-4 w-4 text-slate-500" />
                  </button>
                </li>
                <li className="flex items-center justify-between rounded-lg border border-neutral-300/20 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Paperclip className="h-4 w-4 text-slate-500" />
                    <span className="text-sm text-slate-700">
                      payment_flow_mockup.png
                    </span>
                  </div>
                  <button
                    className="rounded-md p-1.5 hover:bg-slate-100"
                    title="Remove"
                    type="button"
                  >
                    <X className="h-4 w-4 text-slate-500" />
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Assignees (UI only) */}
            <div className="rounded-xl border border-neutral-300/20 p-4">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Assignee(s)
              </label>
              <div className="flex -space-x-2">
                <img
                  src="https://i.pravatar.cc/40?img=1"
                  alt="Alice Johnson"
                  className="h-8 w-8 rounded-full border-2 border-white"
                />
                <img
                  src="https://i.pravatar.cc/40?img=2"
                  alt="Bob Williams"
                  className="h-8 w-8 rounded-full border-2 border-white"
                />
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-sm text-slate-600">
                  +
                </div>
              </div>
            </div>

            {/* Due Date */}
            <div className="rounded-xl p-4">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Due Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300/20 px-3 py-2 pr-10 text-sm outline-none "
                />
                <Calendar className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-slate-500" />
              </div>
            </div>

            {/* Priority */}
            <div className="rounded-xl p-4">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-lg border border-neutral-300/20 px-3 py-2 text-sm outline-none "
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </div>

            {/* Status */}
            <div className="rounded-xl p-4">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border border-neutral-300/20 px-3 py-2 text-sm outline-none"
              >
                <option>To do</option>
                <option>In Progress</option>
                <option>Stuck</option>
                <option>Done</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4">
          <button
            onClick={onCancel}
            type="button"
            className="rounded-lg border px-4 py-2 text-sm hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
