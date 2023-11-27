import logo from './logo.svg';
import './App.css';
import PlayerApi from './components/apis/PlayerApi';
import react, { useState, useEffect } from 'react';
import Board from './components/minesweeper/Board';

const api = new PlayerApi();

function App() {

  // stuff for rendering a list of players to probably delete later:

  const [players, setPlayers] = useState([])

  useEffect(() => {
    getPlayers()
  }, []);

  const getPlayers = async () => {
    const response = await api.get("players")
    console.log(response)
    setPlayers(response)
  }

  // stuff for rendering an example board, likely to keep:

  // Example board with 0 and 1 values
  const minesweeperBoard = [
    [0, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 1, 0],
  ];

  return (
    <div className="App">
      <header className="App-header">
        <p>Current players:</p>
        <ul>
        {players &&
          players.map((p) => <li key={p.id}>{p.username}</li>)
        }
        </ul>

        <h1>Minesweeper Game</h1>
        <Board board={minesweeperBoard} />
      </header>
    </div>
  );
}

export default App;
