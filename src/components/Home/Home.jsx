import Project from "../Project";
import PropTypes from "prop-types";
import SideMenu from "../SideMenu";
import NavItem from "../NavItem/NavItem";
import heroBanner from "../../assets/hero-banner.png";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";

export default function Home({ user, userData, teams, usersList }) {
	const navigate = useNavigate();
	return (
		<>
			{!user ? (
				<div className="px-36 py-10">
					<nav className="flex justify-between ">
						<h1 className="text-4xl font-semibold text-black font-poppins">
							TaskHive
						</h1>
						<ul className="text-customText flex gap-4 items-center">
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
					</nav>
					<div className="grid mt-[6.625rem] items-start text-customText grid-cols-[44%,50%] gap-24">
						<div>
							<h2 className="text-5.5xl !font-playfair font-normal">
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
						<div className="rounded-lg border-0 overflow-hidden">
							<img src={heroBanner} alt="a group of people working together" />
						</div>
					</div>
				</div>
			) : (
				<>
					<Navbar user={user} userData={userData} teams={teams} />
					<div className="flex items-start gap-6 h-full">
						<div className="py-8 rounded-xl text-customText shadow-secondaryCustom !w-64 px-8 text-base self-stretch">
							<SideMenu user={user} teams={teams} />
						</div>
						{userData?.teams.length ? (
							<div className="shadow-secondaryCustom rounded-t-lg px-4 text-customText w-full bg-primary h-full pb-10">
								<Project
									user={user}
									userData={userData}
									usersList={usersList}
								/>
							</div>
						) : (
							<></>
						)}
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
