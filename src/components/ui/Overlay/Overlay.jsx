import PropTypes from "prop-types";

export default function Overlay({ children }) {
  return (
    <>
      <div className="bg-black h-full w-full fixed top-0 left-0 z-50 flex justify-center items-center bg-opacity-65">
        <div className="bg-white flex flex-col rounded-xl w-11/12 md:w-1/3 items-center opacity-100 shadow-2xl shadow-custom-text/20 h-auto">
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
