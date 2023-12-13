import './App.css';
import PuzzleApi from './components/apis/PuzzleApi';
import React, { useState, useEffect } from 'react';
import Board from './components/minesweeper/Board';
import Button from './components/common/Button';

const api = new PuzzleApi();

function App() {
  const [puzzle, setPuzzle] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const puzzleData = await api.getPuzzleOfTheDay();
        console.log(puzzleData);
        setPuzzle(puzzleData.layout);
      } catch (error) {
        console.error('Error fetching puzzle:', error);
      }
    };

    fetchData();
  }, []); // empty dependency array means this effect runs once, similar to componentDidMount

  return (
    <div className="App">
      <header className="App-header">
        <h1>Minesweeper Game</h1>
        {puzzle && <Board layout={puzzle} />}
        <Button value={"button"}/>
      </header>
    </div>
  );
}

export default App;