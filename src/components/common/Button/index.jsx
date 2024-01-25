import React from "react";

import "./style.css";

const Button = props => {
  const btnEnableDisable = !props.isDisabled ? "btn-enable" : "btn-disabled";

  return (
    <button
      id={props.id}
      className={`btn ${btnEnableDisable}`}
      onClick={props.clickHandler}
      type={props.type}
      disabled={props.isDisabled}
    >
      {props.value}
    </button>
  );
};

Button.defaultProps = {
  type: "button",

  disabled: false
};

export default Button;
