import PropTypes from "prop-types";

export default function Overlay({ children }) {
	return (
		<>
			<div className="bg-black h-screen w-screen absolute top-0 left-0 z-50 flex justify-center items-center bg-opacity-70">
				<div className="bg-customBackground flex flex-col rounded-xls text-center w-3/12 items-center py-24 opacity-100">
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
