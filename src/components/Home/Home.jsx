import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { lazy } from "react";
import { useSignals } from "@preact/signals-react/runtime";
const LazyProject = lazy(() => import("../Project"));
const LazySideMenu = lazy(() => import("../SideMenu"));

export default function Home({ user, userData, toggleMenu }) {
	const navigate = useNavigate();
	useSignals();
	return (
		<div className="h-full">
			{!user ? (
				<>
					<div className="p-5 lg:px-14 md:py-5 md:px-32">
						<div className="flex flex-col items-center mt-[3rem] text-customText gap-12 md:gap-24 text-center">
							<div className="flex flex-col justify-center h-full items-center lg:w-7/12 gap-7">
								<h2 className="text-2xl md:text-4xl lg:text-5xl font-helvetica font-semibold !leading-snug">
									Streamline Your Workflow. Empower Your Team.
								</h2>
								<p className="md:text-lg lg:text-xl font-light w-10/12 text-purpleText">
									TaskHive makes team management effortless and efficient.
								</p>
								<div className="flex gap-4 items-center">
									<button
										className="font-semibold bg-accent-500 hover:bg-transparent border-2 border-transparent hover:border-accent-500 rounded-md px-4 py-2 hover:bg-accentShade1Hover text-white transition-all duration-300 ease-in-out w-fit"
										onClick={() => navigate("/register")}
									>
										Get Started
									</button>
									<button className="font-semibold rounded-md px-4 py-2 text-accent-500 hover:text-white hover:bg-accent-500 transition-all duration-300 ease-in-out w-fit border-2 border-accent-500">
										See how it works
									</button>
								</div>
							</div>
							<div className="md:rounded-lg border-0 overflow-hidden"></div>
						</div>
					</div>
				</>
			) : (
				<>
					<div className="flex items-start gap-6 h-full">
						<div
							className={
								toggleMenu.value == "true"
									? "flex flex-col gap-4 fixed top-0 left-0 px-10 md:px-5 pt-10 w-screen h-screen bg-customBackground text-customText z-30"
									: "py-8 rounded-tr-xl border text-customText shadow-secondaryCustom !w-64 px-8 text-base self-stretch hidden md:block bg-primaryShade3"
							}
						>
							<div className="text-customText  md:hidden">
								<FontAwesomeIcon
									icon={faClose}
									className="text-xl"
									onClick={() => {
										toggleMenu.value = "false";
									}}
								/>
							</div>
							<LazySideMenu
								user={user}
								teams={userData?.teams}
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
	toggleMenu: PropTypes.object,
};
