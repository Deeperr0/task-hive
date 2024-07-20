import PropTypes from "prop-types";
import "./Overlay.css";
export default function Overlay({ children }) {
	return (
		<div className="overlay">
			<div className="overlay--container">
				<div className="overlay--content">{children}</div>
			</div>
		</div>
	);
}

Overlay.propTypes = {
	children: PropTypes.node,
	toggleOverlay: PropTypes.func,
	setToggleOverlay: PropTypes.func,
};
