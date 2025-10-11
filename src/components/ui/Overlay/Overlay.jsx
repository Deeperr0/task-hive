import PropTypes from "prop-types";

export default function Overlay({ children }) {
	return (
		<>
			<div className="bg-black h-full w-full fixed top-0 left-0 z-50 flex justify-center items-center bg-opacity-65">
				<div className="bg-primary-500 flex flex-col rounded-xl w-11/12 md:w-fit text-center items-center p-10 opacity-100 shadow-2xl shadow-custom-text/20">
					{children}
				</div>
			</div>
		</>
	);
}

Overlay.propTypes = {
	children: PropTypes.node,
	toggleOverlay: PropTypes.func,
	setToggleOverlay: PropTypes.func,
};
