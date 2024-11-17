import React from 'react';
import AuthApi from '../../apis/AuthApi';
import { useCookies } from 'react-cookie';
import { Button } from 'react-bootstrap';

const api = new AuthApi();

const LogoutForm = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['jwt', "username"]);

    const handleLogout = (e) => {
        e.preventDefault();
        removeCookie('jwt');
        removeCookie('username');
    }
    
    return (
        <div className="d-grid gap-2">
            <Button variant="outline-danger" onClick={handleLogout}>
                Sign out
            </Button>
        </div>
    );
}

export default LogoutForm;