import { faCalendarCheck } from "@fortawesome/free-regular-svg-icons";
import {
	faCaretDown,
	faCaretRight,
	faEllipsis,
	faFilter,
	faHome,
	faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import "./SideMenu.css";
import filterIcon from "./Filter-outline.svg";

export default function SideMenu() {
	const [currentWorkSpace, setCurrentWorkSpace] = useState(1);
	const [expandWorkSpace, setExpandWorkSpace] = useState(false);
	const workspaces = [
		{
			id: 1,
			name: "Personal",
			subWorkSpaces: [
				{
					id: 1,
					name: "Digital planner",
				},
				{
					id: 2,
					name: "Tower cranes",
				},
			],
		},
		{
			id: 2,
			name: "Work",
			subWorkSpaces: [
				{
					id: 1,
					name: "Business",
				},
				{
					id: 2,
					name: "Plan",
				},
			],
		},
	];
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
				<select onChange={(e) => setCurrentWorkSpace(e.target.value)}>
					{workspaces.map((workspace) => (
						<option
							value={workspace.id}
							key={workspace.id}
						>
							{workspace.name}
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
				<button>
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
					{workspaces.map(
						(workspace) =>
							workspace.id == currentWorkSpace && (
								<div
									key={workspace.id}
									className={currentWorkSpace === workspace.id ? "active" : ""}
									onClick={() => {
										setCurrentWorkSpace(workspace.id);
										setExpandWorkSpace(!expandWorkSpace);
									}}
								>
									{workspace.name}
								</div>
							)
					)}
				</div>
				<div className="sub-workspace">
					<ul>
						{workspaces[currentWorkSpace - 1].subWorkSpaces.map(
							(subWorkSpace) => (
								<li key={subWorkSpace.id}>{subWorkSpace.name}</li>
							)
						)}
					</ul>
				</div>
			</div>
		</div>
	);
}
