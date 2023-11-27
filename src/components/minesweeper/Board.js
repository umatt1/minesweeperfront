import React, { useState } from 'react';
import Cell from './Cell';

const Board = ({ board }) => {
  const [revealedCells, setRevealedCells] = useState([]);

  const revealCell = (row, col) => {
    if (!revealedCells.includes(`${row}-${col}`)) {
      setRevealedCells([...revealedCells, `${row}-${col}`]);
    }
  };

  const renderCell = (value, row, col) => {
    const isRevealed = revealedCells.includes(`${row}-${col}`);
    return (
      <Cell
        key={`${row}-${col}`}
        value={value}
        isRevealed={isRevealed}
        onClick={() => revealCell(row, col)}
      />
    );
  };

  return (
    <div className="minesweeper-board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((cell, columnIndex) => renderCell(cell, rowIndex, columnIndex))}
        </div>
      ))}
    </div>
  );
};

export default Board;
