export const Notification = ({ message, isError }) => {
  let style = {
    color: isError ? "red" : "green",
    background: "lightgrey",
    fontsize: 20,
    borderStyle: "solid",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  };

  return <div style={style}>{message}</div>;
};
