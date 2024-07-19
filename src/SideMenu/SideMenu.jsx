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
import filterIcon from "../Filter-outline.svg";
import PropTypes from "prop-types";
import { useContext } from "react";
import { WorkSpaceContext } from "../App";

export default function SideMenu({
	teams,
	expandWorkSpace,
	setExpandWorkSpace,
}) {
	const { currentWorkSpace, setCurrentWorkSpace } =
		useContext(WorkSpaceContext);
	return (
		<div className="side-menu-container">
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
				<button className="add-to-team">
					<FontAwesomeIcon icon={faPlus} />
				</button>
			</div>
			<div className="workspace-sub-menu">
				<div className="workspace">
					{expandWorkSpace ? (
						<FontAwesomeIcon icon={faCaretDown} />
					) : (
						<FontAwesomeIcon icon={faCaretRight} />
					)}
					{teams.map(
						(workspace) =>
							workspace.teamId == currentWorkSpace.teamId && (
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
		</div>
	);
}

SideMenu.propTypes = {
	user: PropTypes.object,
	teams: PropTypes.array,
	expandWorkSpace: PropTypes.bool,
	setExpandWorkSpace: PropTypes.func,
};
