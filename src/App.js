import logo from './logo.svg';
import './App.css';
import PlayerApi from './components/apis/PlayerApi';
import react, { useState, useEffect } from 'react';

const api = new PlayerApi();

function App() {

  const [players, setPlayers] = useState([])

  useEffect(() => {
    getPlayers()
  }, []);

  const getPlayers = async () => {
    const response = await api.get("players")
    console.log(response)
    setPlayers(response)
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>Current players:</p>
        <ul>
          {players && players.map((p)=> {<li>{p.username}</li>})}
        </ul>
      </header>
    </div>
  );
}

export default App;
