import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import "./Navbar.css";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faArrowRightFromBracket,
	faBars,
	faClose,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import SideMenu from "../SideMenu";

export default function Navbar({
	user,
	userData,
	teams,
	currentWorkSpace,
	setCurrentWorkSpace,
	expandWorkSpace,
	setExpandWorkSpace,
}) {
	const navigate = useNavigate();
	const [toggleMenu, setToggleMenu] = useState(false);
	const [toggleUserMenu, setToggleUserMenu] = useState(false);
	async function handleLogout() {
		try {
			await signOut(auth).then(() => {
				navigate("/");
			});
		} catch (error) {
			console.error("Error logging out:", error);
		}
	}

	return (
		<div className="nav--container">
			<nav>
				{user && (
					<div className="nav--menu">
						<div onClick={() => setToggleMenu(true)}>
							<FontAwesomeIcon icon={faBars} />
						</div>
						<div
							className={
								toggleMenu ? "nav--side-menu" : "nav--side-menu hidden"
							}
						>
							<SideMenu
								user={user}
								setCurrentWorkSpace={setCurrentWorkSpace}
								currentWorkSpace={currentWorkSpace}
								setExpandWorkSpace={setExpandWorkSpace}
								expandWorkSpace={expandWorkSpace}
								teams={teams}
							/>
							<div
								className="nav--close"
								onClick={() => setToggleMenu(false)}
							>
								<FontAwesomeIcon icon={faClose} />
							</div>
						</div>
					</div>
				)}
				<div className="nav--logo">
					<a href="/">
						<h1>TaskHive</h1>
					</a>
				</div>
				<div className="nav--right">
					{user != undefined && (
						<div className="nav--user-desktop">
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
							<h1 className="user-letter">
								{userData.firstName[0].toUpperCase()}
							</h1>
						</div>
					)}
					{user != undefined && (
						<h1
							className="user-letter user-letter-mobile"
							onClick={() => setToggleUserMenu(!toggleUserMenu)}
						>
							{userData.firstName[0].toUpperCase()}
						</h1>
					)}
					<div
						className={
							toggleUserMenu ? "nav--user-menu" : "nav--user-menu hidden"
						}
					>
						{user ? (
							<div className="user-menu-container">
								<div
									className="nav--close"
									onClick={() => setToggleUserMenu(false)}
								>
									<FontAwesomeIcon icon={faClose} />
								</div>
								<div className="user-menu">
									<div className="user-info">
										<h1
											className="user-letter"
											onClick={() => setToggleUserMenu(!toggleUserMenu)}
										>
											{userData.firstName[0].toUpperCase()}
										</h1>
										<h2>{`${userData.firstName} ${userData.lastName}`}</h2>
									</div>
									<hr />
									<a
										href="/profile"
										className="profile"
									>
										Profile
									</a>
									<hr />
									<a
										href="/change-password"
										className="change-password"
									>
										Change password
									</a>
									<hr />
									<button
										onClick={handleLogout}
										className="logout"
									>
										<FontAwesomeIcon icon={faArrowRightFromBracket} /> Logout
									</button>
								</div>
							</div>
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
	user: PropTypes.object,
	userData: PropTypes.object,
	teams: PropTypes.array,
	currentWorkSpace: PropTypes.string,
	setCurrentWorkSpace: PropTypes.func,
	expandWorkSpace: PropTypes.bool,
	setExpandWorkSpace: PropTypes.func,
};
