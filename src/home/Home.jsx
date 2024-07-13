import Project from "./Project";
import "./Home.css";
import PropTypes from "prop-types";
import SideMenu from "../SideMenu";
import { useState } from "react";

export default function Home({
  user,
  role,
  userData,
  teams,
  currentWorkSpace,
  setCurrentWorkSpace,
  expandWorkSpace,
  setExpandWorkSpace,
}) {
  return (
    <div className="home--container">
      <div className="home--left">
        <SideMenu
          user={user}
          setCurrentWorkSpace={setCurrentWorkSpace}
          currentWorkSpace={currentWorkSpace}
          setExpandWorkSpace={setExpandWorkSpace}
          expandWorkSpace={expandWorkSpace}
          teams={teams}
        />
      </div>
      <div className="home--right">
        <Project
          user={user}
          role={role}
          userData={userData}
          currentTeam={currentWorkSpace}
        />
      </div>
    </div>
  );
}

Home.propTypes = {
  user: PropTypes.object,
  role: PropTypes.string,
  userData: PropTypes.object,
};
