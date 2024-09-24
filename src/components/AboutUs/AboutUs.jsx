import { useEffect, useState } from "react";
import { Blurhash } from "react-blurhash";
export default function AboutUs() {
	const [isLoaded, setIsLoaded] = useState(false);
	useEffect(() => {
		const img = new Image();
		img.src = "/about-us/about-us.webp";

		img.onload = () => {
			setIsLoaded(true);
		};

		return () => {
			img.onload = null;
		};
	}, []);
	return (
		<div className="pt-4 pb-16 px-8 md:px-20 lg:px-36">
			<div className="max-w-7xl mx-auto">
				<h1 className="text-2xl md:text-3xl lg:text-4xl font-normal text-left text-accent-300 mb-8 !font-playfair ml-10">
					Empowering Teams. <br /> Achieving More Together.
				</h1>
				<div className="gap-12 relative">
					<div className="w-full md:h-[450px]">
						{isLoaded ? (
							<picture>
								{/* Use the <source> tags to define different image formats or resolutions */}
								<source
									srcSet="/about-us/about-us.webp"
									type="image/webp"
								/>
								<source
									srcSet="/about-us/about-us.jpg"
									type="image/jpeg"
								/>
								{/* Fallback <img> tag for browsers that do not support <picture> */}
								<img
									src="/about-us/about-us.jpg"
									alt="Team working on their laptops"
									className="w-full h-full object-cover object-center group-hover:opacity-50"
									height={400}
									loading="lazy"
								/>
							</picture>
						) : (
							<div className="w-80 h-56 md:w-[600px] md:h-full lg:w-full lg:h-full mx-auto">
								<Blurhash
									hash="LAIO;50000.7.mo#4nRO5SeSt7nO"
									className="w-full h-full"
									width="100%"
									height="100%"
									resolutionX={32}
									resolutionY={32}
									punch={1}
								/>
							</div>
						)}
					</div>

					<div className="md:absolute left-8 lg:left-24 bottom-32 flex flex-col justify-center bg-primary-500 md:w-2/5 lg:w-5/12 h-auto mt-10 md:mt-0 text-center md:text-left">
						<div className="p-6 rounded-lg space-y-4">
							<h2 className="text-lg lg:text-xl font-semibold text-accent-300">
								Why We Built TaskHive
							</h2>
							<p className="text-accent-50 text-sm lg:text-base">
								TaskHive was created to solve the challenges faced by teams in
								managing their projects and collaborating effectively. Our
								platform provides an intuitive and powerful way to streamline
								tasks, enhance communication, and boost productivity.
							</p>
							<button className="bg-accent-300 group/explore hover:bg-transparent border-2 border-transparent hover:border-accent-400 px-4 py-2 transition-colors duration-300 ease-in-out">
								<a
									href="/about-us"
									className="text-accent-50 group-hover/explore:text-accent-300 font-medium transition-colors"
								>
									Explore Our Blog
								</a>
							</button>
						</div>
					</div>
					<div>
						<div className="space-y-4 md:ml-[55%] lg:md:ml-[60%] mt-12 md:mt-16 lg:pr-16 text-center md:text-left">
							<h2 className="text-2xl lg:text-3xl font-semibold text-accent-300 !font-playfair ">
								Helping You <br />
								Succeed at Every Step.
							</h2>
							<p className="text-accent-50">
								Whether you're a small team or a large organization, TaskHive
								adapts to your needs, helping you stay organized and on track.
								Our suite of tools is designed to support your goals and empower
								your team to work better together.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
