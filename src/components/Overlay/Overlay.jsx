import PropTypes from "prop-types";

export default function Overlay({ children }) {
	return (
		<>
			<div className="bg-black h-screen w-screen fixed top-0 left-0 z-50 flex justify-center items-center bg-opacity-70">
				<div className="bg-background1 flex flex-col rounded-xl w-11/12 md:w-fit text-center items-center py-24 opacity-100">
					<div className="flex flex-col items-center gap-4 w-fit py-10 px-10 text-base md:text-lg">
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
