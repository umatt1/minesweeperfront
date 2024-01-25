import { useState, useEffect } from 'react';
import './App.css';
import Board from './components/minesweeper/Board';
import PuzzleApi from './components/apis/PuzzleApi';

const api = new PuzzleApi();

function App() {
  const [puzzle, setPuzzle] = useState(null);

  useEffect(() => {
    // define an async function to setPuzzle to board layout
    const fetchData = async () => {
      try {
        const puzzleData = await api.getPuzzleOfTheDay();
        setPuzzle(puzzleData.layout);
      } catch (error) {
        console.error('Error fetching puzzle:', error);
      }
    };
    // call
    fetchData();
  }, []); // empty dependency array = only do this on first render

  return (
    <>
    <h1>Minesweeper Game</h1>
    {puzzle && <Board layout={puzzle} />}
    </>
  )
}

export default App
