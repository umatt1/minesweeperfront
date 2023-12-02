import React, { useState } from 'react';
import Cell from './Cell';
import './Board.css'

const Board = ({ board }) => {
  const [revealedCells, setRevealedCells] = useState([]);
  const [flaggedCells, setFlaggedCells] = useState([]);

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
        console.log(`flagging ${row}-${col}`)
        setFlaggedCells([...flaggedCells, `${row}-${col}`])
      } else {
        // unflag if flagged
        console.log(`unflagging ${row}-${col}`)
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
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((cell, columnIndex) => renderCell(cell, rowIndex, columnIndex, board))}
        </div>
      ))}
    </div>
  );
};

export default Board;
