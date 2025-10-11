import "./Loader.css";
export default function Loader() {
	return (
		<div className="flex justify-center items-center h-screen m-auto overflow-hidden">
			<div className="loader-container">
				<div className="loader *:bg-custom-text">
					<div className="loader-square"></div>
					<div className="loader-square"></div>
					<div className="loader-square"></div>
					<div className="loader-square"></div>
					<div className="loader-square"></div>
					<div className="loader-square"></div>
					<div className="loader-square"></div>
				</div>
			</div>
		</div>
	);
}
