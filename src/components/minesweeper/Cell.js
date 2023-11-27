import React from 'react';
import './Cell.css'

const Cell = ({ value, isRevealed, onClick }) => {
  return (
    <div
      className={`cell ${isRevealed ? 'revealed' : 'clickable'}`}
      onClick={onClick}
    >
      {isRevealed ? (value === 1 ? '💣' : ' ') : ' '}
    </div>
  );
};

export default Cell;
