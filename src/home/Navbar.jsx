import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import "./Navbar.css";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

export default function Navbar({ loggedIn, username }) {
	const navigate = useNavigate();
	const handleLogout = async () => {
		try {
			await signOut(auth).then(() => {
				navigate("/");
			});
		} catch (error) {
			console.error("Error logging out:", error);
		}
	};

	return (
		<div className="nav--container">
			<nav>
				<div className="nav--left">
					<a href="/">
						<h1>TaskHive</h1>
					</a>
				</div>
				<div className="nav--right">
					<div>
						{loggedIn ? (
							<>
								<a
									href="/change-password"
									className="change-password"
								>
									Change password
								</a>
								<button
									onClick={handleLogout}
									className="logout"
								>
									Logout
								</button>
								<h1 className="user-letter">{username}</h1>
							</>
						) : (
							<></>
						)}
					</div>
				</div>
			</nav>
		</div>
	);
}

Navbar.propTypes = {
	loggedIn: PropTypes.bool,
	username: PropTypes.string,
};
