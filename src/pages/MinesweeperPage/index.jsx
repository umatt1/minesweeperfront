import React, { useState, useEffect } from 'react';
import Board from '../../components/minesweeper/Board';
import PuzzleApi from '../../components/apis/PuzzleApi';
import { useCookies } from 'react-cookie';

import './style.css';
import Navbar from '../../components/Navbar';

const api = new PuzzleApi();

function MinesweeperPage() {
  const [puzzle, setPuzzle] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(['jwt', "username"]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const puzzleData = await api.getPuzzleOfTheDay(cookies.jwt);
        setPuzzle(puzzleData.layout);
      } catch (error) {
        console.error('Error fetching puzzle:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
    <Navbar/>
    <div className='page'>
      <h1>Minesweeper Game</h1>
      {puzzle && <Board layout={puzzle} />}
    </div>
    </>
  );
}

export default MinesweeperPage;
