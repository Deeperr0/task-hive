import Project from "../Project";
import "./Home.css";
import PropTypes from "prop-types";
import SideMenu from "../SideMenu";

export default function Home({ user, userData, teams, usersList }) {
	return (
		<div className="home--container">
			<div className="home--left">
				<SideMenu
					user={user}
					teams={teams}
				/>
			</div>
			{userData.teams.length ? (
				<div className="home--right">
					<Project
						user={user}
						userData={userData}
						usersList={usersList}
					/>
				</div>
			) : (
				<></>
			)}
		</div>
	);
}

Home.propTypes = {
	user: PropTypes.object,
	userData: PropTypes.object,
	teams: PropTypes.array,
	setExpandWorkSpace: PropTypes.func,
	usersList: PropTypes.array,
};
