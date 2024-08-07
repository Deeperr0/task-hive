import Project from "../Project";
import PropTypes from "prop-types";
import SideMenu from "../SideMenu";
import NavItem from "../NavItem/NavItem";
import heroBanner from "../../assets/hero-banner.png";

export default function Home({ user, userData, teams, usersList }) {
	return (
		<div className="px-36 py-10">
			<nav className="flex justify-between ">
				<h1 className="text-4xl font-semibold text-black font-poppins">
					TaskHive
				</h1>
				<ul className="text-customText flex gap-4 items-center">
					<li>
						<NavItem
							itemName="Home"
							itemLink="/"
							active={true}
						/>
					</li>
					<li>
						<NavItem
							itemName="Features"
							itemLink="/"
							active={false}
						/>
					</li>
					<li>
						<NavItem
							itemName="Pricing"
							itemLink="/"
							active={false}
						/>
					</li>
					<li>
						<NavItem
							itemName="About us"
							itemLink="/"
							active={false}
						/>
					</li>
					<li>
						<NavItem
							itemName="Contact"
							itemLink="/"
							active={false}
						/>
					</li>
				</ul>
			</nav>
			<div className="flex mt-[6.625rem] items-center text-customText">
				<div>
					<h2 className="text-5.5xl !font-playfair font-normal">
						Streamline Your Workflow. Empower Your Team.
					</h2>
					<p className="mt-[0.688rem]">
						TaskHive makes team management effortless and efficient.
					</p>
				</div>
				<div>
					<img
						src={heroBanner}
						alt="a group of people working together"
					/>
				</div>
			</div>
			{/* <div className="px-6 py-8 rounded-xl text-customText shadow-secondaryCustom w-1/6 ml-4">
				<SideMenu
					user={user}
					teams={teams}
				/>
			</div>
			{userData?.teams.length ? (
				<div className="shadow-secondaryCustom rounded-lg px-4  text-customText w-9/12">
					<Project
						user={user}
						userData={userData}
						usersList={usersList}
					/>
				</div>
			) : (
				<></>
			)} */}
		</div>
	);
}

Home.propTypes = {
	user: PropTypes.object,
	userData: PropTypes.object,
	teams: PropTypes.array,
	setExpandWorkSpace: PropTypes.func,
	usersList: PropTypes.array,
};
