import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import './style.css';

function WelcomeScreen() {
  const [cookies, setCookie, removeCookie] = useCookies(['jwt', 'username']);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if jwt and username cookies exist to determine if user is logged in
    if (cookies.jwt && cookies.username) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [cookies]);

  const handlePlayButtonClick = () => {
    // Handle play button click
  };

  const handlePlayWithoutSignIn = () => {
    // Handle play without signing in button click
  };

  const handleSignInClick = () => {
    // Handle sign in button click
  };

  const handleRegisterClick = () => {
    // Handle register button click
  };

  const handleSignOutClick = () => {
    // Handle sign out button click
    removeCookie('jwt');
    removeCookie('username');
    setIsLoggedIn(false);
  };

  return (
    <div className="welcome-screen">
      {isLoggedIn ? (
        <div>
          <h1>Welcome back, {cookies.username}!</h1>
          <button className="play-button" onClick={handlePlayButtonClick}>Play</button>
          <button className="signout-button" onClick={handleSignOutClick}>Sign Out</button>
        </div>
      ) : (
        <div>
          <h1>Welcome to our app!</h1>
          <p>Please sign in or register to continue.</p>
          <div>
            <button className="play-button" onClick={handlePlayWithoutSignIn}>Play without signing in</button>
            <button className="signin-button" onClick={handleSignInClick}>Sign In</button>
            <button className="register-button" onClick={handleRegisterClick}>Register</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default WelcomeScreen;
