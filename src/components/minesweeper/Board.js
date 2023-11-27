import React, { useState } from 'react';
import Cell from './Cell';
import './Board.css'

const Board = ({ board }) => {
  const [revealedCells, setRevealedCells] = useState([]);

  const revealCell = (row, col) => {
    if (!revealedCells.includes(`${row}-${col}`)) {
      setRevealedCells([...revealedCells, `${row}-${col}`]);
    }
  };

  const surroundingMines = (row, col, layout) => {
    let count = 0;
    for (let i = row-1; i < row+2; i += 1) {
        for (let j = col-1; j < col+2; j += 1) {
            if (i < 0 || j < 0 || i >= layout.length || j >= layout.at(0).lenght) {
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
    const isRevealed = revealedCells.includes(`${row}-${col}`);
    return (
      <Cell
        key={`${row}-${col}`}
        value={value}
        isRevealed={isRevealed}
        onClick={() => revealCell(row, col)}
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
