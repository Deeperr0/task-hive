import PropTypes from "prop-types";
import { useRef, useEffect } from "react";

export default function Card({ cardTitle, cardText }) {
	const triggerBoxRef = useRef(null);
	const hoverBoxRef = useRef(null);

	useEffect(() => {
		const triggerBox = triggerBoxRef.current;
		const hoverBox = hoverBoxRef.current;

		if (triggerBox && hoverBox) {
			const handleMouseOver = () => {
				hoverBox.classList.remove("h-2.5");
				hoverBox.classList.add("mt-[-0.75rem]", "h-4");
			};

			const handleMouseOut = () => {
				hoverBox.classList.remove("mt-[-0.75rem]", "h-4");
				hoverBox.classList.add("h-2.5");
			};

			triggerBox.addEventListener("mouseover", handleMouseOver);
			triggerBox.addEventListener("mouseout", handleMouseOut);

			return () => {
				triggerBox.removeEventListener("mouseover", handleMouseOver);
				triggerBox.removeEventListener("mouseout", handleMouseOut);
			};
		}
	}, []);

	return (
		<div
			className="bg-gradient-to-bl from-accent-650/30 to-accent-400/40 shadow-md hover:shadow-lg text-primary-50 flex flex-col w-80 md:w-[26.875rem] h-[25.25rem] rounded-2xl px-10 pt-36 gap-5 items-center flex-shrink-0"
			ref={triggerBoxRef}
		>
			<div className="w-fit">
				<p className="text-accent-50 text-3xl text-center">{cardTitle}</p>
				<div
					className="hidden lg:block w-full h-2.5 bg-accent-500 mt-[-0.4rem] transition-all duration-200 ease-in-out bg-opacity-90"
					ref={hoverBoxRef}
				></div>
			</div>
			<p className="text-customText">{cardText}</p>
		</div>
	);
}

Card.propTypes = {
	cardTitle: PropTypes.string.isRequired,
	cardText: PropTypes.string.isRequired,
};
