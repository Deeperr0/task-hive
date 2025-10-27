import AddUser from "../../teams/AddUser";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { useContext, useEffect, useRef, useState } from "react";
import Tasks from "../Tasks";
import PropTypes from "prop-types";
import { RoleContext, WorkSpaceContext } from "../../../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faPlus,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import Tab from "../../ui/Tab/Tab";
import { useNavigate } from "react-router-dom";
export default function Project({ teams, user, userData }) {
  const navigate = useNavigate();
  const [teamsList, setTeamsList] = useState({});
  async function getTeam(teamId) {
    const teamDocRef = doc(db, "teams", teamId);
    const teamDoc = await getDoc(teamDocRef);
    const teamData = teamDoc?.data();
    return teamData;
  }
  // Stores the current work space of the logged in user
  const { currentWorkSpace, setCurrentWorkSpace } =
    useContext(WorkSpaceContext);

  useEffect(() => {
    async function fetchTeams() {
      if (!teams) return;

      await Promise.all(
        Object.keys(teams)?.map(async (teamId) => {
          const teamData = await getTeam(teamId);
          setTeamsList((prevTeamsList) => ({
            ...prevTeamsList,
            [teamId]: teamData,
          }));
        })
      );
    }

    fetchTeams();
  }, [currentWorkSpace, teams]);
  const selectRef = useRef(null);

  // Stores the chosen priority filter (if any)
  const [priorityFilter, setPriorityFilter] = useState("");
  // Toggles the AddUser Overlay form to add a user to the project
  const [toggleAddUser, setToggleAddUser] = useState(false);
  // Stores the role of the logged in user (admins have more permissions)
  const { role } = useContext(RoleContext);

  const [activeTab, setActiveTab] = useState(0);

  const handleWrapperClick = () => {
    if (selectRef.current) {
      selectRef.current.showPicker();
    }
  };

  return (
    <div className="flex flex-col items-start gap-4 pt-4">
      {/* Conditionally renders the AddUser form */}
      {toggleAddUser && (
        <AddUser
          toggleAddUser={toggleAddUser}
          setToggleAddUser={setToggleAddUser}
          user={user}
          currentWorkSpace={currentWorkSpace}
        />
      )}
      <div className="flex justify-between w-full items-center py-8">
        <div>
          <div className="text-customBlack bg-transparent w-fit flex justify-between mb-2">
            <div
              className="select-wrapper-4 items-center flex font-semibold rounded-lg gap-2 my-5 cursor-pointer hover:text-neutral-500 text-5xl transition-all duration-200 w-fit"
              onClick={handleWrapperClick}
            >
              <select
                ref={selectRef}
                className="w-full cursor-pointer bg-transparent border-none outline-none appearance-none leading-tight"
                value={currentWorkSpace?.teamId}
                onChange={(e) => {
                  setCurrentWorkSpace(teamsList[e.target.value]);
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {teams &&
                  Object.keys(teams).map((teamId) => (
                    <option
                      key={teamId}
                      value={teamId}
                      className="text-primary-900 text-lg"
                    >
                      {teamsList[teamId]?.teamName}
                    </option>
                  ))}
              </select>
              <div className="text-neutral-500 flex flex-col text-xl pointer-events-none">
                <FontAwesomeIcon icon={faAngleDown} />
              </div>
            </div>
          </div>

          <p className="text-neutral-500 text-lg mt-2">
            Manage and track all team tasks across different stages
          </p>
        </div>
        {role === "admin" && (
          <div className="flex gap-5">
            <button
              className="bg-neutral-500/10 hover:bg-neutral-500/20 text-black py-3 px-6 rounded-lg transition-all duration-300 flex gap-2 items-center font-semibold"
              onClick={() => setToggleAddUser(true)}
            >
              <FontAwesomeIcon icon={faUserPlus} />
              <span className="ml-2">Invite User</span>
            </button>
            <button
              // onClick={() =>
              // 	addTask(
              // 		role,
              // 		userData,
              // 		user,
              // 		currentWorkSpace,
              // 		setCurrentWorkSpace
              // 	)
              // }
              onClick={() => navigate("/add-task")}
              className="bg-accent-500 hover:bg-accent-600 text-accent-50 h-fit py-3 px-6 rounded-lg transition-all duration-300 flex gap-2 items-center font-semibold"
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>Add task</span>
            </button>
          </div>
        )}
      </div>
      <div className="flex w-full border-b border-neutral-500/50 [&>div]:cursor-pointer">
        <Tab
          tab={0}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabText={"To do"}
        />
        <Tab
          tab={1}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabText={"In Progress"}
        />
        <Tab
          tab={2}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabText={"Stuck"}
        />
        <Tab
          tab={3}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabText={"Done"}
        />
      </div>
      {activeTab == 0 ? (
        <>
          <Tasks
            tasksList={currentWorkSpace.tasks.filter(
              (task) => task.status === "To Do"
            )}
          />
        </>
      ) : activeTab == 1 ? (
        <>
          <Tasks
            tasksList={currentWorkSpace.tasks.filter(
              (task) => task.status === "In Progress"
            )}
          />
        </>
      ) : activeTab == 2 ? (
        <>
          <Tasks
            tasksList={currentWorkSpace.tasks.filter(
              (task) => task.status === "Stuck"
            )}
          />
        </>
      ) : (
        <>
          <Tasks
            tasksList={currentWorkSpace.tasks.filter(
              (task) => task.status === "Done"
            )}
          />
        </>
      )}
      
    </div>
  );
}

Project.propTypes = {
  user: PropTypes.object.isRequired,
  userData: PropTypes.object.isRequired,
};
