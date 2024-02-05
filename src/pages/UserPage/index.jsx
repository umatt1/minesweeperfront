import React, {useState} from "react";
import LoginForm from "../../components/forms/login";
import RegisterForm from "../../components/forms/register";

const UserPage = ({}) => {
    return (<>
        <LoginForm/>
        <RegisterForm/>
    </>);
}

export default UserPage;