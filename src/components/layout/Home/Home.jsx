import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { lazy } from "react";
import { useSignals } from "@preact/signals-react/runtime";
import Features from "../Features";
const LazyProject = lazy(() => import("../Project"));
const LazySideMenu = lazy(() => import("../../ui/SideMenu"));

export default function Home({ user, userData, toggleMenu }) {
	useSignals();
	return (
		<div className="h-full">
			{!user ? (
				<>
					<div className="h-[calc(100vh-6rem)] overflow-hidden bg-[url('/home/hero-banner.webp')] bg-cover bg-center relative">
						<div className="relative z-10 flex flex-col items-center justify-center gap-6 text-white w-10/12 h-full mx-auto text-center">
							<h1 className="font-bold  text-7xl">
								Streamline Teamwork with TaskHive
							</h1>
							<h5 className="w-2/3 text-[#c4c3c2]">
								Manage projects, assign tasks, and track progress effortlessly.
								TaskHive adapts to your team's needs, whether you're a small
								team or a large organization.
							</h5>
							<button className="bg-[#137fec] px-6 py-3 rounded-xl text-xl hover:bg-[#126fea] transition-all duration-300">
								Get started for free
							</button>
						</div>
						<div className="absolute w-full h-full bg-linear-to-t from-black/80 to-black/10 top-0 left-0"></div>
					</div>
					<Features />
				</>
			) : (
				<>
					<div className="flex items-start gap-6 h-full">
						<div
							className={
								toggleMenu.value == "true"
									? "flex flex-col gap-4 fixed top-0 left-0 px-10 md:px-5 pt-10 w-screen h-screen text-custom-text z-30 "
									: "py-8 rounded-tr-xl text-custom-text shadow-secondary-custom w-64! px-8 text-base self-stretch hidden md:block bg-linear-to-b from-secondary-800/80 to-transparent"
							}>
							<div className="text-custom-text  md:hidden">
								<FontAwesomeIcon
									icon={faClose}
									className="text-xl"
									onClick={() => {
										toggleMenu.value = "false";
									}}
								/>
							</div>
							<LazySideMenu user={user} teams={userData?.teams} />
						</div>
						<div className="md:rounded-tl-2xl px-8 text-custom-text w-full py-10 bg-linear-to-b from-secondary-800/80 to-transparent">
							<LazyProject user={user} userData={userData} />
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
