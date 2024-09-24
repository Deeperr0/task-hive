import { useState } from "react";
import PropTypes from "prop-types";
import Card from "../Card";
import Loader from "../Loader";

export default function Features() {
	return (
		<div>
			<div className={`py-10 w-screen`}>
				<div
					id="hero-section"
					className=" mx-4 md:mx-36"
				>
					<div className="flex flex-col items-center text-customText gap-10 text-center">
						<div className="text-center">
							<h1 className="text-3xl md:text-5xl !font-playfair font-normal leading-snug text-center">
								{`Discover TaskHive's Powerful Features`}
							</h1>
							<p className="mt-[0.688rem] text-md md:text-lg font-light">
								Explore our robust features designed to transform the way you
								manage projects.
							</p>
						</div>
					</div>
				</div>
				<div
					id="features-overview"
					className="mt-14"
				>
					<h2 className="text-3xl text-customText text-center mb-9 !font-helvetica">
						Features Overview
					</h2>
					<div className="flex gap-4 items-center lg:justify-center overflow-x-scroll lg:overflow-hidden px-5 no-scrollbar">
						<Card
							cardTitle="Task Management"
							cardText="Manage your tasks with ease. Add, edit, and delete tasks in one place."
						/>
						<Card
							cardTitle="Collaboration"
							cardText="Collaborate with others in real-time. Share tasks, files, and notes with your team."
						/>
						<Card
							cardTitle="Time Tracking"
							cardText="Track your time efficiently. Set goals, track time, and stay on top of your work."
						/>
					</div>
				</div>
				<div
					id="benefits"
					className="mt-14 w-full"
				>
					<h2 className="text-3xl text-customText text-center mb-9 !font-helvetica">
						Benefits
					</h2>
					<div className="flex gap-4 items-center lg:justify-center overflow-x-scroll lg:overflow-hidden w-full px-5 no-scrollbar">
						<Card
							cardTitle="Boost Efficiency"
							cardText=" With TaskHive, you can streamline your workflow and increase productivity. Track time, set goals, and stay on top of your work with ease."
						/>
						<Card
							cardTitle="Stay Organized"
							cardText="Keep all your projects and tasks in one place for easy tracking and management"
						/>
						<Card
							cardTitle="Progress Tracking"
							cardText="Monitor the status of your projects with real-time progress updates"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

Features.propTypes = {
	user: PropTypes.object,
};
