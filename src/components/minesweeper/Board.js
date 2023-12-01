import React, { useState } from 'react';
import Cell from './Cell';
import './Board.css'

const Board = ({ board }) => {
  const [revealedCells, setRevealedCells] = useState([]);

  function revealCellFactory(row, col) {
    // return a function that will update this component's state
    return () => {
      console.log(`row and col ${row} and ${col}`)
      revealChunk(row,col);
    };
  }

  function revealChunk(row, col) {
    // perform the searching part of revealing a large chunk of cells
    // checks
    if (revealedCells.includes(`${row}-${col}`) || row < 0 || col < 0 || row >= board.length || col >= board.at(0).length) {
      return;
    }
    const touched = revealedCells.slice(0, revealedCells.length);
    touched.push(`${row}-${col}`)
    const stack = [{row: row, col: col}];
    while (stack.length > 0) {
      console.log(touched);
      const center = stack.pop();
      for (let r = center.row-1; r < center.row+2; r++) {
        for (let c = center.col-1; c < center.col+2; c++) {
          // reveal unrevealed surroundings
          if (touched.includes(`${r}-${c}`) || r < 0 || c < 0 || r >= board.length || c >= board.at(0).length) {
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
    const revealer = revealCellFactory(row, col);
    return (
      <Cell
        key={`${row}-${col}`}
        value={value}
        isRevealed={isRevealed}
        onClick={revealer}
        surrounding={surroundingMines(row, col, layout)}
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
