import Project from "./Project";
import "./Home.css";
import PropTypes from "prop-types";
import SideMenu from "../SideMenu";

export default function Home({ user, role }) {
  console.log("user:", user, "role:", role);
  return (
    <div className="home--container">
      <div className="home--left">
        <SideMenu user={user} />
      </div>
      <div className="home--right">
        <Project user={user} role={role} />
      </div>
    </div>
  );
}

Home.propTypes = {
  user: PropTypes.object,
  role: PropTypes.string,
};
