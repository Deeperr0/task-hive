import PropTypes from "prop-types";

export default function Overlay({ children }) {
	return (
		<>
			<div className="bg-customBackground h-screen w-screen fixed top-0 left-0 z-100 flex justify-center items-center opacity-65"></div>
			<div className="h-screen w-screen fixed top-0 left-0 z-1000 flex justify-center items-center">
				<div className="bg-customBackground flex flex-col rounded-lg text-center w-3/12 items-center py-24 opacity-100">
					<div className="flex flex-col items-center gap-4 w-10/12 text-lg">
						{children}
					</div>
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
