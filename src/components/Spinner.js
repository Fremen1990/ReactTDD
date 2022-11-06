import React from "react";

const Spinner = ({ size }) => {
  let spanClass = "spinner-border";
  if (size !== "big") {
    spanClass += " spinner-border-sm";
  }
  return <span className={spanClass} role="status" />;
};

export default Spinner;
