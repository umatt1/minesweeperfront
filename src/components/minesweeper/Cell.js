import React from 'react';
import './Cell.css'

const Cell = ({ value, isRevealed, onClick, surrounding, isFlagged }) => {
  function handleContextMenu(event) {
    event.preventDefault(); // Prevent the default context menu
    
    console.log('right clicked on a tile');
    // You can add more logic here if needed
  }

  function tileValue(isRevealed, surrounding, isFlagged) {
    // revealed -> return bomb or the surrounding tiles
    if (isRevealed) {
      return (value === 1 ? '💣' : surrounding);
    } else if (isFlagged) {
      return <img src='/america.png' alt={'flag'}/>;
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
