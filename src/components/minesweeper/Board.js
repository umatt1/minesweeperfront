import React, { useState } from 'react';
import Cell from './Cell';
import './Board.css';

const Board = ({ board }) => {
  const [revealedCells, setRevealedCells] = useState(new Set());

  const revealCell = (row, col) => {
    if (!beenFound(row, col)) {
      setRevealedCells(new Set([...revealedCells], `${row}-${col}`));
    }
  };

  const beenFound = (row, col) => {
    return revealedCells.has(`${row}-${col}`);
  };

  const surroundingMines = (row, col, layout) => {
    let count = 0;
    for (let i = row - 1; i < row + 2; i += 1) {
      for (let j = col - 1; j < col + 2; j += 1) {
        if (i < 0 || j < 0 || i >= layout.length || j >= layout[0].length) {
          continue;
        } else if (layout[i][j] === 1) {
          count += 1;
        }
      }
    }
    return count;
  };

  const renderCell = (value, row, col, layout) => {
    const isRevealed = revealedCells.has(`${row}-${col}`);

    function handleReveals() {
      revealCell(row, col);
      if (value !== 0) {
        return;
      }
      const stack = [];
      for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
          if (
            r < 0 ||
            c < 0 ||
            r >= layout.length ||
            c >= layout[0].length
          ) {
            continue;
          }
          // skip all the ones we already got
          if (beenFound(r, c)) {
            continue;
          }
          // skip non zeros
          if (surroundingMines(r, c, layout) !== 0) {
            continue;
          }
          // non zeros havent found yet get marked as found and added to look at
          stack.push([r, c]);
          revealCell(r, c);
        }
      }

      while (stack.length > 0) {
        let item = stack.pop();
        let itemRow = item[0];
        let itemCol = item[1];
        let itemVal = layout[itemRow][itemCol];
        if (itemVal === 0) {
          revealCell(itemRow, itemCol);
          for (let r = itemRow - 1; r <= itemRow + 1; r++) {
            for (let c = itemCol - 1; c <= itemCol + 1; c++) {
              if (
                r < 0 ||
                c < 0 ||
                r >= layout.length ||
                c >= layout[0].length
              ) {
                continue;
              }
              // skip the ones we already got
              if (beenFound(r, c)) {
                continue;
              }
              // skip the non zeros
              if (surroundingMines(r, c, layout) !== 0) {
                continue;
              }
              // non zeros havent found yet get marked as found and added to look at
              stack.push([r, c]);
              revealCell(r, c);
            }
          }
        }
      }
    }


    // ISSUE: ISREVEALED IS NOT UPDATED FOR THE CELLS I BELIEVE AFTER THEY ARE RENDERED, ONLY MARKED IN THE BOARD GAME LOGIC
    // I.E. THE CHANGE ONLY HAPPENS IN THE REVEALED CELLS STATE BELONGING TO THE PARENT **BOARD** COMPONENT
    // NEED TO FIND A WAY TO PASS IT TO THE **CELL** COMPONENT
    return (
      <Cell
        key={`${row}-${col}`}
        value={value}
        isRevealed={isRevealed}
        onClick={handleReveals}
        surrounding={surroundingMines(row, col, layout)}
      />
    );
  };

  return (
    <div className="minesweeper-board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((cell, columnIndex) =>
            renderCell(cell, rowIndex, columnIndex, board)
          )}
        </div>
      ))}
    </div>
  );
};

export default Board;
