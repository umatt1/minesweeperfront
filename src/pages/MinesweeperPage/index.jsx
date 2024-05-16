import React, { useState, useEffect } from 'react';
import Board from '../../components/minesweeper/Board';
import PuzzleApi from '../../components/apis/PuzzleApi';
import { useCookies } from 'react-cookie';

import './style.css';
import Navbar from '../../components/Navbar';
import LoginForm from '../../components/forms/login'
import RegisterForm from '../../components/forms/register'
import LogoutForm from '../../components/forms/logout';
import Solves from '../../components/solves';
import SolveApi from '../../components/apis/SolveApi';
import WelcomeScreen from '../WelcomePage';

const api = new PuzzleApi();
const solveApi = new SolveApi();

function MinesweeperPage() {
  const [puzzleId, setPuzzleId] = useState(null);
  const [puzzle, setPuzzle] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(['jwt', "username"]);
  const [signIn, setSignIn] = useState(true);
  const [solves, setSolves] = useState([]);
  const [localPush, setLocalPush] = useState(false);

  // retrieve puzzle data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const puzzleData = await api.getPuzzleOfTheDay(cookies.jwt);
        setPuzzle(puzzleData.layout);
        setPuzzleId(puzzleData.id);
      } catch (error) {
        console.error('Error fetching puzzle:', error);
      }
    };

    fetchData();
  }, [cookies.jwt]);

  // retrieve solve data
  useEffect(() => {
    const fetchSolveData = async () => {
      try {
        const solveData = await solveApi.getWeeksSolves(cookies.username, cookies.jwt);
        setSolves(solveData);
      } catch (error) {
        setSolves([]);
        console.error('Error fetching solves:', error)
      }
    };

    fetchSolveData();
  }, [cookies.jwt]);

  function toggleSignIn() {
    setSignIn(!signIn);
  }

  function completedToday() {
    const today = new Date();
    for (const solve of solves) {
      if (solve.puzzle.date.getDay() === today.getDay()) {
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
    setSolves([...solves, solveObject])
};


  return (
    <>
    <Navbar/>
    <div className='page'>
      <h1>Minesweeper Puzzle #{puzzleId}</h1>
      <WelcomeScreen/>
      {cookies.jwt && puzzle && completedToday() != null && <p>You already completed puzzle #{puzzleId} with status {completedToday().success ? 'Success' : 'Failure'}</p>}
      {cookies.jwt && puzzle && <Board layout={puzzle} puzzleId={puzzleId} pushASolveLocally={pushASolveLocally} solve={completedToday()}/>}
      {cookies.jwt && cookies.username && <Solves solves={solves}/>}
      {!cookies.jwt && <div>
        {signIn && <div>
          <p>You aren't currently using any puzzle code. You need one to play. Use a puzzle code below or <form onClick={toggleSignIn}><button>register a puzzle code</button></form></p>
          <LoginForm/>
        </div>}
        {!signIn && <div>
          <p>You aren't currently using any puzzle code. You need one to play. Register a puzzle code below or <form onClick={toggleSignIn}><button>use a puzzle code</button></form></p>
          <RegisterForm/>
        </div>}
      </div>}
    </div>
    </>
  );
}

export default MinesweeperPage;
