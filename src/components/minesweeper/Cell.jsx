import React, { useState } from 'react';
import './Cell.css';

const Cell = ({ value, isRevealed, onClick, surrounding, isFlagged, onRightClick }) => {
  const [timer, setTimer] = useState(null);

  function handleContextMenu(event) {
    event.preventDefault(); // Prevent the default context menu
    onRightClick();
  }

  function handleMouseDown(event) {
    if (event.button === 0) {
      // Left-click
      setTimer(setTimeout(() => {
        onRightClick();
      }, 150));
    }
  }

  function handleMouseUp() {
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
  }

  function handleTouchStart() {
    setTimer(setTimeout(() => {
      onRightClick();
    }, 500));
  }

  function handleTouchEnd() {
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
  }

  function tileValue(isRevealed, surrounding, isFlagged) {
    // revealed -> return bomb or the surrounding tiles
    if (isRevealed) {
      return value === 1 ? '💣' : surrounding;
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
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {tileValue(isRevealed, surrounding, isFlagged)}
    </div>
  );
};

export default Cell;
