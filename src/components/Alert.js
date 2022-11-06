const Alert = ({ type = "success", children, center }) => {
  let classForAlert = `alert alert-${type}`;
  if (center) {
    classForAlert = `${classForAlert} text-center`;
  }
  return <div className={classForAlert}>{children}</div>;
};

export default Alert;
