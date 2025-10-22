import {
	faAngleDown,
	faAngleUp,
	faArrowRightFromBracket,
	faChartLine,
	faGear,
	faHome,
	faListCheck,
	faPeopleGroup,
	faPlus,
	faUserPlus,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import { useContext, useEffect, useRef, useState } from "react";
import { UserDataContext, WorkSpaceContext } from "../../../App";
import AddTeam from "../../teams/AddTeam";

import SideMenuTab from "../SideMenuTab";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase";
import { useNavigate } from "react-router-dom";

export default function SideMenu({
	setToggleAddTeam,
	currentTab,
	setCurrentTab,
}) {
	const { currentWorkSpace, setCurrentWorkSpace } =
		useContext(WorkSpaceContext);
	const { userData } = useContext(UserDataContext);

	const navigate = useNavigate();
	async function handleLogout() {
		try {
			await signOut(auth);
			startTransition(() => navigate("/"));
		} catch (error) {
			console.error("Error logging out:", error);
		}
	}

	return (
		<div className="text-black text-md h-full flex flex-col justify-between">
			<div>
				<div className="mt-5 mb-10">
					<a href="/">
						<h1 className="text-black !text-4xl leading-10 font-medium hover:text-accent-500 transition duration-300">
							TaskHive
						</h1>
					</a>
				</div>
				<div></div>

				<div>
					<ul
						className={`[&>li]:flex [&>li]:gap-4 [&>li]:items-center text-lg flex flex-col gap-2 [&>li]:p-2 [&>li]:rounded-lg text-neutral-500`}>
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
					onClick={() => setToggleAddTeam(true)}>
					<FontAwesomeIcon icon={faPlus} />
					<span className="ml-2">New Team</span>
				</button>
				<button
					className="bg-neutral-500/10 p-3 rounded-lg text-black hover:bg-neutral-500/20 transition-all duration-300"
					onClick={handleLogout}>
					<FontAwesomeIcon icon={faArrowRightFromBracket} /> Logout
				</button>
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
