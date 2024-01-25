import React from 'react';
import './Cell.css'

const Cell = ({ value, isRevealed, onClick, surrounding, isFlagged, onRightClick }) => {
  function handleContextMenu(event) {
    event.preventDefault(); // Prevent the default context menu
    onRightClick()
  }

  function tileValue(isRevealed, surrounding, isFlagged) {
    // revealed -> return bomb or the surrounding tiles
    if (isRevealed) {
      return (value === 1 ? '💣' : surrounding);
    } else if (isFlagged) {
      return '🚩';
    } else {
      return ' ';
    }
  }
  return (
    <div
      className={`cell ${isRevealed ? 'revealed' : 'clickable'}`}
      onClick={onClick}
      onContextMenu={handleContextMenu}
    >
      {tileValue(isRevealed, surrounding, isFlagged)}
    </div>
  );
};

export default Cell;
