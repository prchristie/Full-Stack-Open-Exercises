export const CountryFilter = ({ currentFilter, handleFilterChange }) => (
  <div>
    find countries
    <input
      value={currentFilter}
      onChange={(e) => handleFilterChange(e.target.value)}
    />
  </div>
);
