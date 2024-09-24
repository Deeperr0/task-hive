import PropTypes from "prop-types";
export default function NavItem({ itemName, itemLink, active }) {
	return (
		<div className="parent group">
			<a
				className="md:text-sm lg:text-base"
				href={`${itemLink}`}
			>
				{itemName.toUpperCase()}
			</a>
			<hr
				className={
					active
						? "opacity-100 border-1 border-accent-500 md:w-1/3 w-4"
						: "opacity-0 transition-all duration-300 group-hover:opacity-100 border-1 border-accent-500 md:w-1/3 w-4"
				}
			/>
		</div>
	);
}

NavItem.propTypes = {
	itemName: PropTypes.string.isRequired,
	itemLink: PropTypes.string.isRequired,
	active: PropTypes.bool.isRequired,
};
