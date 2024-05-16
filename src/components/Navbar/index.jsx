import { Link } from "react-router-dom";
import './style.css';
import { useCookies } from "react-cookie";
import { useState } from "react";

import LoginForm from "../forms/login"; 

const Navbar = () => {

    const [cookies, setCookie, removeCookie] = useCookies(['jwt', "username"]);
    const [displaySigninForm, setDisplaySigninForm] = useState(false)

    function signOut() {
        removeCookie("jwt");
        removeCookie("username");
    }


    return (
        <>
            <nav className="navbar">
                <Link to="/" className="navbar-link">Play</Link>
                <Link to="/user" className="navbar-link">User Stats</Link>
                <Link to="/about" className="navbar-link">About</Link>
                <div className="side">
                    {cookies.jwt && cookies.username ? (
                        <Link className="navbar-link" onClick={signOut}>Sign out</Link>
                    ) : (
                        <Link className="navbar-link" onClick={() => setDisplaySigninForm(!displaySigninForm)}>Sign in</Link>
                    )
                    }
                </div>
            </nav>
            {
                    displaySigninForm &&
                        <LoginForm/>
            }
        </>
    )
}

export default Navbar;
