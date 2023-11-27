import React from 'react';
import './Cell.css'

const Cell = ({ value, isRevealed, onClick, surrounding }) => {
  return (
    <div
      className={`cell ${isRevealed ? 'revealed' : 'clickable'}`}
      onClick={onClick}
    >
      {isRevealed ? (value === 1 ? '💣' : surrounding) : ' '}
    </div>
  );
};

export default Cell;