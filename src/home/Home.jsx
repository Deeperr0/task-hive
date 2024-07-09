import Project from "./Project";
import "./Home.css";
import PropTypes from "prop-types";

export default function Home({ user, role }) {
	return (
		<div className="home--container">
			<Project
				user={user}
				role={role}
			/>
		</div>
	);
}

Home.propTypes = {
	user: PropTypes.object,
	role: PropTypes.string,
};
