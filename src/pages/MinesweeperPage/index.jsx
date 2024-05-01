import React, { useState, useEffect } from 'react';
import Board from '../../components/minesweeper/Board';
import PuzzleApi from '../../components/apis/PuzzleApi';
import { useCookies } from 'react-cookie';

import './style.css';
import Navbar from '../../components/Navbar';
import LoginForm from '../../components/forms/login'
import RegisterForm from '../../components/forms/register'
import LogoutForm from '../../components/forms/logout';

const api = new PuzzleApi();

function MinesweeperPage() {
  const [puzzle, setPuzzle] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(['jwt', "username"]);
  const [signIn, setSignIn] = useState(true);


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
  }, [cookies.jwt]);

  function toggleSignIn() {
    setSignIn(!signIn);
  }

  return (
    <>
    <Navbar/>
    <div className='page'>
      <h1>Minesweeper</h1>
      {cookies.jwt && <div>
        <p>You're currently using puzzle code {cookies.username}. Want to sign out? <LogoutForm/></p>
      </div>}
      {!cookies.jwt && <div>
        {signIn && <div>
          <p>You aren't currently using any puzzle code. You need one to play. Use a puzzle code below or <form onClick={toggleSignIn}><button>register a puzzle code</button></form></p>
          <LoginForm/>
        </div>}
        {!signIn && <div>
          <p>You aren't currently using any puzzle code. You need one to play. Register a puzzle code below or <form onClick={toggleSignIn}><button>use a puzzle code</button></form></p>
          <RegisterForm/>
        </div>}
      </div>}
      {cookies.jwt && puzzle && <Board layout={puzzle} />}
    </div>
    </>
  );
}

export default MinesweeperPage;
