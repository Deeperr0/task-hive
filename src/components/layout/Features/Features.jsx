import PropTypes from "prop-types";
import Card from "../../ui/Card";
import { faListUl, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons";

export default function Features() {
	return (
		<div>
			<div className={`py-10 w-screen`}>
				<div id="hero-section" className=" mx-4 md:mx-36">
					<div className="flex flex-col items-center text-black gap-10 text-center">
						<div className="text-center mt-10">
							<h2 className="font-semibold">Key Features</h2>
							<p className="text-custom-text">
								TaskHive offers a comprehensive suite of tools designed to
								enhance team productivity and project management
							</p>
						</div>
					</div>
				</div>
				<div id="features-overview" className="mt-14 mb-20">
					<div className="grid grid-cols-3 gap-12 px-20 h-80">
						<Card
							cardIcon={faUserGroup}
							cardTitle="Team Management"
							cardText="Easily create and manage multiple teams with different user roles (admin/user)"
						/>
						<Card
							cardIcon={faListUl}
							cardTitle="Task Organization"
							cardText="Organize tasks with lists, boards, and calendars for clear project oversight"
						/>
						<Card
							cardIcon={faClock}
							cardTitle="Time Tracking"
							cardText="Track your time efficiently. Set goals, track time, and stay on top of your work."
						/>
					</div>
				</div>
				<div className="text-black mt-20">
					<h2 className="text-center">Visualize Your Workflow</h2>
					<p className="text-center mt-6 mb-14 text-xl">
						Gain a clear understanding of project progress and team workload
						with intuitive visualizations.
					</p>
					<div className="grid grid-cols-2 h-120 px-20 gap-10">
						<div className="flex flex-col">
							<div className="mb-6 shadow-lg shadow-black/40 h-5/6 overflow-hidden bg-[url('/about-us/about-us.webp')] bg-cover bg-center w-full rounded-xl"></div>
							<h5 className="mb-2">Project dashboards</h5>
							<p>
								Monitor project timelines, task completion rates, and team
								performance at a glance
							</p>
						</div>
						<div className="flex flex-col">
							<div className="mb-6 shadow-lg shadow-black/40 h-5/6 overflow-hidden bg-[url('/home/hero-banner.webp')] bg-cover bg-center w-full rounded-xl"></div>
							<h5 className="mb-2">Team collaboration</h5>
							<p>
								Facilitate seamless collaboration with real-time updates,
								comments, and file sharing
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

Features.propTypes = {
	user: PropTypes.object,
};
