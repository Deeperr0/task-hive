import "./Loader.css";
export default function Loader() {
	return (
		<div className="loader-container">
			<div className="loader [&>*]:bg-customText">
				<div className="loader-square"></div>
				<div className="loader-square"></div>
				<div className="loader-square"></div>
				<div className="loader-square"></div>
				<div className="loader-square"></div>
				<div className="loader-square"></div>
				<div className="loader-square"></div>
			</div>
		</div>
	);
}
