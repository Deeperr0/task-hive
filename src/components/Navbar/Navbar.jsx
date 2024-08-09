import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
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
export default function Navbar({ user, userData, teams }) {
	const navigate = useNavigate();
	const [toggleMenu, setToggleMenu] = useState(false);
	const [toggleUserMenu, setToggleUserMenu] = useState(false);
	async function handleLogout() {
		try {
			setToggleUserMenu(false);
			await signOut(auth);
			navigate("/");
		} catch (error) {
			console.error("Error logging out:", error);
		}
	}
	// Side menu in Mobile
	return (
		<div className="border-solid border-0 shadow-custom pl-12 pr-14 pt-6 h-20 mb-8 bg-navy">
			<nav className="flex justify-between items-center">
				{user && (
					<div className="md:hidden">
						<div onClick={() => setToggleMenu(true)} className="">
							<FontAwesomeIcon icon={faBars} />
						</div>
						<div className={toggleMenu ? "" : ""}>
							<SideMenu user={user} teams={teams} />
							<div className="" onClick={() => setToggleMenu(false)}>
								<FontAwesomeIcon icon={faClose} />
							</div>
						</div>
					</div>
				)}
				<div className="">
					<a href="/">
						<h1 className="text-customText text-2xl leading-10 font-normal hover:text-primaryShade1 transition duration-300">
							TaskHive
						</h1>
					</a>
				</div>
				<div className="text-customBlack text-base">
					{user != undefined && (
						<div className="flex justify-between items-center">
							<a href="/change-password" className="">
								Change password
							</a>
							<button onClick={handleLogout} className="">
								Logout
							</button>
							<h1 className="bg-customGreen w-10 h-10 rounded-full flex justify-center items-center text-lg text-Shark ">
								{userData?.firstName[0].toUpperCase()}
							</h1>
						</div>
					)}
					{user != undefined && (
						<h1
							className="md:hidden"
							onClick={() => setToggleUserMenu(!toggleUserMenu)}>
							{userData?.firstName[0].toUpperCase()}
						</h1>
					)}
					<div className={toggleUserMenu ? "" : ""}>
						{user ? (
							<div className="md:hidden">
								<div className="" onClick={() => setToggleUserMenu(false)}>
									<FontAwesomeIcon icon={faClose} />
								</div>
								<div className="">
									<div className="">
										<h1
											className=""
											onClick={() => setToggleUserMenu(!toggleUserMenu)}>
											{userData?.firstName[0].toUpperCase()}
										</h1>
										<h2>{`${userData?.firstName} ${userData?.lastName}`}</h2>
									</div>
									<hr />
									<a href="/profile" className="">
										Profile
									</a>
									<hr />
									<a href="/change-password" className="">
										Change password
									</a>
									<hr />
									<button onClick={handleLogout} className="">
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
	currentWorkSpace: PropTypes.object,
	setCurrentWorkSpace: PropTypes.func,
};
