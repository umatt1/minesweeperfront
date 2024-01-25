// MinesweeperPage.jsx
import React, { useState, useEffect } from 'react';
import Board from '../../components/minesweeper/Board';
import PuzzleApi from '../../components/apis/PuzzleApi';

const api = new PuzzleApi();

function MinesweeperPage() {
  const [puzzle, setPuzzle] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const puzzleData = await api.getPuzzleOfTheDay();
        setPuzzle(puzzleData.layout);
      } catch (error) {
        console.error('Error fetching puzzle:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <h1>Minesweeper Game</h1>
      {puzzle && <Board layout={puzzle} />}
    </>
  );
}

export default MinesweeperPage;
