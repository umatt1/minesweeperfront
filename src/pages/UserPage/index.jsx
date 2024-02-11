import React, {useState} from "react";
import LoginForm from "../../components/forms/login";
import RegisterForm from "../../components/forms/register";
import Navbar from "../../components/Navbar";

const UserPage = ({}) => {
    return (<>
        <Navbar/>
        <LoginForm/>
    </>)
}

export default UserPage;