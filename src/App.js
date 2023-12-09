import './App.css';
import PlayerApi from './components/apis/PlayerApi';
import React, { useState, useEffect } from 'react';
import Board from './components/minesweeper/Board';

const api = new PlayerApi();

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
      </header>
    </div>
  );
}

export default App;