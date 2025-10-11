import { faCalendarCheck } from "@fortawesome/free-regular-svg-icons";
import {
  faAngleDown,
  faAngleUp,
  faCaretDown,
  faCaretRight,
  faChartLine,
  faEllipsis,
  faGear,
  faHome,
  faListCheck,
  faPeopleGroup,
  faPlus,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import filterIcon from "../../../Filter-outline.svg";
import PropTypes from "prop-types";
import { useContext, useEffect, useRef, useState } from "react";
import { UserDataContext, WorkSpaceContext } from "../../../App";
import AddTeam from "../../teams/AddTeam";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import SideMenuTab from "../SideMenuTab";

async function getTeam(teamId) {
  const teamDocRef = doc(db, "teams", teamId);
  const teamDoc = await getDoc(teamDocRef);
  const teamData = teamDoc?.data();
  return teamData;
}

export default function SideMenu({ teams, currentTab, setCurrentTab }) {
  const [toggleAddTeam, setToggleAddTeam] = useState(false);
  const [expandWorkSpace, setExpandWorkSpace] = useState(false);
  const { currentWorkSpace, setCurrentWorkSpace } =
    useContext(WorkSpaceContext);
  const [teamsList, setTeamsList] = useState({});
  const selectRef = useRef(null);
  const { userData } = useContext(UserDataContext);

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

  const handleWrapperClick = () => {
    if (selectRef.current) {
      selectRef.current.showPicker();
    }
  };

  return (
    <div className="text-black text-md h-full flex flex-col justify-between">
      <div>
        <div className="my-5">
          <a href="/">
            <h1 className="text-black !text-4xl leading-10 font-medium hover:text-accent-500 transition duration-300">
              TaskHive
            </h1>
          </a>
        </div>
        {toggleAddTeam && <AddTeam setToggleAddTeam={setToggleAddTeam} />}
        <div></div>
        <div className="text-customBlack bg-transparent w-full flex justify-between mb-2">
          <div
            className="select-wrapper-4 p-2 px-4 items-center flex bg-neutral-500/15 font-semibold rounded-lg gap-2 my-5 cursor-pointer hover:bg-neutral-500/20 transition-colors w-full"
            onClick={handleWrapperClick}
          >
            <div className="text-lg mr-2 bg-accent-400 rounded-md w-6 h-6 p-2 font-semibold flex items-center justify-center">
              {currentWorkSpace?.teamName?.[0]}
            </div>
            <select
              ref={selectRef}
              className="w-full cursor-pointer bg-transparent border-none outline-none appearance-none"
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
                    className="text-primary-900"
                  >
                    {teamsList[teamId]?.teamName}
                  </option>
                ))}
            </select>
            <div className="text-neutral-500 flex flex-col text-sm pointer-events-none">
              <FontAwesomeIcon icon={faAngleUp} />
              <FontAwesomeIcon icon={faAngleDown} />
            </div>
          </div>
        </div>
        <div>
          <ul
            className={`[&>li]:flex [&>li]:gap-4 [&>li]:items-center text-lg flex flex-col gap-2 [&>li]:p-2 [&>li]:rounded-lg text-neutral-500`}
          >
            <SideMenuTab
              tabName="home"
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              tabText="Home"
              tabIcon={faHome}
            />
            <SideMenuTab
              tabName="my-tasks"
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              tabText="My Tasks"
              tabIcon={faListCheck}
            />
            <SideMenuTab
              tabName="team-tasks"
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              tabText="Team Tasks"
              tabIcon={faPeopleGroup}
            />
            <SideMenuTab
              tabName="reports"
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              tabText="Reports"
              tabIcon={faChartLine}
            />
            <SideMenuTab
              tabName="settings"
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              tabText="Settings"
              tabIcon={faGear}
            />
          </ul>
        </div>
      </div>
      <div className="w-full [&>*]:w-full flex flex-col gap-2">
        <button
          className="bg-accent-500 p-3 rounded-lg text-white hover:bg-accent-600 transition-all duration-300"
          onClick={() => setToggleAddTeam(true)}
        >
          <FontAwesomeIcon icon={faPlus} />
          <span className="ml-2">New Team</span>
        </button>
        {userData.teams[currentWorkSpace?.teamId]?.role === "admin" && (
          <button
            className="bg-neutral-500/10 p-3 rounded-lg text-black hover:bg-neutral-500/20 transition-all duration-300"
            onClick={() => setToggleAddTeam(true)}
          >
            <FontAwesomeIcon icon={faUserPlus} />
            <span className="ml-2">Invite User</span>
          </button>
        )}
      </div>
    </div>
  );
}

SideMenu.propTypes = {
  user: PropTypes.object,
  teams: PropTypes.object,
  expandWorkSpace: PropTypes.bool,
  setExpandWorkSpace: PropTypes.func,
};
