import { Link } from "react-router-dom";
import './style.css';
import { useCookies } from "react-cookie";
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import LoginForm from '../../components/forms/login';
import RegisterForm from '../../components/forms/register';



const Navbar = () => {

    const [cookies, setCookie, removeCookie] = useCookies(['jwt', "username"]);
    const [signIn, setSignIn] = useState(false);
    const [register, setRegister] = useState(false);

    function toggleSignIn() {
        setRegister(false);
        setSignIn(!signIn);
      }
    
      function toggleRegister() {
        setSignIn(false);
        setRegister(!register);
      }

      const handleLogout = (e) => {
        removeCookie('jwt')
        removeCookie('username')
        setSignIn(false);
        setRegister(false);
    }

    return (
        <>
        <div className="buttonsDiv">
          {/* buttons for not logged in */}
          {
            !cookies.jwt && !cookies.username &&
            <button className="registerButton" onClick={() => {toggleRegister()}}>Register</button>
          }
          {
            !cookies.jwt && !cookies.username &&
            <button className="signInButton" onClick={() => toggleSignIn()}>Sign in</button>
          }
          {/* buttons for logged in */}
          {
            cookies.jwt && cookies.username &&
            <button className="signOutButton" onClick={() => {handleLogout()}}>Sign out</button>
          }
          <button className="playButton" onClick={() => { navigate("/play")}}>Play</button>
        </div>

        {!cookies.jwt && <div>
        {signIn &&
          <LoginForm/>}
        {register &&
          <RegisterForm/>}
      </div>}
</>

    );
}

export default Navbar;
