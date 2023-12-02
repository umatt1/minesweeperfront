import React, { useState, useEffect } from 'react';
import Cell from './Cell';
import './Board.css'

const Board = ({ board }) => {
  const [revealedCells, setRevealedCells] = useState([]);
  const [flaggedCells, setFlaggedCells] = useState([]);
  // game states:
  // not started -> default state. transitions into in progress and stores a time on the reveal of the first square
  //                it can transition into a loss of the first tile revealed is a mine
  // in progress -> game state after the first tile click. transitions into a win if revealedCells.length = board - num mines
  // win -> displays a congrats
  // lose -> displays a loss
  const [gameState, setGameState] = useState('not started');
  const [startTime, setStartTime] = useState(null);

  function manageGameState() {
    if (gameState === 'not started') {
      setStartTime(new Date().toLocaleDateString())
      setGameState('in progress')
    }

    let mineCount = 0;
    let squareCount = 0;
    let hitMine = false;
    board.forEach(row => {
      row.forEach(tile => {
        mineCount += tile;
        squareCount += 1;
      });
    });
    revealedCells.forEach(cell => {
      const [row, col] = cell.split('-').map(Number);
      if (board[row][col] === 1) {
        hitMine = true;
      }
    })

    if (hitMine) {
      setGameState('lose');
      return;
    }
    if (revealedCells.length === squareCount - mineCount) {
      setGameState('win');
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
    if (revealedCells.includes(`${row}-${col}`) || row < 0 || col < 0 || row >= board.length || col >= board.at(0).length || flaggedCells.includes(`${row}-${col}`)) {
      return;
    }
    const touched = revealedCells.slice(0, revealedCells.length);
    touched.push(`${row}-${col}`)
    const stack = [];
    if (board[row][col] === 0 && surroundingMines(row, col, board) === 0) {stack.push({row: row, col: col});}
    while (stack.length > 0) {
      const center = stack.pop();
      for (let r = center.row-1; r < center.row+2; r++) {
        for (let c = center.col-1; c < center.col+2; c++) {
          // reveal unrevealed surroundings
          if (touched.includes(`${r}-${c}`) || r < 0 || c < 0 || r >= board.length || c >= board.at(0).length || flaggedCells.includes(`${r}-${c}`)) {
            continue;
          }
          if (board[r][c] === 1) {
            continue;
          }
          touched.push(`${r}-${c}`)
          // add 0's to the stack
          if (surroundingMines(r,c,board) === 0) {
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

  const renderCell = (value, row, col, layout) => {
    // create a cell
    const isRevealed = revealedCells.includes(`${row}-${col}`);
    const isFlagged = flaggedCells.includes(`${row}-${col}`)
    const revealer = revealCellFactory(row, col);
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

  return (
    <div className="minesweeper-board">
      {(gameState === 'not started' || gameState === 'in progress') && board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((cell, columnIndex) => renderCell(cell, rowIndex, columnIndex, board))}
        </div>
      ))}
      {(gameState === 'win') &&
        <h1>win!</h1>
      }
      {(gameState === 'lose') &&
        <h1>lose!</h1>
      }
    </div>
  );
};

export default Board;
