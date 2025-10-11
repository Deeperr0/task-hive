import PropTypes from "prop-types";
export function Filters({ setPriorityFilter }) {
  return (
    <div className=" items-center gap-4">
      <h2>Filters: </h2>
      <div className=" flex items-center gap-2">
        <div className="">
          <p>Priority</p>
          <select
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-primary-900"
          >
            <option value="">All</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default Filters;

Filters.propTypes = {
  setPriorityFilter: PropTypes.func.isRequired,
};
