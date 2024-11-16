import React, { useState, useEffect, useRef } from 'react';
import Board from '../../components/minesweeper/Board';
import PuzzleApi from '../../components/apis/PuzzleApi';
import { useCookies } from 'react-cookie';
import './style.css';
import Navbar from '../../components/Navbar';
import Solves from '../../components/solves';
import SolveApi from '../../components/apis/SolveApi';

const api = new PuzzleApi();
const solveApi = new SolveApi();

function PlayPage() {
  const [puzzleId, setPuzzleId] = useState(null);
  const [puzzle, setPuzzle] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(['jwt', "username"]);
  const [solves, setSolves] = useState([]);
  const [friendsSolves, setFriendsSolves] = useState([]);
  const solvesRef = useRef();
  const [copied, setCopied] = useState(false);
  const [puzzleCompleted, setPuzzleCompleted] = useState(false);


  useEffect(() => {
    const fetchPuzzleData = async () => {
      try {
        const puzzleData = await api.getPuzzleOfTheDay(cookies.jwt);
        setPuzzle(puzzleData.layout);
        setPuzzleId(puzzleData.id);
      } catch (error) {
        console.error('Error fetching puzzle:', error);
      }
    };
    fetchPuzzleData();
  }, [cookies.jwt]);


  const fetchSolveData = async () => {
    try {
      const solveData = await solveApi.getWeeksSolves(cookies.username, cookies.jwt);
      setSolves(solveData);
    } catch (error) {
      console.error('Error fetching solves:', error);
    }
  };
  useEffect(() => {
    fetchSolveData();
  }, [cookies.jwt]);

  useEffect(() => {
    const fetchFriendsSolves = async () => {
      try {
        const friendsSolvesData = await solveApi.getFriendsSolves(cookies.username, cookies.jwt, puzzleId);
        setFriendsSolves(friendsSolvesData);
      } catch (error) {
        console.error('Error fetching friends solves:', error);
      }
    };
    if (puzzleId) {
      fetchFriendsSolves();
    }
  }, [puzzleId, cookies.jwt]);

  const handleCopyToClipboard = () => {
    const solvesText = solvesRef.current.getSolvesText();
    navigator.clipboard.writeText(
      `I finished the daily sweeple in ${solves.at(-1).time}!` +
      "\n" + 
      solvesText + 
      "\n" + 
      "Try it out yourself at https://www.minesweeple.com"
    )
      .then(() => {
        console.log('Copied to clipboard!');
      })
      .catch((error) => {
        console.error('Error copying text to clipboard:', error);
      });
  };

  const handleSolveCompleted = async (solveData) => {
    try {
      const solveObject = {
        player: { username: cookies.username },
        puzzle: { date: new Date(), layout: [] },
        success: solveData.success,
        time: solveData.time,
      };
      await solveApi.postSolve(solveObject, cookies.jwt);
      setSolves([...solves, solveObject]);
      setPuzzleCompleted(true);
      const friendsSolvesData = await solveApi.getFriendsSolves(cookies.username, cookies.jwt, puzzleId);
      setFriendsSolves(friendsSolvesData);
    } catch (error) {
      console.error('Error posting solve:', error);
    }
  };

  return (
    <div className='page'>
      <h1>Minesweeper Puzzle #{puzzleId}</h1>
      <Solves solves={solves} ref={solvesRef}/>
      {puzzle && <Board layout={puzzle} puzzleId={puzzleId} onSolveComplete={handleSolveCompleted} />}
      
      <button onClick={()=>{handleCopyToClipboard(); setCopied(true)}}>Share?</button>
      {copied && <p>Copied to clipboard</p>}

      {puzzleCompleted && (
        <>
          <h2>Friends' Solves:</h2>
          <ul>
            {friendsSolves.map((solve, index) => (
              <li key={index}>{solve.player.username} - {solve.time} - {solve.success ? '🟢' : '🔴'}</li>
            ))}
          </ul>
        </>
      )}
      
    </div>
  );
}

export default PlayPage;