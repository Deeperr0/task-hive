import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";

export default function Card({ cardIcon, cardTitle, cardText }) {
	return (
		<div className="flex flex-col items-start justify-between gap-3 w-full h-full text-black border border-black/20 rounded-xl p-8">
			<FontAwesomeIcon
				icon={cardIcon}
				className="text-2xl mb-3 text-[#137fec]"
			/>
			<h2 className="text-xl font-semibold">{cardTitle}</h2>
			<p className="text-base text-[#4a5568]">{cardText}</p>
		</div>
	);
}

Card.propTypes = {
	cardIcon: PropTypes.object.isRequired,
	cardTitle: PropTypes.string.isRequired,
	cardText: PropTypes.string.isRequired,
};
