import Project from "../Project";
import "./Home.css";
import PropTypes from "prop-types";
import SideMenu from "../SideMenu";

export default function Home({
	user,
	userData,
	teams,
	expandWorkSpace,
	setExpandWorkSpace,
	usersList,
}) {
	return (
		<div className="home--container">
			<div className="home--left">
				<SideMenu
					user={user}
					setExpandWorkSpace={setExpandWorkSpace}
					expandWorkSpace={expandWorkSpace}
					teams={teams}
				/>
			</div>
			<div className="home--right">
				<Project
					user={user}
					userData={userData}
					usersList={usersList}
				/>
			</div>
		</div>
	);
}

Home.propTypes = {
	user: PropTypes.object,
	userData: PropTypes.object,
	teams: PropTypes.array,
	expandWorkSpace: PropTypes.bool,
	setExpandWorkSpace: PropTypes.func,
	usersList: PropTypes.array,
};
