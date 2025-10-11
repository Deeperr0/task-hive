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
  description,
}) {
  return (
    <div
      className={`w-80 md:w-96 h-128 border text-black flex flex-col p-12 gap-3 rounded-xl ${
        mostPopular
          ? "[&>h5]:text-accent-500 border-accent-500 shadow-2xl shadow-accent-300"
          : "border-neutral-250"
      }`}
    >
      <p className="text-xl font-medium">{packageName}</p>
      <p className="text-3xl flex items-center font-semibold">
        {priceType != null && "$"}
        <span className="text-5xl">{price}</span>
        {priceType != null && (
          <span className="text-base">
            /{priceType == 0 ? "month" : "year"}
          </span>
        )}
      </p>
      <p className="text-neutral-500 !text-sm">{description}</p>
      <button
        className={`cursor-pointer font-medium rounded-md my-5 px-6 py-2 hover:shadow-2xl  hover:-translate-y-0.5 transition-all duration-300 ease-in-out ${
          mostPopular
            ? "bg-accent-500 hover:shadow-accent-500 text-accent-50"
            : "bg-accent-150 hover:shadow-primary-500 text-accent-500"
        }`}
      >
        {buttonText}
      </button>
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
