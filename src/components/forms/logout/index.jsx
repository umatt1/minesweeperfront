import React, {useState} from 'react';
import AuthApi from '../../apis/AuthApi';
import { useCookies } from 'react-cookie';
import './style.css';

const api = new AuthApi();

const LogoutForm = ({}) => {
    const [cookies, setCookie, removeCookie] = useCookies(['jwt', "username"]);

    const handleLogout = async (e) => {
        removeCookie('jwt')
        removeCookie('username')
    }
    
    return (
            <form onSubmit={handleLogout}>
            <button type="submit">Sign out</button>
            </form>
    );
}

export default LogoutForm;