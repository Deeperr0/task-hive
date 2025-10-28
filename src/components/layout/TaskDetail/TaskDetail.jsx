import { useNavigate, useParams } from "react-router-dom";
import { lazy, useContext, useEffect, useMemo } from "react";
import { WorkSpaceContext } from "../../../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Timestamp } from "firebase/firestore";
import { fmtDate } from "../../../utils/manageDates";
const LazySideMenu = lazy(() => import("../../ui/SideMenu"));

export default function TaskDetail({
  currentTab,
  user,
  userData,
  setCurrentTab,
}) {
  const navigate = useNavigate();
  let { taskId } = useParams();
  console.log("taskId:" + taskId);
  const { currentWorkSpace } = useContext(WorkSpaceContext);
  const currentTask = useMemo(() => {
    return currentWorkSpace?.tasks?.find((task) => task.taskId == taskId);
  }, [currentWorkSpace?.tasks, taskId]);

  /**
   * Converts any supported timestamp format to milliseconds since epoch.
   */
  function toMillis(val) {
    if (!val) return null;
    if (val instanceof Date) return val.getTime();
    if (val instanceof Timestamp) return val.toMillis();
    if (typeof val.toDate === "function") return val.toDate().getTime();
    if (typeof val === "number") return val; // already ms
    if (typeof val === "string") return new Date(val).getTime();
    if (typeof val.seconds === "number") {
      return val.seconds * 1000 + Math.floor((val.nanoseconds ?? 0) / 1e6);
    }
    return null;
  }

  /**
   * Returns a human-readable "time ago" string for Firestore Timestamps,
   * Date objects, ISO strings, or numeric epoch times.
   */
  function timeAgo(timestamp) {
    const ms = toMillis(timestamp);
    if (!ms) return "—";

    const now = Date.now();
    const diffMs = now - ms;

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 5) return "Just now";
    if (seconds < 60) return `${seconds} second${seconds === 1 ? "" : "s"} ago`;
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
    if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
    if (weeks < 5) return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
    if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
    return `${years} year${years === 1 ? "" : "s"} ago`;
  }

  return (
    <>
      <div className="flex h-full">
        <div className="py-8 border-r border-neutral-250 px-8 text-base self-stretch hidden md:block w-80">
          <LazySideMenu
            currentTab={currentTab}
            user={user}
            teams={userData?.teams}
            setCurrentTab={setCurrentTab}
          />
        </div>
        <div className="py-20 px-10 w-full">
          <div className="flex gap-5">
            <div
              className="text-black text-2xl pt-4 cursor-pointer"
              onClick={() => navigate(-1)}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </div>
            <div>
              <h2 className="text-black font-bold">{currentTask.content}</h2>
              <p className="text-black">
                in{" "}
                <span className="text-accent-400 font-medium">
                  {currentWorkSpace.teamName}
                </span>
              </p>
            </div>
          </div>
          <div className="flex gap-10 pt-10 w-full">
            <div className="bg-white rounded-xl shadow-xs px-10 py-5 flex flex-col min-w-8/12 shrink-0 h-fit">
              <h5 className="text-black font-semibold">Description</h5>
              <p className="text-neutral-500 border-b-2 border-neutral-300/20 py-4">
                {currentTask.notes}
              </p>
              <div className="flex text-black [&_h6]:text-neutral-350 [&_h6]:text-sm! [&_h6]:mb-1 justify-between [&>div]:flex [&>div]:flex-col [&>div]:gap-4 pt-8">
                <div>
                  <div>
                    <h6>Assignee</h6>
                    <div className="flex gap-2 items-center">
                      <div className="aspect-square w-8 rounded-full overflow-hidden">
                        <img
                          src="/home/hero-banner.webp"
                          alt="Profile picture of assignee"
                          className="aspect-square w-8 rounded-full object-cover"
                        />
                      </div>
                      <p>{currentTask.owner}</p>
                    </div>
                  </div>
                  <div>
                    <h6>Priority</h6>
                    <p
                      className={`px-4 rounded-full text-center w-fit ${
                        currentTask.priority == "High"
                          ? "text-red-700 bg-red-200"
                          : currentTask.priority == "Medium"
                          ? "text-yellow-700 bg-yellow-200"
                          : "text-green-700 bg-green-200"
                      }`}
                    >
                      {currentTask.priority}
                    </p>
                  </div>
                </div>
                <div>
                  <div>
                    <h6>Due Date</h6>
                    <p>{fmtDate(currentTask.deadline)}</p>
                  </div>
                  <div>
                    <h6>Status</h6>
                    <p
                      className={`px-4 rounded-full text-center w-fit ${
                        currentTask.status === "Not started"
                          ? "text-gray-700 bg-gray-200"
                          : currentTask.status === "In progress"
                          ? "text-blue-700 bg-blue-200"
                          : currentTask.status === "Stuck"
                          ? "text-red-700 bg-red-200"
                          : "text-green-700 bg-green-200"
                      }`}
                    >
                      {currentTask.status}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white w-full shadow-xs rounded-xl text-black py-4 px-8 flex flex-col gap-4  h-fit">
              <h5 className="font-semibold">Activity & Comments</h5>
              <div className="flex gap-2 items-center py-4">
                <div>
                  <img
                    src="/home/hero-banner.webp"
                    alt="Profile picture of assignee"
                    className="aspect-square w-12 rounded-full object-cover"
                  />
                </div>
                <div>
                  <p>
                    <span className="font-semibold">System</span> created the
                    task.
                  </p>
                  <p className="text-sm text-neutral-400">
                    {timeAgo(currentTask.updatedAt)}
                  </p>
                </div>
              </div>
              <div className="flex gap-4 border-t-2 border-neutral-300/15 py-5">
                <div>
                  <img
                    src="/home/hero-banner.webp"
                    alt="Profile picture of assignee"
                    className="aspect-square w-12 rounded-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-5">
                  <textarea
                    name="comment"
                    id="comment"
                    placeholder="Add a comment..."
                    className="border outline-none border-neutral-400/20 rounded-lg p-2 resize-none"
                    rows={4}
                    cols={30}
                  ></textarea>
                  <button className="bg-accent-500/80 w-fit px-4 text-accent-50 rounded-md py-1 hover:bg-accent-600 transition-all duration-300">
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
