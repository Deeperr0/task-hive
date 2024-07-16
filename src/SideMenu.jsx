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
import filterIcon from "./Filter-outline.svg";
import PropTypes from "prop-types";

export default function SideMenu(props) {
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
            props.setCurrentWorkSpace(e.target.value);
          }}
        >
          {props.teams.map((workspace) => (
            <option value={workspace.teamId} key={workspace.teamId}>
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
        <button>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
      <div className="workspace-sub-menu">
        <div className="workspace">
          {props.expandWorkSpace ? (
            <FontAwesomeIcon icon={faCaretDown} />
          ) : (
            <FontAwesomeIcon icon={faCaretRight} />
          )}
          {props.teams.map(
            (workspace) =>
              workspace.teamId == props.currentWorkSpace && (
                <div
                  key={workspace.teamId}
                  className={props.expandWorkSpace ? "active" : ""}
                  onClick={() => {
                    props.setExpandWorkSpace(!props.expandWorkSpace);
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
  role: PropTypes.string,
  teams: PropTypes.array,
  currentWorkSpace: PropTypes.string,
  setCurrentWorkSpace: PropTypes.func,
  expandWorkSpace: PropTypes.bool,
  setExpandWorkSpace: PropTypes.func,
};
