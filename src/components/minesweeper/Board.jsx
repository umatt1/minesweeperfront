import React, { useState, useEffect } from 'react';
import Cell from './Cell';
import './Board.css'
import SolveApi from '../apis/SolveApi';
import { useCookies } from 'react-cookie';

const api = new SolveApi();

const Board = ({ layout, puzzleId, onSolveComplete }) => {
  const [revealedCells, setRevealedCells] = useState([]);
  const [flaggedCells, setFlaggedCells] = useState([]);
  const [gameState, setGameState] = useState('not started');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(['jwt', "username"]);

  function manageGameState() {
    if (gameState === 'not started') {
      setStartTime(new Date())
      setGameState('in progress')
    }

    let mineCount = 0;
    let squareCount = 0;
    let hitMine = false;
    layout.forEach(row => {
      row.forEach(tile => {
        mineCount += tile;
        squareCount += 1;
      });
    });
    revealedCells.forEach(cell => {
      const [row, col] = cell.split('-').map(Number);
      if (layout[row][col] === 1) {
        hitMine = true;
      }
    })

    if (hitMine) {
      const end = new Date();
      setGameState('lose');
      setEndTime(end);
      api.postSolve({
        username: cookies.username,
        puzzleId: puzzleId,
        time: (end-startTime)/1000,
        success: false,
        jwt: cookies.jwt
      }, cookies.jwt);
      onSolveComplete({
        success: false,
        time: (end-startTime)/1000
      });
      return;
    }
    if (revealedCells.length === squareCount - mineCount) {
      const end = new Date();
      setGameState('win');
      setEndTime(end);
      api.postSolve({
        username: cookies.username,
        puzzleId: puzzleId,
        time: (end-startTime)/1000,
        success: true,
        jwt: cookies.jwt
      }, cookies.jwt);
      onSolveComplete({
        success: true,
        time: (end-startTime)/1000
      });
    }
  }

  useEffect(() => {
    manageGameState()
  }, [revealedCells]);

  function revealCellFactory(row, col) {
    // return a function that will update this component's state
    return () => {
      revealChunk(row,col);
    };
  }

  function revealChunk(row, col) {
    // perform the searching part of revealing a large chunk of cells
    // checks
    if (revealedCells.includes(`${row}-${col}`) || row < 0 || col < 0 || row >= layout.length || col >= layout.at(0).length || flaggedCells.includes(`${row}-${col}`)) {
      return;
    }
    const touched = revealedCells.slice(0, revealedCells.length);
    touched.push(`${row}-${col}`)
    const stack = [];
    if (layout[row][col] === 0 && surroundingMines(row, col, layout) === 0) {stack.push({row: row, col: col});}
    while (stack.length > 0) {
      const center = stack.pop();
      for (let r = center.row-1; r < center.row+2; r++) {
        for (let c = center.col-1; c < center.col+2; c++) {
          // reveal unrevealed surroundings
          if (touched.includes(`${r}-${c}`) || r < 0 || c < 0 || r >= layout.length || c >= layout.at(0).length || flaggedCells.includes(`${r}-${c}`)) {
            continue;
          }
          if (layout[r][c] === 1) {
            continue;
          }
          touched.push(`${r}-${c}`)
          // add 0's to the stack
          if (surroundingMines(r,c,layout) === 0) {
            stack.push({row: r, col: c});
          }
        }
      }
    }
    setRevealedCells(touched);
  }

  function flagCellFactory(row, col, isFlagged) {
    return () => {
      // flag if unflagged
      if (!isFlagged) {
        setFlaggedCells([...flaggedCells, `${row}-${col}`])
      } else {
        // unflag if flagged
        const toRemove = flaggedCells.indexOf(`${row}-${col}`)
        setFlaggedCells([...flaggedCells.slice(0, toRemove), ...flaggedCells.slice(toRemove+1, flaggedCells.length)])
      }
    }
  }

  const surroundingMines = (row, col, layout) => {
    // return number of surrounding mines
    let count = 0;
    for (let i = row-1; i < row+2; i += 1) {
        for (let j = col-1; j < col+2; j += 1) {
            if (i < 0 || j < 0 || i >= layout.length || j >= layout.at(0).length) {
                continue
            }
            else if (layout.at(i).at(j) === 1) {
                count += 1;
            }
        }
    }
    return count;
  }

  const renderCell = (value, row, col, layout, clickable=true) => {
    // create a cell
    const isRevealed = revealedCells.includes(`${row}-${col}`) || ["win", "lose"].includes(gameState);
    const isFlagged = flaggedCells.includes(`${row}-${col}`)
    const revealer = clickable ? revealCellFactory(row, col) : (row, col) => {};
    const flagger = flagCellFactory(row, col, isFlagged);
    return (
      <Cell
        key={`${row}-${col}`}
        value={value}
        isRevealed={isRevealed}
        onClick={revealer}
        surrounding={surroundingMines(row, col, layout)}
        isFlagged={isFlagged}
        onRightClick={flagger}
      />
    );
  };

  const renderBoard = (clickable=true) => {
    return layout.map((row, rowIndex) => (
      <div key={rowIndex} className="board-row">
        {row.map((cell, columnIndex) => renderCell(cell, rowIndex, columnIndex, layout, clickable))}
      </div>
    ))
  }

  return (
    <div className="minesweeper-board">
      {(gameState === 'not started' || gameState === 'in progress') && <div>
          {renderBoard(true)}
        </div>}
      {(gameState === 'win') && <div>
          {renderBoard(false)}
          <h3>Won in {((endTime-startTime)/ 1000).toFixed(2)} seconds</h3>
        </div>
      }
      {(gameState === 'lose') && <div>
          {renderBoard(false)}
          <h3>Lost in {((endTime-startTime)/ 1000).toFixed(2)} seconds</h3>
        </div>
      }
    </div>
  );
};
export default Board;
