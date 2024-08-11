import Project from "../Project";
import PropTypes from "prop-types";
import SideMenu from "../SideMenu";
import NavItem from "../NavItem/NavItem";
import heroBanner from "../../assets/hero-banner.png";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faClose } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export default function Home({ user, userData, teams, usersList }) {
	const [toggleMenu, setToggleMenu] = useState(false);
	const [toggleNavMenu, setToggleNavMenu] = useState(false);
	const navigate = useNavigate();
	return (
		<>
			{!user ? (
				<div className="p-10 md:px-36 md:py-10">
					<nav className="flex justify-between items-center">
						<h1 className="text-2xl md:text-4xl font-semibold text-black font-poppins">
							TaskHive
						</h1>
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
										className="text-2xl"
									/>
								</li>
								<li>
									<NavItem itemName="Home" itemLink="/" active={true} />
								</li>
								<li>
									<NavItem
										itemName="Features"
										itemLink="/features"
										active={false}
									/>
								</li>
								<li>
									<NavItem
										itemName="Pricing"
										itemLink="/pricing"
										active={false}
									/>
								</li>
								<li>
									<NavItem
										itemName="About us"
										itemLink="/about-us"
										active={false}
									/>
								</li>
								<li>
									<NavItem
										itemName="Contact"
										itemLink="/contact"
										active={false}
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
					<div className="flex flex-col items-center md:grid mt-[6.625rem] md:items-start text-customText grid-cols-[44%,50%] gap-10 md:gap-24">
						<div>
							<h2 className="text-4xl md:text-5.5xl !font-playfair font-normal">
								Streamline Your Workflow. Empower Your Team.
							</h2>
							<p className="mt-[0.688rem] text-lg font-light">
								TaskHive makes team management effortless and efficient.
							</p>
							<button
								className="text-customText mt-6 font-semibold bg-accentShade1 rounded-md px-4 py-2"
								onClick={() => navigate("/register")}>
								Get Started for Free
							</button>
						</div>
						<div className="md:rounded-lg border-0 overflow-hidden">
							<img src={heroBanner} alt="a group of people working together" />
						</div>
					</div>
				</div>
			) : (
				<>
					<Navbar user={user} setToggleMenu={setToggleMenu} />
					<div className="flex items-start gap-6 h-full">
						<div
							className={
								toggleMenu
									? "flex flex-col gap-4 fixed top-0 left-0 px-5 pt-10 w-screen h-screen bg-customBackground text-customText"
									: "py-8 rounded-xl text-customText shadow-secondaryCustom !w-64 px-8 text-base self-stretch hidden md:block"
							}>
							<div
								className="text-customText"
								onClick={() => setToggleMenu(false)}>
								{toggleMenu && (
									<FontAwesomeIcon icon={faClose} className="text-xl" />
								)}
							</div>
							<SideMenu user={user} teams={teams} />
						</div>
						<div className="shadow-secondaryCustom md:rounded-t-lg px-4 text-customText w-full bg-primary h-full pb-10">
							<Project user={user} userData={userData} usersList={usersList} />
						</div>
					</div>
				</>
			)}
		</>
	);
}

Home.propTypes = {
	user: PropTypes.object,
	userData: PropTypes.object,
	teams: PropTypes.array,
	setExpandWorkSpace: PropTypes.func,
	usersList: PropTypes.array,
};
