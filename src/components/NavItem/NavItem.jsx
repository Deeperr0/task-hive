import PropTypes from "prop-types";
export default function NavItem({ itemName, itemLink, active }) {
	return (
		<div className="parent group">
			<a href={`/${itemLink}`}>{itemName.toUpperCase()}</a>
			<hr
				className={
					active
						? "opacity-100 border-1 border-black w-1/3"
						: "opacity-0 transition-all duration-300 group-hover:opacity-100 border-1 border-black w-1/3"
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
