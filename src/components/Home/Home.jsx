import React from "react";
// import Project from "../Project";

import PropTypes from "prop-types";
import heroBanner from "../../assets/hero-banner.png";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const LazyProject = React.lazy(() => import("../Project"));
const LazySideMenu = React.lazy(() => import("../SideMenu"));

export default function Home({ user, userData, teams }) {
	const [toggleMenu, setToggleMenu] = useState(false);
	const navigate = useNavigate();
	return (
		<div className="h-full">
			{!user ? (
				<>
					<Navbar user={user} />
					<div className="p-5 md:px-36 md:py-5">
						<div className="flex flex-col items-center md:grid mt-[3rem] md:items-start text-customText grid-cols-[44%,50%] gap-10 md:gap-24 text-center md:text-left">
							<div>
								<h2 className="text-4xl md:text-5.5xl !font-playfair font-normal leading-snug">
									Streamline Your Workflow. Empower Your Team.
								</h2>
								<p className="mt-[0.688rem] text-lg font-light">
									TaskHive makes team management effortless and efficient.
								</p>
								<button
									className="text-customText mt-6 font-semibold bg-accentShade1 rounded-md px-4 py-2 hover:bg-accentShade2 transition-all duration-300 ease-in-out"
									onClick={() => navigate("/register")}
								>
									Get Started for Free
								</button>
							</div>
							<div className="md:rounded-lg border-0 overflow-hidden">
								<img
									src={heroBanner}
									alt="a group of people working together"
								/>
							</div>
						</div>
					</div>
				</>
			) : (
				<>
					<Navbar
						user={user}
						setToggleMenu={setToggleMenu}
					/>
					<div className="flex items-start gap-6 h-full ">
						<div
							className={
								toggleMenu
									? "flex flex-col gap-4 fixed top-0 left-0 px-10 md:px-5 pt-10 w-screen h-screen bg-primaryShade3 text-customText z-30"
									: "py-8 rounded-tr-xl border text-customText shadow-secondaryCustom !w-64 px-8 text-base self-stretch hidden md:block bg-primaryShade3"
							}
						>
							<div
								className="text-customText"
								onClick={() => setToggleMenu(false)}
							>
								{toggleMenu && (
									<FontAwesomeIcon
										icon={faClose}
										className="text-xl"
									/>
								)}
							</div>
							<LazySideMenu
								user={user}
								teams={teams}
							/>
						</div>
						<div className="shadow-secondaryCustom md:rounded-t-lg px-4 text-customText w-full bg-primaryShade3 h-full pb-10">
							<LazyProject
								user={user}
								userData={userData}
							/>
						</div>
					</div>
				</>
			)}
		</div>
	);
}

Home.propTypes = {
	user: PropTypes.object,
	userData: PropTypes.object,
	teams: PropTypes.object,
};
