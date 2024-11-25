import React, { useState, useEffect } from 'react';
import Board from '../../components/minesweeper/Board';
import PuzzleApi from '../../components/apis/PuzzleApi';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

import './style.css';
import Navbar from '../../components/Navbar';
import LoginForm from '../../components/forms/login';
import RegisterForm from '../../components/forms/register';
import LogoutForm from '../../components/forms/logout';
import Solves from '../../components/solves';
import SolveApi from '../../components/apis/SolveApi';
import SocialPopdown from '../../components/social/Popdown';

// Ensure PuzzleApi and SolveApi are correctly imported and functional
const api = new PuzzleApi();
const solveApi = new SolveApi();

function HomePage() {
  const [puzzleId, setPuzzleId] = useState(null);
  const [puzzle, setPuzzle] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(['jwt', "username"]);
  const [signIn, setSignIn] = useState(false);
  const [register, setRegister] = useState(false);
  const [solves, setSolves] = useState([]);
  const [localPush, setLocalPush] = useState(false);
  const [displaySocial, setDisplaySocial] = useState(false);
  const navigate = useNavigate();

  // retrieve puzzle data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const puzzleData = await api.getPuzzleOfTheDay(cookies.jwt);
        setPuzzle(puzzleData.layout);
        setPuzzleId(puzzleData.id);
      } catch (error) {
        console.error('Error fetching puzzle:', error);
        if (error.response.status === 401) {
          removeCookie("jwt")
          removeCookie("username")
        }
      }
    };

    fetchData();
  }, [cookies.jwt]);

  const handleLogout = (e) => {
    removeCookie('jwt')
    removeCookie('username')
    setDisplaySocial(false);
    setSignIn(false);
    setRegister(false);
}

  // retrieve solve data
  useEffect(() => {
    const fetchSolveData = async () => {
      try {
        const solveData = await solveApi.getWeeksSolves(cookies.username, cookies.jwt);
        setSolves(solveData);
      } catch (error) {
        setSolves([]);
        console.error('Error fetching solves:', error);
        if (error.response.status === 401) {
          removeCookie("jwt")
          removeCookie("username")
        }
      }
    };

    fetchSolveData();
  }, [cookies.jwt]);

  function toggleSignIn() {
    setRegister(false);
    setSignIn(!signIn);
  }

  function toggleRegister() {
    setSignIn(false);
    setRegister(!register);
  }

  function completedToday() {
    const today = new Date();
    for (const solve of solves) {
      const solveDate = new Date(solve.puzzle.date); // Ensure solve.puzzle.date is a Date object
      if (solveDate.getDay() === today.getDay()) {
        return solve; // Puzzle completed today
      }
    }
    return null; // Puzzle not completed today
  }

  const pushASolveLocally = (solveData) => {
    setLocalPush(true);
    const solveObject = {
      player: { username: cookies.username },
      puzzle: { date: new Date(), layout: [] }, 
      success: solveData.success,
      time: solveData.time,
    };
    setSolves([...solves, solveObject]);
  };

  return (
    <>
      <div className='page'>
        <h1 className='sweeple'>Sweeple 💣</h1>
        <h3 className='sweeple'>Solve daily minesweeper #{puzzleId}</h3>
        {cookies.jwt && cookies.username && <h2>Welcome, {cookies.username}</h2>}
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
          {
            cookies.jwt && cookies.username &&
            <button className="socialButton" onClick={() => {setDisplaySocial(!displaySocial)}}>Social</button>
          }
          <button className="playButton" onClick={() => { navigate("/play")}}>Play</button>
          <button className="btn btn-link btn-sm text-muted btn-stats" onClick={() => { navigate("/statistics")}}>Stats</button>
        </div>

        {!cookies.jwt && <div>
        {signIn &&
          <LoginForm/>}
        {register &&
          <RegisterForm/>}
        </div>}

        {cookies.jwt && cookies.username && displaySocial && 
          <SocialPopdown/>
        }

      </div>
    </>
  );
}

export default HomePage;
