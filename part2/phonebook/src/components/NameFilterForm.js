export const NameFilterForm = ({ handleFilterChange, nameFilterValue }) => (
  <div>
    filter shown with
    <input type="text" onChange={handleFilterChange} value={nameFilterValue} />
  </div>
);
