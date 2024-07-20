import PropTypes from "prop-types";
import "./Filters.css";
export function Filters({ setPriorityFilter, setStatusFilter }) {
	return (
		<div className="filters-container">
			<h2 className="filters-title">Filters: </h2>
			<div className="filters">
				<div>
					<p>Priority</p>
					<select onChange={(e) => setPriorityFilter(e.target.value)}>
						<option value="">All</option>
						<option value="Low">Low</option>
						<option value="Medium">Medium</option>
						<option value="High">High</option>
						<option value="Critical">Critical</option>
					</select>
				</div>
				<div>
					<p>Status</p>
					<select onChange={(e) => setStatusFilter(e.target.value)}>
						<option value="">All</option>
						<option value="Not started">Not started</option>
						<option value="Working on it">Working on it</option>
						<option value="Stuck">Stuck</option>
					</select>
				</div>
			</div>
		</div>
	);
}

export default Filters;

Filters.propTypes = {
	setPriorityFilter: PropTypes.func.isRequired,
	setStatusFilter: PropTypes.func.isRequired,
};
