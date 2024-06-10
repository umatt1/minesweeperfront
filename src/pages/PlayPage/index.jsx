import React, { useState, useEffect, useRef } from 'react';
import Board from '../../components/minesweeper/Board';
import PuzzleApi from '../../components/apis/PuzzleApi';
import { useCookies } from 'react-cookie';

import './style.css';
import Navbar from '../../components/Navbar';
import LoginForm from '../../components/forms/login';
import RegisterForm from '../../components/forms/register';
import LogoutForm from '../../components/forms/logout';
import Solves from '../../components/solves';
import SolveApi from '../../components/apis/SolveApi';

const api = new PuzzleApi();
const solveApi = new SolveApi();

function PlayPage() {
  const [puzzleId, setPuzzleId] = useState(null);
  const [puzzle, setPuzzle] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(['jwt', "username"]);
  const [signIn, setSignIn] = useState(true);
  const [solves, setSolves] = useState([]);
  const [localPush, setLocalPush] = useState(false);
  const [copied, setCopied] = useState(false);
  const solvesRef = useRef();

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
          removeCookie("jwt");
          removeCookie("username");
        }
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
        console.error('Error fetching solves:', error);
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
        return true; // Puzzle completed today
      }
    }
    return false; // Puzzle not completed today
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

  const handleCopyToClipboard = () => {
    const solvesText = solvesRef.current.getSolvesText();
    navigator.clipboard.writeText(
      `I finished the daily sweeple in ${solves.at(-1).time}!` +
      "\n" + 
      solvesText + 
      "\n" + 
      "Try it out yourself at URL"
    )
      .then(() => {
        setCopied(true);
      })
      .catch((error) => {
        console.error('Error copying text to clipboard:', error);
      });
  };

  return (
    <>
      <div className='page'>
        <h1>Minesweeper Puzzle #{puzzleId}</h1>
        <Solves solves={solves} ref={solvesRef} />
        {puzzle && (localPush || !completedToday()) && <Board layout={puzzle} puzzleId={puzzleId} pushASolveLocally={pushASolveLocally} />}
        {puzzle && completedToday() &&
          <>
            <p>⛳ Puzzle #{puzzleId} completed! ⛳</p>
            <button onClick={handleCopyToClipboard}>Share?</button>
            {copied && <p>Copied to clipboard</p>}
          </>}
        <br></br>
        <Navbar />
      </div>
    </>
  );
}

export default PlayPage;
