export const Notification = ({ message, isError }) => {
  if (message === null) {
    return null;
  }
  let style = {
    color: "green",
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  if (isError) {
    style = {
      ...style,
      color: "red",
    };
  }

  return <div style={style}>{message}</div>;
};

// color: red;
// background: lightgrey;
// font-size: 20px;
// border-style: solid;
// border-radius: 5px;
// padding: 10px;
// margin-bottom: 10px;
