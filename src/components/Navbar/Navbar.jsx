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
import { useSignals } from "@preact/signals-react/runtime";

export default function Navbar({ user, toggleMenu }) {
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
	useSignals();
	return (
		<div className="border-solid border-0 shadow-custom px-8 md:py-12 md:px-14 h-20 mb-8 bg-navy text-customText flex items-center z-50">
			<nav className="flex justify-between items-center w-full">
				{user && (
					<div
						className="md:hidden"
						onClick={() => {
							toggleMenu.value = "true";
						}}
					>
						<div className="block md:hidden text-xl">
							<FontAwesomeIcon icon={faBars} />
						</div>
					</div>
				)}
				<div className="">
					<a href="/">
						<h1 className="text-customText text-2xl leading-10 font-normal hover:text-accent-500 transition duration-300">
							TaskHive
						</h1>
					</a>
				</div>
				<div className="text-customBlack text-base flex gap-4 items-center">
					{user ? (
						<>
							<div className="hidden md:flex justify-between items-center gap-4">
								<a
									href="/change-password"
									className="font-medium hover:text-accentShade1 transition-all duration-300"
								>
									Change password
								</a>
								<button
									onClick={handleLogout}
									className="font-medium hover:text-danger transition-all duration-300"
								>
									Logout
								</button>
								<h1 className="bg-accent-500 w-10 h-10 rounded-full flex justify-center items-center text-lg text-Shark">
									{userData?.firstName[0].toUpperCase()}
								</h1>
							</div>
							<div className="bg-secondary w-10 h-10 rounded-full flex justify-center items-center md:hidden">
								<h1
									className="md:hidden"
									onClick={() => setToggleUserMenu(!toggleUserMenu)}
								>
									{userData?.firstName[0].toUpperCase()}
								</h1>
							</div>
						</>
					) : (
						path != "/login" &&
						path != "/register" &&
						path != "/reset-password" && (
							<nav className="flex justify-between items-center">
								<div
									className={
										toggleNavMenu
											? "fixed top-0 left-0 z-50 w-screen h-screen bg-gradient-to-br from-background1 via-background2 to-background3 p-10"
											: "hidden md:flex"
									}
								>
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

								<div className="md:hidden text-customText aspect-square text-xl">
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
								? "flex flex-col gap-4 fixed top-0 left-0 px-5 pt-10 w-screen h-screen bg-gradient-to-b from-background1 to-background2 text-customText z-30"
								: "hidden"
						}
					>
						<div className="md:hidden px-5">
							<div className="text-xl">
								<FontAwesomeIcon
									icon={faClose}
									onClick={() => setToggleUserMenu(false)}
								/>
							</div>
							<div className="flex flex-col gap-4 items-center">
								<div className="flex flex-col gap-4 items-center">
									<div className="bg-secondary w-10 h-10 rounded-full flex justify-center items-center">
										<h1
											className=""
											onClick={() => setToggleUserMenu(!toggleUserMenu)}
										>
											{userData?.firstName[0].toUpperCase()}
										</h1>
									</div>
									<h2>{`${userData?.firstName} ${userData?.lastName}`}</h2>
								</div>
								<hr />
								<a
									href="/profile"
									className=""
								>
									Profile
								</a>
								<hr />
								<a
									href="/change-password"
									className=""
								>
									Change password
								</a>
								<hr />
								<button onClick={handleLogout}>
									<FontAwesomeIcon icon={faArrowRightFromBracket} /> Logout
								</button>
							</div>
						</div>
					</div>
				</div>
				{!user && path != "/login" && path != "/register" && (
					<div className="hidden md:flex gap-4">
						<button
							className="text-accent-500 border-2 rounded-lg hover:bg-accent-500 border-accent-500 px-4 py-2 hover:text-white transition-all duration-300"
							onClick={() => navigate("/login")}
						>
							Login
						</button>
						<button
							className="bg-accent-500 border-2 border-transparent rounded-lg hover:bg-transparent hover:border-accent-500 px-4 py-2 text-white transition-all duration-300"
							onClick={() => navigate("/register")}
						>
							Sign Up
						</button>
					</div>
				)}
			</nav>
		</div>
	);
}

Navbar.propTypes = {
	user: PropTypes.object,
	toggleMenu: PropTypes.object,
};
