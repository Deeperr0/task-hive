import { faCalendarCheck } from "@fortawesome/free-regular-svg-icons";
import {
	faCaretDown,
	faCaretRight,
	faEllipsis,
	faHome,
	faPlus,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import filterIcon from "../../Filter-outline.svg";
import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import { WorkSpaceContext } from "../../App";
import AddTeam from "../AddTeam";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

async function getTeam(teamId) {
	const teamDocRef = doc(db, "teams", teamId);
	const teamDoc = await getDoc(teamDocRef);
	const teamData = teamDoc?.data();
	return teamData;
}

export default function SideMenu({ teams }) {
	const [toggleAddTeam, setToggleAddTeam] = useState(false);
	const [expandWorkSpace, setExpandWorkSpace] = useState(false);
	const { currentWorkSpace, setCurrentWorkSpace } =
		useContext(WorkSpaceContext);
	const [teamsList, setTeamsList] = useState({});
	useEffect(() => {
		async function fetchTeams() {
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
	return (
		<div className="text-customBlack text-md h-full">
			{toggleAddTeam && <AddTeam setToggleAddTeam={setToggleAddTeam} />}
			<ul className="flex flex-col gap-2 mb-4">
				<li>
					<a href="/" className="flex gap-1 items-center">
						<FontAwesomeIcon icon={faHome} className="w-5" />
						Home
					</a>
				</li>
				<li>
					{
						// TODO add a projects page that displays all the projects/teams of the user
					}
					<a href="/" className="flex gap-1 items-center">
						<FontAwesomeIcon icon={faCalendarCheck} className="w-5" />
						Projects (Upcoming)
					</a>
				</li>
			</ul>
			<hr className="mb-2" />
			<div className="text-customBlack bg-transparent w-full flex justify-between mb-2">
				<select
					className="bg-transparent w-9/12"
					onChange={(e) => {
						setCurrentWorkSpace(teamsList[e.target.value]?.teamName);
					}}>
					{Object.keys(teams).map((teamId) => (
						<option key={teamId} value={teamId}>
							{teamsList[teamId]?.teamName}
						</option>
					))}
				</select>
				{
					// TODO add a drop down menu for a list of actions that can be done on the current workspace
				}
				<button>
					<FontAwesomeIcon icon={faEllipsis} className="mx-1" />
				</button>
			</div>
			<div className="flex justify-between bg-transparent mb-4 gap-3">
				<div className="border-black flex justify-between items-center border-2 w-36 bg-white overflow-hidden h-8">
					<input type="text" className="w-full bg-transparent" />
					<button>
						<img src={filterIcon} className="w-5 text-customText mr-3" />
					</button>
				</div>
				<button
					className="bg-accentShade1 w-8 rounded-md"
					onClick={() => setToggleAddTeam(true)}>
					<FontAwesomeIcon icon={faPlus} />
				</button>
			</div>
			{teams?.length != 0 && (
				<div className="">
					<div className="flex gap-1 items-center">
						{expandWorkSpace ? (
							<FontAwesomeIcon icon={faCaretDown} />
						) : (
							<FontAwesomeIcon icon={faCaretRight} />
						)}
						{currentWorkSpace && (
							<div
								key={currentWorkSpace.teamId}
								className={expandWorkSpace ? "active" : ""}
								onClick={() => {
									setExpandWorkSpace(!expandWorkSpace);
								}}>
								{currentWorkSpace.teamName}
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}

SideMenu.propTypes = {
	user: PropTypes.object,
	teams: PropTypes.object,
	expandWorkSpace: PropTypes.bool,
	setExpandWorkSpace: PropTypes.func,
};
