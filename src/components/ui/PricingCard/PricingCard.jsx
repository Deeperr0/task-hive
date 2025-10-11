import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
export default function PricingCard({
	packageName,
	price,
	features,
	buttonText,
	mostPopular,
	priceType,
}) {
	return (
		<div
			className={`w-80 md:w-96 h-128 text-custom-text flex flex-col items-center justify-center gap-10 rounded-xl ${
				mostPopular
					? "bg-linear-to-tr from-primary-400/20 to-primary-600/50 h-136 lg:-translate-y-4 shadow-2xl"
					: "bg-linear-to-bl from-accent-750/40 to-accent-500/40"
			}`}
		>
			<h2 className="text-xl">{packageName}</h2>
			<p className="text-3xl flex items-center">
				$<span className="text-5xl">{price}</span>
				<span className="text-base">/{priceType == 0 ? "month" : "year"}</span>
			</p>
			<div className="text-base">
				<ul className="flex flex-col gap-3">
					{features.map((feature, index) => (
						<li key={`${feature.split(" ")}-${index}`}>
							<div className="flex gap-4 items-center">
								<FontAwesomeIcon
									icon={faCheck}
									className="text-accent text-2xl"
								/>
								{feature}
							</div>
						</li>
					))}
				</ul>
			</div>
			<button
				className={`rounded-md px-6 py-2 hover:shadow-2xl text-accent-50 hover:-translate-y-0.5 transition-all duration-300 ease-in-out ${
					mostPopular
						? "bg-accent-500 hover:shadow-accent-500"
						: "bg-primary-450 hover:shadow-primary-500"
				}`}
			>
				{buttonText}
			</button>
		</div>
	);
}

PricingCard.propTypes = {
	packageName: PropTypes.string,
	price: PropTypes.number,
	features: PropTypes.array,
	buttonText: PropTypes.string,
	mostPopular: PropTypes.bool,
	priceType: PropTypes.number,
};
