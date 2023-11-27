import logo from './logo.svg';
import './App.css';
import PlayerApi from './components/apis/PlayerApi';
import react, { useState, useEffect } from 'react';
import Board from './components/minesweeper/Board';

const api = new PlayerApi();

function App() {

  // stuff for rendering an example board, likely to keep:

  // Example board with 0 and 1 values
  // const minesweeperBoard = [
  //   [0, 0, 0, 0],
  //   [1, 0, 0, 0],
  //   [1, 0, 1, 0],
  // ];

const [puzzle, setPuzzle] = useState(null)

useEffect(() => {
  getPuzzle()
}, []);

const getPuzzle = async () => {
  api.get("puzzles/2")
  .then(
    (e) => {
      console.log(e);
      setPuzzle(e.layout);
    }
  )
  .catch(e=>console.log(e))
}

  return (
    <div className="App">
      <header className="App-header">

        <h1>Minesweeper Game</h1>
        {puzzle && <Board board={puzzle} />}
      </header>
    </div>
  );
}

export default App;
