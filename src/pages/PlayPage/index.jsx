import React, { useState, useEffect, useRef } from 'react';
import Board from '../../components/minesweeper/Board';
import PuzzleApi from '../../components/apis/PuzzleApi';
import { useCookies } from 'react-cookie';
import './style.css';
import Navbar from '../../components/Navbar';
import Solves from '../../components/solves';
import SolveApi from '../../components/apis/SolveApi';
import GameStatsPopup from '../../components/GameStatsPopup';

const api = new PuzzleApi();
const solveApi = new SolveApi();

function PlayPage() {
  const [puzzleId, setPuzzleId] = useState(null);
  const [puzzle, setPuzzle] = useState(null);
  const [puzzleMines, setPuzzleMines] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(['jwt', "username"]);
  const [solves, setSolves] = useState([]);
  const [friendsSolves, setFriendsSolves] = useState([]);
  const solvesRef = useRef();
  const [copied, setCopied] = useState(false);
  const [puzzleCompleted, setPuzzleCompleted] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [gameStats, setGameStats] = useState(null);


  useEffect(() => {
    const fetchPuzzleData = async () => {
      try {
        const puzzleData = await api.getPuzzleOfTheDay(cookies.jwt);
        setPuzzle(puzzleData.layout);
        setPuzzleId(puzzleData.id);
        setPuzzleMines(puzzleData.mines);
      } catch (error) {
        console.error('Error fetching puzzle:', error);
      }
    };
    fetchPuzzleData();
  }, [cookies.jwt]);


  const fetchSolveData = async () => {
    try {
      const solveData = await solveApi.getWeeksSolves(cookies.username, cookies.jwt);
      if (solveData.length > 0 && solveData.some(solve => solve.puzzle.id === puzzleId)) {
        setPuzzleCompleted(true);
      }
      setSolves(solveData);
    } catch (error) {
      console.error('Error fetching solves:', error);
    }
  };
  useEffect(() => {
    fetchSolveData();
  }, [puzzleId, cookies.jwt]);

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

  const handleSolveComplete = async (solveData) => {
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
      
      // Show statistics popup
      setGameStats(solveData.stats);
      setShowStats(true);
    } catch (error) {
      console.error('Error posting solve:', error);
    }
  };

  return (
    <div className='page'>
      <h1>Minesweeper Puzzle #{puzzleId}</h1>
      <Solves solves={solves} ref={solvesRef}/>
      {puzzleCompleted && <h2>You've already completed today's puzzle</h2>}
      {puzzle && <Board 
        layout={puzzle} 
        puzzleId={puzzleId} 
        onSolveComplete={handleSolveComplete}
        mines={puzzleMines}
      />}
      
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

      <GameStatsPopup
        show={showStats}
        onHide={() => setShowStats(false)}
        stats={gameStats}
      />
    </div>
  );
}

export default PlayPage;