import React from "react";
import { Button as BootstrapButton } from 'react-bootstrap';

const Button = ({ 
    id, 
    isDisabled, 
    clickHandler, 
    type = "button", 
    value,
    variant = "primary",
    size,
    className = ""
}) => {
    return (
        <BootstrapButton
            id={id}
            className={className}
            onClick={clickHandler}
            type={type}
            disabled={isDisabled}
            variant={variant}
            size={size}
        >
            {value}
        </BootstrapButton>
    );
};

Button.defaultProps = {
    type: "button",
    disabled: false,
    variant: "primary",
    className: ""
};

export default Button;
