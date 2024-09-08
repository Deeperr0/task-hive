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
						<div className="flex flex-col items-center lg:grid mt-[3rem] lg:items-start text-customText grid-cols-[44%,50%] gap-12 md:gap-24 text-center lg:text-left">
							<div className="flex flex-col justify-center h-full items-center lg:items-start">
								<h2 className="text-4xl md:text-5.5xl !font-playfair font-normal leading-snug ">
									Streamline Your Workflow. Empower Your Team.
								</h2>
								<p className="mt-[0.688rem] text-lg font-light">
									TaskHive makes team management effortless and efficient.
								</p>
								<button
									className="mt-6 font-semibold bg-accentShade1 rounded-md px-4 py-2 hover:bg-accentShade1Hover text-white transition-all duration-300 ease-in-out w-fit"
									onClick={() => navigate("/register")}
								>
									Get Started for Free
								</button>
							</div>
							<div className="md:rounded-lg border-0 overflow-hidden">
								<picture>
									<source
										srcSet="/home/hero-banner.webp"
										type="image/webp"
										media="(min-width:768px)"
									/>
									<img
										src="/home/hero-banner-mobile.webp"
										alt="a group of people working together"
									/>
								</picture>
							</div>
						</div>
					</div>
				</>
			) : (
				<>
					<div className="flex items-start gap-6 h-full ">
						<div
							className={
								toggleMenu.value == "true"
									? "flex flex-col gap-4 fixed top-0 left-0 px-10 md:px-5 pt-10 w-screen h-screen bg-customBackground text-customText z-30"
									: "py-8 rounded-tr-xl border text-customText shadow-secondaryCustom !w-64 px-8 text-base self-stretch hidden md:block bg-primaryShade3"
							}
						>
							<div className="text-customText">
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
