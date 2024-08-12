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
import { useContext, useState } from "react";
import { UserDataContext } from "../../App";
import NavItem from "../NavItem";
export default function Navbar({ user, setToggleMenu }) {
	const path = window.location.pathname;
	const navigate = useNavigate();
	const [toggleNavMenu, setToggleNavMenu] = useState(false);
	const [toggleUserMenu, setToggleUserMenu] = useState(false);
	const { userData } = useContext(UserDataContext);
	async function handleLogout() {
		try {
			setToggleUserMenu(false);
			await signOut(auth);
			navigate("/");
		} catch (error) {
			console.error("Error logging out:", error);
		}
	}
	return (
		<div className="border-solid border-0 shadow-custom pl-12 pr-14 md:py-6 h-20 mb-8 bg-navy text-customText flex items-center">
			<nav className="flex justify-between items-center w-full">
				{user && (
					<div className="md:hidden">
						<div
							onClick={() => setToggleMenu(true)}
							className="block md:hidden">
							<FontAwesomeIcon icon={faBars} />
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
				<div className="text-customBlack text-base flex gap-4 items-center">
					{user ? (
						<>
							<div className="hidden md:flex justify-between items-center gap-4">
								<a href="/change-password">Change password</a>
								<button onClick={handleLogout}>Logout</button>
								<h1 className="bg-secondary w-10 h-10 rounded-full flex justify-center items-center text-lg text-Shark">
									{userData?.firstName[0].toUpperCase()}
								</h1>
							</div>
							<div className="bg-secondary w-10 h-10 rounded-full flex justify-center items-center md:hidden">
								<h1
									className="md:hidden"
									onClick={() => setToggleUserMenu(!toggleUserMenu)}>
									{userData?.firstName[0].toUpperCase()}
								</h1>
							</div>
						</>
					) : (
						path != "/login" &&
						path != "/register" && (
							<nav className="flex justify-between items-center">
								<div
									className={
										toggleNavMenu
											? "fixed top-0 left-0 z-100 w-screen h-screen bg-customBackground p-10"
											: "hidden md:flex"
									}>
									<ul className="text-customText gap-4 md:items-center md:flex flex flex-col md:flex-row">
										<li>
											<FontAwesomeIcon
												icon={faClose}
												onClick={() => setToggleNavMenu(false)}
												className="text-2xl md:hidden"
											/>
										</li>
										<li>
											<NavItem
												itemName="Home"
												itemLink="/"
												active={path == "/"}
											/>
										</li>
										<li>
											<NavItem
												itemName="Features"
												itemLink="/features"
												active={path == "/features"}
											/>
										</li>
										<li>
											<NavItem
												itemName="Pricing"
												itemLink="/pricing"
												active={path == "/pricing"}
											/>
										</li>
										<li>
											<NavItem
												itemName="About us"
												itemLink="/about-us"
												active={path == "/about-us"}
											/>
										</li>
										<li>
											<NavItem
												itemName="Contact"
												itemLink="/contact"
												active={path == "/contact"}
											/>
										</li>
									</ul>
								</div>
								<div className="md:hidden text-customText">
									<FontAwesomeIcon
										icon={faBars}
										onClick={() => setToggleNavMenu(true)}
									/>
								</div>
							</nav>
						)
					)}
					<div
						className={
							toggleUserMenu && user
								? "flex flex-col gap-4 fixed top-0 left-0 px-5 pt-10 w-screen h-screen bg-customBackground text-customText z-30"
								: "hidden"
						}>
						<div className="md:hidden">
							<div className="" onClick={() => setToggleUserMenu(false)}>
								<FontAwesomeIcon icon={faClose} />
							</div>
							<div className="flex flex-col gap-4 items-center">
								<div className="flex flex-col gap-4 items-center">
									<div className="bg-secondary w-10 h-10 rounded-full flex justify-center items-center">
										<h1
											className=""
											onClick={() => setToggleUserMenu(!toggleUserMenu)}>
											{userData?.firstName[0].toUpperCase()}
										</h1>
									</div>
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
					</div>
				</div>
			</nav>
		</div>
	);
}

Navbar.propTypes = {
	user: PropTypes.object,
	setToggleMenu: PropTypes.func,
};
