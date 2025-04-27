import PropTypes from "prop-types";

export default function Card({ cardTitle, cardText }) {
	return (
		<div className="shadow-md bg-gradient-to-t from-accent-900/40 to-accent-100/10 hover:shadow-lg text-primary-50 flex flex-col w-80 md:w-[26.875rem] h-[18rem] rounded-2xl px-10 pt-24 gap-5 items-center flex-shrink-0 group/card ">
			<div className="w-fit">
				<p className="text-accent-50 text-3xl text-center">{cardTitle}</p>
				<div className="hidden lg:block w-full h-2.5 bg-accent-500/80 mt-[-0.4rem] transition-all duration-200 ease-in-out bg-opacity-90 group-hover/card:mt-[-0.75rem] group-hover/card:h-4"></div>
			</div>
			<p className="text-customText">{cardText}</p>
		</div>
	);
}

Card.propTypes = {
	cardTitle: PropTypes.string.isRequired,
	cardText: PropTypes.string.isRequired,
};
