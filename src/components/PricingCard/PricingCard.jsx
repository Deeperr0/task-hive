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
			className={`w-96 h-[32rem] text-customText flex flex-col items-center justify-center gap-10 rounded-xl ${
				mostPopular
					? "bg-primaryShade2 h-[34rem] -translate-y-4 shadow-2xl"
					: "bg-secondaryShade2"
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
				className={` rounded-md px-6 py-2 hover:shadow-2xl text-customBackground hover:-translate-y-0.5 transition-all duration-300 ease-in-out ${
					mostPopular
						? "bg-primary hover:shadow-primary"
						: "bg-accentShade1 hover:shadow-accent"
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
