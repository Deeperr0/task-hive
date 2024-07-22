import { faCalendarCheck } from "@fortawesome/free-regular-svg-icons";
import {
	faCaretDown,
	faCaretRight,
	faEllipsis,
	faHome,
	faPlus,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./SideMenu.css";
import filterIcon from "../../Filter-outline.svg";
import PropTypes from "prop-types";
import { useContext, useState } from "react";
import { WorkSpaceContext } from "../../App";
import AddTeam from "../AddTeam";

export default function SideMenu({ teams }) {
	const [toggleAddTeam, setToggleAddTeam] = useState(false);
	const [expandWorkSpace, setExpandWorkSpace] = useState(false);
	const { currentWorkSpace, setCurrentWorkSpace } =
		useContext(WorkSpaceContext);
	return (
		<div className="side-menu-container">
			{toggleAddTeam && <AddTeam setToggleAddTeam={setToggleAddTeam} />}
			<ul className="side-menu">
				<li>
					<FontAwesomeIcon icon={faHome} />
					Home
				</li>
				<li>
					<FontAwesomeIcon icon={faCalendarCheck} />
					Projects
				</li>
			</ul>
			<hr />
			<div className="workspace-menu">
				<select
					onChange={(e) => {
						setCurrentWorkSpace(
							teams.filter((team) => team.teamId === e.target.value)[0]
						);
					}}
				>
					{teams.map((workspace) => (
						<option
							value={workspace.teamId}
							key={workspace.teamId}
						>
							{workspace.teamName}
						</option>
					))}
				</select>
				<button>
					<FontAwesomeIcon icon={faEllipsis} />
				</button>
			</div>
			<div className="workspace-filter">
				<div className="search">
					<input type="text" />
					<button>
						<img src={filterIcon} />
					</button>
				</div>
				<button
					className="add-to-team"
					onClick={() => setToggleAddTeam(true)}
				>
					<FontAwesomeIcon icon={faPlus} />
				</button>
			</div>
			{teams.length != 0 && (
				<div className="workspace-sub-menu">
					<div className="workspace">
						{expandWorkSpace ? (
							<FontAwesomeIcon icon={faCaretDown} />
						) : (
							<FontAwesomeIcon icon={faCaretRight} />
						)}
						{teams.map(
							(workspace) =>
								workspace?.teamId == currentWorkSpace?.teamId && (
									<div
										key={workspace.teamId}
										className={expandWorkSpace ? "active" : ""}
										onClick={() => {
											setExpandWorkSpace(!expandWorkSpace);
										}}
									>
										{workspace.teamName}
									</div>
								)
						)}
					</div>
				</div>
			)}
		</div>
	);
}

SideMenu.propTypes = {
	user: PropTypes.object,
	teams: PropTypes.array,
	expandWorkSpace: PropTypes.bool,
	setExpandWorkSpace: PropTypes.func,
};
